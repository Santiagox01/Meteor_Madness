import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export type CameraMode = "free" | "earth" | "followAsteroid";

export interface TimeControlsProps {
  playing: boolean;
  onTogglePlay: () => void;
  speed: number;
  onChangeSpeed: (s: number) => void;
  simTimeSec: number;
  onGoToImpact: () => void;
  cameraMode: CameraMode;
  onCameraMode: (m: CameraMode) => void;
  onFullscreen?: () => void;
  onReset?: () => void;
}

// Speed options with labels and values
const speedOptions = [
  { value: 1, label: "1x" },
  { value: 100, label: "100x" },
  { value: 86400, label: "1día/seg" }, // 1 day = 86400 seconds
  { value: 259200, label: "3días/seg" }, // 3 days = 259200 seconds
  { value: 604800, label: "1semana/seg" }, // 1 week = 604800 seconds  
  { value: 2592000, label: "1mes/seg" } // 1 month ≈ 30 days = 2592000 seconds
];

export default function TimeControls({ playing, onTogglePlay, speed, onChangeSpeed, simTimeSec, onGoToImpact, cameraMode, onCameraMode, onFullscreen, onReset }: TimeControlsProps) {
  const simDate = new Date(simTimeSec * 1000).toISOString().slice(0, 16).replace("T", " ");
  return (
    <Card className="bg-card/80 backdrop-blur border border-border/60">
      <CardContent className="flex flex-wrap items-center gap-3 py-4">
        <Button variant={playing?"destructive":"default"} onClick={onTogglePlay}>{playing?"Pausa":"Play"}</Button>
        <div className="flex items-center gap-2">
          <Label>Velocidad</Label>
          <div className="flex gap-1">
            {speedOptions.map((option)=> (
              <Button key={option.value} size="sm" variant={option.value===speed?"default":"outline"} onClick={()=>onChangeSpeed(option.value)}>
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label>Cámara</Label>
          <select className="h-10 rounded-md bg-background border px-3" value={cameraMode} onChange={(e)=>onCameraMode(e.target.value as any)}>
            <option value="free">Libre</option>
            <option value="earth">Centrar en la Tierra</option>
            <option value="followAsteroid">Seguir asteroide</option>
          </select>
        </div>
        <Button variant="outline" onClick={onGoToImpact}>Ir al impacto</Button>
        {onFullscreen && <Button variant="outline" onClick={onFullscreen}>Pantalla completa</Button>}
        {onReset && <Button variant="ghost" onClick={onReset}>Reset</Button>}
        <div className="ml-auto text-sm text-muted-foreground">{simDate} (ISO)</div>
      </CardContent>
    </Card>
  );
}
