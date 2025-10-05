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

<<<<<<< HEAD
// TEXTURAS MÁS SIMPLES Y CONFIABLES
=======
// TEXTURAS ALTERNATIVAS - Más confiables
>>>>>>> 70ea7ab0faf7cc4cb09c25c33389c111b1d8a4c1
const EARTH_TEXTURES = {
<<<<<<< HEAD
  color: "/textures/earth.jpg", // Textura local en public/textures/
  // O alternativas online:
  // color: "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  // color: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Earth_Western_Hemisphere_transparent_background.png/1024px-Earth_Western_Hemisphere_transparent_background.png"
=======
  // Opción 1: Texturas de NASA/dominio público
  color: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001589/GSFC_20171208_Archive_e001589~orig.jpg",
  
  // Opción 2: Texturas de dominio público alternativas
  specular: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Earth_Western_Hemisphere_transparent_background.png/1024px-Earth_Western_Hemisphere_transparent_background.png",
  
  // Opción 3: Sin nubes para simplificar
  clouds: ""
>>>>>>> 70ea7ab0faf7cc4cb09c25c33389c111b1d8a4c1
};

<<<<<<< HEAD
// NUEVA ESFERA TEXTURIZADA ALTERNATIVA
function TexturedEarth({ impactCenter, craterRadiusKm }: { impactCenter: THREE.Vector3; craterRadiusKm: number }) {
  const earthGroupRef = useRef<THREE.Group>(null!);
  
  // Cargar textura
  const earthTexture = useTexture(EARTH_TEXTURES.color);
  
  // Configurar la textura para que se repita correctamente
  earthTexture.wrapS = THREE.RepeatWrapping;
  earthTexture.wrapT = THREE.RepeatWrapping;
  earthTexture.rotation = 0;
  earthTexture.repeat.set(1, 1);

  useFrame(() => {
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={earthGroupRef}>
      {/* ESFERA PRINCIPAL CON TEXTURA - FORMA ALTERNATIVA */}
      <mesh rotation={[0, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          metalness={0.1}
          roughness={0.8}
          color={0xffffff}
        />
      </mesh>
      
      {/* EFECTO DE CRÁTER (se mantiene igual) */}
      <CraterEffect 
        center={impactCenter} 
        radius={craterRadiusKm / RE} 
      />
    </group>
  );
}

// OPCIÓN 2: ESFERA CON MATERIAL BÁSICO PERO FUNCIONAL
function SimpleTexturedEarth({ impactCenter, craterRadiusKm }: { impactCenter: THREE.Vector3; craterRadiusKm: number }) {
=======
function Earth({ impactCenter, craterRadiusKm }: { impactCenter: THREE.Vector3; craterRadiusKm: number }) {
>>>>>>> 70ea7ab0faf7cc4cb09c25c33389c111b1d8a4c1
  const earthRef = useRef<THREE.Mesh>(null!);
  
<<<<<<< HEAD
  const earthTexture = useTexture(EARTH_TEXTURES.color);
  
=======
  // Cargar solo la textura de color
  const colorMap = useTexture(EARTH_TEXTURES.color);

>>>>>>> 70ea7ab0faf7cc4cb09c25c33389c111b1d8a4c1
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

<<<<<<< HEAD
  return (
    <group>
      {/* Esfera MUY simple con material básico */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 32, 32]} /> {/* Menos segmentos para debug */}
        <meshBasicMaterial 
          map={earthTexture}
          toneMapped={false}
        />
      </mesh>
      
      <CraterEffect 
        center={impactCenter} 
        radius={craterRadiusKm / RE} 
      />
    </group>
  );
}

// OPCIÓN 3: ESFERA CON GRADIENTE DE COLORES (fallback)
function ColoredEarth({ impactCenter, craterRadiusKm }: { impactCenter: THREE.Vector3; craterRadiusKm: number }) {
  const earthRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

=======
>>>>>>> 70ea7ab0faf7cc4cb09c25c33389c111b1d8a4c1
  return (
    <group>
<<<<<<< HEAD
      {/* Esfera con colores en lugar de textura */}
=======
      {/* Tierra principal - SOLO con textura de color */}
>>>>>>> 70ea7ab0faf7cc4cb09c25c33389c111b1d8a4c1
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
<<<<<<< HEAD
          color={0x1e3a8a}      // Azul océano
          specular={0x222222}   // Reflexiones
          shininess={10}
          transparent={true}
          opacity={0.9}
=======
          map={colorMap}
          specular={new THREE.Color(0x222222)}
          shininess={25} // Más brillo para mejor visibilidad
          color={new THREE.Color(0xffffff)} // Color base blanco
>>>>>>> 70ea7ab0faf7cc4cb09c25c33389c111b1d8a4c1
        />
      </mesh>
      
<<<<<<< HEAD
      {/* "Continentes" simulados con esferas más pequeñas */}
      <mesh position={[0.3, 0.2, 0.4]} scale={[0.7, 0.5, 0.8]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshPhongMaterial color={0x4ade80} /> {/* Verde */}
      </mesh>
=======
      {/* Nubes opcionales - solo si la textura carga */}
      {EARTH_TEXTURES.clouds && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.005, 64, 64]} />
          <meshPhongMaterial
            map={useTexture(EARTH_TEXTURES.clouds)}
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      )}
>>>>>>> 70ea7ab0faf7cc4cb09c25c33389c111b1d8a4c1
      
      <mesh position={[-0.4, -0.1, 0.3]} scale={[0.6, 0.4, 0.7]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshPhongMaterial color={0x4ade80} /> {/* Verde */}
      </mesh>
      
      <CraterEffect 
        center={impactCenter} 
        radius={craterRadiusKm / RE} 
      />
    </group>
  );
}

// EL RESTO DEL CÓDIGO SE MANTIENE EXACTAMENTE IGUAL
function CraterEffect({ center, radius }: { center: THREE.Vector3; radius: number }) {
  const craterRef = useRef<THREE.Mesh>(null!);
  
  const geometry = useMemo(() => {
    const craterSize = Math.max(0.08, radius * 3);
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
      position={center.clone().multiplyScalar(1.03)}
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
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 0.1 + Math.random() * 0.2;
      
      positions[i3] = center.x + Math.cos(angle) * distance;
      positions[i3 + 1] = center.y + (Math.random() - 0.5) * 0.1;
      positions[i3 + 2] = center.z + Math.sin(angle) * distance;
      
      const pos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]).normalize();
      positions[i3] = pos.x;
      positions[i3 + 1] = pos.y;
      positions[i3 + 2] = pos.z;
      
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
<<<<<<< HEAD
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={3.0} />
        <pointLight position={impactCenter.toArray()} intensity={5.0} color="#ff6b6b" />
=======
        <ambientLight intensity={0.8} /> {/* Más luz */}
        <pointLight position={[5, 5, 5]} intensity={3.0} /> {/* Más intensidad */}
        <pointLight position={impactCenter.toArray()} intensity={5.0} color="#ff6b6b" />
>>>>>>> 70ea7ab0faf7cc4cb09c25c33389c111b1d8a4c1
        
        <Stars radius={50} depth={30} count={5000} factor={2} saturation={0} fade speed={0.5} />
        
        {/* ELIGE UNA DE ESTAS OPCIONES: */}
        
        {/* Opción 1: Esfera texturizada simple */}
        <SimpleTexturedEarth impactCenter={impactCenter} craterRadiusKm={craterRadiusKm} />
        
        {/* Opción 2: Esfera con colores (comenta la línea de arriba y descomenta esta) */}
        {/* <ColoredEarth impactCenter={impactCenter} craterRadiusKm={craterRadiusKm} /> */}
        
        {/* Opción 3: Esfera texturizada avanzada (comenta las otras) */}
        {/* <TexturedEarth impactCenter={impactCenter} craterRadiusKm={craterRadiusKm} /> */}
        
        <ExplosionFlash center={impactCenter} slowMotion={slowMotion} />
        
        <ImpactRings 
          center={impactCenter} 
          craterR={craterRadiusKm} 
          severeR={severeRadiusKm} 
          moderateR={moderateRadiusKm} 
        />
        
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
        
        <ShockwaveParticles 
          center={impactCenter} 
          slowMotion={slowMotion} 
        />
        
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}