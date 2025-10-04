import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { BookOpenCheck, GraduationCap, Globe2, Activity, Waves, ThermometerSun, Rocket, Shield, Brain } from "lucide-react";

const topics = [
  {
    id: "neos",
    title: "NEOs y asteroides potencialmente peligrosos",
    summary: "Clasificación, órbitas y seguimiento continuo de objetos cercanos a la Tierra.",
    content: "Los NEOs son cuerpos cuyo perihelio es menor a 1.3 AU. Un asteroide potencialmente peligroso (PHA) combina tamaño significativo con distancia mínima inferior a 0.05 AU.",
  },
  {
    id: "historicos",
    title: "Impactos históricos",
    summary: "Comparativa entre Tunguska, Cheliábinsk y Chicxulub.",
    content: "Desde explosiones atmosféricas hasta cráteres masivos, los eventos históricos ofrecen parámetros clave para calibrar modelos de daños y estrategias de mitigación.",
  },
  {
    id: "torino",
    title: "Escala de Torino",
    summary: "Índice estandarizado para comunicar riesgos de impacto.",
    content: "La escala combina probabilidad de impacto con energía cinética estimada. Valores de 0 a 10 guían la comunicación pública y la respuesta institucional.",
  },
  {
    id: "efectos",
    title: "Efectos ambientales",
    summary: "Cráteres, tsunamis, terremotos y cambios climáticos.",
    content: "El daño depende del punto de impacto, composición y velocidad. Los efectos secundarios incluyen incendios globales, tsunamis y alteraciones atmosféricas.",
  },
  {
    id: "mitigacion",
    title: "Estrategias de mitigación",
    summary: "Impactadores cinéticos, tractores gravitacionales y opciones nucleares.",
    content: "Cada herramienta tiene ventanas de tiempo y requisitos operativos diferentes. La misión adecuada se selecciona según masa, velocidad y tiempo de antelación.",
  },
];

const modules = [
  {
    title: "Laboratorio de simulación",
    body: "Explora órbitas heliocéntricas, calcula energía cinética y genera escenarios de impacto local.",
    icon: <Globe2 className="h-5 w-5 text-primary" />,
    simulate: "/simulation",
    mission: "/mission",
  },
  {
    title: "Entrenamiento de defensa",
    body: "Dirige ejercicios con herramientas de mitigación. Evalúa reportes de misión y protocolos de respuesta.",
    icon: <Shield className="h-5 w-5 text-primary" />,
    simulate: "/mission",
    mission: "/mission",
  },
  {
    title: "Divulgación científica",
    body: "Material multimedia para docentes y comunicadores. Incluye comparaciones históricas y glosario técnico.",
    icon: <BookOpenCheck className="h-5 w-5 text-primary" />,
    simulate: "/simulation",
    mission: "/academy",
  },
];

export default function Academy() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-primary">
          📚 Academia Code Nebula
        </div>
        <h1 className="text-4xl font-bold glow-text">Centro de formación en defensa planetaria</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Recursos educativos, análisis históricos e ilustraciones científicas para dominar la física de impactos y las estrategias de mitigación. Cada módulo enlaza con simulaciones interactivas y reportes operativos.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/20">
            <Link to="/simulation">Simular escenario</Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/mission">Enviar a misión</Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="space-panel">
          <CardHeader>
            <CardTitle className="text-foreground text-xl flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" /> Programa curricular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-2">
              {topics.map((topic) => (
                <AccordionItem key={topic.id} value={topic.id} className="border border-primary/20 rounded-xl px-4">
                  <AccordionTrigger className="text-left text-sm text-foreground">
                    <div className="flex flex-col">
                      <span className="font-semibold">{topic.title}</span>
                      <span className="text-xs text-muted-foreground">{topic.summary}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {topic.content}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/15 text-xs">
                        <Link to="/simulation">🔬 Simular escenario</Link>
                      </Button>
                      <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary text-xs">
                        <Link to="/mission">🛰️ Enviar a misión</Link>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="space-panel">
          <CardHeader>
            <CardTitle className="text-foreground text-xl flex items-center gap-3">
              <Brain className="h-5 w-5 text-primary" /> Capacitación recomendada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modules.map((module) => (
              <div key={module.title} className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-primary">{module.icon}{module.title}</div>
                <p className="text-xs text-muted-foreground">{module.body}</p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/20 text-xs">
                    <Link to={module.simulate}>🔬 Simular escenario</Link>
                  </Button>
                  <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary text-xs">
                    <Link to={module.mission}>🛰️ Enviar a misión</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-panel rounded-3xl p-8 md:p-12 space-y-6 text-center">
        <h2 className="text-3xl font-semibold glow-text">Material complementario</h2>
        <div className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-2">
            <Badge variant="outline" className="border-primary/40 text-primary"><Rocket className="h-3 w-3 mr-1" /> Protocolos</Badge>
            <p>Guías técnicas para activar protocolos de observación, simulación y respuesta ciudadana.</p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-2">
            <Badge variant="outline" className="border-primary/40 text-primary"><Activity className="h-3 w-3 mr-1" /> Laboratorios</Badge>
            <p>Ejercicios de aula que combinan modelos físicos simplificados con visualización inmersiva.</p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-2">
            <Badge variant="outline" className="border-primary/40 text-primary"><Waves className="h-3 w-3 mr-1" /> Modelos ambientales</Badge>
            <p>Simulaciones de tsunamis, ondas sísmicas y efectos atmosféricos derivados de los impactos.</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/simulation">Abrir simulador orbital</Link>
          </Button>
          <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/15">
            <Link to="/mission">Asignar misión</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
