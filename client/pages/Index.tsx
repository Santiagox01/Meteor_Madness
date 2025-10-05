import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Orbit, Radar, ShieldCheck, GraduationCap, Sparkles, PanelRightOpen, ScrollText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Index() {
  const { t } = useLanguage();
  
  const modules = [
    {
      title: t.neosCatalogTitle,
      description: t.neosCatalogDescription,
      icon: "🪐",
      to: "/asteroids",
      action: t.exploreAsteroids,
    },
    {
      title: t.orbitalSimulationTitle,
      description: t.orbitalSimulationDescription,
      icon: "🌍",
      to: "/simulation",
      action: t.openSimulation,
    },
    {
      title: t.missionCenterTitle,
      description: t.missionCenterDescription,
      icon: "🛰️",
      to: "/mission",
      action: t.enterCenter,
    },
    {
      title: t.academyTitle,
      description: t.academyDescription,
      icon: "📚",
      to: "/academy",
      action: t.goToAcademy,
    },
  ];

  const diagnostics = [
    {
      icon: <Radar className="h-5 w-5 text-primary" />,
      title: t.continuousMonitoring,
      body: t.continuousMonitoringDescription,
    },
    {
      icon: <Orbit className="h-5 w-5 text-primary" />,
      title: t.physicalModels,
      body: t.physicalModelsDescription,
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      title: t.defenseScenarios,
      body: t.defenseScenariosDescription,
    },
    {
      icon: <GraduationCap className="h-5 w-5 text-primary" />,
      title: t.educationalTraining,
      body: t.educationalTrainingDescription,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm uppercase font-semibold tracking-wider">{t.welcomeTitle}</span>
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground glow-text">
            {t.welcomeSubtitle}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => (
            <Card
              key={module.to}
              className="group relative overflow-hidden border-primary/20 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:border-primary/40"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{module.icon}</span>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {module.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {module.description}
                </p>
                <Link to={module.to} className="block">
                  <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                    {module.action}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <PanelRightOpen className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">{t.continuousMonitoring}</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {diagnostics.map((item, index) => (
              <Card
                key={index}
                className="border-primary/20 bg-card/30 hover:bg-card/60 transition-all duration-300"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center space-y-4 pt-8 border-t border-border/40">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <ScrollText className="h-4 w-4" />
          </div>
          <div className="flex justify-center gap-4">
            <Link to="/simulation">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t.openSimulation}
              </Button>
            </Link>
            <Link to="/mission">
              <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/20">
                {t.missionCenter}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}