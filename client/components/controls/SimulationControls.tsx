import { useId, type ReactNode } from "react";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { AsteroidParams, DeflectionParams } from "@/lib/api";

export interface SimulationControlsProps {
  params: AsteroidParams;
  setParams: (p: AsteroidParams) => void;
  deflection: DeflectionParams;
  setDeflection: (d: DeflectionParams) => void;
  showDeflection: boolean;
  setShowDeflection: (s: boolean) => void;
}

export default function SimulationControls({
  params,
  setParams,
  deflection,
  setDeflection,
  showDeflection,
  setShowDeflection,
}: SimulationControlsProps) {
  const baseId = useId();
  const latId = `${baseId}-lat`;
  const lonId = `${baseId}-lon`;
  const oceanId = `${baseId}-ocean`;
  const deflectionToggleId = `${baseId}-show-def`;

  const update = <K extends keyof AsteroidParams>(key: K, value: AsteroidParams[K]) =>
    setParams({ ...params, [key]: value });

  const updateDef = <K extends keyof DeflectionParams>(key: K, value: DeflectionParams[K]) =>
    setDeflection({ ...deflection, [key]: value });

  const deflectionDisabled = !showDeflection;

  return (
    <TooltipProvider delayDuration={100}>
      <Card className="border border-border/60 bg-card/80 backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg">Scenario Controls</CardTitle>
          <p className="text-sm text-muted-foreground">
            Fine-tune asteroid characteristics and mitigation strategy.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <Section
            title="Asteroid parameters"
            description="Control size, composition, and entry conditions before impact."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Control
                label="Diameter (km)"
                tooltip="Physical diameter of the asteroid in kilometers"
                value={params.diameterKilometers}
                onChange={(v) => update("diameterKilometers", v)}
                min={0.01}
                max={50}
                step={0.01}
              />
              <Control
                label="Density (kg/m³)"
                tooltip="Typical rocky asteroids are close to 3000 kg/m³"
                value={params.densityKgM3}
                onChange={(v) => update("densityKgM3", v)}
                min={500}
                max={8000}
                step={50}
              />
              <Control
                label="Velocity (km/s)"
                tooltip="Impact speed relative to Earth"
                value={params.velocityKmS}
                onChange={(v) => update("velocityKmS", v)}
                min={5}
                max={72}
                step={0.5}
              />
              <Control
                label="Impact angle (°)"
                tooltip="Angle relative to the horizontal; 90° is vertical"
                value={params.impactAngleDeg}
                onChange={(v) => update("impactAngleDeg", v)}
                min={5}
                max={90}
                step={1}
              />
            </div>
          </Section>

          <Section
            title="Impact location"
            description="Select coordinates and surface type for the predicted impact point."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={latId}>Latitude (°)</Label>
                <Input
                  id={latId}
                  type="number"
                  value={params.impactLat}
                  onChange={(event) => update("impactLat", Number(event.target.value))}
                  step={0.1}
                  inputMode="decimal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={lonId}>Longitude (°)</Label>
                <Input
                  id={lonId}
                  type="number"
                  value={params.impactLon}
                  onChange={(event) => update("impactLon", Number(event.target.value))}
                  step={0.1}
                  inputMode="decimal"
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-background/80 px-4 py-3">
                <div className="space-y-1">
                  <Label htmlFor={oceanId} className="text-sm font-medium">
                    Ocean impact
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Toggle to simulate a water landing scenario.
                  </p>
                </div>
                <Switch
                  id={oceanId}
                  checked={params.isOceanImpact}
                  onCheckedChange={(checked) => update("isOceanImpact", checked)}
                />
              </div>
            </div>
          </Section>

          <Section
            title="Deflection strategy"
            description="Enable mitigation and set maneuver timing and direction."
            action={
              <div className="flex items-center gap-2 text-sm">
                <Switch id={deflectionToggleId} checked={showDeflection} onCheckedChange={setShowDeflection} />
                <Label htmlFor={deflectionToggleId} className="text-sm">
                  Enable strategy
                </Label>
              </div>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Control
                label="Δv (m/s)"
                tooltip="Change in asteroid velocity (kinetic impactor/gravity tractor)"
                value={deflection.deltaVMS}
                onChange={(v) => updateDef("deltaVMS", v)}
                min={0}
                max={500}
                step={1}
                disabled={deflectionDisabled}
              />
              <Control
                label="Lead time (days)"
                tooltip="Time before the nominal impact when deflection is applied"
                value={deflection.leadTimeDays}
                onChange={(v) => updateDef("leadTimeDays", v)}
                min={0}
                max={3650}
                step={1}
                disabled={deflectionDisabled}
              />
              <div className="space-y-2">
                <Label htmlFor={`${baseId}-dir`}>Direction</Label>
                <select
                  id={`${baseId}-dir`}
                  className="h-10 w-full rounded-md border border-border/60 bg-background/80 px-3 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                  value={deflection.direction}
                  onChange={(event) => updateDef("direction", event.target.value as DeflectionParams["direction"])}
                  disabled={deflectionDisabled}
                >
                  <option value="prograde">Prograde</option>
                  <option value="retrograde">Retrograde</option>
                  <option value="normal">Normal</option>
                  <option value="antinormal">Antinormal</option>
                </select>
              </div>
            </div>
          </Section>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

function Section({ title, description, action, children }: SectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

interface ControlProps {
  label: string;
  tooltip?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
}

function Control({ label, tooltip, value, onChange, min, max, step, disabled = false }: ControlProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex h-5 w-5 items-center justify-center rounded-full border border-border/60 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                i
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[220px] text-sm leading-relaxed">{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={(sliderValue) => onChange(sliderValue[0])}
          className="w-full"
          aria-label={label}
          disabled={disabled}
        />
        <Input
          className="w-full sm:w-28"
          type="number"
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={(event) => onChange(Number(event.target.value))}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
