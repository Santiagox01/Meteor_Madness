import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useState, useEffect } from "react";

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

// Texturas de la Tierra
const EARTH_TEXTURES = {
  color: "https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthmap1k.jpg",
  specular: "https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthspec1k.jpg",
  clouds: "https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthcloudmap.jpg",
  bump: "https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthbump1k.jpg"
};

function useTextureWithFallback(url: string, fallbackColor: string = "#0b132b") {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      url,
      (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        console.warn(`Failed to load texture: ${url}`);
        setTexture(null);
      }
    );
  }, [url]);
  
  return texture;
}

function Earth({ impactCenter, craterRadiusKm }: { impactCenter: THREE.Vector3; craterRadiusKm: number }) {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  
  const colorMap = useTextureWithFallback(EARTH_TEXTURES.color);
  const specularMap = useTextureWithFallback(EARTH_TEXTURES.specular);
  const cloudsMap = useTextureWithFallback(EARTH_TEXTURES.clouds);
  const bumpMap = useTextureWithFallback(EARTH_TEXTURES.bump);

  // Crear material personalizado con efecto de cráter
  const earthMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      map: colorMap,
      specularMap: specularMap,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      shininess: 5,
      transparent: true,
      opacity: 1
    });
  }, [colorMap, specularMap, bumpMap]);

  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <group>
      {/* Tierra principal */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>
      
      {/* Nubes */}
      {cloudsMap && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.005, 128, 128]} />
          <meshPhongMaterial
            map={cloudsMap}
            transparent
            opacity={0.6}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Efecto de cráter en el punto de impacto */}
      <CraterEffect 
        center={impactCenter} 
        radius={craterRadiusKm / RE} 
      />
    </group>
  );
}

function CraterEffect({ center, radius }: { center: THREE.Vector3; radius: number }) {
  const craterRef = useRef<THREE.Mesh>(null!);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // El cráter aparece después de un breve delay
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const geometry = useMemo(() => {
    // Crear geometría de cráter (cono invertido)
    const craterGeometry = new THREE.ConeGeometry(radius * 0.8, radius * 0.3, 32);
    craterGeometry.translate(0, -radius * 0.15, 0);
    craterGeometry.rotateX(Math.PI);
    return craterGeometry;
  }, [radius]);

  const normal = useMemo(() => center.clone().normalize(), [center]);
  const rotation = useMemo(() => 
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal), 
    [normal]
  );

  if (!visible) return null;

  return (
    <mesh
      ref={craterRef}
      position={center.clone().multiplyScalar(1.01)} // Justo sobre la superficie
      quaternion={rotation}
      geometry={geometry}
    >
      <meshStandardMaterial
        color="#8B4513"
        roughness={0.9}
        metalness={0.1}
        emissive="#4a2c0f"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function ImpactRings({ center, craterR, severeR, moderateR }: { center: THREE.Vector3; craterR: number; severeR: number; moderateR: number }) {
  const mkRing = (radiusKm: number, color: string, width: number = 2) => {
    const points: THREE.Vector3[] = [];
    const ang = radiusKm / RE;
    
    for (let i = 0; i <= 256; i++) {
      const t = (2 * Math.PI * i) / 256;
      const lat0 = Math.asin(center.y);
      const lon0 = Math.atan2(center.z, center.x);
      
      const lat = Math.asin(Math.sin(lat0) * Math.cos(ang) + Math.cos(lat0) * Math.sin(ang) * Math.cos(t));
      const lon = lon0 + Math.atan2(Math.sin(t) * Math.sin(ang) * Math.cos(lat0), Math.cos(ang) - Math.sin(lat0) * Math.sin(lat));
      
      const x = Math.cos(lat) * Math.cos(lon);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.sin(lon);
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return (
      <line geometry={geom}>
        <lineBasicMaterial color={color} linewidth={width} />
      </line>
    );
  };

  return (
    <group>
      {mkRing(craterR, "#ff6b6b", 3)}
      {mkRing(severeR, "#ffa726", 2)}
      {mkRing(moderateR, "#66bb6a", 1)}
    </group>
  );
}

function DynamicWave({ center, baseRadiusKm, color, slowMotion, isShockwave = false }: { center: THREE.Vector3; baseRadiusKm: number; color: string; slowMotion: boolean; isShockwave?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const phaseRef = useRef(0);
  
  const normal = useMemo(() => center.clone().normalize(), [center]);
  const rotation = useMemo(() => 
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal), 
    [normal]
  );
  
  const position = useMemo(() => normal.clone().multiplyScalar(1.001), [normal]);
  const angularRadius = baseRadiusKm / RE;
  const radius = Math.max(0.01, Math.sin(Math.min(Math.PI / 2, angularRadius)));
  const thickness = radius * (isShockwave ? 0.08 : 0.15);

  useFrame((_, delta) => {
    const speed = slowMotion ? 0.3 : 1.2;
    phaseRef.current = (phaseRef.current + delta * speed) % 2.0;
    
    const scale = 1 + phaseRef.current * (isShockwave ? 2.5 : 1.8);
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale);
    }
    
    if (materialRef.current) {
      const fade = Math.max(0, 1 - phaseRef.current / 2.0);
      materialRef.current.opacity = (isShockwave ? 0.8 : 0.6) * fade;
      
      // Efecto pulsante para la onda de choque
      if (isShockwave) {
        const pulse = 0.8 + 0.2 * Math.sin(phaseRef.current * Math.PI * 4);
        materialRef.current.opacity *= pulse;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} quaternion={rotation}>
      <ringGeometry args={[radius, radius + thickness, 128]} />
      <meshBasicMaterial 
        ref={materialRef} 
        color={color} 
        transparent 
        opacity={isShockwave ? 0.8 : 0.6}
        side={THREE.DoubleSide}
        blending={isShockwave ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </mesh>
  );
}

function ShockwaveParticles({ center, radiusKm, slowMotion }: { center: THREE.Vector3; radiusKm: number; slowMotion: boolean }) {
  const particlesRef = useRef<THREE.Points>(null!);
  const [particles] = useState(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const angles = new Float32Array(count * 2);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.cos(phi);
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta);
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      
      angles[i * 2] = Math.random() * Math.PI * 2;
      angles[i * 2 + 1] = Math.random() * 0.5 + 0.5;
    }
    
    return { positions, velocities, angles };
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
    geom.setAttribute('velocity', new THREE.BufferAttribute(particles.velocities, 3));
    geom.setAttribute('angle', new THREE.BufferAttribute(particles.angles, 2));
    return geom;
  }, [particles]);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = particlesRef.current.geometry.attributes.velocity.array as Float32Array;
    const angles = particlesRef.current.geometry.attributes.angle.array as Float32Array;
    
    const speed = slowMotion ? 0.5 : 1.5;
    
    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      const i2 = i * 2;
      
      // Mover partículas
      positions[i3] += velocities[i3] * speed;
      positions[i3 + 1] += velocities[i3 + 1] * speed;
      positions[i3 + 2] += velocities[i3 + 2] * speed;
      
      // Rotar alrededor del centro
      angles[i2] += 0.02 * speed;
      
      const distance = Math.sqrt(
        positions[i3] * positions[i3] + 
        positions[i3 + 1] * positions[i3 + 1] + 
        positions[i3 + 2] * positions[i3 + 2]
      );
      
      // Mantener en la superficie
      if (distance > 1.02) {
        positions[i3] *= 0.99;
        positions[i3 + 1] *= 0.99;
        positions[i3 + 2] *= 0.99;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.rotation.y += 0.001 * speed;
  });

  return (
    <points ref={particlesRef} position={[0, 0, 0]}>
      <primitive object={geometry} />
      <pointsMaterial
        color="#ff6b6b"
        size={0.02}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function EntryStreak({ center, angleDeg, slowMotion }: { center: THREE.Vector3; angleDeg: number; slowMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const phaseRef = useRef(0);
  
  const normal = useMemo(() => center.clone().normalize(), [center]);
  const baseDirection = useMemo(() => {
    const approach = center.clone().normalize().multiplyScalar(-1);
    const axis = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), normal).normalize();
    if (axis.length() === 0) return approach;
    return approach.applyAxisAngle(axis, toRad(angleDeg));
  }, [center, normal, angleDeg]);

  useFrame((_, delta) => {
    const speed = slowMotion ? 0.3 : 1.5;
    phaseRef.current = (phaseRef.current + delta * speed) % 1.8;
    
    const progress = phaseRef.current / 1.8;
    const length = 0.5 + progress * 1.2;
    
    const start = center.clone().add(baseDirection.clone().multiplyScalar(0.3));
    const end = start.clone().add(baseDirection.clone().multiplyScalar(length));
    
    if (meshRef.current) {
      meshRef.current.position.copy(start.clone().add(end).multiplyScalar(0.5));
      const dir = new THREE.Vector3().subVectors(end, start).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      meshRef.current.setRotationFromQuaternion(quat);
      meshRef.current.scale.set(1, length, 1);
    }
    
    if (materialRef.current) {
      materialRef.current.opacity = 0.9 - progress * 0.7;
    }
  });

  const geometry = useMemo(() => new THREE.CylinderGeometry(0.008, 0.03, 1, 8), []);
  
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial 
        ref={materialRef} 
        color="#ffa726" 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function LocalImpact({ lat, lon, craterRadiusKm, severeRadiusKm, moderateRadiusKm, isOcean, slowMotion = false }: LocalImpactProps) {
  const impactCenter = useMemo(() => sph2cart(lat, lon, 1), [lat, lon]);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden bg-[#060814]">
      <Canvas camera={{ position: [2.8, 1.8, 3.2], fov: 55 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-3, -3, -3]} intensity={0.8} color="#4facfe" />
        
        <Stars radius={50} depth={30} count={5000} factor={2} saturation={0} fade speed={0.5} />
        
        {/* Tierra con texturas */}
        <Earth impactCenter={impactCenter} craterRadiusKm={craterRadiusKm} />
        
        {/* Anillos de impacto */}
        <ImpactRings 
          center={impactCenter} 
          craterR={craterRadiusKm} 
          severeR={severeRadiusKm} 
          moderateR={moderateRadiusKm} 
        />
        
        {/* Ondas expansivas */}
        <DynamicWave 
          center={impactCenter} 
          baseRadiusKm={craterRadiusKm * 0.5} 
          color="#ff6b6b" 
          slowMotion={slowMotion} 
          isShockwave={true}
        />
        <DynamicWave 
          center={impactCenter} 
          baseRadiusKm={severeRadiusKm} 
          color="#ffa726" 
          slowMotion={slowMotion} 
        />
        {isOcean && (
          <DynamicWave 
            center={impactCenter} 
            baseRadiusKm={moderateRadiusKm * 1.3} 
            color="#4facfe" 
            slowMotion={slowMotion} 
          />
        )}
        
        {/* Partículas de escombros */}
        <ShockwaveParticles 
          center={impactCenter} 
          radiusKm={severeRadiusKm} 
          slowMotion={slowMotion} 
        />
        
        {/* Estela de entrada */}
        <EntryStreak 
          center={impactCenter} 
          angleDeg={35} 
          slowMotion={slowMotion} 
        />
        
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}