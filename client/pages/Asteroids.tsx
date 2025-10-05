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

interface NeoObject {
  id: string;
  name: string;
  estimated_diameter?: { meters?: { estimated_diameter_min?: number; estimated_diameter_max?: number } };
  close_approach_data?: Array<{ close_approach_date?: string; relative_velocity?: { kilometers_per_second?: string }; miss_distance?: { kilometers?: string; lunar?: string } }>;
  is_potentially_hazardous_asteroid?: boolean;
}

const hazardOptions = [
  { value: "all", label: "Todos" },
  { value: "pha", label: "Peligrosos" },
  { value: "safe", label: "No peligrosos" },
];

const sizeOptions = [
  { value: "all", label: "Todos los tamaños" },
  { value: "small", label: "< 0.1 km" },
  { value: "medium", label: "0.1 - 1 km" },
  { value: "large", label: "> 1 km" },
];

export default function Asteroids() {
  const [search, setSearch] = useState("");
  const [hazardFilter, setHazardFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [distanceMetric, setDistanceMetric] = useState<"lunar" | "kilometers">("lunar");
  const navigate = useNavigate();

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
          🪐 Catálogo de asteroides
        </div>
        <h1 className="text-4xl font-bold glow-text">Vigilancia NEO · Code Nebula</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Datos en vivo de la NASA NEO API, clasificados por peligrosidad, tamaño y distancia mínima. Envía cualquier objeto al Centro de Misión para evaluar estrategias de defensa planetaria.
        </p>
      </header>

      <section className="space-panel rounded-3xl p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 text-primary"><SlidersHorizontal className="h-5 w-5" /> Controles</span>
          <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Buscar por nombre o designación" className="max-w-xs border-primary/40 bg-card/60" />
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
            <SelectTrigger className="w-44 border-primary/40 bg-card/60"><SelectValue placeholder="Distancia" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="lunar">Distancia en LD</SelectItem>
              <SelectItem value="kilometers">Distancia en km</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((neo) => {
          const est = neo.estimated_diameter?.meters;
          const avgSizeKm = est ? ((est.estimated_diameter_max ?? 0) + (est.estimated_diameter_min ?? 0)) / 2 / 1000 : 0;
          const approach = neo.close_approach_data?.[0];
          const velocity = Number(approach?.relative_velocity?.kilometers_per_second ?? 0).toFixed(2);
          const distance = distanceMetric === "lunar"
            ? Number(approach?.miss_distance?.lunar ?? 0).toFixed(2)
            : Number(approach?.miss_distance?.kilometers ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          return (
            <Card key={neo.id} className="space-panel">
              <CardHeader className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-foreground">{neo.name}</CardTitle>
                  {neo.is_potentially_hazardous_asteroid ? (
                    <Badge variant="destructive" className="flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> PHA</Badge>
                  ) : (
                    <Badge variant="outline" className="border-primary/40 text-primary">Monitorizado</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">Próxima aproximación: {approach?.close_approach_date ?? "N/D"}</div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground/70">Tamaño medio</div>
                    <div className="text-foreground text-lg font-semibold">{avgSizeKm.toFixed(2)} km</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground/70">Velocidad</div>
                    <div className="text-foreground text-lg font-semibold">{velocity} km/s</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground/70">Distancia mínima</div>
                    <div className="text-foreground text-lg font-semibold">{distance} {distanceMetric === "lunar" ? "LD" : "km"}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground/70">PHA</div>
                    <div className="text-foreground text-lg font-semibold">{neo.is_potentially_hazardous_asteroid ? "Sí" : "No"}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/15" asChild>
                    <Link to={`/simulation?neo=${neo.id}`}><Telescope className="mr-2 h-4 w-4" /> Ver trayectoria</Link>
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={()=>navigate(`/mission?stage=simulate&neo=${neo.id}`)}>
                    <Rocket className="mr-2 h-4 w-4" /> Simular impacto
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="space-panel col-span-full">
            <CardContent className="p-12 text-center space-y-4">
              <Sparkles className="h-8 w-8 mx-auto text-primary" />
              <p className="text-muted-foreground">No se encontraron asteroides con los filtros actuales. Ajusta los parámetros o recarga el catálogo.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
