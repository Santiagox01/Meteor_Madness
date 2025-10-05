import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
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
  radius: number;
};

const PLANETS: PlanetDescriptor[] = [
  { name: "Mercury", orbitColor: "#a8a29e", radius: 0.1 },
  { name: "Venus", orbitColor: "#fbbf24", radius: 0.13 },
  { name: "Earth", orbitColor: "#38bdf8", radius: 0.15 },
  { name: "Mars", orbitColor: "#ef4444", radius: 0.12 },
  { name: "Jupiter", orbitColor: "#f59e0b", radius: 0.36 },
  { name: "Saturn", orbitColor: "#fde68a", radius: 0.32 },
  { name: "Uranus", orbitColor: "#60a5fa", radius: 0.22 },
  { name: "Neptune", orbitColor: "#3b82f6", radius: 0.22 },
];

const TEXTURE_ROOT = "https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/";
const SUN_TEXTURE = `${TEXTURE_ROOT}sunmap.jpg`;
const ASTEROID_TEXTURE = `${TEXTURE_ROOT}moonmap1k.jpg`;

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

type TextureOptions = {
  colorSpace?: THREE.ColorSpace;
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
  minFilter?: THREE.TextureFilter;
  magFilter?: THREE.MagnificationTextureFilter;
};

function enhanceTexture(texture: THREE.Texture, options?: TextureOptions) {
  texture.anisotropy = 8;
  texture.colorSpace = options?.colorSpace ?? THREE.SRGBColorSpace;
  if (options?.wrapS) texture.wrapS = options.wrapS;
  if (options?.wrapT) texture.wrapT = options.wrapT;
  if (options?.minFilter) texture.minFilter = options.minFilter;
  if (options?.magFilter) texture.magFilter = options.magFilter;
  texture.needsUpdate = true;
}

function createSolidTexture(color: string, colorSpace: THREE.ColorSpace = THREE.SRGBColorSpace) {
  const c = new THREE.Color(color);
  const data = new Uint8Array([
    Math.round(c.r * 255),
    Math.round(c.g * 255),
    Math.round(c.b * 255),
    255,
  ]);
  const texture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
  texture.colorSpace = colorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function useSafeTexture(url?: string, fallbackColor?: string, options?: TextureOptions) {
  const { colorSpace, wrapS, wrapT, minFilter, magFilter } = options ?? {};
  const fallback = useMemo(() => (fallbackColor ? createSolidTexture(fallbackColor, colorSpace ?? THREE.SRGBColorSpace) : undefined), [fallbackColor, colorSpace]);
  const [texture, setTexture] = useState<THREE.Texture | undefined>(fallback);

  useEffect(() => {
    if (!url) {
      setTexture(fallback);
      return;
    }
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      url,
      (loaded) => {
        if (cancelled) return;
        enhanceTexture(loaded, { colorSpace, wrapS, wrapT, minFilter, magFilter });
        setTexture(loaded);
      },
      undefined,
      () => {
        if (cancelled) return;
        console.warn(`[textures] Failed to load ${url}, using fallback.`);
        setTexture(fallback);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [url, fallback, colorSpace, wrapS, wrapT, minFilter, magFilter]);

  return texture;
}

function Sun() {
  const texture = useSafeTexture(SUN_TEXTURE, "#0035bbff");
  return (
    <mesh>
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshBasicMaterial map={texture ?? undefined} toneMapped={false} color={texture ? undefined : "#f5b342"} />
    </mesh>
  );
}

interface PlanetProps extends PlanetDescriptor {
  simTimeSec: number;
  speedFactor: number;
  setEarthPos?: (v: THREE.Vector3) => void;
}

function Planet({ name, orbitColor, simTimeSec, speedFactor, setEarthPos, radius }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const ringsRef = useRef<THREE.Mesh>(null!);
  
  // Obtener elementos orbitales del planeta
  const elements = PLANETARY_ELEMENTS[name];
  
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
          <sphereGeometry args={[radius, 80, 80]} />
          <meshStandardMaterial
            map={map ?? undefined}
            roughnessMap={roughnessMap ?? specularMap ?? undefined}
            metalnessMap={specularMap ?? undefined}
            metalness={0.05}
            roughness={0.85}
            color={!map ? orbitColor : undefined}
          />
        </mesh>
        
        {/* Nubes para la Tierra */}
        {cloudsMap && (
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[radius * 1.015, 80, 80]} />
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
            <ringGeometry args={[radius * 1.6, radius * 2.4, 256]} />
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

function AsteroidOrbit({ elements, deflected }: { elements: OrbitalElements; deflected: boolean }) {
  const orbitPoints = useMemo(() => {
    if (!elements) return [];
    return generateOrbitPoints(elements, 180);
  }, [elements]);

  const orbitGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(orbitPoints);
  }, [orbitPoints]);

  if (!elements) return null;

  return (
    <lineSegments geometry={orbitGeometry}>
      <lineBasicMaterial 
        color={deflected ? "#22c55e" : "#f43f5e"} 
        linewidth={2} 
        transparent 
        opacity={0.7} 
      />
    </lineSegments>
  );
}

function Asteroid({ elements, deflected, simTimeSec, speedFactor }: { 
  elements: OrbitalElements; 
  deflected: boolean;
  simTimeSec: number;
  speedFactor: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.08, 3);
    const position = geo.attributes.position as THREE.BufferAttribute;
    const temp = new THREE.Vector3();
    for (let i = 0; i < position.count; i++) {
      temp.set(position.getX(i), position.getY(i), position.getZ(i));
      const displacement = (Math.sin(temp.x * 9.7) + Math.cos(temp.y * 7.3) + Math.sin(temp.z * 5.1)) / 9 + 0.5;
      const scale = 1 + (displacement - 0.5) * 0.35;
      temp.multiplyScalar(scale);
      position.setXYZ(i, temp.x, temp.y, temp.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
  
  const map = useSafeTexture(ASTEROID_TEXTURE, "#b6a48b");

  useFrame(({ clock }) => {
    if (!elements || !ref.current) return;
    
    // Calcular posición con elementos modificados si está desviado
    const currentElements = deflected ? 
      { 
        ...elements, 
        e: Math.min(elements.e * 1.5, 0.99), // Aumentar excentricidad
        ω: elements.ω + 10 // Cambiar argumento del perihelio
      } : 
      elements;
    
    const effectiveTime = simTimeSec * speedFactor;
    const position = getOrbitalPosition(currentElements, effectiveTime);
    ref.current.position.copy(position.position);
    
    // Rotación del asteroide
    const rotationSpeed = 0.003 * speedFactor;
    ref.current.rotation.y += rotationSpeed * clock.getDelta();
    ref.current.rotation.x += (rotationSpeed * 0.5) * clock.getDelta();
  });

  return (
    <mesh ref={ref} geometry={geometry} castShadow>
      <meshStandardMaterial map={map ?? undefined} roughness={0.95} metalness={0.05} color={!map ? "#b6a48b" : undefined} />
    </mesh>
  );
}

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

export default function SolarSystem3D({ 
  simTimeSec, 
  playing, 
  cameraMode, 
  deflection, 
  showDeflection, 
  goToImpactSignal, 
  onImpactReached,
  speedFactor = 1,
  asteroidId = "433" // Eros por defecto
}: SolarSystem3DProps) {
  const earthPos = useRef(new THREE.Vector3(0, 0, 1));
  const asteroidPos = useRef(new THREE.Vector3(0, 0, 0));
  const [currentSimTime, setCurrentSimTime] = useState(simTimeSec);
  const [asteroidElements, setAsteroidElements] = useState<OrbitalElements | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goSeek, setGoSeek] = useState(0);

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
        <div className="absolute top-4 left-4 z-10 bg-red-500/80 text-white px-3 py-2 rounded">
          {error}
        </div>
      )}
      
      <Canvas camera={{ position: [8, 5, 9], fov: 55 }} shadows>
        <ambientLight intensity={0.35} />
        <pointLight position={[0, 0, 0]} intensity={1.8} decay={1.2} />
        <directionalLight position={[6, 6, 4]} intensity={0.6} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <Stars radius={80} depth={40} count={7000} factor={2} saturation={0} fade speed={0.5} />
        
        <Sun />
        
        {/* Planetas con órbitas reales */}
        {PLANETS.map((planet) => (
          <Planet
            key={planet.name}
            {...planet}
            simTimeSec={currentSimTime}
            speedFactor={speedFactor}
            setEarthPos={(vector: THREE.Vector3) => {
              if (planet.name === "Earth") earthPos.current.copy(vector);
            }}
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