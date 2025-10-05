// Orbital3D.tsx - VERSIÓN CORREGIDA Y UNIFICADA
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import type { DeflectionParams } from "@/lib/api";
import { estimateDeflectionOutcome } from "@/lib/physics";
import { 
  getOrbitalPosition, 
  generateOrbitPoints, 
  NASADataService,
  type OrbitalElements,
  getEarthPosition
} from "@/lib/orbits";

export interface Orbital3DProps {
  deflection?: DeflectionParams;
  showDeflection?: boolean;
  asteroidId?: string; // Opcional: ID de asteroide NASA
  useRealOrbits?: boolean; // Nuevo: elegir entre simulación simple o real
  simTimeSec?: number; // Tiempo de simulación para órbitas reales
}

function Earth({ useRealOrbits = false, simTimeSec = 0 }) {
  const earthRef = useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
    if (useRealOrbits && earthRef.current) {
      // Posición real de la Tierra en el sistema solar
      const earthPos = getEarthPosition(simTimeSec);
      earthRef.current.position.set(earthPos.x, earthPos.y, earthPos.z);
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[useRealOrbits ? 0.15 : 1, 64, 64]} />
      <meshPhongMaterial 
        color={new THREE.Color("#0b132b")} 
        emissive={new THREE.Color("#14213d")} 
        shininess={10} 
      />
    </mesh>
  );
}

function AsteroidOrbit({ elements }: { elements: OrbitalElements }) {
  const orbitPoints = useMemo(() => {
    return generateOrbitPoints(elements, 180);
  }, [elements]);

  const orbitGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(orbitPoints);
  }, [orbitPoints]);

  return (
    <lineSegments geometry={orbitGeometry}>
      <lineBasicMaterial color="#f43f5e" linewidth={2} transparent opacity={0.7} />
    </lineSegments>
  );
}

function RealAsteroid({ elements, deflected, simTimeSec }: { 
  elements: OrbitalElements; 
  deflected: boolean;
  simTimeSec: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (!elements || !ref.current) return;
    
    // Aplicar deflexión modificando elementos orbitales
    const currentElements = deflected ? 
      { 
        ...elements, 
        e: elements.e * 1.1, // Aumentar excentricidad
        a: elements.a * 1.05 // Cambiar semieje mayor
      } : 
      elements;
    
    const position = getOrbitalPosition(currentElements, simTimeSec);
    ref.current.position.copy(position.position);
    
    // Rotación del asteroide
    ref.current.rotation.y += 0.003;
    ref.current.rotation.x += 0.0015;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial color="#d97706" roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

function SimpleAsteroid({ deflected }: { deflected: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * 0.1) % 1;
    // Trayectoria paramétrica simple (compatible con versión original)
    const a = 4;
    const x = -a * (1 - t);
    const z = 2 * Math.sin(t * Math.PI * 1.1);
    const y = 0.5 * Math.sin(t * Math.PI * 2);
    
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

function ApproachCurve({ deflected, useRealOrbits }: { deflected: boolean; useRealOrbits: boolean }) {
  const points = useMemo(() => {
    if (useRealOrbits) {
      // Para órbitas reales, no mostramos curva de aproximación simple
      return [];
    }
    
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
  }, [deflected, useRealOrbits]);

  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  if (useRealOrbits || points.length === 0) {
    return null;
  }

  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color={deflected ? "#22c55e" : "#f43f5e"} linewidth={2} />
    </lineSegments>
  );
}

export function Orbital3D({ 
  deflection, 
  showDeflection, 
  asteroidId = "433",
  useRealOrbits = false,
  simTimeSec = 0 
}: Orbital3DProps) {
  const [asteroidElements, setAsteroidElements] = useState<OrbitalElements | null>(null);
  const [loading, setLoading] = useState(useRealOrbits); // Solo carga si usa órbitas reales
  const [error, setError] = useState<string | null>(null);
  
  const outcome = deflection
    ? estimateDeflectionOutcome(deflection, 6371)
    : { avoidsImpact: false };

  const deflected = Boolean(showDeflection && outcome.avoidsImpact);

  // Cargar datos del asteroide solo si se usan órbitas reales
  useEffect(() => {
    if (!useRealOrbits) {
      setLoading(false);
      return;
    }

    async function loadAsteroidData() {
      try {
        setLoading(true);
        setError(null);
        const elements = await NASADataService.getAsteroidElements(asteroidId);
        setAsteroidElements(elements);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading asteroid data');
        console.error('Failed to load asteroid data:', err);
        
        // Fallback: usar elementos de ejemplo
        setAsteroidElements({
          a: 1.5,
          e: 0.3,
          i: 10,
          Ω: 80,
          ω: 60,
          M0: 0,
          epoch: 2451545.0,
          period: 500
        });
      } finally {
        setLoading(false);
      }
    }

    loadAsteroidData();
  }, [asteroidId, useRealOrbits]);

  if (loading) {
    return (
      <div className="h-80 w-full rounded-lg overflow-hidden bg-[#060814] flex items-center justify-center">
        <div className="text-white">Loading NASA orbital data...</div>
      </div>
    );
  }

  if (useRealOrbits && error) {
    return (
      <div className="h-80 w-full rounded-lg overflow-hidden bg-[#060814] flex items-center justify-center">
        <div className="text-yellow-400">
          Using simulated orbit (NASA data unavailable)
        </div>
      </div>
    );
  }

  const cameraPosition: [number, number, number] = useRealOrbits ? [8, 5, 9] : [3.5, 2, 4.5];
  const cameraFov = useRealOrbits ? 55 : 55;

  return (
    <div className="h-80 w-full rounded-lg overflow-hidden bg-[#060814]">
      <Canvas camera={{ position: cameraPosition, fov: cameraFov }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <Stars radius={50} depth={30} count={5000} factor={2} saturation={0} fade speed={0.5} />
        
        <Earth useRealOrbits={useRealOrbits} simTimeSec={simTimeSec} />
        
        {/* Órbita del asteroide (solo para modo real) */}
        {useRealOrbits && asteroidElements && (
          <AsteroidOrbit elements={asteroidElements} />
        )}
        
        {/* Curva de aproximación (solo para modo simple) */}
        <ApproachCurve deflected={deflected} useRealOrbits={useRealOrbits} />
        
        {/* Asteroide según el modo seleccionado */}
        {useRealOrbits && asteroidElements ? (
          <RealAsteroid 
            elements={asteroidElements} 
            deflected={deflected} 
            simTimeSec={simTimeSec}
          />
        ) : (
          <SimpleAsteroid deflected={deflected} />
        )}
        
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}

export default Orbital3D;