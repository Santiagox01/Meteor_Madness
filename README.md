# Impactor-2025 - Code Nebula 🚀

Una plataforma inmersiva de defensa planetaria que combina simulación orbital, análisis de NEOs (Near Earth Objects) y estrategias de mitigación. Visualiza trayectorias heliocéntricas, controla la escala temporal y ejecuta misiones de deflección de asteroides con herramientas científicamente fundamentadas.

## ✨ Características Principales

### 🪐 **Catálogo NEO en Tiempo Real**
- Datos actualizados de la NASA NEO API
- Filtrado por peligrosidad, tamaño y distancia mínima
- Clasificación según la escala de Torino
- Información detallada de trayectorias y aproximaciones

### 🌍 **Simulación Orbital Avanzada**
- Visualización 3D del sistema solar en tiempo real
- Simulación de deflección de asteroides
- Modelos físicos de impacto local
- Controles de tiempo y escalas ajustables

### 🛰️ **Centro de Misión**
- Planificación de estrategias de mitigación
- Evaluación de herramientas: impactador cinético, tractor gravitacional, explosión nuclear
- Análisis de probabilidades de éxito
- Reportes ejecutivos y protocolos operativos

### 📚 **Academia de Defensa Planetaria**
- Material educativo sobre impactos históricos
- Análisis de efectos ambientales
- Protocolos de respuesta y mitigación
- Recursos multimedia para divulgación científica

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js v18.0.0 o superior
- npm o yarn
- Git

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd meteor-madness-impactor-2025
```

### 2. Instalar dependencias
```bash
npm install --legacy-peer-deps
```

### 3. Configurar variables de entorno (opcional)
```bash
# Crear archivo .env en la raíz del proyecto
NASA_API_KEY=tu_api_key_aqui  # Opcional, se usa DEMO_KEY por defecto
```

### 4. Iniciar el servidor de desarrollo
```bash
# Opción 1: Solo frontend (recomendado para desarrollo)
npm run dev

# Opción 2: Con Netlify Dev (incluye funciones serverless)
netlify dev --port 8888
```

### 5. Acceder a la aplicación
- **Frontend:** http://localhost:3000
- **Netlify Dev:** http://localhost:8888

## 📁 Estructura del Proyecto

```
meteor-madness-impactor-2025/
├── client/                     # Frontend React/TypeScript
│   ├── components/            # Componentes React
│   │   ├── controls/         # Controles de simulación
│   │   ├── layout/           # Componentes de layout
│   │   ├── panels/           # Paneles de información
│   │   ├── ui/               # Componentes de UI base
│   │   └── visualizations/   # Visualizaciones 3D
│   ├── contexts/             # Contextos React (idioma, etc.)
│   ├── hooks/                # Hooks personalizados
│   ├── lib/                  # Librerías y utilidades
│   │   ├── api.ts           # Cliente API y tipos
│   │   ├── orbits.ts        # Cálculos orbitales
│   │   ├── physics.ts       # Modelos físicos de impacto
│   │   └── translations.ts  # Sistema de traducciones
│   ├── pages/                # Páginas de la aplicación
│   └── global.css           # Estilos globales y animaciones
├── netlify/
│   └── functions/            # Funciones serverless para APIs
├── index.html               # Punto de entrada HTML
├── package.json             # Dependencias y scripts
├── vite.config.ts           # Configuración de Vite
├── tailwind.config.js       # Configuración de Tailwind CSS
└── netlify.toml             # Configuración de Netlify
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la construcción
- `npm run lint` - Ejecuta el linter
- `npm run lint:fix` - Ejecuta el linter y arregla errores automáticamente

## 🌐 API y Fuentes de Datos

### APIs Externas
- **NASA NEO API:** Datos de asteroides cercanos a la Tierra
- **USGS Elevation API:** Datos de elevación para ubicaciones de impacto

### Funciones Serverless (Netlify Functions)
- `/api/neo/browse` - Lista asteroides con paginación
- `/api/neo/{id}` - Detalles de un asteroide específico
- `/api/usgs/elevation` - Consulta de elevación por coordenadas

## 🎨 Tecnologías Utilizadas

### Frontend
- **React 18** + TypeScript
- **Vite** - Herramientas de construcción rápidas
- **React Router** - Navegación
- **TanStack Query** - Gestión de estado y cache
- **Tailwind CSS** - Estilos utilitarios
- **Radix UI** - Componentes accesibles
- **Three.js** + React Three Fiber - Visualizaciones 3D
- **Lucide React** - Iconografía

### Backend/Serverless
- **Netlify Functions** - Funciones serverless
- **TypeScript** - Tipado estático

### Desarrollo
- **ESLint** - Linter
- **PostCSS** - Procesamiento CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 🌍 Soporte de Idiomas

La aplicación cuenta con soporte completo para:
- **Español** (por defecto)
- **Inglés**

El cambio de idioma se realiza mediante el selector en la esquina superior derecha de la aplicación.

## 📊 Características Técnicas

### Visualización 3D
- Simulación del sistema solar con órbitas planetarias reales
- Representación de trayectorias de asteroides
- Efectos visuales de impacto y deflección
- Controles de cámara interactivos

### Modelos Físicos
- Cálculos de energía cinética de impacto
- Estimación de tamaño de cráter
- Análisis de ondas sísmicas
- Evaluación de efectos atmosféricos

### Datos en Tiempo Real
- Conexión con APIs oficiales de NASA
- Cache inteligente para mejor rendimiento
- Fallbacks para garantizar disponibilidad

## 🔧 Configuración para Producción

### Build
```bash
npm run build
```

### Deploy en Netlify
1. Conectar el repositorio a Netlify
2. Configurar build command: `npm run build`
3. Configurar publish directory: `dist`
4. Agregar variables de entorno si es necesario

### Variables de Entorno
```
NASA_API_KEY=tu_api_key_de_nasa
```

## 📋 Funcionalidades por Página

### 🏠 **Inicio**
- Dashboard principal con métricas del sistema
- Enlaces rápidos a todos los módulos
- Estado actual del monitoreo
- Arquitectura operativa

### 🪐 **Asteroides**
- Catálogo completo de NEOs
- Filtros avanzados por peligrosidad y tamaño
- Enlaces directos a simulación y centro de misión
- Información detallada de cada objeto

### 🌍 **Simulación Orbital**
- Visualización 3D del sistema solar
- Controles de tiempo y escala
- Simulación de deflección de asteroides
- Panel de métricas en tiempo real

### 🛰️ **Centro de Misión**
- Selección de escenarios operativos
- Evaluación de herramientas de mitigación
- Cálculo de probabilidades de éxito
- Generación de reportes ejecutivos

### 📚 **Academia**
- Material educativo estructurado
- Análisis de casos históricos
- Protocolos y procedimientos
- Recursos para divulgación

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🌟 Créditos

- **Code Nebula Team** - Desarrollo principal
- **NASA** - Datos de asteroides y APIs públicas
- **USGS** - Datos de elevación terrestre
- **Three.js Community** - Herramientas de visualización 3D

---

**Impactor-2025** es una herramienta educativa y de investigación desarrollada con fines científicos. Los cálculos y simulaciones son aproximaciones basadas en modelos simplificados y no deben usarse para toma de decisiones reales de defensa planetaria.

🚀 **¡Defiende la Tierra con ciencia y tecnología!** 🌍