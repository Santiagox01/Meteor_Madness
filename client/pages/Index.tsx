import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Orbit, Radar, ShieldCheck, GraduationCap, Sparkles, PanelRightOpen, ScrollText } from "lucide-react";

const modules = [
  {
    title: "Catálogo NEOs",
    description: "Consulta asteroides cercanos en tiempo real con datos de la NASA, evalúa peligrosidad y prepara análisis rápidos.",
    icon: "🪐",
    to: "/asteroids",
    action: "Explorar asteroides",
  },
  {
    title: "Simulación Orbital",
    description: "Visualiza trayectorias heliocéntricas, controla la escala temporal y sigue el acercamiento de Impactor-2025.",
    icon: "🌍",
    to: "/simulation",
    action: "Abrir simulación",
  },
  {
    title: "Centro de Misión",
    description: "Coordina estrategias de mitigación, ejecuta impactos cinéticos o tractores gravitacionales y revisa reportes.",
    icon: "🛰️",
    to: "/mission",
    action: "Entrar al centro",
  },
  {
    title: "Academia",
    description: "Formación continua: impactos históricos, escala de Torino, efectos ambientales y tácticas de defensa planetaria.",
    icon: "📚",
    to: "/academy",
    action: "Ir a la academia",
  },
];

const diagnostics = [
  {
    icon: <Radar className="h-5 w-5 text-primary" />,
    title: "Monitoreo continuo",
    body: "Paneles con telemetría actualizada: distancia, velocidad relativa y amenazas destacadas.",
  },
  {
    icon: <Orbit className="h-5 w-5 text-primary" />,
    title: "Modelos físicos",
    body: "Cálculos de energía cinética, cráter estimado, magnitud sísmica y escala de Torino en tiempo real.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-primary" />,
    title: "Escenarios de defensa",
    body: "Comparativa de impacto cinético, tractor gravitacional y opciones nucleares bajo métricas cuantificables.",
  },
  {
    icon: <GraduationCap className="h-5 w-5 text-primary" />,
    title: "Divulgación científica",
    body: "Material educativo inmersivo para científicos, docentes y ciudadanía sobre riesgos de impacto.",
  },
];

export default function Index() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" aria-hidden />
        <div className="absolute -top-40 right-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden />
      </div>

      <main className="container mx-auto px-4 py-16 space-y-24">
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-primary text-xs uppercase tracking-[0.3em]">
              Code Nebula · Defensa Planetaria
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight glow-text">
              Impactor-2025 – Code Nebula 🚀
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Visualización, simulación y análisis estratégicos de escenarios de impacto. Una plataforma inmersiva que replica un centro de defensa planetaria con datos reales, modelos físicos y herramientas de mitigación.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/simulation">Iniciar simulación orbital</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/15">
                <Link to="/mission">Entrar al centro de misión</Link>
              </Button>
              <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
                <Link to="/asteroids">Ver catálogo NEOs</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="space-panel px-4 py-5">
                <div className="text-sm text-muted-foreground">Datos activos</div>
                <div className="text-2xl font-semibold text-foreground">NASA NEO + USGS</div>
              </Card>
              <Card className="space-panel px-4 py-5">
                <div className="text-sm text-muted-foreground">Simulaciones</div>
                <div className="text-2xl font-semibold text-foreground">Orbital · Local</div>
              </Card>
              <Card className="space-panel px-4 py-5">
                <div className="text-sm text-muted-foreground">Mitigación</div>
                <div className="text-2xl font-semibold text-foreground">Impacto · Tractor · Nuclear</div>
              </Card>
            </div>
          </div>
          <Card className="space-panel overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm uppercase tracking-widest">Estado del sistema</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Impactor-2025</span>
                    <span>Monitorizado</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Distancia actual</span>
                    <span>~7.4 LD</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Escala Torino</span>
                    <span className="text-primary font-semibold">4 / 10</span>
                  </div>
                </div>
                <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm text-primary">
                  "Simula escenarios y envía estrategias de mitigación directamente al Centro de Misión para evaluación inmediata."
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 text-xs text-muted-foreground border-t border-border/60">
                <span>Panel de Defensa Planetaria · Versión 2025.1</span>
                <Link to="/academy" className="flex items-center gap-1 text-primary hover:underline text-sm">
                  Manual de operación
                  <ScrollText className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold glow-text">Módulos de la plataforma</h2>
            <p className="text-muted-foreground max-w-xl">
              Una experiencia altamente inmersiva con navegación rápida para científicos, responsables de políticas públicas y educadores. Cada módulo se conecta con simulaciones en vivo y reportes técnicos.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {modules.map((module) => (
              <Card key={module.title} className="space-panel h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl" aria-hidden>{module.icon}</span>
                    <PanelRightOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{module.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{module.description}</p>
                  </div>
                  <Button asChild variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/15">
                    <Link to={module.to}>{module.action}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-semibold glow-text">Arquitectura operativa</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {diagnostics.map((item) => (
              <Card key={item.title} className="space-panel h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">{item.icon}<span className="text-lg font-semibold text-foreground">{item.title}</span></div>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-panel rounded-3xl p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold glow-text">Listo para defender la Tierra</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Coordina simulaciones, activa protocolos de misión y educa a tu equipo desde un único centro. Impactor-2025 combina ciencia rigurosa, visualización inmersiva y herramientas de mitigación para la toma de decisiones estratégicas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/mission">Enviar a misión</Link>
            </Button>
            <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/20">
              <Link to="/simulation">Simular escenario</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
