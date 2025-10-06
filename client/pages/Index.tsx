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
    {
      title: t.impactsTitle,
      description: t.impactsDescription,
      icon: "⚠️",
      to: "/impacts",
      action: t.impacts,
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
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 md:space-y-12">
        <div className="text-center space-y-3 md:space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs md:text-sm uppercase font-semibold tracking-wider">{t.welcomeTitle}</span>
            <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground glow-text">
            {t.welcomeSubtitle}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {modules.map((module) => (
            <Card
              key={module.to}
              className="group relative overflow-hidden border-primary/20 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-2xl md:text-3xl">{module.icon}</span>
                  <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {module.title}
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {module.description}
                </p>
                <Link to={module.to} className="block">
                  <Button className="w-full text-xs md:text-sm bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                    {module.action}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <PanelRightOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground">{t.continuousMonitoring}</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {diagnostics.map((item, index) => (
              <Card
                key={index}
                className="border-primary/20 bg-card/30 hover:bg-card/60 transition-all duration-300 hover:border-primary/30"
              >
                <CardContent className="p-3 md:p-4 space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <h4 className="text-xs md:text-sm font-semibold text-foreground leading-tight">{item.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center space-y-4 pt-6 md:pt-8 border-t border-border/40">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <ScrollText className="h-4 w-4" />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 max-w-md mx-auto">
            <Link to="/simulation" className="flex-1">
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {t.openSimulation}
              </Button>
            </Link>
            <Link to="/mission" className="flex-1">
              <Button size="lg" variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/20">
                {t.missionCenter}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}