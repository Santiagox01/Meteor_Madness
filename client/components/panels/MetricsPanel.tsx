import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Metric {
  label: string;
  value: string;
  hint?: string;
}

export default function MetricsPanel({ metrics }: { metrics: Metric[] }) {
  return (
    <Card className="bg-card/80 backdrop-blur border border-border/60">
      <CardHeader>
        <CardTitle className="text-lg">Impact Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-border/60 bg-background/60 p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{m.label}</div>
              <div className="text-xl font-semibold mt-1">{m.value}</div>
              {m.hint && <div className="text-xs text-muted-foreground mt-1">{m.hint}</div>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
