import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { GraduationCap, Activity, Brain } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Academy() {
  const { t } = useLanguage();
  
  const topics = [
    {
      id: "neos",
      title: t.neosAndPHAs,
      summary: t.neosAndPHAsDescription,
      content: t.neosAndPHAsContent,
    },
    {
      id: "historicos",
      title: t.historicalImpacts,
      summary: t.historicalImpactsDescription,
      content: t.historicalImpactsContent,
    },
    {
      id: "torino",
      title: t.torinoScaleTitle,
      summary: t.torinoScaleDescription,
      content: t.torinoScaleContent,
    },
    {
      id: "efectos",
      title: t.environmentalEffects,
      summary: t.environmentalEffectsDescription,
      content: t.environmentalEffectsContent,
    },
    {
      id: "mitigacion",
      title: t.mitigationTechniques,
      summary: t.mitigationTechniquesDescription,
      content: t.mitigationTechniquesContent,
    },
    {
      id: "deteccion",
      title: t.detectionSystems,
      summary: t.detectionSystemsDescription,
      content: t.detectionSystemsContent,
    },
    {
      id: "protocolos",
      title: t.internationalProtocols,
      summary: t.internationalProtocolsDescription,
      content: t.internationalProtocolsContent,
    },
    {
      id: "casos",
      title: t.caseStudies,
      summary: t.caseStudiesDescription,
      content: t.caseStudiesContent,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs uppercase tracking-widest text-primary">
          📚 {t.academy}
        </div>
        <h1 className="text-4xl font-bold glow-text">{t.planetaryDefenseTraining}</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {t.planetaryDefenseDescription}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                {t.planetaryDefenseTraining}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="space-y-4">
                {topics.map((topic, index) => (
                  <AccordionItem
                    key={topic.id}
                    value={topic.id}
                    className="border-primary/20 bg-card/30 rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <Badge variant="outline" className="shrink-0 border-primary/40 text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </Badge>
                        <div>
                          <div className="font-semibold text-foreground">{topic.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">{topic.summary}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 text-muted-foreground">
                      {topic.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                {t.practiceSimulation}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t.planetaryDefenseDescription}
              </p>
              <div className="space-y-2">
                <Link to="/simulation" className="block">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {t.openSimulation}
                  </Button>
                </Link>
                <Link to="/mission" className="block">
                  <Button variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/20">
                    {t.missionCenter}
                  </Button>
                </Link>
                <Link to="/asteroids" className="block">
                  <Button variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/20">
                    {t.goToCatalog}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {t.operationalFlow}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{t.operationalStep1}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.detectionSystemsDescription}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{t.operationalStep2}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.torinoScaleDescription}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{t.operationalStep3}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.mitigationTechniquesDescription}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}