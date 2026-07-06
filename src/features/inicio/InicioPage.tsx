import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { AppButton } from '../../components/actions/AppButton'
import { ThemeToggle } from '../../components/navigation/ThemeToggle'
import { SkipToContent } from '../../components/navigation/SkipToContent'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { Icon, type IconName } from '../../components/icons/Icon'
import { EcosystemLoop } from './EcosystemLoop'
import { ModuleVisual, type ModuleVisualName } from './ModuleVisuals'
import brandMark from '../../assets/brand/smartgym-mark.svg'
import piscinaUcacue from '../../assets/images/piscina-ucacue.jpg'
import './inicio.scss'

/* Fotografía institucional autorizada, aportada por el propio proyecto:
   piscina de la Escuela Nacional del Deporte (UCACUE). Ver manifiesto. */

interface FeaturedModule {
  visual: ModuleVisualName
  title: string
  description: string
  benefit: string
  to: string
  cta: string
  reverse?: boolean
}

const FEATURED: FeaturedModule[] = [
  {
    visual: 'nfc',
    title: 'Identidad y acceso NFC',
    description:
      'Cada deportista se identifica con su manilla. El sistema valida el acceso, registra el intento y protege las credenciales: ningún valor sensible llega a la pantalla.',
    benefit: 'Control de acceso auditable sin fricción en la puerta.',
    to: '/operacion/accesos',
    cta: 'Abrir Acceso NFC',
  },
  {
    visual: 'iot',
    title: 'Telemetría IoT de máquinas',
    description:
      'Las máquinas conectadas reportan sesiones, latencia y sincronización a través de gateways. Los estados degradado, retrasado y desconectado se distinguen a simple vista.',
    benefit: 'Mantenimiento y operación guiados por datos reales, nunca simulados.',
    to: '/operacion/maquinas',
    cta: 'Abrir Telemetría',
    reverse: true,
  },
  {
    visual: 'riesgo',
    title: 'Riesgo médico con escalamiento',
    description:
      'Las alertas clínicas llegan con severidad, justificación y flujo de resolución. Lo crítico domina la jerarquía visual y nunca queda oculto tras decoración.',
    benefit: 'El equipo médico decide antes, con contexto completo y trazable.',
    to: '/atencion/alertas',
    cta: 'Abrir Alertas médicas',
  },
  {
    visual: 'agenda',
    title: 'Agenda y capacidad',
    description:
      'Reservas por franja y aforo por zona con prevención de conflictos. La disponibilidad se lee de un vistazo y también con lector de pantalla.',
    benefit: 'Espacios llenos donde importa, sin sobrecupo ni filas.',
    to: '/operacion/agenda',
    cta: 'Abrir Agenda',
    reverse: true,
  },
]

const INDEX_MODULES: Array<{ name: string; desc: string; to: string | null; label: string }> = [
  {
    name: 'Expediente clínico',
    desc: 'Perfil deportivo-sanitario, aptitud y observaciones.',
    to: '/atencion/deportistas',
    label: 'Abrir deportistas',
  },
  {
    name: 'Planes y revisiones',
    desc: 'Versiones, revisor responsable y aprobación humana.',
    to: '/atencion/planes',
    label: 'Abrir planes',
  },
  {
    name: 'Seguimiento y adherencia',
    desc: 'Restricciones, intervenciones y cumplimiento.',
    to: null,
    label: '',
  },
  {
    name: 'Exergames XR',
    desc: 'Compatibilidad, preparación y sesiones de realidad mixta.',
    to: '/experiencias/xr',
    label: 'Abrir XR',
  },
  {
    name: 'Reportes',
    desc: 'Analítica autorizada por rol con exportación trazable.',
    to: '/analisis/reportes',
    label: 'Abrir reportes',
  },
  {
    name: 'Gobernanza y privacidad',
    desc: 'Roles, consentimientos, revocación y auditoría.',
    to: '/administracion/privacidad',
    label: 'Abrir privacidad',
  },
]

interface Flujo {
  icon: IconName
  title: string
  steps: string[]
  to: string
  label: string
}

const FLUJOS: Flujo[] = [
  {
    icon: 'nfc',
    title: 'Bloquear una manilla comprometida',
    steps: [
      'Abrir Acceso NFC y localizar la manilla',
      'Elegir «Bloquear» y leer la consecuencia',
      'Confirmar: el bloqueo queda auditado',
    ],
    to: '/operacion/accesos',
    label: 'Ir a Acceso NFC',
  },
  {
    icon: 'alerta',
    title: 'Atender una alerta médica crítica',
    steps: [
      'La alerta crítica encabeza la cola por severidad',
      'Revisar justificación clínica y contexto',
      'Resolver con decisión trazable del responsable',
    ],
    to: '/atencion/alertas',
    label: 'Ir a Alertas médicas',
  },
  {
    icon: 'gateway',
    title: 'Inspeccionar un gateway desconectado',
    steps: [
      'El estado «Desconectado» resalta en telemetría',
      'Abrir el detalle: última sincronización y zona',
      'Escalar a mantenimiento con el evento registrado',
    ],
    to: '/operacion/maquinas',
    label: 'Ir a Telemetría',
  },
]

const SEGURIDAD = [
  {
    term: 'Control por roles',
    def: 'Cada módulo se muestra según el rol confirmado por el backend. Ocultar en el frontend nunca sustituye la autorización real del servidor.',
  },
  {
    term: 'Trazabilidad',
    def: 'Accesos, bloqueos, aprobaciones y revocaciones dejan un registro cronológico con actor, acción y recurso.',
  },
  {
    term: 'Consentimiento',
    def: 'Los datos de salud se procesan solo con consentimiento vigente; la revocación es explícita y queda registrada.',
  },
  {
    term: 'Datos sensibles',
    def: 'Valores NFC, HMAC, tokens y credenciales nunca aparecen en la interfaz, en URLs ni en registros del cliente.',
  },
  {
    term: 'Auditoría',
    def: 'Un registro inmutable orientado al tiempo permite reconstruir cualquier decisión operativa o clínica.',
  },
]

export default function InicioPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page) return

    const mm = gsap.matchMedia(page)

    mm.add(
      {
        desktop: '(min-width: 992px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 991.98px) and (prefers-reduced-motion: no-preference)',
        fine: '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const { desktop, mobile, fine } = ctx.conditions as {
          desktop: boolean
          mobile: boolean
          fine: boolean
        }
        const foto = page.querySelector<HTMLElement>('.inicio-hero__media img')

        /* Intro del hero: fromTo + clearProps para que nada quede invisible. */
        if (desktop) {
          const intro = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.5 } })
          if (foto) {
            intro.fromTo(foto, { scale: 1.12, autoAlpha: 0.4 }, { scale: 1.06, autoAlpha: 1, duration: 1.1, ease: 'power2.out' })
          }
          intro
            .fromTo('.inicio-hero__inst', { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, '-=0.8')
            .fromTo(
              '.inicio-hero__title .line',
              { y: 30, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.55 },
              '-=0.2',
            )
            .fromTo('.inicio-hero__lead', { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '-=0.35')
            .fromTo(
              '.inicio-hero__ctas > *',
              { y: 10, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.35 },
              '-=0.3',
            )
          intro.eventCallback('onComplete', () => {
            gsap.set(
              page.querySelectorAll(
                '.inicio-hero__inst, .inicio-hero__title .line, .inicio-hero__lead, .inicio-hero__ctas > *',
              ),
              { clearProps: 'all' },
            )
          })
        }
        if (mobile) {
          gsap.fromTo(
            '.inicio-hero__copy > *',
            { y: 12, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.07,
              duration: 0.35,
              ease: 'power2.out',
              onComplete: () => {
                gsap.set(page.querySelectorAll('.inicio-hero__copy > *'), { clearProps: 'all' })
              },
            },
          )
        }

        /* La foto respira con el scroll (solo transform). */
        if (desktop && foto) {
          gsap.to(foto, {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: '.inicio-hero',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
            },
          })
        }

        /* Parallax de cursor sobre la fotografía del hero: deriva sutil. */
        if (fine && foto) {
          const xTo = gsap.quickTo(foto, 'x', { duration: 1, ease: 'power3.out' })
          const yTo = gsap.quickTo(foto, 'y', { duration: 1, ease: 'power3.out' })
          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5
            const ny = e.clientY / window.innerHeight - 0.5
            xTo(nx * -14)
            yTo(ny * -8)
          }
          window.addEventListener('pointermove', onMove, { passive: true })
          return () => window.removeEventListener('pointermove', onMove)
        }
      },
    )

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Revelado editorial por sección (elementos sueltos).
      gsap.utils.toArray<HTMLElement>('[data-reveal]', page).forEach((el) => {
        gsap.from(el, {
          y: 18,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })

      // Grupos con stagger: cada hijo entra en cascada corta.
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]', page).forEach((group) => {
        gsap.from(group.children, {
          y: 20,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          overwrite: 'auto',
          scrollTrigger: { trigger: group, start: 'top 90%', once: true },
        })
      })

      // Recalcular posiciones cuando la tipografía termina de cargar.
      document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {})
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={pageRef} className="inicio">
      <SkipToContent />
      <header className="inicio-nav">
        <Link to="/inicio" className="inicio-nav__brand">
          <img src={brandMark} alt="" width="30" height="30" />
          SmartGym
        </Link>
        <nav className="inicio-nav__links" aria-label="Secciones de la presentación">
          <a className="inicio-nav__link" href="#modulos">
            Módulos
          </a>
          <a className="inicio-nav__link" href="#flujos">
            Flujos
          </a>
          <a className="inicio-nav__link" href="#seguridad">
            Seguridad
          </a>
        </nav>
        <div className="ms-auto d-flex align-items-center gap-2">
          <ThemeToggle />
          <AppButton to="/ingresar" size="sm">
            Ingresar
          </AppButton>
        </div>
      </header>

      <main id="contenido-principal">
        {/* ---------- Hero: fotografía institucional degradada en todo el top ---------- */}
        <section className="inicio-hero" aria-labelledby="hero-titulo">
          <div className="inicio-hero__media" aria-hidden="true">
            <img
              src={piscinaUcacue}
              alt=""
              width="1440"
              height="903"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="inicio-hero__copy">
            <p className="inicio-hero__inst">Universidad Católica de Cuenca</p>
            <h1 id="hero-titulo" className="inicio__display inicio-hero__title">
              <span className="line">SmartGym</span>
              <span className="line line--accent">tecnología deportiva,</span>
              <span className="line">salud y control</span>
              <span className="line">en un solo sistema.</span>
            </h1>
            <p className="inicio-hero__lead">
              Acceso NFC, telemetría de máquinas, expediente deportivo-sanitario, planes con
              revisión humana y auditoría completa para el campus.
            </p>
            <div className="inicio-hero__ctas">
              <AppButton to="/ingresar" size="lg" iconEnd="flechaDerecha">
                Ingresar a la plataforma
              </AppButton>
              <a className="sg-btn sg-btn--secondary sg-btn--lg" href="#modulos">
                Explorar módulos
              </a>
            </div>
          </div>
          <div className="inicio-scrollcue" aria-hidden="true" />
        </section>

        {/* ---------- Loop pseudo-3D ---------- */}
        <EcosystemLoop />

        {/* ---------- Módulos ---------- */}
        <section id="modulos" className="inicio-section" aria-labelledby="modulos-titulo">
          <div className="inicio-section__inner">
            <div data-reveal>
              <h2 id="modulos-titulo">Módulos que operan como un solo producto</h2>
              <p className="inicio-section__lead">
                Cada módulo comparte el mismo lenguaje visual, los mismos estados y la misma
                exigencia: información primero, decoración nunca.
              </p>
            </div>

            {FEATURED.map((mod) => (
              <article
                key={mod.title}
                className={`mod-row${mod.reverse ? ' mod-row--reverse' : ''}`}
                data-reveal
              >
                <div>
                  <h3>{mod.title}</h3>
                  <p className="mod-row__benefit">{mod.description}</p>
                  <p
                    className="mod-row__benefit"
                    style={{ fontWeight: 600, color: 'var(--sg-text-primary)' }}
                  >
                    {mod.benefit}
                  </p>
                  <AppButton variant="tertiary" to={mod.to} iconEnd="flechaDerecha">
                    {mod.cta}
                  </AppButton>
                </div>
                <div className="mod-row__visual">
                  <ModuleVisual name={mod.visual} />
                </div>
              </article>
            ))}

            <ul className="mod-index" data-reveal-group>
              {INDEX_MODULES.map((mod) => (
                <li key={mod.name}>
                  <span>
                    <span className="mod-index__name">{mod.name}</span>
                    <span className="mod-index__desc">{mod.desc}</span>
                  </span>
                  {mod.to ? (
                    <Link to={mod.to}>{mod.label}</Link>
                  ) : (
                    <StatusBadge tone="neutral" label="En preparación" icon="reloj" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Flujos críticos ---------- */}
        <section id="flujos" className="inicio-section inicio-section--tinted" aria-labelledby="flujos-titulo">
          <div className="inicio-section__inner">
            <div data-reveal>
              <h2 id="flujos-titulo">Tres flujos críticos, tres interacciones</h2>
              <p className="inicio-section__lead">
                Las decisiones con consecuencias no pueden esconderse en menús: estos recorridos
                están diseñados para resolverse en tres pasos como máximo.
              </p>
            </div>
            <div className="flujos-grid" data-reveal-group>
              {FLUJOS.map((flujo) => (
                <article key={flujo.title} className="flujo">
                  <span className="flujo__icon">
                    <Icon name={flujo.icon} size={22} />
                  </span>
                  <h3>{flujo.title}</h3>
                  <ol className="flujo__steps">
                    {flujo.steps.map((paso) => (
                      <li key={paso}>{paso}</li>
                    ))}
                  </ol>
                  <AppButton variant="tertiary" size="sm" to={flujo.to} iconEnd="flechaDerecha">
                    {flujo.label}
                  </AppButton>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Control operativo ---------- */}
        <section className="inicio-section" aria-labelledby="control-titulo">
          <div className="inicio-section__inner" data-reveal>
            <h2 id="control-titulo">Una sala de control honesta</h2>
            <p className="inicio-section__lead">
              El centro de control muestra únicamente datos reales del backend. Sin contratos
              confirmados, cada indicador declara su estado en lugar de inventar métricas.
            </p>
            <div className="inicio-console mt-4">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <StatusBadge tone="warning" label="Contrato API no confirmado" />
                <StatusBadge tone="neutral" label="Sin datos simulados" icon="check" />
              </div>
              <div className="inicio-console__grid" data-reveal-group>
                {['Accesos NFC hoy', 'Gateways en línea', 'Alertas activas', 'Aforo por zona'].map(
                  (label) => (
                    <div key={label} className="inicio-console__cell">
                      <h3>{label}</h3>
                      <span className="inicio-console__value">N/D</span>
                      <span className="inicio-console__hint">Sin datos disponibles</span>
                    </div>
                  ),
                )}
              </div>
              <div className="inicio-console__trace">
                <p>
                  Trazabilidad: cuando el backend publique sus contratos, esta consola mostrará
                  accesos, sincronizaciones y alertas en tiempo real, con su equivalente textual
                  accesible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Seguridad y privacidad ---------- */}
        <section id="seguridad" className="inicio-section" aria-labelledby="seguridad-titulo">
          <div className="inicio-section__inner">
            <div data-reveal>
              <h2 id="seguridad-titulo">Seguridad institucional, no candados decorativos</h2>
              <p className="inicio-section__lead">
                SmartGym maneja datos de salud y credenciales de acceso. Estas son las reglas que la
                interfaz cumple en todos los módulos.
              </p>
            </div>
            <ul className="inicio-seguridad__list" data-reveal-group>
              {SEGURIDAD.map((item) => (
                <li key={item.term}>
                  <span className="inicio-seguridad__term">{item.term}</span>
                  <p className="inicio-seguridad__def">{item.def}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Cierre ---------- */}
        <section className="inicio-section inicio-cierre" aria-labelledby="cierre-titulo">
          <div className="inicio-section__inner inicio-cierre__content" data-reveal>
            <h2 id="cierre-titulo" className="inicio__display">
              Acceder a SmartGym
            </h2>
            <p className="mt-3 mb-4">
              Plataforma académica de la Universidad Católica de Cuenca para la operación del
              gimnasio universitario: deporte, salud y tecnología con trazabilidad.
            </p>
            <AppButton to="/ingresar" size="lg" iconEnd="flechaDerecha">
              Ingresar a la plataforma
            </AppButton>
          </div>
        </section>
      </main>

      <footer className="inicio-footer">
        <span>Universidad Católica de Cuenca · SmartGym</span>
        <nav aria-label="Enlaces institucionales" className="d-flex gap-4">
          <Link to="/ingresar">Ingresar</Link>
          <Link to="/panel">Plataforma</Link>
          <Link to="/administracion/privacidad">Privacidad</Link>
        </nav>
      </footer>
    </div>
  )
}
