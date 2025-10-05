import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNeoBrowse } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldAlert, Telescope, Rocket, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface NeoObject {
  id: string;
  name: string;
  estimated_diameter?: { meters?: { estimated_diameter_min?: number; estimated_diameter_max?: number } };
  close_approach_data?: Array<{ close_approach_date?: string; relative_velocity?: { kilometers_per_second?: string }; miss_distance?: { kilometers?: string; lunar?: string } }>;
  is_potentially_hazardous_asteroid?: boolean;
}

export default function Asteroids() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [hazardFilter, setHazardFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [distanceMetric, setDistanceMetric] = useState<"lunar" | "kilometers">("lunar");
  const navigate = useNavigate();

  const hazardOptions = [
    { value: "all", label: t.all },
    { value: "pha", label: t.dangerous },
    { value: "safe", label: t.notDangerous },
  ];

  const sizeOptions = [
    { value: "all", label: t.allSizes },
    { value: "small", label: t.smallSize },
    { value: "medium", label: t.mediumSize },
    { value: "large", label: t.largeSize },
  ];

  const { data } = useQuery({ queryKey: ["neo-browse", "asteroids"], queryFn: () => fetchNeoBrowse(0, 40), retry: 0 });
  const neos: NeoObject[] = data?.near_earth_objects ?? [];

  const filtered = useMemo(() => {
    return neos.filter((neo) => {
      const nameMatch = neo.name?.toLowerCase().includes(search.toLowerCase());
      if (!nameMatch) return false;
      if (hazardFilter === "pha" && !neo.is_potentially_hazardous_asteroid) return false;
      if (hazardFilter === "safe" && neo.is_potentially_hazardous_asteroid) return false;

      const est = neo.estimated_diameter?.meters;
      const avgSizeKm = est ? ((est.estimated_diameter_max ?? 0) + (est.estimated_diameter_min ?? 0)) / 2 / 1000 : 0;
      if (sizeFilter === "small" && avgSizeKm >= 0.1) return false;
      if (sizeFilter === "medium" && (avgSizeKm < 0.1 || avgSizeKm > 1)) return false;
      if (sizeFilter === "large" && avgSizeKm <= 1) return false;

      return true;
    });
  }, [neos, search, hazardFilter, sizeFilter]);

  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs uppercase tracking-widest text-primary">
          🪐 {t.asteroidsTitle}
        </div>
        <h1 className="text-4xl font-bold glow-text">{t.asteroidsTitle}</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {t.asteroidsDescription}
        </p>
      </header>

      <section className="space-panel rounded-3xl p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 text-primary"><SlidersHorizontal className="h-5 w-5" /> {t.hazardFilter}</span>
          <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder={t.searchPlaceholder} className="max-w-xs border-primary/40 bg-card/60" />
          <Select value={hazardFilter} onValueChange={setHazardFilter}>
            <SelectTrigger className="w-40 border-primary/40 bg-card/60"><SelectValue /></SelectTrigger>
            <SelectContent>
              {hazardOptions.map((o)=>(<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger className="w-48 border-primary/40 bg-card/60"><SelectValue /></SelectTrigger>
            <SelectContent>
              {sizeOptions.map((o)=>(<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={distanceMetric} onValueChange={(val)=>setDistanceMetric(val as any)}>
            <SelectTrigger className="w-44 border-primary/40 bg-card/60"><SelectValue placeholder={t.approachDistance} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="lunar">{t.lunarDistances}</SelectItem>
              <SelectItem value="kilometers">{t.km}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((neo) => {
          const est = neo.estimated_diameter?.meters;
          const avgSizeKm = est ? ((est.estimated_diameter_max ?? 0) + (est.estimated_diameter_min ?? 0)) / 2 / 1000 : 0;
          const approach = neo.close_approach_data?.[0];
          const velocity = approach?.relative_velocity?.kilometers_per_second ? parseFloat(approach.relative_velocity.kilometers_per_second) : 0;
          const distance = distanceMetric === "lunar" 
            ? approach?.miss_distance?.lunar ? parseFloat(approach.miss_distance.lunar) : 0
            : approach?.miss_distance?.kilometers ? parseFloat(approach.miss_distance.kilometers) / 1000000 : 0;
          
          return (
            <Card key={neo.id} className="group relative overflow-hidden border-primary/20 bg-card/50 hover:bg-card/80 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {neo.name}
                  </CardTitle>
                  <Badge variant={neo.is_potentially_hazardous_asteroid ? "destructive" : "secondary"} className="shrink-0">
                    {neo.is_potentially_hazardous_asteroid ? t.potentiallyHazardous : t.nonHazardous}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">{t.diameter}</div>
                      <div className="font-medium">{avgSizeKm.toFixed(2)} km</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Telescope className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">{t.approachDate}</div>
                      <div className="font-medium">{approach?.close_approach_date ?? "N/A"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">{t.relativeVelocity}</div>
                      <div className="font-medium">{velocity.toFixed(1)} {t.kmPerS}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">{t.approachDistance}</div>
                      <div className="font-medium">
                        {distance.toFixed(2)} {distanceMetric === "lunar" ? "LD" : "M km"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-primary/40 text-primary hover:bg-primary/20"
                    onClick={() => console.log(`View details for ${neo.name}`)}
                  >
                    {t.viewDetails}
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => navigate(`/simulation?neo=${encodeURIComponent(neo.name)}&neoId=${neo.id}`)}
                  >
                    {t.simulate}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Telescope className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{t.searchPlaceholder}</p>
        </div>
      )}

      <div className="text-center pt-8 border-t border-border/40">
        <Link to="/mission">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            {t.sendToMission}
          </Button>
        </Link>
      </div>
    </div>
  );
}