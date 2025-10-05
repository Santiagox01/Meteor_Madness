import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useState } from "react";

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

// TEXTURAS MEJORADAS - URLs directas del repositorio de three.js
const EARTH_TEXTURES = {
  color: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg",
  specular: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg", 
  clouds: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_2048.png"
};

function Earth({ impactCenter, craterRadiusKm }: { impactCenter: THREE.Vector3; craterRadiusKm: number }) {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  
  // Usar useTexture de drei que es más robusto
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
      {/* Tierra principal con texturas MEJORADAS */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          specularMap={specularMap}
          specular={new THREE.Color(0x333333)}
          shininess={15} {/* AUMENTADO para más reflejo */}
        />
      </mesh>
      
      {/* Capa de nubes MEJORADA */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.005, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={0.6} {/* AUMENTADO para más visibilidad */}
          depthWrite={false}
        />
      </mesh>
      
      {/* Efecto de cráter */}
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
    const craterSize = Math.max(0.08, radius * 3); // Más grande
    const craterGeometry = new THREE.ConeGeometry(craterSize, craterSize * 0.5, 32);
    craterGeometry.translate(0, -craterSize * 0.25, 0);
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
      const pulse = 0.6 + 0.4 * Math.sin(clock.getElapsedTime() * 2);
      if (craterRef.current.material) {
        (craterRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 0.8;
      }
    }
  });

  return (
    <mesh
      ref={craterRef}
      position={center.clone().multiplyScalar(1.03)} // Más alejado
      quaternion={rotation}
      geometry={geometry}
    >
      <meshStandardMaterial
        color="#5c2c0d"
        roughness={0.7}
        metalness={0.4}
        emissive="#ff4500"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

function ImpactRings({ center, craterR, severeR, moderateR }: { center: THREE.Vector3; craterR: number; severeR: number; moderateR: number }) {
  const ringsRef = useRef<THREE.Group>(null!);
  
  const mkRing = (radiusKm: number, color: string, width: number = 4) => {
    const points: THREE.Vector3[] = [];
    const ang = radiusKm / RE;
    
    for (let i = 0; i <= 64; i++) {
      const t = (2 * Math.PI * i) / 64;
      
      // Cálculo simplificado pero funcional
      const lat0 = Math.asin(center.y);
      const lon0 = Math.atan2(center.z, center.x);
      
      const x = Math.cos(lat0) * Math.cos(lon0 + t * ang);
      const y = Math.sin(lat0);
      const z = Math.cos(lat0) * Math.sin(lon0 + t * ang);
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return (
      <line geometry={geom}>
        <lineBasicMaterial color={color} linewidth={width} />
      </line>
    );
  };

  useFrame(({ clock }) => {
    if (ringsRef.current) {
      const pulse = 0.7 + 0.3 * Math.sin(clock.getElapsedTime() * 3);
      ringsRef.current.children.forEach((child) => {
        if (child instanceof THREE.Line && child.material) {
          (child.material as THREE.LineBasicMaterial).opacity = pulse;
        }
      });
    }
  });

  return (
    <group ref={ringsRef}>
      {mkRing(craterR, "#ff0000", 5)}
      {mkRing(severeR, "#ff6600", 4)}
      {mkRing(moderateR, "#ffaa00", 3)}
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
  
  const position = useMemo(() => normal.clone().multiplyScalar(1.002), [normal]);
  const angularRadius = baseRadiusKm / RE;
  const radius = Math.max(0.08, Math.sin(Math.min(Math.PI / 2, angularRadius)));
  const thickness = radius * (isShockwave ? 0.15 : 0.25);

  useFrame((_, delta) => {
    const speed = slowMotion ? 0.15 : 0.6;
    phaseRef.current = (phaseRef.current + delta * speed) % 2.5;
    
    const scale = 1 + phaseRef.current * 4.0;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale);
    }
    
    if (materialRef.current) {
      const fade = Math.max(0, 1 - phaseRef.current / 2.5);
      materialRef.current.opacity = (isShockwave ? 1.0 : 0.9) * fade;
      
      if (isShockwave) {
        const pulse = 0.6 + 0.4 * Math.sin(phaseRef.current * Math.PI * 6);
        materialRef.current.opacity *= pulse;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} quaternion={rotation}>
      <ringGeometry args={[radius, radius + thickness, 48]} />
      <meshBasicMaterial 
        ref={materialRef} 
        color={color} 
        transparent 
        opacity={isShockwave ? 1.0 : 0.9}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function ShockwaveParticles({ center, slowMotion }: { center: THREE.Vector3; slowMotion: boolean }) {
  const particlesRef = useRef<THREE.Points>(null!);
  
  const [particles] = useState(() => {
    const count = 80;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Distribución más simple alrededor del centro
      const angle = Math.random() * Math.PI * 2;
      const distance = 0.1 + Math.random() * 0.2;
      
      positions[i3] = center.x + Math.cos(angle) * distance;
      positions[i3 + 1] = center.y + (Math.random() - 0.5) * 0.1;
      positions[i3 + 2] = center.z + Math.sin(angle) * distance;
      
      // Normalizar para poner en superficie
      const pos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]).normalize();
      positions[i3] = pos.x;
      positions[i3 + 1] = pos.y;
      positions[i3 + 2] = pos.z;
      
      // Colores cálidos
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.2 + Math.random() * 0.5;
      colors[i3 + 2] = 0.0;
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
    const speed = slowMotion ? 0.2 : 0.8;
    
    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      
      const currentPos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      const direction = currentPos.clone().normalize();
      
      // Mover hacia afuera
      positions[i3] += direction.x * 0.008 * speed;
      positions[i3 + 1] += direction.y * 0.008 * speed;
      positions[i3 + 2] += direction.z * 0.008 * speed;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <primitive object={geometry} />
      <pointsMaterial
        size={0.04}
        vertexColors={true}
        transparent
        opacity={0.9}
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
    const speed = slowMotion ? 0.3 : 1.5;
    phaseRef.current += delta * speed;
    
    if (phaseRef.current < 1.5) {
      const scale = 0.5 + phaseRef.current * 3.0;
      const opacity = Math.max(0, 1.0 - phaseRef.current / 1.5);
      
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
    <mesh ref={meshRef} position={center.clone().multiplyScalar(1.02)}>
      <sphereGeometry args={[0.15, 12, 12]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#ffff00"
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
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={2.5} />
        <pointLight position={impactCenter.toArray()} intensity={4.0} color="#ff6b6b" />
        
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
        
        {/* Ondas expansivas */}
        <DynamicWave 
          center={impactCenter} 
          baseRadiusKm={craterRadiusKm * 0.4} 
          color="#ff0000" 
          slowMotion={slowMotion} 
          isShockwave={true}
        />
        <DynamicWave 
          center={impactCenter} 
          baseRadiusKm={craterRadiusKm * 0.8} 
          color="#ff3333" 
          slowMotion={slowMotion} 
          isShockwave={true}
        />
        <DynamicWave 
          center={impactCenter} 
          baseRadiusKm={severeRadiusKm} 
          color="#ff6600" 
          slowMotion={slowMotion} 
        />
        <DynamicWave 
          center={impactCenter} 
          baseRadiusKm={moderateRadiusKm} 
          color="#ff9900" 
          slowMotion={slowMotion} 
        />
        
        {/* Partículas */}
        <ShockwaveParticles 
          center={impactCenter} 
          slowMotion={slowMotion} 
        />
        
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}