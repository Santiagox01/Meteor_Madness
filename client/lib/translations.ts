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
    spanish: "Español"
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
    spanish: "Español"
  }
};

export type Language = 'es' | 'en';