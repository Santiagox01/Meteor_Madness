import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 mt-12 bg-background/60">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-muted-foreground">
        <div className="space-y-2">
          <div className="text-foreground font-semibold">Code Nebula 🚀</div>
          <p>
            Impactor-2025 es una plataforma de defensa planetaria creada por Code Nebula para analizar y mitigar riesgos de NEOs con rigor científico.
          </p>
          <p className="text-xs text-muted-foreground/80">
            Datos en vivo: NASA NEO API · USGS EPQS · Modelos físicos aproximados.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-foreground font-medium">Módulos</div>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link to="/asteroids" className="hover:text-primary transition-colors">Asteroides</Link></li>
              <li><Link to="/simulation" className="hover:text-primary transition-colors">Simulación Orbital</Link></li>
              <li><Link to="/mission" className="hover:text-primary transition-colors">Centro de Misión</Link></li>
              <li><Link to="/academy" className="hover:text-primary transition-colors">Academia</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="text-foreground font-medium">Recursos</div>
            <ul className="space-y-1">
              <li><a href="https://api.nasa.gov/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">NASA Open APIs</a></li>
              <li><a href="https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">JPL Small-Body DB</a></li>
              <li><a href="https://www.usgs.gov/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">USGS</a></li>
              <li><a href="https://cneos.jpl.nasa.gov/sentry/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">CNEOS Sentry</a></li>
            </ul>
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-foreground font-medium">Contacto</div>
          <p>Centro de Defensa Planetaria · Estación Orbital Code Nebula</p>
          <p className="text-xs">© {new Date().getFullYear()} Code Nebula. Uso educativo y de investigación.</p>
        </div>
      </div>
    </footer>
  );
}
