import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
import { Orbit, ShieldCheck, Swords, Telescope, FlameKindling, Target } from "lucide-react";

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
  const [scenarioId, setScenarioId] = useState<string>("impactor2025");
  const [toolId, setToolId] = useState<string>("kinetic");

  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0], [scenarioId]);
  const tool = useMemo(() => TOOLS.find((t) => t.id === toolId) ?? TOOLS[0], [toolId]);

  const compatibility = useMemo(() => {
    if (scenario.recommendedTool === tool.id) return 0.95;
    if (tool.id === "nuclear" && scenario.torino >= 8) return 0.9;
    if (tool.id === "tractor" && scenario.velocity < 18) return 0.75;
    return 0.6;
  }, [scenario, tool]);

  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-primary">
          🛰️ Centro de misión
        </div>
        <h1 className="text-4xl font-bold glow-text">Agencia de Defensa Planetaria</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Selecciona un escenario de amenaza, calcula estrategias de mitigación y genera reportes operativos. Cada resultado puede enviarse al módulo de simulación o a la academia para entrenamiento.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/20" onClick={()=>navigate("/simulation")}>Abrir simulación</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={()=>navigate("/asteroids")}>Cargar NEO</Button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="space-panel">
          <CardHeader className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Orbit className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground text-xl">Escenario operativo</CardTitle>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={scenarioId} onValueChange={setScenarioId}>
                <SelectTrigger className="w-64 border-primary/40 bg-card/60 text-sm">
                  <SelectValue placeholder="Selecciona un escenario" />
                </SelectTrigger>
                <SelectContent>
                  {SCENARIOS.map((sc) => (
                    <SelectItem key={sc.id} value={sc.id}>{sc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={toolId} onValueChange={setToolId}>
                <SelectTrigger className="w-64 border-primary/40 bg-card/60 text-sm">
                  <SelectValue placeholder="Herramienta de mitigación" />
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
                <Badge variant="outline" className="border-primary/40 text-primary">Escala Torino {scenario.torino}</Badge>
                <span>Velocidad {scenario.velocity} km/s · Masa {scenario.massGt} Gt</span>
              </div>
              <p>{scenario.description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <MissionMetric icon={<Telescope className="h-5 w-5 text-primary" />} title="Monitoreo" body="Seguimiento radar y óptico sincronizado con módulo orbital." />
              <MissionMetric icon={<Swords className="h-5 w-5 text-primary" />} title="Mitigación" body={tool.summary} />
              <MissionMetric icon={<FlameKindling className="h-5 w-5 text-primary" />} title="Impacto residual" body={tool.residual} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Probabilidad de éxito</span>
                <span>{tool.success}%</span>
              </div>
              <Progress value={tool.success} className="h-2" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Compatibilidad con el escenario</span>
                <span>{Math.round(compatibility * 100)}%</span>
              </div>
              <Progress value={compatibility * 100} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div className="space-y-1">
                  <div className="uppercase tracking-wide">Δv estimado</div>
                  <div className="text-foreground text-lg font-semibold">{tool.deltaV.toFixed(1)} m/s</div>
                </div>
                <div className="space-y-1">
                  <div className="uppercase tracking-wide">Ventana de respuesta</div>
                  <div className="text-foreground text-lg font-semibold">{tool.responseTimeDays} días</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Órdenes disponibles</div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/15">
                  <Link to={`/simulation?neo=${scenarioId === "custom" ? "" : scenarioId}`}>Simular trayectoria</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to={`/mission?execute=${scenarioId}&tool=${tool.id}`}>Enviar reporte oficial</Link>
                </Button>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
                  <Link to="/academy">Revisar protocolo educativo</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="space-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-foreground text-xl">
              <ShieldCheck className="h-5 w-5 text-primary" /> Reporte de misión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Resumen ejecutivo generado automáticamente con base en el escenario seleccionado y la estrategia de mitigación.</p>
            <ul className="space-y-2">
              <li>• Resultado esperado: <span className="text-foreground font-medium">{tool.success}%</span> de éxito.</li>
              <li>• Distancia desviada: <span className="text-foreground font-medium">{(compatibility * 1.4).toFixed(2)} radios terrestres</span>.</li>
              <li>• Impacto residual: {tool.residual}.</li>
              <li>• Requiere coordinación con simulación orbital para validar trayectorias finales.</li>
            </ul>
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-primary text-xs">
              Nota: Los valores son aproximaciones para uso en ejercicios de defensa. Se recomienda validación con datos actualizados del catálogo NEO.
            </div>
            <div className="pt-4 border-t border-border/60 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground"><Target className="h-4 w-4" /> Próximos pasos</div>
              <p>1. Validar órbitas en Simulación Orbital. 2. Coordinar con Academia para capacitación. 3. Emitir comunicado científico a la red Code Nebula.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-panel rounded-3xl p-8 md:p-10 space-y-6 text-center">
        <h2 className="text-3xl font-semibold glow-text">Briefing final</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          El Centro de Misión integra simulaciones, catálogos NEO y procedimientos educativos para mantener una respuesta global coordinada. Usa los resultados para informar a gobiernos, agencias científicas y equipos de campo.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/simulation">Abrir simulación orbital</Link>
          </Button>
          <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/20">
            <Link to="/academy">Asignar entrenamiento</Link>
          </Button>
          <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
            <Link to="/asteroids">Analizar otro NEO</Link>
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
