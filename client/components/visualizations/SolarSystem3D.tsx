import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DeflectionParams } from "@/lib/api";
import { estimateDeflectionOutcome } from "@/lib/physics";
import type { CameraMode } from "@/components/controls/TimeControls";
import { 
  getOrbitalPosition, 
  generateOrbitPoints, 
  PLANETARY_ELEMENTS,
  type OrbitalElements,
  NASADataService
} from "@/lib/orbits";

export interface SolarSystem3DProps {
  simTimeSec: number;
  playing: boolean;
  cameraMode: CameraMode;
  deflection?: DeflectionParams;
  showDeflection?: boolean;
  goToImpactSignal?: number;
  onImpactReached?: () => void;
  speedFactor?: number;
  asteroidId?: string;
  showPlanetLabels?: boolean; // Nuevo: controlar visibilidad de etiquetas
}

type PlanetName =
  | "Mercury"
  | "Venus"
  | "Earth"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune";

type PlanetDescriptor = {
  name: PlanetName;
  orbitColor: string;
  // Radio en kilómetros (escala real)
  radiusKm: number;
  // Distancia máxima para mostrar etiqueta (en unidades AU de escena)
  labelMaxDistance: number;
};

// RADIOS REALES EN KILÓMETROS y configuración de etiquetas
const PLANETS: PlanetDescriptor[] = [
  { name: "Mercury", orbitColor: "#a8a29e", radiusKm: 2439.7, labelMaxDistance: 15 },
  { name: "Venus", orbitColor: "#fbbf24", radiusKm: 6051.8, labelMaxDistance: 15 },
  { name: "Earth", orbitColor: "#38bdf8", radiusKm: 6371, labelMaxDistance: 15 },
  { name: "Mars", orbitColor: "#ef4444", radiusKm: 3389.5, labelMaxDistance: 20 },
  { name: "Jupiter", orbitColor: "#f59e0b", radiusKm: 69911, labelMaxDistance: 30 },
  { name: "Saturn", orbitColor: "#fde68a", radiusKm: 58232, labelMaxDistance: 40 },
  { name: "Uranus", orbitColor: "#60a5fa", radiusKm: 25362, labelMaxDistance: 50 },
  { name: "Neptune", orbitColor: "#3b82f6", radiusKm: 24622, labelMaxDistance: 60 },
];

// FACTOR DE ESCALA PARA VISUALIZACIÓN
// El radio de la Tierra (6371 km) se escala a 0.15 unidades en la escena
const EARTH_RADIUS_KM = 6371;
const EARTH_SCENE_RADIUS = 0.15;
const SCALE_FACTOR = EARTH_SCENE_RADIUS / EARTH_RADIUS_KM;

// Función para convertir radio real a radio de escena
function getSceneRadius(radiusKm: number): number {
  return radiusKm * SCALE_FACTOR;
}

const TEXTURE_ROOT = "https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/";
const SUN_TEXTURE = `${TEXTURE_ROOT}sunmap.jpg`;
const ASTEROID_TEXTURE = `${TEXTURE_ROOT}moonmap1k.jpg`;

// Radio REAL del Sol en km y su escala correspondiente
const SUN_RADIUS_KM = 696340;
const SUN_SCENE_RADIUS = getSceneRadius(SUN_RADIUS_KM);

type PlanetTextureSet = {
  map: string;
  normalMap?: string;
  roughnessMap?: string;
  specularMap?: string;
  clouds?: string;
  ringColor?: string;
  ringAlpha?: string;
};

const PLANET_TEXTURES: Record<PlanetName, PlanetTextureSet> = {
  Mercury: { map: `${TEXTURE_ROOT}mercurymap.jpg` },
  Venus: { map: `${TEXTURE_ROOT}venusmap.jpg` },
  Earth: {
    map: `${TEXTURE_ROOT}earthmap1k.jpg`,
    roughnessMap: `${TEXTURE_ROOT}earthspec1k.jpg`,
    clouds: `${TEXTURE_ROOT}earthcloudmap.jpg`,
  },
  Mars: { map: `${TEXTURE_ROOT}marsmap1k.jpg` },
  Jupiter: { map: `${TEXTURE_ROOT}jupitermap.jpg` },
  Saturn: {
    map: `${TEXTURE_ROOT}saturnmap.jpg`,
    ringColor: `${TEXTURE_ROOT}saturnringcolor.jpg`,
    ringAlpha: `${TEXTURE_ROOT}saturnringpattern.gif`,
  },
  Uranus: { map: `${TEXTURE_ROOT}uranusmap.jpg` },
  Neptune: { map: `${TEXTURE_ROOT}neptunemap.jpg` },
};

// ... (funciones de texturas se mantienen igual: enhanceTexture, createSolidTexture, useSafeTexture)

function Sun() {
  const texture = useSafeTexture(SUN_TEXTURE, "#f5b342");
  return (
    <mesh>
      <sphereGeometry args={[SUN_SCENE_RADIUS, 64, 64]} />
      <meshBasicMaterial map={texture ?? undefined} toneMapped={false} color={texture ? undefined : "#f5b342"} />
    </mesh>
  );
}

// Componente de etiqueta para planetas
function PlanetLabel({ 
  name, 
  position, 
  visible,
  fontSize = 0.3
}: { 
  name: string; 
  position: THREE.Vector3; 
  visible: boolean;
  fontSize?: number;
}) {
  if (!visible) return null;

  return (
    <Text
      position={[position.x, position.y + getSceneRadius(7000), position.z]} // Offset arriba del planeta
      fontSize={fontSize}
      color="white"
      anchorX="center"
      anchorY="middle"
      font="/fonts/inter-regular.woff" // Puedes cambiar la fuente
      outlineWidth={0.01}
      outlineColor="#000000"
    >
      {name}
    </Text>
  );
}

interface PlanetProps extends PlanetDescriptor {
  simTimeSec: number;
  speedFactor: number;
  setEarthPos?: (v: THREE.Vector3) => void;
  showLabel: boolean;
  cameraDistance: number;
}

function Planet({ name, orbitColor, radiusKm, labelMaxDistance, simTimeSec, speedFactor, setEarthPos, showLabel, cameraDistance }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const ringsRef = useRef<THREE.Mesh>(null!);
  
  // Obtener elementos orbitales del planeta
  const elements = PLANETARY_ELEMENTS[name];
  
  // Calcular radio de escena basado en radio real
  const sceneRadius = getSceneRadius(radiusKm);
  
  // Generar puntos de la órbita
  const orbitPoints = useMemo(() => {
    return generateOrbitPoints(elements, 360);
  }, [elements]);
  
  const orbitGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    return geometry;
  }, [orbitPoints]);

  // Calcular posición actual
  const getCurrentPosition = (timeSec: number): THREE.Vector3 => {
    const effectiveTime = timeSec * speedFactor;
    const orbitalPos = getOrbitalPosition(elements, effectiveTime);
    return orbitalPos.position;
  };

  // Períodos de rotación reales en segundos
  const ROTATION_PERIODS: Record<PlanetName, number> = {
    Mercury: 5068800,    // 58.6 días
    Venus: 20995200,     // 243 días (retrógrada)
    Earth: 86164,        // 23h 56m 4s
    Mars: 88643,         // 24h 37m 23s
    Jupiter: 35730,      // 9h 55m 30s
    Saturn: 38340,       // 10h 39m
    Uranus: 62040,       // 17h 14m
    Neptune: 57960,      // 16h 6m
  };

  // Dirección de rotación
  const ROTATION_DIRECTIONS: Record<PlanetName, number> = {
    Mercury: 1,
    Venus: -1,  // Retrógrada
    Earth: 1,
    Mars: 1,
    Jupiter: 1,
    Saturn: 1,
    Uranus: 1,
    Neptune: 1,
  };

  // Rotación planetaria REAL
  useFrame(({ clock }) => {
    const delta = clock.getDelta();
    
    if (planetRef.current) {
      const rotationPeriod = ROTATION_PERIODS[name];
      const direction = ROTATION_DIRECTIONS[name];
      
      // Velocidad angular REAL con factor de velocidad
      const angularSpeed = (2 * Math.PI) / rotationPeriod * speedFactor * direction;
      planetRef.current.rotation.y += angularSpeed * delta;
    }
    
    // Rotar nubes (más rápido para efecto visual)
    if (cloudsRef.current && name === "Earth") {
      cloudsRef.current.rotation.y += 0.0001 * speedFactor * delta * 60;
    }
    
    // Rotar anillos de Saturno
    if (ringsRef.current && name === "Saturn") {
      ringsRef.current.rotation.z += 0.00005 * speedFactor * delta * 60;
    }
  });

  // Texturas
  const textures = PLANET_TEXTURES[name];
  const map = useSafeTexture(textures.map, orbitColor);
  const roughnessMap = useSafeTexture(textures.roughnessMap, undefined, { colorSpace: THREE.LinearSRGBColorSpace });
  const specularMap = useSafeTexture(textures.specularMap, undefined, { colorSpace: THREE.LinearSRGBColorSpace });
  const cloudsMap = useSafeTexture(textures.clouds, undefined, { colorSpace: THREE.SRGBColorSpace });
  const ringColor = useSafeTexture(textures.ringColor, orbitColor, {
    colorSpace: THREE.SRGBColorSpace,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  });
  const ringAlpha = useSafeTexture(textures.ringAlpha, "#ffffff", {
    colorSpace: THREE.LinearSRGBColorSpace,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  });

  // Posición actual
  const currentPosition = getCurrentPosition(simTimeSec);

  // Determinar si mostrar etiqueta basado en distancia de cámara
  const shouldShowLabel = showLabel && cameraDistance < labelMaxDistance;

  useEffect(() => {
    if (name === "Earth" && setEarthPos) {
      setEarthPos(currentPosition.clone());
    }
  }, [currentPosition, name, setEarthPos]);

  return (
    <group>
      {/* Órbita elíptica real */}
      <lineSegments geometry={orbitGeometry}>
        <lineBasicMaterial color={orbitColor} transparent opacity={0.3} linewidth={1} />
      </lineSegments>
      
      {/* Planeta en posición orbital actual */}
      <group position={[currentPosition.x, currentPosition.y, currentPosition.z]}>
        <mesh ref={planetRef} castShadow receiveShadow>
          <sphereGeometry args={[sceneRadius, 80, 80]} />
          <meshStandardMaterial
            map={map ?? undefined}
            roughnessMap={roughnessMap ?? specularMap ?? undefined}
            metalnessMap={specularMap ?? undefined}
            metalness={0.05}
            roughness={0.85}
            color={!map ? orbitColor : undefined}
          />
        </mesh>
        
        {/* Etiqueta del planeta */}
        <PlanetLabel 
          name={name} 
          position={new THREE.Vector3(0, 0, 0)} 
          visible={shouldShowLabel}
          fontSize={Math.max(0.2, 0.3 * (labelMaxDistance / Math.max(cameraDistance, 1)))}
        />
        
        {/* Nubes para la Tierra */}
        {cloudsMap && (
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[sceneRadius * 1.015, 80, 80]} />
            <meshStandardMaterial 
              map={cloudsMap} 
              transparent 
              opacity={0.8} 
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
        
        {/* Anillos para Saturno */}
        {name === "Saturn" && (ringColor || ringAlpha) && (
          <mesh ref={ringsRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[sceneRadius * 1.6, sceneRadius * 2.4, 256]} />
            <meshBasicMaterial
              map={ringColor ?? undefined}
              alphaMap={ringAlpha ?? undefined}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

// ... (AsteroidOrbit, Asteroid, CameraController se mantienen igual)

function CameraController({ cameraMode, getTargets }: { cameraMode: CameraMode; getTargets: () => { earth: THREE.Vector3; asteroid: THREE.Vector3 } }) {
  const { camera } = useThree();
  useFrame(() => {
    const { earth, asteroid } = getTargets();
    if (cameraMode === "earth") {
      camera.position.lerp(new THREE.Vector3(earth.x + 3, 2, earth.z + 3), 0.05);
      camera.lookAt(earth);
    } else if (cameraMode === "followAsteroid") {
      camera.position.lerp(new THREE.Vector3(asteroid.x + 1.8, 1.2, asteroid.z + 1.8), 0.05);
      camera.lookAt(asteroid);
    }
  });
  return null;
}

// Hook para obtener distancia de cámara
function useCameraDistance(targetPosition: THREE.Vector3): number {
  const { camera } = useThree();
  const [distance, setDistance] = useState(0);
  
  useFrame(() => {
    const dist = camera.position.distanceTo(targetPosition);
    setDistance(dist);
  });
  
  return distance;
}

export default function SolarSystem3D({ 
  simTimeSec, 
  playing, 
  cameraMode, 
  deflection, 
  showDeflection, 
  goToImpactSignal, 
  onImpactReached,
  speedFactor = 1,
  asteroidId = "433",
  showPlanetLabels = true // Por defecto mostrar etiquetas
}: SolarSystem3DProps) {
  const earthPos = useRef(new THREE.Vector3(0, 0, 1));
  const asteroidPos = useRef(new THREE.Vector3(0, 0, 0));
  const [currentSimTime, setCurrentSimTime] = useState(simTimeSec);
  const [asteroidElements, setAsteroidElements] = useState<OrbitalElements | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goSeek, setGoSeek] = useState(0);

  // Obtener distancia de cámara a la Tierra para controlar etiquetas
  const cameraDistance = useCameraDistance(earthPos.current);

  // Cargar datos del asteroide
  useEffect(() => {
    async function loadAsteroidData() {
      try {
        setLoading(true);
        setError(null);
        const elements = await NASADataService.getAsteroidElements(asteroidId);
        setAsteroidElements(elements);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading asteroid data');
        console.error('Failed to load asteroid data:', err);
        // Usar elementos de ejemplo si falla la API
        setAsteroidElements({
          a: 1.5,
          e: 0.2,
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
  }, [asteroidId]);

  // Sincronizar con el tiempo inicial
  useEffect(() => {
    setCurrentSimTime(simTimeSec);
  }, [simTimeSec]);

  useEffect(() => {
    if (goToImpactSignal) setGoSeek((n) => n + 1);
  }, [goToImpactSignal]);

  const outcome = deflection ? estimateDeflectionOutcome(deflection, 6371) : { avoidsImpact: false };
  const deflected = Boolean(showDeflection && outcome.avoidsImpact);

  const getTargets = () => ({ earth: earthPos.current, asteroid: asteroidPos.current });

  function Updaters() {
    const lastTimeRef = useRef(performance.now());
    
    useFrame(() => {
      const now = performance.now();
      const deltaTimeMs = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (playing) {
        // Aplicar factor de velocidad al tiempo de simulación
        const deltaSeconds = (deltaTimeMs / 1000) * speedFactor;
        setCurrentSimTime(prev => prev + deltaSeconds);
      }

      // Actualizar posición de la Tierra
      const earthElements = PLANETARY_ELEMENTS.Earth;
      const earthPosition = getOrbitalPosition(earthElements, currentSimTime * speedFactor);
      earthPos.current.copy(earthPosition.position);

      // Actualizar posición del asteroide
      if (asteroidElements) {
        const asteroidPosition = getOrbitalPosition(asteroidElements, currentSimTime * speedFactor);
        asteroidPos.current.copy(asteroidPosition.position);
      }

      // Detectar impacto
      if (goSeek > 0 && playing && asteroidElements) {
        const d = asteroidPos.current.distanceTo(earthPos.current);
        if (d < 0.2) {
          onImpactReached?.();
          setGoSeek(0);
        }
      }
    });
    return null;
  }

  return (
    <div className="h-96 w-full overflow-hidden rounded-lg bg-[#060814] relative">
      {loading && (
        <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-2 rounded">
          Loading asteroid data from NASA...
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 z-10 bg-yellow-500/80 text-black px-3 py-2 rounded text-sm">
          Using simulated orbit: {error}
        </div>
      )}
      
      <Canvas camera={{ position: [8, 5, 9], fov: 55 }} shadows>
        <ambientLight intensity={0.35} />
        <pointLight position={[0, 0, 0]} intensity={1.8} decay={1.2} />
        <directionalLight position={[6, 6, 4]} intensity={0.6} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <Stars radius={80} depth={40} count={7000} factor={2} saturation={0} fade speed={0.5} />
        
        <Sun />
        
        {/* Planetas con órbitas reales y etiquetas */}
        {PLANETS.map((planet) => (
          <Planet
            key={planet.name}
            {...planet}
            simTimeSec={currentSimTime}
            speedFactor={speedFactor}
            setEarthPos={(vector: THREE.Vector3) => {
              if (planet.name === "Earth") earthPos.current.copy(vector);
            }}
            showLabel={showPlanetLabels}
            cameraDistance={cameraDistance}
          />
        ))}
        
        {/* Asteroide y su órbita */}
        {asteroidElements && (
          <>
            <AsteroidOrbit elements={asteroidElements} deflected={deflected} />
            <Asteroid 
              elements={asteroidElements} 
              deflected={deflected} 
              simTimeSec={currentSimTime}
              speedFactor={speedFactor}
            />
          </>
        )}
        
        <CameraController cameraMode={cameraMode} getTargets={getTargets} />
        <Updaters />
        <OrbitControls enablePan={false} enabled={cameraMode === "free"} />
      </Canvas>
    </div>
  );
}