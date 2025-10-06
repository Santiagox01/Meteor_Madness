import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SimulationControls from "@/components/controls/SimulationControls";
import TimeControls, { type CameraMode } from "@/components/controls/TimeControls";
import MetricsPanel from "@/components/panels/MetricsPanel";
import SolarSystem3D from "@/components/visualizations/SolarSystem3D";
import LocalImpact from "@/components/visualizations/LocalImpact";
import { fetchNeoBrowse, fetchNeoById, fetchElevation } from "@/lib/api";
import type { AsteroidParams, DeflectionParams } from "@/lib/api";
import { estimateDeflectionOutcome, runImpactModel } from "@/lib/physics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getAsteroidPosition, getEarthPosition, sceneUnitsToKm, getNextApproachData } from "@/lib/orbits";
import {
  Orbit,
  GaugeCircle,
  Timer,
  ShieldCheck,
  SatelliteDish,
  Mountain,
  ArrowBigRightDash,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function useQueryParams() {
  const [params] = useSearchParams();
  return Object.fromEntries(params.entries());
}

function formatDuration(hours: number, t: any) {
  if (!Number.isFinite(hours) || hours <= 0) return t.imminent;
  if (hours < 24) return `${hours.toFixed(1)} ${t.hours}`;
  const days = hours / 24;
  return `${days.toFixed(1)} ${t.days}`;
}

type TelemetryCardSpec = {
  title: string;
  value: string;
  sub: string;
  icon: LucideIcon;
};

export default function Simulation() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const queryParams = useQueryParams();
  const [params, setParams] = useState<AsteroidParams>({
    name: "Impactor-2025",
    diameterKilometers: 0.28,
    densityKgM3: 3000,
    velocityKmS: 22,
    impactAngleDeg: 42,
    impactLat: 12.3,
    impactLon: -45.8,
    isOceanImpact: false,
  });
  const [deflection, setDeflection] = useState<DeflectionParams>({
    deltaVMS: 3,
    leadTimeDays: 540,
    direction: "prograde",
  });
  const [showDeflection, setShowDeflection] = useState(true);
  const [slowMotion, setSlowMotion] = useState(false);

  const { data: listData } = useQuery({ queryKey: ["neo-browse", "simulation"], queryFn: () => fetchNeoBrowse(0, 30), retry: 0 });
  const { data: neoData } = useQuery({
    queryKey: ["neo", queryParams.neo],
    queryFn: () => (queryParams.neo ? fetchNeoById(queryParams.neo) : Promise.resolve(null)),
    enabled: Boolean(queryParams.neo),
    retry: 0,
  });

  useEffect(() => {
    if (neoData) {
      const est = neoData.estimated_diameter?.meters;
      const avgMeters = est ? ((est.estimated_diameter_max ?? 0) + (est.estimated_diameter_min ?? 0)) / 2 : params.diameterKilometers * 1000;
      const avgKilometers = avgMeters / 1000;
      
      // Obtener la próxima aproximación futura en lugar de la primera histórica
      const nextApproach = getNextApproachData(neoData.close_approach_data);
      const velocity = Number(nextApproach?.relative_velocity?.kilometers_per_second ?? params.velocityKmS);
      const miss = nextApproach?.miss_distance?.kilometers;
      
      setParams((prev) => ({
        ...prev,
        name: neoData.name || prev.name,
        diameterKilometers: avgKilometers || prev.diameterKilometers,
        velocityKmS: velocity || prev.velocityKmS,
        impactLat: prev.impactLat,
        impactLon: prev.impactLon,
        isOceanImpact: prev.isOceanImpact,
      }));
      if (miss) {
        const deltaV = Math.min(10, Math.max(1, Number(miss) / 1_000_000));
        setDeflection((prev) => ({ ...prev, deltaVMS: deltaV }));
      }
    }
  }, [neoData]);

  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(100);
  const [simTime, setSimTime] = useState(() => Math.floor(Date.now() / 1000));
  const simTimeRef = useRef(simTime);
  const [camMode, setCamMode] = useState<CameraMode>("earth");
  const [goToImpactSignal, setGoToImpactSignal] = useState(0);

  useEffect(() => {
    simTimeRef.current = simTime;
  }, [simTime]);

  useEffect(() => {
    let raf: number;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (playing) setSimTime((t) => t + dt * speed);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);

  const impact = useMemo(() => runImpactModel(params), [params]);
  const craterRadiusKm = Math.max(impact.craterDiameterKm / 2, 5);
  const deflectionOutcome = useMemo(() => estimateDeflectionOutcome(deflection), [deflection]);

  useEffect(() => {
    if (!goToImpactSignal) return;
    const start = simTimeRef.current;
    let best = start;
    let minDistance = Infinity;
    const deflected = showDeflection && deflectionOutcome.avoidsImpact;
    for (let i = 0; i <= 2000; i++) {
      const candidate = start + i * 1800;
      const asteroid = getAsteroidPosition(candidate, deflected);
      const earth = getEarthPosition(candidate);
      const dx = asteroid.x - earth.x;
      const dy = asteroid.y - earth.y;
      const dz = asteroid.z - earth.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < minDistance) {
        minDistance = dist;
        best = candidate;
        if (dist < 0.05) break;
      }
    }
    setSimTime(best);
    setPlaying(false);
  }, [goToImpactSignal, showDeflection, deflectionOutcome.avoidsImpact]);

  const telemetry = useMemo(() => {
    const asteroidScene = getAsteroidPosition(simTime, showDeflection && deflectionOutcome.avoidsImpact);
    const earthScene = getEarthPosition(simTime);
    const dx = asteroidScene.x - earthScene.x;
    const dy = asteroidScene.y - earthScene.y;
    const dz = asteroidScene.z - earthScene.z;
    const distanceScene = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const distanceKm = sceneUnitsToKm(distanceScene);
    const distanceLD = distanceKm / 384_400;
    const relativeSpeed = params.velocityKmS;
    const etaHours = distanceKm / (relativeSpeed * 3600);
    return {
      distanceKm,
      distanceLD,
      relativeSpeed,
      etaHours,
    };
  }, [simTime, params.velocityKmS, deflectionOutcome.avoidsImpact, showDeflection]);

  const { data: elevation } = useQuery({
    queryKey: ["elevation", params.impactLat, params.impactLon],
    queryFn: () => fetchElevation(params.impactLat, params.impactLon),
    retry: 0,
  });

  const metrics = useMemo(
    () => [
      { label: t.energy, value: `${(impact.kineticEnergyJ / 1e18).toFixed(2)} ${t.exajoules}` },
      { label: t.yield, value: `${impact.tntMegatons.toFixed(2)} ${t.megatons}` },
      { label: t.crater, value: `${impact.craterDiameterKm.toFixed(2)} ${t.km}` },
      { label: t.blastRadius, value: `${impact.blast5psiRadiusKm.toFixed(2)} ${t.km}` },
      { label: t.lightDamage, value: `${impact.lightDamageRadiusKm.toFixed(2)} ${t.km}` },
      { label: t.seismicMagnitude, value: `${impact.estSeismicMagnitude.toFixed(2)}` },
      { label: t.mass, value: `${(impact.massKg / 1e9).toFixed(2)} ${t.gigatons}` },
      { label: t.torinoScale, value: `${impact.torinoScale} / 10` },
    ],
    [impact, t],
  );

  const telemetryCards: TelemetryCardSpec[] = [
    {
      title: t.asteroidEarthDistance,
      value: `${telemetry.distanceLD.toFixed(2)} ${t.lunarDistances}`,
      sub: `${telemetry.distanceKm.toLocaleString(t.language === 'es' ? "es-ES" : "en-US", { maximumFractionDigits: 0 })} ${t.km}`,
      icon: Orbit,
    },
    {
      title: t.relativeVelocity,
      value: `${telemetry.relativeSpeed.toFixed(2)} ${t.kmPerS}`,
      sub: `${(telemetry.relativeSpeed * 3600).toFixed(0)} ${t.kmPerH}`,
      icon: GaugeCircle,
    },
    {
      title: t.estimatedArrival,
      value: formatDuration(telemetry.etaHours, t),
      sub: t.orbitalCrossingTime,
      icon: Timer,
    },
    {
      title: t.mitigation,
      value: deflectionOutcome.avoidsImpact ? t.avoidanceAchieved : t.impactLikely,
      sub: `Δv ${deflection.deltaVMS.toFixed(2)} ${t.mPerS} · ${t.shift} ${deflectionOutcome.alongTrackShiftKm.toFixed(2)} ${t.km}`,
      icon: ShieldCheck,
    },
  ];

  const presets = useMemo(() => listData?.near_earth_objects ?? [], [listData]);

  function loadPreset(id: string) {
    const neo = presets.find((n: any) => String(n.id) === id);
    if (!neo) return;
    const est = neo.estimated_diameter?.meters;
    const avgMeters = est ? ((est.estimated_diameter_max ?? 0) + (est.estimated_diameter_min ?? 0)) / 2 : params.diameterKilometers * 1000;
    const avgKilometers = avgMeters / 1000;
    const nextApproach = getNextApproachData(neo.close_approach_data);
    const velocity = Number(nextApproach?.relative_velocity?.kilometers_per_second ?? params.velocityKmS);
    setParams((prev) => ({
      ...prev,
      name: neo.name ?? prev.name,
      diameterKilometers: avgKilometers || prev.diameterKilometers,
      velocityKmS: velocity || prev.velocityKmS,
    }));
    navigate(`/simulation?neo=${neo.id}`);
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <header className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-primary">
              🌍 {t.orbitalSimulation}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold glow-text">{t.trajectoryCenter}</h1>
            <p className="text-muted-foreground">
              {t.simulationDescription}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/20" onClick={() => setGoToImpactSignal((x) => x + 1)}>
              {t.goToImpact}
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate("/mission")}>{t.sendToMission}</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {telemetryCards.map((card) => (
            <TelemetrySummaryCard key={card.title} {...card} />
          ))}
        </div>
      </header>

      <section className="space-panel rounded-3xl p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <SatelliteDish className="h-5 w-5" /> {t.loadAsteroid}
          </div>
          <select
            className="h-10 rounded-md border border-primary/40 bg-card/60 px-3 text-sm"
            value={queryParams.neo ?? ""}
            onChange={(e) => loadPreset(e.target.value)}
          >
            <option value="">{t.selectNEO}</option>
            {presets.map((neo: any) => (
              <option key={neo.id} value={neo.id}>
                {neo.name} · {((neo.estimated_diameter?.meters?.estimated_diameter_max ?? 0) / 1000).toFixed(2)} {t.km}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Switch id="slow-motion" checked={slowMotion} onCheckedChange={setSlowMotion} />
            <Label htmlFor="slow-motion" className="text-sm text-muted-foreground">
              {t.slowMotionPlayback}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/40 text-primary">
              <Sparkles className="h-3 w-3 mr-1" /> {t.torinoScale} {impact.torinoScale}
            </Badge>
          </div>
        </div>
      </section>

      <section>
        <SimulationControls
          params={params}
          setParams={setParams}
          deflection={deflection}
          setDeflection={setDeflection}
          showDeflection={showDeflection}
          setShowDeflection={setShowDeflection}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <TimeControls
            playing={playing}
            onTogglePlay={() => setPlaying((p) => !p)}
            speed={speed}
            onChangeSpeed={setSpeed}
            simTimeSec={simTime}
            onGoToImpact={() => setGoToImpactSignal((s) => s + 1)}
            cameraMode={camMode}
            onCameraMode={setCamMode}
            onFullscreen={() => document.querySelector("#solar-canvas")?.requestFullscreen?.()}
            onReset={() => {
              setSimTime(Math.floor(Date.now() / 1000));
              setSpeed(100);
              setPlaying(true);
            }}
          />
          <div id="solar-canvas" className="space-panel rounded-3xl p-3">
            <SolarSystem3D
              simTimeSec={simTime}
              playing={playing}
              cameraMode={camMode}
              deflection={deflection}
              showDeflection={showDeflection}
              goToImpactSignal={goToImpactSignal}
              approachDate={getNextApproachData(neoData?.close_approach_data)?.close_approach_date}
            />
          </div>
          <div className="space-panel rounded-3xl p-3">
            <LocalImpact
              lat={params.impactLat}
              lon={params.impactLon}
              craterRadiusKm={craterRadiusKm}
              severeRadiusKm={impact.blast5psiRadiusKm}
              moderateRadiusKm={impact.lightDamageRadiusKm}
              isOcean={params.isOceanImpact}
              slowMotion={slowMotion}
            />
          </div>
        </div>
        <div className="space-y-6">
          <MetricsPanel metrics={metrics} />
          {elevation?.value && (
            <Card className="space-panel">
              <CardHeader>
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-primary" /> {t.impactElevation}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {elevation.value?.USGS_Elevation_Point_Query_Service?.Elevation?.toFixed?.(2)} {t.metersAboveSeaLevel}
              </CardContent>
            </Card>
          )}
          <Card className="space-panel">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <ArrowBigRightDash className="h-4 w-4 text-primary" /> {t.operationalFlow}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1. {t.operationalStep1}</p>
              <p>2. {t.operationalStep2}</p>
              <p>3. {t.operationalStep3}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function TelemetrySummaryCard({ icon: Icon, title, value, sub }: TelemetryCardSpec) {
  const { t } = useLanguage();
  
  return (
    <Card className="space-panel h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-0">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
            {t.telemetry}
          </p>
          <CardTitle className="text-base font-semibold tracking-normal text-foreground">
            {title}
          </CardTitle>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </span>
      </CardHeader>
      <CardContent className="space-y-2 pt-6">
        <p className="text-4xl font-bold leading-tight text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}