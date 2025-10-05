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

// Texturas realistas de alta calidad de la Tierra
const EARTH_TEXTURES = {
  color: "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  specular: "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg", 
  normal: "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg",
  clouds: "https://threejs.org/examples/textures/planets/earth_clouds_1024.png",
  nightLights: "https://threejs.org/examples/textures/planets/earth_lights_2048.jpg"
};

// Texturas alternativas como respaldo usando URLs más confiables
const FALLBACK_TEXTURES = {
  color: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1024px-The_Earth_seen_from_Apollo_17.jpg",
  specular: "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",
  normal: "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg", 
  clouds: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Blue_Marble_Eastern_Hemisphere.jpg/1024px-Blue_Marble_Eastern_Hemisphere.jpg",
  nightLights: "https://threejs.org/examples/textures/planets/earth_lights_2048.jpg"
};

// Crear texturas procedurales mejoradas como solución predeterminada
function createProceduralEarthTexture(type: 'color' | 'normal' | 'specular' | 'clouds' | 'nightLights') {
  const canvas = document.createElement('canvas');
  const size = 1024;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return null;
  
  switch (type) {
    case 'color':
      // Crear mapa de color de la Tierra más realista
      const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      gradient.addColorStop(0, '#6B8FE6'); // Azul oceánico
      gradient.addColorStop(0.3, '#2E8B57'); // Verde mar
      gradient.addColorStop(0.6, '#8FBC8F'); // Verde claro
      gradient.addColorStop(0.8, '#D2B48C'); // Tan (desiertos)
      gradient.addColorStop(1, '#4682B4'); // Azul acero
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      
      // Añadir continentes simulados
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = 20 + Math.random() * 40;
        
        const landGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        landGradient.addColorStop(0, '#228B22'); // Verde bosque
        landGradient.addColorStop(0.7, '#8FBC8F'); // Verde claro
        landGradient.addColorStop(1, '#DEB887'); // Marrón claro
        
        ctx.fillStyle = landGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
      
    case 'normal':
      // Crear mapa normal básico (azul uniforme con variaciones)
      ctx.fillStyle = '#8080FF';
      ctx.fillRect(0, 0, size, size);
      
      // Añadir rugosidad
      for (let i = 0; i < 500; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = Math.random() * 10;
        ctx.fillStyle = `rgb(${120 + Math.random() * 20}, ${120 + Math.random() * 20}, ${200 + Math.random() * 55})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
      
    case 'specular':
      // Crear mapa especular (océanos brillantes, tierra mate)
      ctx.fillStyle = '#404040'; // Gris oscuro para tierra
      ctx.fillRect(0, 0, size, size);
      
      // Océanos más brillantes
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = 50 + Math.random() * 100;
        ctx.fillStyle = '#C0C0C0'; // Plateado para agua
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
      
    case 'clouds':
      // Crear mapa de nubes
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, size, size);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 150; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = 20 + Math.random() * 60;
        const opacity = 0.3 + Math.random() * 0.5;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
      
    case 'nightLights':
      // Crear mapa de luces nocturnas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, size);
      
      // Añadir luces de ciudades
      for (let i = 0; i < 300; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = 1 + Math.random() * 3;
        const brightness = Math.random();
        ctx.fillStyle = `rgba(255, ${200 + Math.random() * 55}, ${100 + Math.random() * 155}, ${brightness})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
  }
  
  return canvas;
}

function useTexture(url: string, fallbackUrl?: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    const loadTexture = (textureUrl: string, isFallback = false) => {
      // Primero intentar cargar desde URL externa
      fetch(textureUrl, { mode: 'cors' })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.blob();
        })
        .then(blob => {
          const url = URL.createObjectURL(blob);
          return new Promise<THREE.Texture>((resolve, reject) => {
            loader.load(
              url,
              (loadedTexture) => {
                URL.revokeObjectURL(url); // Limpiar URL objeto
                loadedTexture.colorSpace = THREE.SRGBColorSpace;
                loadedTexture.wrapS = loadedTexture.wrapT = THREE.RepeatWrapping;
                loadedTexture.anisotropy = 16;
                resolve(loadedTexture);
              },
              undefined,
              reject
            );
          });
        })
        .then((loadedTexture) => {
          setTexture(loadedTexture);
          setIsLoading(false);
          console.log(`✓ External texture loaded successfully: ${textureUrl}`);
        })
        .catch((error) => {
          console.warn(`Failed to load external texture: ${textureUrl}`, error);
          
          // Intentar con URL de respaldo
          if (fallbackUrl && !isFallback) {
            console.log(`Attempting fallback texture: ${fallbackUrl}`);
            loadTexture(fallbackUrl, true);
            return;
          }
          
          // Crear textura procedimental como último recurso
          console.log('Creating procedural texture as final fallback');
          let textureType: 'color' | 'normal' | 'specular' | 'clouds' | 'nightLights' = 'color';
          
          if (textureUrl.includes('normal')) textureType = 'normal';
          else if (textureUrl.includes('specular')) textureType = 'specular';
          else if (textureUrl.includes('clouds')) textureType = 'clouds';
          else if (textureUrl.includes('lights')) textureType = 'nightLights';
          
          const canvas = createProceduralEarthTexture(textureType);
          if (canvas) {
            const proceduralTexture = new THREE.CanvasTexture(canvas);
            proceduralTexture.colorSpace = THREE.SRGBColorSpace;
            proceduralTexture.wrapS = proceduralTexture.wrapT = THREE.RepeatWrapping;
            proceduralTexture.anisotropy = 16;
            setTexture(proceduralTexture);
            setIsLoading(false);
            console.log(`✓ Procedural ${textureType} texture created successfully`);
          }
        });
    };
    
    loadTexture(url);
  }, [url, fallbackUrl]);
  
  return { texture, isLoading };
}

function Earth({ impactCenter, craterRadiusKm }: { impactCenter: THREE.Vector3; craterRadiusKm: number }) {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const atmosphereRef = useRef<THREE.Mesh>(null!);
  
  // Cargar texturas con respaldo
  const { texture: colorMap } = useTexture(EARTH_TEXTURES.color, FALLBACK_TEXTURES.color);
  const { texture: specularMap } = useTexture(EARTH_TEXTURES.specular, FALLBACK_TEXTURES.specular);
  const { texture: normalMap } = useTexture(EARTH_TEXTURES.normal, FALLBACK_TEXTURES.normal);
  const { texture: cloudsMap } = useTexture(EARTH_TEXTURES.clouds, FALLBACK_TEXTURES.clouds);
  const { texture: nightLightsMap } = useTexture(EARTH_TEXTURES.nightLights, FALLBACK_TEXTURES.nightLights);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <group>
      {/* Tierra principal con texturas realistas mejoradas */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          // Color base realista para cuando no hay textura
          color={colorMap ? "#ffffff" : "#4682B4"} // Azul acero si no hay textura
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(1.2, 1.2)} // Más detalle en el normal map
          roughnessMap={specularMap}
          roughness={0.7}
          metalness={0.05}
          emissiveMap={nightLightsMap}
          emissive={new THREE.Color(colorMap ? 0x666622 : 0x001122)} // Luces nocturnas más cálidas o azul oscuro
          emissiveIntensity={0.4}
          // Mejorar la calidad visual
          transparent={false}
          alphaTest={0}
        />
      </mesh>
      
      {/* Nubes mejoradas con mejor transparencia */}
      {cloudsMap && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.008, 96, 96]} />
          <meshLambertMaterial
            map={cloudsMap}
            transparent
            opacity={0.6}
            depthWrite={false}
            alphaTest={0.15} // Mejor recorte de transparencia
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Atmósfera con efecto mejorado */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.025, 48, 48]} />
        <meshBasicMaterial
          color={new THREE.Color(0x6699ff)} // Color atmosférico más realista
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Efecto de cráter más prominente */}
      <CraterEffect 
        center={impactCenter} 
        radius={craterRadiusKm / RE} 
      />
    </group>
  );
}

function CraterEffect({ center, radius }: { center: THREE.Vector3; radius: number }) {
  const craterRef = useRef<THREE.Mesh>(null!);
  const debrisRef = useRef<THREE.Points>(null!);
  
  const geometry = useMemo(() => {
    const craterSize = Math.max(0.08, radius * 2.5);
    const craterGeometry = new THREE.ConeGeometry(craterSize, craterSize * 0.5, 32);
    craterGeometry.translate(0, -craterSize * 0.25, 0);
    craterGeometry.rotateX(Math.PI);
    return craterGeometry;
  }, [radius]);

  const debrisGeometry = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = (i / count) * Math.PI * 2;
      const distance = 0.05 + Math.random() * 0.1;
      
      positions[i3] = Math.cos(angle) * distance;
      positions[i3 + 1] = Math.random() * 0.05;
      positions[i3 + 2] = Math.sin(angle) * distance;
      
      colors[i3] = 0.6 + Math.random() * 0.4;
      colors[i3 + 1] = 0.3 + Math.random() * 0.3;
      colors[i3 + 2] = 0.1 + Math.random() * 0.2;
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geom;
  }, []);

  const normal = useMemo(() => center.clone().normalize(), [center]);
  const rotation = useMemo(() => 
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal), 
    [normal]
  );

  useFrame(({ clock }) => {
    if (craterRef.current) {
      const pulse = 0.6 + 0.4 * Math.sin(clock.getElapsedTime() * 2);
      if (craterRef.current.material) {
        (craterRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 0.4;
      }
    }
    
    if (debrisRef.current) {
      debrisRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={center.clone().multiplyScalar(1.03)} quaternion={rotation}>
      <mesh
        ref={craterRef}
        geometry={geometry}
      >
        <meshStandardMaterial
          color="#654321"
          roughness={0.9}
          metalness={0.1}
          emissive="#aa3333"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      <points ref={debrisRef}>
        <primitive object={debrisGeometry} />
        <pointsMaterial
          size={0.02}
          vertexColors={true}
          transparent
          opacity={0.8}
        />
      </points>
    </group>
  );
}

function ImpactRings({ center, craterR, severeR, moderateR }: { center: THREE.Vector3; craterR: number; severeR: number; moderateR: number }) {
  const ringsRef = useRef<THREE.Group>(null!);
  
  const mkRing = (radiusKm: number, color: string) => {
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
      <line>
        <bufferGeometry attach="geometry" {...geom} />
        <lineBasicMaterial color={color} />
      </line>
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
      {mkRing(craterR, "#ff0000")}    {/* Rojo brillante */}
      {mkRing(severeR, "#ff8800")}    {/* Naranja */}
      {mkRing(moderateR, "#00ff00")}   {/* Verde */}
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
    <div className="h-96 w-full rounded-lg overflow-hidden bg-[#060814] relative">
      {/* Indicador de carga sutil */}
      <div className="absolute top-2 left-2 z-10 text-xs text-blue-400 opacity-70">
        Impacto de asteroide en la Tierra
      </div>
      
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