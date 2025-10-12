import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Metric {
  label: string;
  value: string;
  hint?: string;
}

export default function MetricsPanel({ metrics }: { metrics: Metric[] }) {
  const { t } = useLanguage();
  
  // Separar métricas básicas de termodinámicas
  const baseMetrics = metrics.slice(0, 8); // Primeras 8 métricas básicas
  const thermoMetrics = metrics.slice(8); // Métricas termodinámicas adicionales

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur border border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">
            {t.language === 'es' ? 'Métricas de Impacto' : 'Impact Metrics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {baseMetrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-border/60 bg-background/60 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{m.label}</div>
                <div className="text-xl font-semibold mt-1">{m.value}</div>
                {m.hint && <div className="text-xs text-muted-foreground mt-1">{m.hint}</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {thermoMetrics.length > 0 && (
        <Card className="bg-card/80 backdrop-blur border border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-orange-500">🔥</span>
              {t.language === 'es' ? 'Análisis Termodinámico' : 'Thermodynamic Analysis'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t.language === 'es' 
                ? 'Primera Ley: Conservación de energía cinética en calor, trabajo y ondas sísmicas'
                : 'First Law: Kinetic energy conservation into heat, work, and seismic waves'
              }
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {thermoMetrics.map((m) => (
                <div key={m.label} className="rounded-lg border border-orange-500/20 bg-orange-50/10 p-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{m.label}</div>
                  <div className="text-xl font-semibold mt-1 text-orange-500">{m.value}</div>
                  {m.hint && <div className="text-xs text-muted-foreground mt-1">{m.hint}</div>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
