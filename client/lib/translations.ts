export interface Translations {
  // Navigation and Header
  home: string;
  asteroids: string;
  orbitalSimulation: string;
  missionCenter: string;
  academy: string;
  launchSimulation: string;
  
  // Index page
  welcomeTitle: string;
  welcomeSubtitle: string;
  neosCatalogTitle: string;
  neosCatalogDescription: string;
  exploreAsteroids: string;
  orbitalSimulationTitle: string;
  orbitalSimulationDescription: string;
  openSimulation: string;
  missionCenterTitle: string;
  missionCenterDescription: string;
  enterCenter: string;
  academyTitle: string;
  academyDescription: string;
  goToAcademy: string;
  continuousMonitoring: string;
  continuousMonitoringDescription: string;
  physicalModels: string;
  physicalModelsDescription: string;
  defenseScenarios: string;
  defenseScenariosDescription: string;
  educationalTraining: string;
  educationalTrainingDescription: string;
  
  // Asteroids page
  asteroidsTitle: string;
  asteroidsDescription: string;
  searchPlaceholder: string;
  hazardFilter: string;
  sizeFilter: string;
  all: string;
  dangerous: string;
  notDangerous: string;
  allSizes: string;
  smallSize: string;
  mediumSize: string;
  largeSize: string;
  diameter: string;
  approachDate: string;
  approachDistance: string;
  potentiallyHazardous: string;
  nonHazardous: string;
  viewDetails: string;
  simulate: string;
  
  // Academy page
  planetaryDefenseTraining: string;
  planetaryDefenseDescription: string;
  neosAndPHAs: string;
  neosAndPHAsDescription: string;
  neosAndPHAsContent: string;
  historicalImpacts: string;
  historicalImpactsDescription: string;
  historicalImpactsContent: string;
  torinoScaleTitle: string;
  torinoScaleDescription: string;
  torinoScaleContent: string;
  environmentalEffects: string;
  environmentalEffectsDescription: string;
  environmentalEffectsContent: string;
  mitigationTechniques: string;
  mitigationTechniquesDescription: string;
  mitigationTechniquesContent: string;
  detectionSystems: string;
  detectionSystemsDescription: string;
  detectionSystemsContent: string;
  internationalProtocols: string;
  internationalProtocolsDescription: string;
  internationalProtocolsContent: string;
  caseStudies: string;
  caseStudiesDescription: string;
  caseStudiesContent: string;
  practiceSimulation: string;
  goToCatalog: string;
  
  // Mission page translations
  planetaryDefenseAgency: string;
  missionDescription: string;
  loadNEO: string;
  operationalScenario: string;
  selectScenario: string;
  mitigationTool: string;
  torino: string;
  velocity: string;
  mass: string;
  monitoring: string;
  mitigation: string;
  residualImpact: string;
  overallSuccessProbability: string;
  toolEffectiveness: string;
  scenarioCompatibility: string;
  estimatedDeltaV: string;
  responseWindow: string;
  days: string;
  availableOrders: string;
  simulateTrajectory: string;
  sendOfficialReport: string;
  reviewEducationalProtocol: string;
  missionReport: string;
  executiveSummary: string;
  expectedResult: string;
  successProbability: string;
  toolEffectivenessReport: string;
  compatibility: string;
  deviatedDistance: string;
  earthRadii: string;
  coordinationRequired: string;
  note: string;
  approximateValues: string;
  nextSteps: string;
  nextStepsDescription: string;
  finalBriefing: string;
  briefingDescription: string;
  openOrbitalSimulation: string;
  assignTraining: string;
  analyzeAnotherNEO: string;
  // Parameter controls
  missionDuration: string;
  numberOfImpulses: string;
  instrumentalPrecision: string;
  // Language switcher
  language: string;
  english: string;
  spanish: string;
  // Simulation page translations
  energy: string;
  exajoules: string;
  yield: string;
  megatons: string;
  crater: string;
  km: string;
  blastRadius: string;
  lightDamage: string;
  seismicMagnitude: string;
  gigatons: string;
  torinoScale: string;
  asteroidEarthDistance: string;
  lunarDistances: string;
  relativeVelocity: string;
  kmPerS: string;
  kmPerH: string;
  estimatedArrival: string;
  orbitalCrossingTime: string;
  avoidanceAchieved: string;
  impactLikely: string;
  mPerS: string;
  shift: string;
  trajectoryCenter: string;
  simulationDescription: string;
  goToImpact: string;
  sendToMission: string;
  loadAsteroid: string;
  selectNEO: string;
  meters: string;
  slowMotionPlayback: string;
  impactElevation: string;
  metersAboveSeaLevel: string;
  operationalFlow: string;
  operationalStep1: string;
  operationalStep2: string;
  operationalStep3: string;
  telemetry: string;
  // Time and formatting
  hours: string;
  imminent: string;
  
  // Footer
  footerDescription: string;
  footerDataSources: string;
  modules: string;
  resources: string;
  contact: string;
  contactDescription: string;
  copyright: string;
}

export const translations: Record<'es' | 'en', Translations> = {
  es: {
    // Navigation and Header
    home: "Inicio",
    asteroids: "Asteroides",
    orbitalSimulation: "Simulación Orbital",
    missionCenter: "Centro de Misión",
    academy: "Academia",
    launchSimulation: "Lanzar simulación",
    
    // Index page
    welcomeTitle: "Code Nebula",
    welcomeSubtitle: "Centro de Operaciones para Defensa Planetaria",
    neosCatalogTitle: "Catálogo NEOs",
    neosCatalogDescription: "Consulta asteroides cercanos en tiempo real con datos de la NASA, evalúa peligrosidad y prepara análisis rápidos.",
    exploreAsteroids: "Explorar asteroides",
    orbitalSimulationTitle: "Simulación Orbital",
    orbitalSimulationDescription: "Visualiza trayectorias heliocéntricas, controla la escala temporal y sigue el acercamiento de Impactor-2025.",
    openSimulation: "Abrir simulación",
    missionCenterTitle: "Centro de Misión",
    missionCenterDescription: "Coordina estrategias de mitigación, ejecuta impactos cinéticos o tractores gravitacionales y revisa reportes.",
    enterCenter: "Entrar al centro",
    academyTitle: "Academia",
    academyDescription: "Formación continua: impactos históricos, escala de Torino, efectos ambientales y tácticas de defensa planetaria.",
    goToAcademy: "Ir a la academia",
    continuousMonitoring: "Monitoreo continuo",
    continuousMonitoringDescription: "Paneles con telemetría actualizada: distancia, velocidad relativa y amenazas destacadas.",
    physicalModels: "Modelos físicos",
    physicalModelsDescription: "Cálculos de energía cinética, cráter estimado, magnitud sísmica y escala de Torino en tiempo real.",
    defenseScenarios: "Escenarios de defensa",
    defenseScenariosDescription: "Simulación de impactos cinéticos, tractores gravitatorios y evaluación de ventanas de oportunidad.",
    educationalTraining: "Formación educativa",
    educationalTrainingDescription: "Protocolos estandarizados, estudios de caso y ejercicios de coordinación internacional.",
    
    // Asteroids page
    asteroidsTitle: "Catálogo de Objetos Cercanos a la Tierra (NEO)",
    asteroidsDescription: "Explora asteroides del catálogo de la NASA. Filtra por peligrosidad y tamaño para identificar amenazas.",
    searchPlaceholder: "Buscar por nombre de asteroide...",
    hazardFilter: "Filtro de peligro",
    sizeFilter: "Filtro de tamaño",
    all: "Todos",
    dangerous: "Peligrosos",
    notDangerous: "No peligrosos",
    allSizes: "Todos los tamaños",
    smallSize: "< 0.1 km",
    mediumSize: "0.1 - 1 km",
    largeSize: "> 1 km",
    diameter: "Diámetro",
    approachDate: "Fecha de aproximación",
    approachDistance: "Distancia de aproximación",
    potentiallyHazardous: "Potencialmente peligroso",
    nonHazardous: "No peligroso",
    viewDetails: "Ver detalles",
    simulate: "Simular",
    
    // Academy page
    planetaryDefenseTraining: "Formación en Defensa Planetaria",
    planetaryDefenseDescription: "Programa de capacitación integral para la detección, seguimiento y mitigación de asteroides potencialmente peligrosos.",
    neosAndPHAs: "NEOs y asteroides potencialmente peligrosos",
    neosAndPHAsDescription: "Clasificación, órbitas y seguimiento continuo de objetos cercanos a la Tierra.",
    neosAndPHAsContent: "Los NEOs son cuerpos cuyo perihelio es menor a 1.3 AU. Un asteroide potencialmente peligroso (PHA) combina tamaño significativo con distancia mínima inferior a 0.05 AU.",
    historicalImpacts: "Impactos históricos",
    historicalImpactsDescription: "Comparativa entre Tunguska, Cheliábinsk y Chicxulub.",
    historicalImpactsContent: "Desde explosiones atmosféricas hasta cráteres masivos, los eventos históricos ofrecen parámetros clave para calibrar modelos de daños y estrategias de mitigación.",
    torinoScaleTitle: "Escala de Torino",
    torinoScaleDescription: "Índice estandarizado para comunicar riesgos de impacto.",
    torinoScaleContent: "La escala combina probabilidad de impacto con energía cinética estimada. Valores de 0 a 10 guían la comunicación pública y la respuesta institucional.",
    environmentalEffects: "Efectos ambientales",
    environmentalEffectsDescription: "Cráteres, tsunamis, terremotos y cambios climáticos.",
    environmentalEffectsContent: "Los impactos generan ondas sísmicas, eyecta balística y alteraciones atmosféricas. La magnitud depende del tamaño, velocidad y ángulo de impacto.",
    mitigationTechniques: "Técnicas de mitigación",
    mitigationTechniquesDescription: "Impactadores cinéticos, tractores gravitatorios y explosivos nucleares.",
    mitigationTechniquesContent: "Cada técnica requiere ventanas de oportunidad específicas. Los impactadores kinéticos son efectivos con anticipación, mientras que métodos más drásticos se reservan para emergencias.",
    detectionSystems: "Sistemas de detección",
    detectionSystemsDescription: "Catálogos terrestres, misiones espaciales y redes de seguimiento.",
    detectionSystemsContent: "Programas como Catalina Sky Survey y LINEAR mantienen vigilancia constante. Las misiones espaciales proporcionan datos orbitales precisos para predicciones a largo plazo.",
    internationalProtocols: "Protocolos internacionales",
    internationalProtocolsDescription: "Coordinación entre agencias espaciales y gobiernos.",
    internationalProtocolsContent: "La respuesta global requiere sincronización entre ESA, NASA, Roscosmos y otras agencias. Los protocolos establecen cadenas de mando y distribución de recursos.",
    caseStudies: "Estudios de caso",
    caseStudiesDescription: "Análisis detallado de escenarios reales y simulados.",
    caseStudiesContent: "Revisión de misiones como DART, análisis de eventos como Cheliábinsk y evaluación de propuestas futuras para asteroides específicos del catálogo NEO.",
    practiceSimulation: "Práctica en simulación",
    goToCatalog: "Ir al catálogo",
    
    // Mission page translations
    planetaryDefenseAgency: "Agencia de Defensa Planetaria",
    missionDescription: "Selecciona un escenario de amenaza, calcula estrategias de mitigación y genera reportes operativos. Cada resultado puede enviarse al módulo de simulación o a la academia para entrenamiento.",
    loadNEO: "Cargar NEO",
    operationalScenario: "Escenario operativo",
    selectScenario: "Selecciona un escenario",
    mitigationTool: "Herramienta de mitigación",
    torino: "Escala Torino",
    velocity: "Velocidad",
    mass: "Masa",
    monitoring: "Monitoreo",
    mitigation: "Mitigación",
    residualImpact: "Impacto residual",
    overallSuccessProbability: "Probabilidad de éxito general de la misión",
    toolEffectiveness: "Eficacia base de la herramienta",
    scenarioCompatibility: "Compatibilidad con el escenario",
    estimatedDeltaV: "Δv estimado",
    responseWindow: "Ventana de respuesta",
    days: "días",
    availableOrders: "Órdenes disponibles",
    simulateTrajectory: "Simular trayectoria",
    sendOfficialReport: "Enviar reporte oficial",
    reviewEducationalProtocol: "Revisar protocolo educativo",
    missionReport: "Reporte de misión",
    executiveSummary: "Resumen ejecutivo generado automáticamente con base en el escenario seleccionado y la estrategia de mitigación.",
    expectedResult: "Resultado esperado:",
    successProbability: "de probabilidad de éxito general.",
    toolEffectivenessReport: "Efectividad de herramienta:",
    compatibility: "de compatibilidad.",
    deviatedDistance: "Distancia desviada:",
    earthRadii: "radios terrestres",
    coordinationRequired: "Requiere coordinación con simulación orbital para validar trayectorias finales.",
    note: "Nota:",
    approximateValues: "Los valores son aproximaciones para uso en ejercicios de defensa. Se recomienda validación con datos actualizados del catálogo NEO.",
    nextSteps: "Próximos pasos",
    nextStepsDescription: "1. Validar órbitas en Simulación Orbital. 2. Coordinar con Academia para capacitación. 3. Emitir comunicado científico a la red Code Nebula.",
    finalBriefing: "Briefing final",
    briefingDescription: "El Centro de Misión integra simulaciones, catálogos NEO y procedimientos educativos para mantener una respuesta global coordinada. Usa los resultados para informar a gobiernos, agencias científicas y equipos de campo.",
    openOrbitalSimulation: "Abrir simulación orbital",
    assignTraining: "Asignar entrenamiento",
    analyzeAnotherNEO: "Analizar otro NEO",
    missionDuration: "Duración misión (días)",
    numberOfImpulses: "Número de impulsos",
    instrumentalPrecision: "Precisión instrumental (1-10)",
    language: "Idioma",
    english: "English",
    spanish: "Español",
    // Simulation page translations
    energy: "Energía",
    exajoules: "exajulios",
    yield: "Potencia",
    megatons: "megatones",
    crater: "Cráter",
    km: "km",
    blastRadius: "Radio de explosión",
    lightDamage: "Daño ligero",
    seismicMagnitude: "Magnitud sísmica",
    gigatons: "gigatones",
    torinoScale: "Escala Torino",
    asteroidEarthDistance: "Distancia asteroide-Tierra",
    lunarDistances: "distancias lunares",
    relativeVelocity: "Velocidad relativa",
    kmPerS: "km/s",
    kmPerH: "km/h",
    estimatedArrival: "Llegada estimada",
    orbitalCrossingTime: "Tiempo de cruce orbital",
    avoidanceAchieved: "Evasión lograda",
    impactLikely: "Impacto probable",
    mPerS: "m/s",
    shift: "desplazamiento",
    trajectoryCenter: "Centro de trayectorias",
    simulationDescription: "Monitoreo en tiempo real de trayectorias, evaluación de maniobras de deflexión y análisis de impacto localizado.",
    goToImpact: "Ir al impacto",
    sendToMission: "Enviar a misión",
    loadAsteroid: "Cargar asteroide",
    selectNEO: "Seleccionar NEO",
    meters: "metros",
    slowMotionPlayback: "Reproducción en cámara lenta",
    impactElevation: "Elevación de impacto",
    metersAboveSeaLevel: "metros sobre el nivel del mar",
    operationalFlow: "Flujo operativo",
    operationalStep1: "Detectar y rastrear objetos NEO",
    operationalStep2: "Evaluar riesgo y planificar misión",
    operationalStep3: "Ejecutar maniobras de deflexión",
    telemetry: "Telemetría",
    hours: "horas",
    imminent: "inminente",
    
    // Footer
    footerDescription: "Impactor-2025 es una plataforma de defensa planetaria creada por Code Nebula para analizar y mitigar riesgos de NEOs con rigor científico.",
    footerDataSources: "Datos en vivo: NASA NEO API · USGS EPQS · Modelos físicos aproximados.",
    modules: "Módulos",
    resources: "Recursos",
    contact: "Contacto",
    contactDescription: "Centro de Defensa Planetaria · Estación Orbital Code Nebula",
    copyright: "© {year} Code Nebula. Uso educativo y de investigación.",
  },
  en: {
    // Navigation and Header
    home: "Home",
    asteroids: "Asteroids",
    orbitalSimulation: "Orbital Simulation",
    missionCenter: "Mission Center",
    academy: "Academy",
    launchSimulation: "Launch simulation",
    
    // Index page
    welcomeTitle: "Code Nebula",
    welcomeSubtitle: "Planetary Defense Operations Center",
    neosCatalogTitle: "NEOs Catalog",
    neosCatalogDescription: "Query nearby asteroids in real time with NASA data, assess hazard levels and prepare quick analyses.",
    exploreAsteroids: "Explore asteroids",
    orbitalSimulationTitle: "Orbital Simulation",
    orbitalSimulationDescription: "Visualize heliocentric trajectories, control temporal scale and follow the approach of Impactor-2025.",
    openSimulation: "Open Simulation",
    missionCenterTitle: "Mission Center",
    missionCenterDescription: "Coordinate mitigation strategies, execute kinetic impacts or gravitational tractors and review reports.",
    enterCenter: "Enter center",
    academyTitle: "Academy",
    academyDescription: "Continuous training: historical impacts, Torino scale, environmental effects and planetary defense tactics.",
    goToAcademy: "Go to academy",
    continuousMonitoring: "Continuous monitoring",
    continuousMonitoringDescription: "Panels with updated telemetry: distance, relative velocity and highlighted threats.",
    physicalModels: "Physical models",
    physicalModelsDescription: "Real-time calculations of kinetic energy, estimated crater, seismic magnitude and Torino scale.",
    defenseScenarios: "Defense scenarios",
    defenseScenariosDescription: "Simulation of kinetic impactors, gravitational tractors and opportunity window evaluation.",
    educationalTraining: "Educational training",
    educationalTrainingDescription: "Standardized protocols, case studies and international coordination exercises.",
    
    // Asteroids page
    asteroidsTitle: "Near-Earth Objects (NEO) Catalog",
    asteroidsDescription: "Explore asteroids from NASA's catalog. Filter by hazard level and size to identify threats.",
    searchPlaceholder: "Search by asteroid name...",
    hazardFilter: "Hazard filter",
    sizeFilter: "Size filter",
    all: "All",
    dangerous: "Hazardous",
    notDangerous: "Non-hazardous",
    allSizes: "All sizes",
    smallSize: "< 0.1 km",
    mediumSize: "0.1 - 1 km",
    largeSize: "> 1 km",
    diameter: "Diameter",
    approachDate: "Approach date",
    approachDistance: "Approach distance",
    potentiallyHazardous: "Potentially hazardous",
    nonHazardous: "Non-hazardous",
    viewDetails: "View details",
    simulate: "Simulate",
    
    // Academy page
    planetaryDefenseTraining: "Planetary Defense Training",
    planetaryDefenseDescription: "Comprehensive training program for detection, tracking and mitigation of potentially hazardous asteroids.",
    neosAndPHAs: "NEOs and potentially hazardous asteroids",
    neosAndPHAsDescription: "Classification, orbits and continuous tracking of near-Earth objects.",
    neosAndPHAsContent: "NEOs are bodies whose perihelion is less than 1.3 AU. A potentially hazardous asteroid (PHA) combines significant size with minimum distance less than 0.05 AU.",
    historicalImpacts: "Historical impacts",
    historicalImpactsDescription: "Comparison between Tunguska, Chelyabinsk and Chicxulub.",
    historicalImpactsContent: "From atmospheric explosions to massive craters, historical events offer key parameters to calibrate damage models and mitigation strategies.",
    torinoScaleTitle: "Torino Scale",
    torinoScaleDescription: "Standardized index to communicate impact risks.",
    torinoScaleContent: "The scale combines impact probability with estimated kinetic energy. Values from 0 to 10 guide public communication and institutional response.",
    environmentalEffects: "Environmental effects",
    environmentalEffectsDescription: "Craters, tsunamis, earthquakes and climate changes.",
    environmentalEffectsContent: "Impacts generate seismic waves, ballistic ejecta and atmospheric alterations. Magnitude depends on size, velocity and impact angle.",
    mitigationTechniques: "Mitigation techniques",
    mitigationTechniquesDescription: "Kinetic impactors, gravitational tractors and nuclear explosives.",
    mitigationTechniquesContent: "Each technique requires specific opportunity windows. Kinetic impactors are effective with advance notice, while more drastic methods are reserved for emergencies.",
    detectionSystems: "Detection systems",
    detectionSystemsDescription: "Ground-based catalogs, space missions and tracking networks.",
    detectionSystemsContent: "Programs like Catalina Sky Survey and LINEAR maintain constant surveillance. Space missions provide precise orbital data for long-term predictions.",
    internationalProtocols: "International protocols",
    internationalProtocolsDescription: "Coordination between space agencies and governments.",
    internationalProtocolsContent: "Global response requires synchronization between ESA, NASA, Roscosmos and other agencies. Protocols establish command chains and resource distribution.",
    caseStudies: "Case studies",
    caseStudiesDescription: "Detailed analysis of real and simulated scenarios.",
    caseStudiesContent: "Review of missions like DART, analysis of events like Chelyabinsk and evaluation of future proposals for specific asteroids from the NEO catalog.",
    practiceSimulation: "Practice simulation",
    goToCatalog: "Go to catalog",
    
    // Mission page translations
    planetaryDefenseAgency: "Planetary Defense Agency",
    missionDescription: "Select a threat scenario, calculate mitigation strategies and generate operational reports. Each result can be sent to the simulation module or to the academy for training.",
    loadNEO: "Load NEO",
    operationalScenario: "Operational Scenario",
    selectScenario: "Select a scenario",
    mitigationTool: "Mitigation Tool",
    torino: "Torino Scale",
    velocity: "Velocity",
    mass: "Mass",
    monitoring: "Monitoring",
    mitigation: "Mitigation",
    residualImpact: "Residual Impact",
    overallSuccessProbability: "Overall mission success probability",
    toolEffectiveness: "Base tool effectiveness",
    scenarioCompatibility: "Scenario compatibility",
    estimatedDeltaV: "Estimated Δv",
    responseWindow: "Response Window",
    days: "days",
    availableOrders: "Available Orders",
    simulateTrajectory: "Simulate Trajectory",
    sendOfficialReport: "Send Official Report",
    reviewEducationalProtocol: "Review Educational Protocol",
    missionReport: "Mission Report",
    executiveSummary: "Executive summary automatically generated based on the selected scenario and mitigation strategy.",
    expectedResult: "Expected result:",
    successProbability: "overall success probability.",
    toolEffectivenessReport: "Tool effectiveness:",
    compatibility: "compatibility.",
    deviatedDistance: "Deviated distance:",
    earthRadii: "Earth radii",
    coordinationRequired: "Requires coordination with orbital simulation to validate final trajectories.",
    note: "Note:",
    approximateValues: "Values are approximations for use in defense exercises. Validation with updated NEO catalog data is recommended.",
    nextSteps: "Next Steps",
    nextStepsDescription: "1. Validate orbits in Orbital Simulation. 2. Coordinate with Academy for training. 3. Issue scientific communique to the Code Nebula network.",
    finalBriefing: "Final Briefing",
    briefingDescription: "The Mission Center integrates simulations, NEO catalogs and educational procedures to maintain a coordinated global response. Use results to inform governments, scientific agencies and field teams.",
    openOrbitalSimulation: "Open Orbital Simulation",
    assignTraining: "Assign Training",
    analyzeAnotherNEO: "Analyze Another NEO",
    missionDuration: "Mission Duration (days)",
    numberOfImpulses: "Number of Impulses",
    instrumentalPrecision: "Instrumental Precision (1-10)",
    language: "Language",
    english: "English",
    spanish: "Español",
    // Simulation page translations
    energy: "Energy",
    exajoules: "exajoules",
    yield: "Yield",
    megatons: "megatons",
    crater: "Crater",
    km: "km",
    blastRadius: "Blast radius",
    lightDamage: "Light damage",
    seismicMagnitude: "Seismic magnitude",
    gigatons: "gigatons",
    torinoScale: "Torino Scale",
    asteroidEarthDistance: "Asteroid-Earth distance",
    lunarDistances: "lunar distances",
    relativeVelocity: "Relative velocity",
    kmPerS: "km/s",
    kmPerH: "km/h",
    estimatedArrival: "Estimated arrival",
    orbitalCrossingTime: "Orbital crossing time",
    avoidanceAchieved: "Avoidance achieved",
    impactLikely: "Impact likely",
    mPerS: "m/s",
    shift: "shift",
    trajectoryCenter: "Trajectory Center",
    simulationDescription: "Real-time trajectory monitoring, deflection maneuver assessment, and localized impact analysis.",
    goToImpact: "Go to impact",
    sendToMission: "Send to mission",
    loadAsteroid: "Load asteroid",
    selectNEO: "Select NEO",
    meters: "meters",
    slowMotionPlayback: "Slow motion playback",
    impactElevation: "Impact elevation",
    metersAboveSeaLevel: "meters above sea level",
    operationalFlow: "Operational flow",
    operationalStep1: "Detect and track NEO objects",
    operationalStep2: "Assess risk and plan mission",
    operationalStep3: "Execute deflection maneuvers",
    telemetry: "Telemetry",
    hours: "hours",
    imminent: "imminent",
    
    // Footer
    footerDescription: "Impactor-2025 is a planetary defense platform created by Code Nebula to analyze and mitigate NEO risks with scientific rigor.",
    footerDataSources: "Live data: NASA NEO API · USGS EPQS · Approximate physical models.",
    modules: "Modules",
    resources: "Resources",
    contact: "Contact",
    contactDescription: "Planetary Defense Center · Code Nebula Orbital Station",
    copyright: "© {year} Code Nebula. Educational and research use.",
  }
};

export type Language = 'es' | 'en';