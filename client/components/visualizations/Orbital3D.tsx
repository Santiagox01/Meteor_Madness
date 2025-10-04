import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { DeflectionParams } from "@shared/api";
import { estimateDeflectionOutcome } from "@/lib/physics";

export interface Orbital3DProps {
  deflection?: DeflectionParams;
  showDeflection?: boolean;
}

function Earth() {
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial color={new THREE.Color("#0b132b")} emissive={new THREE.Color("#14213d")} shininess={10} />
    </mesh>
  );
}

function Asteroid({ deflected }: { deflected: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * 0.1) % 1; // 0..1 loop
    // Parametric inbound hyperbolic-like approach in XZ plane
    const a = 4; // scale of the approach curve
    const x = -a * (1 - t);
    const z = 2 * Math.sin(t * Math.PI * 1.1);
    const y = 0.5 * Math.sin(t * Math.PI * 2);
    // If deflected, offset the path sideways to visualize a miss
    const dx = deflected ? 1.5 : 0;
    ref.current.position.set(x + dx, y, z);
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial color="#d97706" roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

function ApproachCurve({ deflected }: { deflected: boolean }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const a = 4;
      const x = -a * (1 - t);
      const z = 2 * Math.sin(t * Math.PI * 1.1);
      const y = 0.5 * Math.sin(t * Math.PI * 2);
      const dx = deflected ? 1.5 : 0;
      pts.push(new THREE.Vector3(x + dx, y, z));
    }
    return pts;
  }, [deflected]);

  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line>
      <bufferGeometry attach="geometry" {...(geom as any)} />
      <lineBasicMaterial color={deflected ? "#22c55e" : "#f43f5e"} linewidth={2} />
    </line>
  );
}

export function Orbital3D({ deflection, showDeflection }: Orbital3DProps) {
  const outcome = deflection
    ? estimateDeflectionOutcome(deflection, 6371)
    : { avoidsImpact: false };

  const deflected = Boolean(showDeflection && outcome.avoidsImpact);

  return (
    <div className="h-80 w-full rounded-lg overflow-hidden bg-[#060814]">
      <Canvas camera={{ position: [3.5, 2, 4.5], fov: 55 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <Stars radius={50} depth={30} count={5000} factor={2} saturation={0} fade speed={0.5} />
        <Earth />
        <ApproachCurve deflected={deflected} />
        <Asteroid deflected={deflected} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}

export default Orbital3D;
