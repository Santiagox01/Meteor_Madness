import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Orbit, ShieldCheck, Swords, Telescope, FlameKindling, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

interface ScenarioConfig {
  id: string;
  name: string;
  description: string;
  torino: number;
  velocity: number;
  massGt: number;
  recommendedTool: string;
}

interface ToolReport {
  id: string;
  name: string;
  summary: string;
  success: number;
  residual: string;
  deltaV: number;
  responseTimeDays: number;
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: "impactor2025",
    name: "Impactor-2025 (actual)",
    description: "Asteroide recientemente detectado con paso cercano a la Tierra y riesgo moderado en la escala de Torino.",
    torino: 4,
    velocity: 22,
    massGt: 0.12,
    recommendedTool: "kinetic",
  },
  {
    id: "chicxulub",
    name: "Chicxulub (66 Ma)",
    description: "Impacto de ~10 km responsable de la extinción masiva cretácico-paleógeno. Escenario extremo.",
    torino: 10,
    velocity: 20,
    massGt: 5.0,
    recommendedTool: "nuclear",
  },
  {
    id: "tunguska",
    name: "Tunguska (1908)",
    description: "Explosión aérea sobre Siberia; estimada en 50-60 m de diámetro. Ideal para simulación preventiva.",
    torino: 5,
    velocity: 15,
    massGt: 0.0005,
    recommendedTool: "kinetic",
  },
  {
    id: "chelyabinsk",
    name: "Cheliábinsk (2013)",
    description: "Evento atmosférico moderno de referencia para mitigación temprana y respuesta civil.",
    torino: 3,
    velocity: 19,
    massGt: 0.0002,
    recommendedTool: "tractor",
  },
  {
    id: "custom",
    name: "Escenario libre",
    description: "Carga un NEO desde el catálogo y define parámetros personalizados para un ejercicio de defensa.",
    torino: 0,
    velocity: 18,
    massGt: 0.05,
    recommendedTool: "tractor",
  },
];

const TOOLS: ToolReport[] = [
  {
    id: "kinetic",
    name: "Impactador cinético",
    summary: "Aplicación de Δv mediante colisión controlada. Eficaz para objetos de masa moderada y alto tiempo de anticipación.",
    success: 78,
    residual: "Impacto residual reduce energía en 62%",
    deltaV: 4.2,
    responseTimeDays: 540,
  },
  {
    id: "tractor",
    name: "Tractor gravitacional",
    summary: "Uso de nave masiva para desviar suavemente al asteroide. Requiere larga ventana temporal.",
    success: 64,
    residual: "Asteroide se desvía 1.2 radios terrestres",
    deltaV: 0.8,
    responseTimeDays: 900,
  },
  {
    id: "nuclear",
    name: "Explosión nuclear controlada",
    summary: "Dispositivo de fracción kilotón colocada fuera de la superficie para ablación y desviación rápida.",
    success: 92,
    residual: "Fragmentos menores con energía reducida",
    deltaV: 6.3,
    responseTimeDays: 120,
  },
];

export default function Mission() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [scenarioId, setScenarioId] = useState<string>("impactor2025");
  const [toolId, setToolId] = useState<string>("kinetic");
  
  // Modifiable parameters
  const [missionDuration, setMissionDuration] = useState<number>(365);
  const [numberOfImpulses, setNumberOfImpulses] = useState<number>(3);
  const [instrumentalPrecision, setInstrumentalPrecision] = useState<number>(7);

  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0], [scenarioId]);
  const tool = useMemo(() => TOOLS.find((t) => t.id === toolId) ?? TOOLS[0], [toolId]);

  // Predetermined probability system based on scenario-tool compatibility
  const compatibility = useMemo(() => {
    // Optimal match: scenario matches recommended tool
    if (scenario.recommendedTool === tool.id) return 0.95;
    
    // High compatibility for nuclear on extreme threats (Torino 8+)
    if (tool.id === "nuclear" && scenario.torino >= 8) return 0.90;
    
    // Medium compatibility for tractor on slow objects (<18 km/s)
    if (tool.id === "tractor" && scenario.velocity < 18) return 0.75;
    
    // Kinetic impactor moderate compatibility for medium threats
    if (tool.id === "kinetic" && scenario.torino >= 3 && scenario.torino <= 6) return 0.70;
    
    // Default low compatibility for mismatched scenarios
    return 0.60;
  }, [scenario, tool]);

  // Overall mission success probability combining tool effectiveness, compatibility, and modifiable parameters
  const missionSuccessProbability = useMemo(() => {
    // Factor in mission duration (longer missions have diminishing returns)
    const durationFactor = Math.max(0.7, 1 - (missionDuration - 365) / 1000);
    
    // Factor in number of impulses (more impulses generally improve success but with complexity costs)
    const impulsesFactor = Math.min(1.1, 0.8 + numberOfImpulses * 0.05);
    
    // Factor in instrumental precision (higher precision improves success)
    const precisionFactor = 0.7 + (instrumentalPrecision / 10) * 0.4;
    
    const baseSuccess = tool.success * compatibility;
    const adjustedSuccess = baseSuccess * durationFactor * impulsesFactor * precisionFactor;
    
    return Math.round(Math.min(99, Math.max(10, adjustedSuccess)));
  }, [tool.success, compatibility, missionDuration, numberOfImpulses, instrumentalPrecision]);

  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <header className="space-y-4 text-center">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-primary">
              🛰️ {t.missionCenter}
            </div>
            <h1 className="text-4xl font-bold glow-text mt-4">{t.planetaryDefenseAgency}</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto mt-4">
              {t.missionDescription}
            </p>
          </div>
          <div className="flex-shrink-0">
            <LanguageSwitcher />
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/20" onClick={()=>navigate("/simulation")}>{t.openSimulation}</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={()=>navigate("/asteroids")}>{t.loadNEO}</Button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="space-panel">
          <CardHeader className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Orbit className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground text-xl">{t.operationalScenario}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={scenarioId} onValueChange={setScenarioId}>
                <SelectTrigger className="w-64 border-primary/40 bg-card/60 text-sm">
                  <SelectValue placeholder={t.selectScenario} />
                </SelectTrigger>
                <SelectContent>
                  {SCENARIOS.map((sc) => (
                    <SelectItem key={sc.id} value={sc.id}>{sc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={toolId} onValueChange={setToolId}>
                <SelectTrigger className="w-64 border-primary/40 bg-card/60 text-sm">
                  <SelectValue placeholder={t.mitigationTool} />
                </SelectTrigger>
                <SelectContent>
                  {TOOLS.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <Badge variant="outline" className="border-primary/40 text-primary">{t.torino} {scenario.torino}</Badge>
                <span>{t.velocity} {scenario.velocity} km/s · {t.mass} {scenario.massGt} Gt</span>
              </div>
              <p>{scenario.description}</p>
            </div>
            
            {/* Modifiable Parameters Section */}
            <div className="space-y-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
              <h3 className="text-sm font-medium text-foreground">{t.language === 'es' ? 'Parámetros de misión' : 'Mission Parameters'}</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-xs text-muted-foreground">{t.missionDuration}</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={missionDuration}
                    onChange={(e) => setMissionDuration(Number(e.target.value))}
                    min={30}
                    max={1095}
                    className="border-primary/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impulses" className="text-xs text-muted-foreground">{t.numberOfImpulses}</Label>
                  <Input
                    id="impulses"
                    type="number"
                    value={numberOfImpulses}
                    onChange={(e) => setNumberOfImpulses(Number(e.target.value))}
                    min={1}
                    max={10}
                    className="border-primary/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precision" className="text-xs text-muted-foreground">{t.instrumentalPrecision}</Label>
                  <Input
                    id="precision"
                    type="number"
                    value={instrumentalPrecision}
                    onChange={(e) => setInstrumentalPrecision(Number(e.target.value))}
                    min={1}
                    max={10}
                    className="border-primary/40"
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <MissionMetric 
                icon={<Telescope className="h-5 w-5 text-primary" />} 
                title={t.monitoring} 
                body={t.language === 'es' ? "Seguimiento radar y óptico sincronizado con módulo orbital." : "Radar and optical tracking synchronized with orbital module."} 
              />
              <MissionMetric 
                icon={<Swords className="h-5 w-5 text-primary" />} 
                title={t.mitigation} 
                body={tool.summary} 
              />
              <MissionMetric 
                icon={<FlameKindling className="h-5 w-5 text-primary" />} 
                title={t.residualImpact} 
                body={tool.residual} 
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{t.overallSuccessProbability}</span>
                <span className="font-semibold text-primary">{missionSuccessProbability}%</span>
              </div>
              <Progress value={missionSuccessProbability} className="h-3" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{t.toolEffectiveness}</span>
                <span>{tool.success}%</span>
              </div>
              <Progress value={tool.success} className="h-2" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{t.scenarioCompatibility}</span>
                <span>{Math.round(compatibility * 100)}%</span>
              </div>
              <Progress value={compatibility * 100} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div className="space-y-1">
                  <div className="uppercase tracking-wide">{t.estimatedDeltaV}</div>
                  <div className="text-foreground text-lg font-semibold">{tool.deltaV.toFixed(1)} m/s</div>
                </div>
                <div className="space-y-1">
                  <div className="uppercase tracking-wide">{t.responseWindow}</div>
                  <div className="text-foreground text-lg font-semibold">{tool.responseTimeDays} {t.days}</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">{t.availableOrders}</div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/15">
                  <Link to={`/simulation?neo=${scenarioId === "custom" ? "" : scenarioId}`}>{t.simulateTrajectory}</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to={`/mission?execute=${scenarioId}&tool=${tool.id}`}>{t.sendOfficialReport}</Link>
                </Button>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
                  <Link to="/academy">{t.reviewEducationalProtocol}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="space-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-foreground text-xl">
              <ShieldCheck className="h-5 w-5 text-primary" /> {t.missionReport}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>{t.executiveSummary}</p>
            <ul className="space-y-2">
              <li>• {t.expectedResult} <span className="text-foreground font-medium">{missionSuccessProbability}%</span> {t.successProbability}</li>
              <li>• {t.toolEffectivenessReport} <span className="text-foreground font-medium">{tool.success}%</span> {t.language === 'es' ? 'con' : 'with'} <span className="text-foreground font-medium">{Math.round(compatibility * 100)}%</span> {t.language === 'es' ? 'de compatibilidad' : 'compatibility'}.</li>
              <li>• {t.deviatedDistance} <span className="text-foreground font-medium">{(compatibility * 1.4).toFixed(2)} {t.earthRadii}</span>.</li>
              <li>• {t.language === 'es' ? 'Impacto residual:' : 'Residual impact:'} {tool.residual}.</li>
              <li>• {t.coordinationRequired}</li>
            </ul>
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-primary text-xs">
              {t.note} {t.approximateValues}
            </div>
            <div className="pt-4 border-t border-border/60 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground"><Target className="h-4 w-4" /> {t.nextSteps}</div>
              <p>{t.nextStepsDescription}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-panel rounded-3xl p-8 md:p-10 space-y-6 text-center">
        <h2 className="text-3xl font-semibold glow-text">{t.finalBriefing}</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {t.briefingDescription}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/simulation">{t.openOrbitalSimulation}</Link>
          </Button>
          <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/20">
            <Link to="/academy">{t.assignTraining}</Link>
          </Button>
          <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
            <Link to="/asteroids">{t.analyzeAnotherNEO}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function MissionMetric({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-2">
      <div className="flex items-center gap-2 text-sm text-primary">{icon}{title}</div>
      <div className="text-xs text-muted-foreground leading-relaxed">{body}</div>
    </div>
  );
}
