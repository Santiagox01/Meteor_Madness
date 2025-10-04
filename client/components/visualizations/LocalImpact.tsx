import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

export interface LocalImpactProps {
  lat: number;
  lon: number;
  craterRadiusKm: number;
  severeRadiusKm: number;
  moderateRadiusKm: number;
  isOcean: boolean;
  slowMotion?: boolean;
}

const RE = 6371; // km

function toRad(d: number) { return (d * Math.PI) / 180; }

function sph2cart(latDeg: number, lonDeg: number, r = 1) {
  const lat = toRad(latDeg);
  const lon = toRad(lonDeg);
  const x = r * Math.cos(lat) * Math.cos(lon);
  const y = r * Math.sin(lat);
  const z = r * Math.cos(lat) * Math.sin(lon);
  return new THREE.Vector3(x, y, z);
}

function Earth() {
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial color={new THREE.Color("#00ffd5ff")} emissive={new THREE.Color("#ff00bbff")} shininess={10} />
    </mesh>
  );
}

function ImpactRings({ center, craterR, severeR, moderateR }: { center: THREE.Vector3; craterR: number; severeR: number; moderateR: number }) {
  const mkRing = (radiusKm: number, color: string) => {
    const points: THREE.Vector3[] = [];
    const ang = radiusKm / RE;
    for (let i=0;i<=256;i++){
      const t = (2*Math.PI*i)/256;
      const lat0 = Math.asin(center.y / center.length());
      const lon0 = Math.atan2(center.z, center.x);
      const lat = Math.asin(Math.sin(lat0)*Math.cos(ang) + Math.cos(lat0)*Math.sin(ang)*Math.cos(t));
      const lon = lon0 + Math.atan2(Math.sin(t)*Math.sin(ang)*Math.cos(lat0), Math.cos(ang)-Math.sin(lat0)*Math.sin(lat));
      const x = Math.cos(lat)*Math.cos(lon);
      const y = Math.sin(lat);
      const z = Math.cos(lat)*Math.sin(lon);
      points.push(new THREE.Vector3(x,y,z));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return (
      <line>
        <bufferGeometry attach="geometry" {...(geom as any)} />
        <lineBasicMaterial color={color} linewidth={2} />
      </line>
    );
  };

  return (
    <group>
      {mkRing(craterR, "#ef4444")}
      {mkRing(severeR, "#f59e0b")}
      {mkRing(moderateR, "#22c55e")}
    </group>
  );
}

function DynamicWave({ center, baseRadiusKm, color, slowMotion }: { center: THREE.Vector3; baseRadiusKm: number; color: string; slowMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const phaseRef = useRef(0);
  const normal = useMemo(() => center.clone().normalize(), [center]);
  const rotation = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal), [normal]);
  const position = useMemo(() => normal.clone(), [normal]);
  const angularRadius = baseRadiusKm / RE;
  const radius = Math.max(0.01, Math.sin(Math.min(Math.PI / 2, angularRadius)));
  const thickness = radius * 0.12;

  useFrame((_, delta) => {
    const speed = slowMotion ? 0.4 : 1;
    phaseRef.current = (phaseRef.current + delta * speed) % 1.6;
    const scale = 1 + phaseRef.current * 1.4;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale);
    }
    if (materialRef.current) {
      const fade = Math.max(0, 1 - phaseRef.current / 1.6);
      materialRef.current.opacity = 0.6 * fade;
    }
  });

  return (
    <mesh ref={meshRef} position={position} quaternion={rotation}>
      <ringGeometry args={[radius, radius + thickness, 96]} />
      <meshBasicMaterial ref={materialRef} color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
}

function EntryStreak({ center, angleDeg, slowMotion }: { center: THREE.Vector3; angleDeg: number; slowMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const phaseRef = useRef(0);
  const normal = useMemo(() => center.clone().normalize(), [center]);
  const baseDirection = useMemo(() => {
    const approach = center.clone().normalize().multiplyScalar(-1).applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.25);
    const axis = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 0, 1), normal).normalize();
    if (!Number.isFinite(axis.length()) || axis.length() === 0) {
      return approach;
    }
    return approach.applyAxisAngle(axis, toRad(angleDeg));
  }, [center, normal, angleDeg]);

  useFrame((_, delta) => {
    const speed = slowMotion ? 0.4 : 1.2;
    phaseRef.current = (phaseRef.current + delta * speed) % 1.4;
    const tail = 0.2 + phaseRef.current * 0.8;
    const tip = center.clone().add(baseDirection.clone().multiplyScalar(0.7));
    const base = tip.clone().add(baseDirection.clone().multiplyScalar(tail));
    if (meshRef.current) {
      meshRef.current.position.copy(tip.clone().add(base).multiplyScalar(0.5));
      const dir = new THREE.Vector3().subVectors(tip, base).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      meshRef.current.setRotationFromQuaternion(quat);
      meshRef.current.scale.setScalar(1 + phaseRef.current * 0.2);
    }
    if (materialRef.current) {
      materialRef.current.opacity = 0.9 - phaseRef.current * 0.4;
    }
  });

  const geometry = useMemo(() => new THREE.CylinderGeometry(0.01, 0.05, 1, 12), []);
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial ref={materialRef} color="#f59e0b" transparent opacity={0.8} />
    </mesh>
  );
}

export default function LocalImpact({ lat, lon, craterRadiusKm, severeRadiusKm, moderateRadiusKm, isOcean, slowMotion }: LocalImpactProps) {
  const impactCenter = useMemo(() => sph2cart(lat, lon, 1), [lat, lon]);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden bg-[#060814]">
      <Canvas camera={{ position: [2.8, 1.8, 3.2], fov: 55 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <Stars radius={50} depth={30} count={5000} factor={2} saturation={0} fade speed={0.5} />
        <Earth />
        <ImpactRings center={impactCenter} craterR={craterRadiusKm} severeR={severeRadiusKm} moderateR={moderateRadiusKm} />
        <DynamicWave center={impactCenter} baseRadiusKm={severeRadiusKm} color="#60a5fa" slowMotion={slowMotion ?? false} />
        {isOcean && <DynamicWave center={impactCenter} baseRadiusKm={moderateRadiusKm * 1.2} color="#22d3ee" slowMotion={slowMotion ?? false} />}
        <EntryStreak center={impactCenter} angleDeg={35} slowMotion={slowMotion ?? false} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
