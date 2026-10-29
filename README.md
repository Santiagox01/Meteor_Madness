# Impactor-2025 - Code Nebula

An immersive planetary defense platform that combines advanced orbital simulation, geological impact analysis, and NEO (Near Earth Objects) mitigation strategies. Integrates NASA and USGS data to visualize heliocentric trajectories, evaluate local geological effects, and execute deflection missions with scientifically grounded physical models.

## Main Features

### **Real-Time NEO Catalog**
- Updated data from NASA NEO API
- Filtering by hazard level, size, and minimum distance
- Classification according to the Torino Scale
- Detailed trajectory and approach information

### **Advanced Orbital Simulation**
- Real-time 3D solar system visualization
- Asteroid deflection simulation
- Local impact physical models
- Adjustable time and scale controls

### **Mission Center**
- Mitigation strategy planning
- Tool evaluation: kinetic impactor, gravity tractor, nuclear explosion
- Success probability analysis
- Executive reports and operational protocols

### **Planetary Defense Academy**
- Educational material on historical impacts
- Environmental effects analysis
- Response and mitigation protocols
- Multimedia resources for scientific outreach

### **Geological Impact Analysis**
- **Crater Formation Models:** Crater diameter calculations based on impact energy using geological scaling equations
- **Seismic Effects:** Seismic magnitude estimation using kinetic-seismic energy coupling models and Gutenberg-Richter scales
- **USGS Elevation Data:** Integration with the United States Geological Survey elevation API for precise topographic analysis
- **Damage Zone Mapping:** Devastation radius calculations (5 psi, light/moderate damage) with nuclear explosion equivalent models
- **Shock Wave Analysis:** 3D visual simulation of seismic and atmospheric wave propagation from impact point
- **Terrain-Specific Effects:** Differentiation between oceanic and terrestrial impacts with specific geological considerations
- **TNT Equivalent Estimation:** Kinetic energy conversion to TNT megatons for comparative destructive evaluation

## Installation and Setup

### Prerequisites
- Node.js v18.0.0 or higher
- npm or yarn
- Git

### 1. Clone the repository
```bash
git clone <repository-url>
cd meteor-madness-impactor-2025
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables (optional)
```bash
# Create .env file in project root
NASA_API_KEY=your_api_key_here  # Optional, uses DEMO_KEY by default
```

### 4. Start development server
```bash
# Option 1: Frontend only (recommended for development)
npm run dev

# Option 2: With Netlify Dev (includes serverless functions)
netlify dev --port 8888
```

### 5. Access the application
- **Frontend:** http://localhost:3000
- **Netlify Dev:** http://localhost:8888

## Project Structure

```text
meteor-madness-impactor-2025/
├── client/                     # Frontend React/TypeScript
│   ├── components/            # React Components
│   │   ├── controls/         # Simulation controls
│   │   ├── layout/           # Layout components
│   │   ├── panels/           # Information panels
│   │   ├── ui/               # Base UI components
│   │   └── visualizations/   # 3D visualizations
│   ├── contexts/             # React contexts (language, etc.)
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Libraries and utilities
│   │   ├── api.ts           # API client and types
│   │   ├── orbits.ts        # Orbital calculations
│   │   ├── physics.ts       # Impact physics models
│   │   └── translations.ts  # Translation system
│   ├── pages/                # Application pages
│   └── global.css           # Global styles and animations
├── netlify/
│   └── functions/            # Serverless functions for APIs
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── netlify.toml             # Netlify configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build application for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
- `npm run lint:fix` - Run linter and fix errors automatically

## APIs and Data Sources

### External APIs
- **NASA NEO API:** Near-Earth asteroid data, orbits and physical characteristics
- **USGS Elevation API:** Precise terrestrial elevation data for local impact and topographic analysis

### Serverless Functions (Netlify Functions)
- `/api/neo/browse` - List asteroids with pagination and hazard filtering
- `/api/neo/{id}` - Specific asteroid details including orbital parameters
- `/api/usgs/elevation` - Topographic elevation query by geographic coordinates

## Technologies Used

### Frontend
- **React 18** + TypeScript
- **Vite** - Fast build tools
- **React Router** - Navigation
- **TanStack Query** - State management and caching
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible components
- **Three.js** + React Three Fiber - 3D visualizations
- **Lucide React** - Icons

### Backend/Serverless
- **Netlify Functions** - Serverless functions
- **TypeScript** - Static typing

### Development
- **ESLint** - Linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic CSS prefixes

## Language Support

The application features full support for:
- **Spanish** (default)
- **English**

Language switching is done through the selector in the upper right corner of the application.

## Technical Features

### 3D Visualization
- Solar system simulation with real planetary orbits
- Asteroid trajectory representation with temporal precision
- Real-time impact and deflection visual effects
- Interactive camera controls and dynamic temporal scaling

### Physical and Geological Models
- **Kinetic Energy:** Precise impact energy calculations based on asteroid mass, velocity and density
- **Crater Formation:** Scaling models for crater diameter estimation using equation D ≈ 1.8 * (E/10^15)^0.22
- **Seismic Effects:** Seismic magnitude analysis with energy coupling models and Gutenberg-Richter scales
- **Overpressure Waves:** Atmospheric damage radius calculations using nuclear explosion models (5 psi, light damage)
- **Topographic Analysis:** USGS data integration for local terrain effects consideration

### Real-Time Data
- Connection to official NASA and USGS APIs
- Intelligent caching for better performance and offline availability
- Automatic fallbacks to ensure continuous operation

## Production Configuration

### Build
```bash
npm run build
```

### Deploy on Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables if needed

### Environment Variables
```text
NASA_API_KEY=your_nasa_api_key
```

## Features by Page

### **Home**
- Main dashboard with system metrics
- Quick links to all modules
- Current monitoring status
- Operational architecture

### **Asteroids**
- Complete NEO catalog
- Advanced filters by hazard and size
- Direct links to simulation and mission center
- Detailed information for each object

### **Orbital Simulation**
- 3D solar system visualization with precise planetary positions
- Time and scale controls for detailed temporal analysis
- Asteroid deflection simulation with multiple strategies
- Real-time metrics panel with geological impact calculations
- Local seismic effects and crater formation modeling

### **Mission Center**
- Operational scenario selection
- Mitigation tool evaluation
- Success probability calculations
- Executive report generation

### **Academy**
- Structured educational material
- Historical case analysis
- Protocols and procedures
- Outreach resources

### **Impacts**
- Geological and environmental impact analysis
- Crater formation and seismic effects modeling
- Local terrain considerations with USGS elevation data
- 3D visualization of shock wave propagation

## Contributing

To contribute to the project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-functionality`)
3. Commit your changes (`git commit -am 'Add new functionality'`)
4. Push to the branch (`git push origin feature/new-functionality`)
5. Create Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Credits

- **Code Nebula Team** - Main development
- **NASA** - Asteroid data and public APIs
- **USGS** - Terrestrial elevation data
- **Three.js Community** - 3D visualization tools

---

**Impactor-2025** is an educational and research tool developed for scientific purposes. Impact calculations, crater formation models, seismic effects, and geological simulations are approximations based on simplified models and should not be used for real planetary defense decision-making or geological risk assessment.

**Defend Earth with science and technology!**
