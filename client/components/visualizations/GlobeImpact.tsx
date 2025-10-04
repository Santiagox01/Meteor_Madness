import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

export interface GlobeImpactProps {
  lat: number; // degrees
  lon: number; // degrees
  ringsKm: { color: string; radiusKm: number; label: string }[];
}

const RE = 6371; // km

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

function circleOnSphere(latDeg: number, lonDeg: number, radiusKm: number, segments = 256) {
  const lat0 = toRad(latDeg);
  const lon0 = toRad(lonDeg);
  const ang = radiusKm / RE; // angular radius
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = (2 * Math.PI * i) / segments;
    // Great-circle formula around center
    const lat = Math.asin(
      Math.sin(lat0) * Math.cos(ang) + Math.cos(lat0) * Math.sin(ang) * Math.cos(t)
    );
    const lon =
      lon0 + Math.atan2(Math.sin(t) * Math.sin(ang) * Math.cos(lat0), Math.cos(ang) - Math.sin(lat0) * Math.sin(lat));
    const x = Math.cos(lat) * Math.cos(lon);
    const y = Math.sin(lat);
    const z = Math.cos(lat) * Math.sin(lon);
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

function Earth() {
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial color={new THREE.Color("#0b132b")} emissive={new THREE.Color("#101735")} shininess={10} />
    </mesh>
  );
}

function Ring({ lat, lon, radiusKm, color }: { lat: number; lon: number; radiusKm: number; color: string }) {
  const geom = useMemo(() => {
    const pts = circleOnSphere(lat, lon, radiusKm);
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    return g;
  }, [lat, lon, radiusKm]);

  return (
    <line>
      <bufferGeometry attach="geometry" {...(geom as any)} />
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  );
}

export function GlobeImpact({ lat, lon, ringsKm }: GlobeImpactProps) {
  return (
    <div className="h-80 w-full rounded-lg overflow-hidden bg-[#060814]">
      <Canvas camera={{ position: [2.8, 1.8, 3.2], fov: 55 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <Stars radius={50} depth={30} count={5000} factor={2} saturation={0} fade speed={0.5} />
        <Earth />
        {ringsKm.map((r, idx) => (
          <Ring key={idx} lat={lat} lon={lon} radiusKm={r.radiusKm} color={r.color} />
        ))}
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}

export default GlobeImpact;
