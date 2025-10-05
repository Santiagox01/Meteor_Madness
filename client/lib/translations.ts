export interface Translations {
  // Mission page translations
  missionCenter: string;
  planetaryDefenseAgency: string;
  missionDescription: string;
  openSimulation: string;
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
  orbitalSimulation: string;
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
}

export const translations: Record<'es' | 'en', Translations> = {
  es: {
    missionCenter: "Centro de misión",
    planetaryDefenseAgency: "Agencia de Defensa Planetaria",
    missionDescription: "Selecciona un escenario de amenaza, calcula estrategias de mitigación y genera reportes operativos. Cada resultado puede enviarse al módulo de simulación o a la academia para entrenamiento.",
    openSimulation: "Abrir simulación",
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
    orbitalSimulation: "Simulación orbital",
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
    imminent: "inminente"
  },
  en: {
    missionCenter: "Mission Center",
    planetaryDefenseAgency: "Planetary Defense Agency",
    missionDescription: "Select a threat scenario, calculate mitigation strategies and generate operational reports. Each result can be sent to the simulation module or to the academy for training.",
    openSimulation: "Open Simulation",
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
    orbitalSimulation: "Orbital simulation",
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
    imminent: "imminent"
  }
};

export type Language = 'es' | 'en';