import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DeflectionParams } from "@/lib/api";
import { estimateDeflectionOutcome } from "@/lib/physics";
import type { CameraMode } from "@/components/controls/TimeControls";
import { getAsteroidPosition, getEarthPosition, SCENE_SCALE } from "@/lib/orbits";

export interface SolarSystem3DProps {
  simTimeSec: number;  // Tiempo de simulación en segundos (desde epoch)
  playing: boolean;
  cameraMode: CameraMode;
  deflection?: DeflectionParams;
  showDeflection?: boolean;
  goToImpactSignal?: number;
  onImpactReached?: () => void;
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
  a_au: number;
  T_days: number;
  orbitColor: string;
  radius: number;
};

const PLANETS: PlanetDescriptor[] = [
  { name: "Mercury", a_au: 0.39, T_days: 88, orbitColor: "#a8a29e", radius: 0.1 },
  { name: "Venus", a_au: 0.72, T_days: 224.7, orbitColor: "#fbbf24", radius: 0.13 },
  { name: "Earth", a_au: 1.0, T_days: 365.25, orbitColor: "#38bdf8", radius: 0.15 },
  { name: "Mars", a_au: 1.52, T_days: 687, orbitColor: "#ef4444", radius: 0.12 },
  { name: "Jupiter", a_au: 5.2, T_days: 4331, orbitColor: "#f59e0b", radius: 0.36 },
  { name: "Saturn", a_au: 9.58, T_days: 10747, orbitColor: "#fde68a", radius: 0.32 },
  { name: "Uranus", a_au: 19.2, T_days: 30589, orbitColor: "#60a5fa", radius: 0.22 },
  { name: "Neptune", a_au: 30.05, T_days: 59800, orbitColor: "#3b82f6", radius: 0.22 },
];

// CONSTANTES DE TIEMPO REAL
const SECONDS_PER_DAY = 86400;
const DAYS_PER_YEAR = 365.25;

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
  const texture = useSafeTexture(SUN_TEXTURE, "#f5b342");
  return (
    <mesh>
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshBasicMaterial map={texture ?? undefined} toneMapped={false} color={texture ? undefined : "#f5b342"} />
    </mesh>
  );
}

interface PlanetProps extends PlanetDescriptor {
  simTimeSec: number;  // Tiempo en segundos (escala real)
  setEarthPos?: (v: THREE.Vector3) => void;
}

function Planet({ a_au, T_days, orbitColor, name, simTimeSec, setEarthPos, radius }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const r = a_au * SCENE_SCALE;
  
  // ESCALA REAL PURA: 1 segundo simulación = 1 segundo real
  // Convertir período de días a segundos
  const periodSeconds = T_days * SECONDS_PER_DAY;
  const angle = (2 * Math.PI * (simTimeSec % periodSeconds)) / periodSeconds;
  
  const x = r * Math.cos(angle);
  const z = r * Math.sin(angle);

  // Rotación sobre su propio eje (escala real)
  useFrame(() => {
    if (groupRef.current) {
      // Velocidades de rotación en escala real (muy lentas)
      const rotationSpeeds: Record<PlanetName, number> = {
        Mercury: 0.00001,   // Muy lento - 58.6 días reales para rotación completa
        Venus: 0.000004,    // Aún más lento - 243 días
        Earth: 0.00006,     // 1 día real = 360° rotación
        Mars: 0.000055,     // ~1.03 días
        Jupiter: 0.00015,   // Más rápido - 9.9 horas
        Saturn: 0.00012,    // 10.7 horas  
        Uranus: 0.00009,    // 17.2 horas
        Neptune: 0.00008,   // 16.1 horas
      };
      groupRef.current.rotation.y += rotationSpeeds[name] || 0.00005;
    }
  });

  useEffect(() => {
    if (name === "Earth" && setEarthPos) {
      setEarthPos(new THREE.Vector3(x, 0, z));
    }
  }, [x, z, name, setEarthPos]);

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

  return (
    <group>
      {/* Órbita visible */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[r - 0.001, r + 0.001, 256]} />
        <meshBasicMaterial color={orbitColor} side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>
      
      {/* Planeta con rotación */}
      <group position={[x, 0, z]} ref={groupRef}>
        <mesh castShadow receiveShadow>
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
          <mesh>
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
          <mesh rotation={[Math.PI / 2, 0, 0]}>
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

function createAsteroidGeometry() {
  const geometry = new THREE.IcosahedronGeometry(0.08, 3);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const temp = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    temp.set(position.getX(i), position.getY(i), position.getZ(i));
    const displacement = (Math.sin(temp.x * 9.7) + Math.cos(temp.y * 7.3) + Math.sin(temp.z * 5.1)) / 9 + 0.5;
    const scale = 1 + (displacement - 0.5) * 0.35;
    temp.multiplyScalar(scale);
    position.setXYZ(i, temp.x, temp.y, temp.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function Asteroid({ simTimeSec, deflected }: { simTimeSec: number; deflected: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const geometry = useMemo(() => createAsteroidGeometry(), []);
  const map = useSafeTexture(ASTEROID_TEXTURE, "#b6a48b");

  useFrame(() => {
    const pos = getAsteroidPosition(simTimeSec, deflected);
    ref.current.position.set(pos.x, pos.y, pos.z);
    // Rotación muy lenta en escala real
    ref.current.rotation.y += 0.000003;
    ref.current.rotation.x += 0.0000015;
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

export default function SolarSystem3D({ simTimeSec, playing, cameraMode, deflection, showDeflection, goToImpactSignal, onImpactReached }: SolarSystem3DProps) {
  const earthPos = useRef(new THREE.Vector3(0, 0, SCENE_SCALE));
  const asteroidPos = useRef(new THREE.Vector3(0, 0, 0));
  const [currentSimTime, setCurrentSimTime] = useState(simTimeSec);
  const [goSeek, setGoSeek] = useState(0);

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
        // ESCALA REAL: 1ms real = 1ms simulación
        const deltaSeconds = deltaTimeMs / 1000;
        setCurrentSimTime(prev => prev + deltaSeconds);
      }

      // Actualizar posición de la Tierra
      const earth = getEarthPosition(currentSimTime);
      earthPos.current.set(earth.x, earth.y, earth.z);

      // Actualizar posición del asteroide
      const asteroid = getAsteroidPosition(currentSimTime, deflected);
      asteroidPos.current.set(asteroid.x, asteroid.y, asteroid.z);

      // Detectar impacto
      if (goSeek > 0 && playing) {
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
    <div className="h-96 w-full overflow-hidden rounded-lg bg-[#060814]">
      <Canvas camera={{ position: [8, 5, 9], fov: 55 }} shadows>
        <ambientLight intensity={0.35} />
        <pointLight position={[0, 0, 0]} intensity={1.8} decay={1.2} />
        <directionalLight position={[6, 6, 4]} intensity={0.6} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <Stars radius={80} depth={40} count={7000} factor={2} saturation={0} fade speed={0.5} />
        
        <Sun />
        
        {/* Planetas con escala de tiempo REAL */}
        {PLANETS.map((planet) => (
          <Planet
            key={planet.name}
            {...planet}
            simTimeSec={currentSimTime}
            setEarthPos={(vector: THREE.Vector3) => {
              if (planet.name === "Earth") earthPos.current.copy(vector);
            }}
          />
        ))}
        
        <Asteroid simTimeSec={currentSimTime} deflected={deflected} />
        <CameraController cameraMode={cameraMode} getTargets={getTargets} />
        <Updaters />
        <OrbitControls enablePan={false} enabled={cameraMode === "free"} />
      </Canvas>
    </div>
  );
}