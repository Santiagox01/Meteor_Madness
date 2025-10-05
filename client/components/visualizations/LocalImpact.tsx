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

// Texturas más confiables
const EARTH_TEXTURES = {
  color: "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/textures/planets/earth_atmos_2048.jpg",
  specular: "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/textures/planets/earth_specular_2048.jpg",
  clouds: "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/textures/planets/earth_clouds_2048.png"
};

function useTexture(url: string) {
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
      (error) => {
        console.warn(`Failed to load texture: ${url}`, error);
        setTexture(null);
      }
    );
  }, [url]);
  
  return texture;
}

function Earth({ impactCenter, craterRadiusKm }: { impactCenter: THREE.Vector3; craterRadiusKm: number }) {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  
  const colorMap = useTexture(EARTH_TEXTURES.color);
  const specularMap = useTexture(EARTH_TEXTURES.specular);
  const cloudsMap = useTexture(EARTH_TEXTURES.clouds);

  useFrame(() => {
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
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          specularMap={specularMap}
          specular={new THREE.Color(0x333333)}
          shininess={5}
          transparent={true}
          opacity={1}
        />
      </mesh>
      
      {/* Nubes */}
      {cloudsMap && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.005, 64, 64]} />
          <meshPhongMaterial
            map={cloudsMap}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      )}
      
      {/* Efecto de cráter - MÁS VISIBLE */}
      <CraterEffect 
        center={impactCenter} 
        radius={craterRadiusKm / RE} 
      />
    </group>
  );
}

function CraterEffect({ center, radius }: { center: THREE.Vector3; radius: number }) {
  const craterRef = useRef<THREE.Mesh>(null!);
  
  const geometry = useMemo(() => {
    // Cráter más grande y visible
    const craterSize = Math.max(0.05, radius * 2); // Hacerlo más grande
    const craterGeometry = new THREE.ConeGeometry(craterSize, craterSize * 0.4, 32);
    craterGeometry.translate(0, -craterSize * 0.2, 0);
    craterGeometry.rotateX(Math.PI);
    return craterGeometry;
  }, [radius]);

  const normal = useMemo(() => center.clone().normalize(), [center]);
  const rotation = useMemo(() => 
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal), 
    [normal]
  );

  useFrame(({ clock }) => {
    if (craterRef.current) {
      // Efecto de brillo pulsante
      const pulse = 0.7 + 0.3 * Math.sin(clock.getElapsedTime() * 3);
      if (craterRef.current.material) {
        (craterRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 0.5;
      }
    }
  });

  return (
    <mesh
      ref={craterRef}
      position={center.clone().multiplyScalar(1.02)} // Más alejado de la superficie
      quaternion={rotation}
      geometry={geometry}
    >
      <meshStandardMaterial
        color="#8B4513"
        roughness={0.8}
        metalness={0.3}
        emissive="#ff6b6b"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function ImpactRings({ center, craterR, severeR, moderateR }: { center: THREE.Vector3; craterR: number; severeR: number; moderateR: number }) {
  const ringsRef = useRef<THREE.Group>(null!);
  
  const mkRing = (radiusKm: number, color: string, width: number = 3) => {
    const points: THREE.Vector3[] = [];
    const ang = radiusKm / RE;
    
    for (let i = 0; i <= 128; i++) {
      const t = (2 * Math.PI * i) / 128;
      
      // Simplificar el cálculo para evitar problemas
      const x = center.x + Math.cos(t) * ang;
      const y = center.y;
      const z = center.z + Math.sin(t) * ang;
      
      // Proyectar sobre la esfera
      const point = new THREE.Vector3(x, y, z).normalize();
      points.push(point);
    }
    
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return (
      <primitive object={new THREE.Line(geom, new THREE.LineBasicMaterial({ color, linewidth: width }))} />
    );
  };

  useFrame(({ clock }) => {
    if (ringsRef.current) {
      // Efecto pulsante en los anillos
      const pulse = 0.8 + 0.2 * Math.sin(clock.getElapsedTime() * 2);
      ringsRef.current.children.forEach((child) => {
        if (child instanceof THREE.Line && child.material) {
          (child.material as THREE.LineBasicMaterial).opacity = pulse;
        }
      });
    }
  });

  return (
    <group ref={ringsRef}>
      {mkRing(craterR, "#ff0000", 4)}    {/* Rojo brillante */}
      {mkRing(severeR, "#ff8800", 3)}    {/* Naranja */}
      {mkRing(moderateR, "#00ff00", 2)}   {/* Verde */}
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
  const radius = Math.max(0.05, Math.sin(Math.min(Math.PI / 2, angularRadius))); // Mínimo más grande
  const thickness = radius * (isShockwave ? 0.1 : 0.2); // Más grueso

  useFrame((_, delta) => {
    const speed = slowMotion ? 0.2 : 0.8;
    phaseRef.current = (phaseRef.current + delta * speed) % 2.0;
    
    const scale = 1 + phaseRef.current * 3.0; // Expansión más dramática
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale);
    }
    
    if (materialRef.current) {
      const fade = Math.max(0, 1 - phaseRef.current / 2.0);
      materialRef.current.opacity = (isShockwave ? 1.0 : 0.8) * fade; // Más opaco
      
      if (isShockwave) {
        const pulse = 0.7 + 0.3 * Math.sin(phaseRef.current * Math.PI * 8);
        materialRef.current.opacity *= pulse;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} quaternion={rotation}>
      <ringGeometry args={[radius, radius + thickness, 64]} />
      <meshBasicMaterial 
        ref={materialRef} 
        color={color} 
        transparent 
        opacity={isShockwave ? 1.0 : 0.8}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function ShockwaveParticles({ slowMotion }: { slowMotion: boolean }) {
  const particlesRef = useRef<THREE.Points>(null!);
  
  const [particles] = useState(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Distribuir partículas en una esfera
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1 + Math.random() * 0.1;
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.cos(phi);
      positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      
      // Colores rojo/naranja
      colors[i3] = 1.0;     // R
      colors[i3 + 1] = 0.3 + Math.random() * 0.4; // G
      colors[i3 + 2] = 0.1; // B
    }
    
    return { positions, colors };
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3));
    return geom;
  }, [particles]);

  useFrame(() => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const speed = slowMotion ? 0.3 : 1.0;
    
    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      
      // Mover partículas hacia afuera
      const direction = new THREE.Vector3(
        positions[i3],
        positions[i3 + 1], 
        positions[i3 + 2]
      ).normalize();
      
      positions[i3] += direction.x * 0.005 * speed;
      positions[i3 + 1] += direction.y * 0.005 * speed;
      positions[i3 + 2] += direction.z * 0.005 * speed;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.rotation.y += 0.002 * speed;
  });

  return (
    <points ref={particlesRef}>
      <primitive object={geometry} />
      <pointsMaterial
        size={0.03}
        vertexColors={true}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

function ExplosionFlash({ center, slowMotion }: { center: THREE.Vector3; slowMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const phaseRef = useRef(0);
  
  useFrame((_, delta) => {
    const speed = slowMotion ? 0.5 : 2.0;
    phaseRef.current += delta * speed;
    
    if (phaseRef.current < 1.0) {
      const scale = 1 + phaseRef.current * 2.0;
      const opacity = 1.0 - phaseRef.current;
      
      if (meshRef.current) {
        meshRef.current.scale.setScalar(scale);
      }
      if (materialRef.current) {
        materialRef.current.opacity = opacity;
      }
    } else {
      if (materialRef.current) {
        materialRef.current.opacity = 0;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={center.clone().multiplyScalar(1.01)}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#ffffff"
        transparent
        opacity={1.0}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function LocalImpact({ lat, lon, craterRadiusKm, severeRadiusKm, moderateRadiusKm, slowMotion = false }: LocalImpactProps) {
  const impactCenter = useMemo(() => sph2cart(lat, lon, 1), [lat, lon]);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden bg-[#060814]">
      <Canvas camera={{ position: [2.8, 1.8, 3.2], fov: 55 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={2.0} />
        <pointLight position={impactCenter.toArray()} intensity={3.0} color="#ff6b6b" />
        
        <Stars radius={50} depth={30} count={5000} factor={2} saturation={0} fade speed={0.5} />
        
        {/* Tierra con texturas */}
        <Earth impactCenter={impactCenter} craterRadiusKm={craterRadiusKm} />
        
        {/* Flash de explosión inicial */}
        <ExplosionFlash center={impactCenter} slowMotion={slowMotion} />
        
        {/* Anillos de impacto */}
        <ImpactRings 
          center={impactCenter} 
          craterR={craterRadiusKm} 
          severeR={severeRadiusKm} 
          moderateR={moderateRadiusKm} 
        />
        
        {/* MÚLTIPLES ondas expansivas para mayor efecto */}
        <DynamicWave 
          center={impactCenter} 
          baseRadiusKm={craterRadiusKm * 0.3} 
          color="#ff0000" 
          slowMotion={slowMotion} 
          isShockwave={true}
        />
        <DynamicWave 
          center={impactCenter} 
          baseRadiusKm={craterRadiusKm * 0.6} 
          color="#ff4444" 
          slowMotion={slowMotion} 
          isShockwave={true}
        />
        <DynamicWave 
          center={impactCenter} 
          baseRadiusKm={severeRadiusKm} 
          color="#ff8800" 
          slowMotion={slowMotion} 
        />
        <DynamicWave 
          center={impactCenter} 
          baseRadiusKm={moderateRadiusKm} 
          color="#ffaa00" 
          slowMotion={slowMotion} 
        />
        
        {/* Partículas de escombros */}
        <ShockwaveParticles 
          slowMotion={slowMotion} 
        />
        
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}