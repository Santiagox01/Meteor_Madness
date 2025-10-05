import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mountain, Waves, Wind, AlertTriangle, Zap, TreePine } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Impacts() {
  const { t } = useLanguage();
  
  const geologicalTopics = [
    {
      id: "seismic",
      title: t.seismicActivity,
      summary: t.seismicActivityDescription,
      content: t.seismicActivityContent,
      icon: <Zap className="h-5 w-5 text-destructive" />,
    },
    {
      id: "crater",
      title: t.craterFormation,
      summary: t.craterFormationDescription,
      content: t.craterFormationContent,
      icon: <Mountain className="h-5 w-5 text-orange-500" />,
    },
    {
      id: "groundwater",
      title: t.groundWaterChanges,
      summary: t.groundWaterChangesDescription,
      content: t.groundWaterChangesContent,
      icon: <Waves className="h-5 w-5 text-blue-500" />,
    },
  ];

  const environmentalTopics = [
    {
      id: "climatic",
      title: t.climaticEffects,
      summary: t.climaticEffectsDescription,
      content: t.climaticEffectsContent,
      icon: <Wind className="h-5 w-5 text-sky-500" />,
    },
    {
      id: "biodiversity",
      title: t.biodiversityLoss,
      summary: t.biodiversityLossDescription,
      content: t.biodiversityLossContent,
      icon: <TreePine className="h-5 w-5 text-green-500" />,
    },
    {
      id: "airquality",
      title: t.airQuality,
      summary: t.airQualityDescription,
      content: t.airQualityContent,
      icon: <Wind className="h-5 w-5 text-gray-500" />,
    },
  ];

  const globalTopics = [
    {
      id: "tsunamis",
      title: t.tsunamis,
      summary: t.tsunamisDescription,
      content: t.tsunamisContent,
      icon: <Waves className="h-5 w-5 text-cyan-500" />,
    },
    {
      id: "globalwinter",
      title: t.globalWinter,
      summary: t.globalWinterDescription,
      content: t.globalWinterContent,
      icon: <Wind className="h-5 w-5 text-blue-600" />,
    },
    {
      id: "ozone",
      title: t.ozoneDamage,
      summary: t.ozoneDamageDescription,
      content: t.ozoneDamageContent,
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-1 text-xs uppercase tracking-widest text-destructive">
          ⚠️ {t.impacts}
        </div>
        <h1 className="text-4xl font-bold glow-text">{t.geologicalAndEnvironmentalImpacts}</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {t.impactsDescription}
        </p>
      </header>

      <div className="space-y-12">
        {/* Geological Impacts */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Mountain className="h-6 w-6 text-primary" />
            {t.geologicalImpacts}
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            {geologicalTopics.map((topic) => (
              <Card key={topic.id} className="border-primary/20 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {topic.icon}
                    {topic.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{topic.summary}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{topic.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Environmental Impacts */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xl font-bold text-foreground">
            <TreePine className="h-6 w-6 text-green-500" />
            {t.environmentalImpacts}
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            {environmentalTopics.map((topic) => (
              <Card key={topic.id} className="border-green-500/20 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {topic.icon}
                    {topic.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{topic.summary}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{topic.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Global Consequences */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xl font-bold text-foreground">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            {t.globalConsequences}
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            {globalTopics.map((topic) => (
              <Card key={topic.id} className="border-destructive/20 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {topic.icon}
                    {topic.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{topic.summary}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{topic.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Interactive Section */}
        <section className="mt-16">
          <Card className="border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                {t.globalConsequencesDescription}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                {t.impactsDescription}
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <Link to="/academy" className="block">
                  <Button variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/20">
                    {t.goToAcademy}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}