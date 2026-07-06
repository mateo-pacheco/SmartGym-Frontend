/* Ilustración original por capas de la sala de alto rendimiento universitaria.
   Arte propio estilo plano arquitectónico: estructura, equipamiento y señales.
   Las capas (.hero-l1/.hero-l2/.hero-l3) se desplazan con profundidad leve vía GSAP. */

export function HeroFacility() {
  return (
    <svg
      viewBox="0 0 720 560"
      role="img"
      aria-label="Plano arquitectónico de la sala de entrenamiento universitaria SmartGym con máquinas conectadas y nodos de telemetría"
      fill="none"
    >
      {/* Capa 1: estructura del edificio */}
      <g className="hero-l1" stroke="currentColor" strokeWidth="1.4" opacity="0.55">
        {/* Cerchas del techo */}
        <path d="M40 150 L680 60" />
        <path d="M40 196 L680 118" />
        <path d="M40 150 V196 M200 128 V174 M360 105 V152 M520 83 V130 M680 60 V118" />
        <path d="M40 196 200 128 M200 174 360 105 M360 152 520 83 M520 130 680 60" opacity="0.6" />
        {/* Muro acristalado del fondo */}
        <path d="M40 196 L40 388 L680 388 L680 118" />
        <path d="M168 173 V388 M296 151 V388 M424 130 V388 M552 108 V388" opacity="0.7" />
        <path d="M40 260 680 214 M40 324 680 300" opacity="0.5" />
      </g>

      {/* Capa 2: pista y equipamiento */}
      <g className="hero-l2" stroke="currentColor" strokeWidth="1.6">
        {/* Carriles de pista convergentes */}
        <path d="M0 560 L250 388 M180 560 L330 388 M420 560 L430 388 M660 560 L530 388" opacity="0.5" />
        {/* Carril con acento institucional */}
        <path d="M180 560 L330 388 L430 388 L420 560 Z" fill="var(--sg-brand)" fillOpacity="0.1" stroke="none" />
        {/* Rack de fuerza */}
        <g opacity="0.9">
          <path d="M470 240 V388 M560 240 V388 M470 240 H560" />
          <path d="M470 300 H560 M470 268 H560" opacity="0.6" />
          <path d="M455 330 H575" strokeWidth="3" />
          <circle cx="462" cy="330" r="7" />
          <circle cx="568" cy="330" r="7" />
        </g>
        {/* Estación de remo */}
        <g opacity="0.9">
          <path d="M610 372 H700" strokeWidth="2.4" />
          <path d="M626 372 V344 H672 V372" />
          <circle cx="618" cy="380" r="6" />
          <circle cx="692" cy="380" r="6" />
        </g>
        {/* Banca */}
        <path d="M300 352 H392 M312 352 V388 M380 352 V388" opacity="0.85" />
      </g>

      {/* Capa 3: señales de telemetría y acceso */}
      <g className="hero-l3" stroke="var(--sg-brand)" strokeWidth="1.8" strokeLinecap="round">
        {/* Nodo del rack */}
        <circle cx="515" cy="222" r="5" fill="var(--sg-brand)" stroke="none" />
        <path d="M504 210 a15 15 0 0 1 22 0 M497 201 a25 25 0 0 1 36 0" />
        {/* Nodo del remo */}
        <circle cx="649" cy="330" r="4.5" fill="var(--sg-brand)" stroke="none" />
        <path d="M640 320 a12 12 0 0 1 18 0" />
        {/* Lector de acceso NFC en columna */}
        <g>
          <rect x="118" y="290" width="26" height="38" rx="5" />
          <path d="M152 300 a16 16 0 0 1 0 20 M160 292 a26 26 0 0 1 0 36" />
        </g>
        {/* Enlace punteado hacia el concentrador */}
        <path
          d="M515 222 C480 150 380 130 300 138 M649 330 C660 240 600 170 520 150"
          strokeDasharray="3 7"
          strokeWidth="1.3"
          opacity="0.8"
        />
        <circle cx="298" cy="138" r="8" />
        <circle cx="298" cy="138" r="2.6" fill="var(--sg-brand)" stroke="none" />
      </g>
    </svg>
  )
}
