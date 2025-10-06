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
  timeUntil: string;
  lowRisk: string;
  mediumRisk: string;
  highRisk: string;
  criticalRisk: string;
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
  
  // Impact page translations
  geologicalAndEnvironmentalImpacts: string;
  impactsTitle: string;
  impactsDescription: string;
  impacts: string;
  geologicalImpacts: string;
  seismicActivity: string;
  seismicActivityDescription: string;
  seismicActivityContent: string;
  craterFormation: string;
  craterFormationDescription: string;
  craterFormationContent: string;
  groundWaterChanges: string;
  groundWaterChangesDescription: string;
  groundWaterChangesContent: string;
  environmentalImpacts: string;
  climaticEffects: string;
  climaticEffectsDescription: string;
  climaticEffectsContent: string;
  biodiversityLoss: string;
  biodiversityLossDescription: string;
  biodiversityLossContent: string;
  airQuality: string;
  airQualityDescription: string;
  airQualityContent: string;
  globalConsequences: string;
  globalConsequencesDescription: string;
  tsunamis: string;
  tsunamisDescription: string;
  tsunamisContent: string;
  globalWinter: string;
  globalWinterDescription: string;
  globalWinterContent: string;
  ozoneDamage: string;
  ozoneDamageDescription: string;
  ozoneDamageContent: string;
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
    timeUntil: "Tiempo restante",
    lowRisk: "Bajo",
    mediumRisk: "Medio",
    highRisk: "Alto",
    criticalRisk: "Crítico",
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
    
    // Impact page translations
    geologicalAndEnvironmentalImpacts: "Impactos Geológicos y Ambientales",
    impactsTitle: "Análisis de Impactos",
    impactsDescription: "Evaluación completa de las consecuencias geológicas y ambientales de impactos asteroidales en la Tierra.",
    impacts: "Impactos",
    geologicalImpacts: "Impactos Geológicos",
    seismicActivity: "Actividad Sísmica",
    seismicActivityDescription: "Ondas sísmicas generadas por el impacto y sus efectos regionales.",
    seismicActivityContent: "Los impactos de asteroides generan ondas sísmicas que se propagan a través de la corteza terrestre. Un asteroide de 1 km puede generar terremotos equivalentes a magnitud 7-8 en la escala de Richter, causando daños estructurales en un radio de cientos de kilómetros.",
    craterFormation: "Formación de Cráteres",
    craterFormationDescription: "Procesos de excavación y características del cráter resultante.",
    craterFormationContent: "La energía cinética del impacto excava material de la superficie, creando cráteres cuyo diámetro puede ser 10-20 veces mayor que el del asteroide. Los cráteres complejos incluyen picos centrales, anillos de montañas y eyecta que se distribuye globalmente.",
    groundWaterChanges: "Alteraciones del Agua Subterránea",
    groundWaterChangesDescription: "Modificaciones en acuíferos y sistemas hidrológicos locales.",
    groundWaterChangesContent: "El impacto puede fracturar rocas subterráneas, alterando el flujo de agua subterránea y creando nuevos manantiales o secando pozos existentes. Los efectos hidrológicos pueden persistir durante décadas después del impacto.",
    environmentalImpacts: "Impactos Ambientales",
    climaticEffects: "Efectos Climáticos",
    climaticEffectsDescription: "Alteraciones atmosféricas y cambios de temperatura global.",
    climaticEffectsContent: "Los impactos inyectan material particulado en la atmósfera, bloqueando la radiación solar y causando enfriamiento global. Los efectos pueden durar meses o años, afectando la agricultura y los ecosistemas terrestres.",
    biodiversityLoss: "Pérdida de Biodiversidad",
    biodiversityLossDescription: "Extinción de especies y alteración de ecosistemas.",
    biodiversityLossContent: "Los grandes impactos pueden causar extinciones masivas, como ocurrió con los dinosaurios hace 66 millones de años. La destrucción de hábitats, cambios climáticos y acidificación oceánica contribuyen a la pérdida de biodiversidad.",
    airQuality: "Calidad del Aire",
    airQualityDescription: "Contaminación atmosférica y efectos respiratorios.",
    airQualityContent: "Los detritos del impacto liberan gases tóxicos, vapores de azufre y partículas finas que degradan la calidad del aire. Los efectos sobre la salud humana incluyen problemas respiratorios y cardiovasculares en poblaciones cercanas.",
    globalConsequences: "Consecuencias Globales",
    globalConsequencesDescription: "Efectos planetarios de impactos catastróficos.",
    tsunamis: "Tsunamis",
    tsunamisDescription: "Ondas oceánicas generadas por impactos marinos.",
    tsunamisContent: "Los impactos en océanos generan tsunamis con olas de hasta 100 metros de altura que pueden viajar a 800 km/h. Las costas globales pueden verse afectadas, con devastación en zonas densamente pobladas.",
    globalWinter: "Invierno Global",
    globalWinterDescription: "Enfriamiento prolongado debido al bloqueo solar.",
    globalWinterContent: "Los grandes impactos pueden provocar un 'invierno de impacto' similar al invierno nuclear, con temperaturas globales reducidas en 1-3°C durante varios años. Esto afecta la producción agrícola mundial y puede causar hambrunas.",
    ozoneDamage: "Daño a la Capa de Ozono",
    ozoneDamageDescription: "Destrucción del ozono estratosférico y radiación UV.",
    ozoneDamageContent: "Los óxidos de nitrógeno generados por el impacto destruyen la capa de ozono, permitiendo que más radiación ultravioleta alcance la superficie. Esto aumenta las tasas de cáncer de piel y daña los ecosistemas marinos.",
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
    timeUntil: "Time until",
    lowRisk: "Low",
    mediumRisk: "Medium",
    highRisk: "High",
    criticalRisk: "Critical",
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
    
    // Impact page translations
    geologicalAndEnvironmentalImpacts: "Geological and Environmental Impacts",
    impactsTitle: "Impact Analysis",
    impactsDescription: "Comprehensive assessment of geological and environmental consequences of asteroid impacts on Earth.",
    impacts: "Impacts",
    geologicalImpacts: "Geological Impacts",
    seismicActivity: "Seismic Activity",
    seismicActivityDescription: "Seismic waves generated by impact and their regional effects.",
    seismicActivityContent: "Asteroid impacts generate seismic waves that propagate through Earth's crust. A 1 km asteroid can produce earthquakes equivalent to magnitude 7-8 on the Richter scale, causing structural damage within a radius of hundreds of kilometers.",
    craterFormation: "Crater Formation",
    craterFormationDescription: "Excavation processes and characteristics of the resulting crater.",
    craterFormationContent: "Impact kinetic energy excavates surface material, creating craters whose diameter can be 10-20 times larger than the asteroid. Complex craters include central peaks, mountain rings, and ejecta distributed globally.",
    groundWaterChanges: "Groundwater Alterations",
    groundWaterChangesDescription: "Modifications in aquifers and local hydrological systems.",
    groundWaterChangesContent: "Impact can fracture underground rocks, altering groundwater flow and creating new springs or drying existing wells. Hydrological effects can persist for decades after impact.",
    environmentalImpacts: "Environmental Impacts",
    climaticEffects: "Climatic Effects",
    climaticEffectsDescription: "Atmospheric alterations and global temperature changes.",
    climaticEffectsContent: "Impacts inject particulate matter into the atmosphere, blocking solar radiation and causing global cooling. Effects can last months or years, affecting agriculture and terrestrial ecosystems.",
    biodiversityLoss: "Biodiversity Loss",
    biodiversityLossDescription: "Species extinction and ecosystem alteration.",
    biodiversityLossContent: "Large impacts can cause mass extinctions, as occurred with dinosaurs 66 million years ago. Habitat destruction, climate change, and ocean acidification contribute to biodiversity loss.",
    airQuality: "Air Quality",
    airQualityDescription: "Atmospheric pollution and respiratory effects.",
    airQualityContent: "Impact debris releases toxic gases, sulfur vapors, and fine particles that degrade air quality. Human health effects include respiratory and cardiovascular problems in nearby populations.",
    globalConsequences: "Global Consequences",
    globalConsequencesDescription: "Planetary effects of catastrophic impacts.",
    tsunamis: "Tsunamis",
    tsunamisDescription: "Ocean waves generated by marine impacts.",
    tsunamisContent: "Ocean impacts generate tsunamis with waves up to 100 meters high that can travel at 800 km/h. Global coastlines can be affected, with devastation in densely populated areas.",
    globalWinter: "Global Winter",
    globalWinterDescription: "Prolonged cooling due to solar blocking.",
    globalWinterContent: "Large impacts can trigger an 'impact winter' similar to nuclear winter, with global temperatures reduced by 1-3°C for several years. This affects global agricultural production and can cause famines.",
    ozoneDamage: "Ozone Layer Damage",
    ozoneDamageDescription: "Stratospheric ozone destruction and UV radiation.",
    ozoneDamageContent: "Nitrogen oxides generated by impact destroy the ozone layer, allowing more ultraviolet radiation to reach the surface. This increases skin cancer rates and damages marine ecosystems.",
  }
};

export type Language = 'es' | 'en';