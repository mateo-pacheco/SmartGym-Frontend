import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { AppButton } from '../../components/actions/AppButton'
import { ThemeToggle } from '../../components/navigation/ThemeToggle'
import { SkipToContent } from '../../components/navigation/SkipToContent'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { Icon, type IconName } from '../../components/icons/Icon'
import { EcosystemCards } from './EcosystemCards'
import { ModuleVisual, type ModuleVisualName } from './ModuleVisuals'
import { NfcCard } from './cards/NfcCard'
import { IotCard } from './cards/IotCard'
import { RiesgoMedicoCard } from './cards/RiesgoMedicoCard'
import { AgendaCard } from './cards/AgendaCard'
import './cards/module-cards.scss'
import './cards/module-visuals.scss'
import { BrandLockup } from '../../components/navigation/BrandLockup'
import { SocialLinks } from '../../components/navigation/SocialLinks'
import { NavDropdown } from '../../components/navigation/NavDropdown'
import { AmbientVideo } from '../../components/media/AmbientVideo'
import { UbicacionMapa } from './UbicacionMapa'
import { NAV_GROUPS } from '../../app/layout/navigation'
import { usePageMeta } from '../../lib/usePageMeta'
import { usePlatformTransition } from '../../components/feedback/PlatformTransition'
import { CookieConsent } from '../../components/feedback/CookieConsent'
import './inicio.scss'

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
    description: 'La manilla valida el acceso y registra cada intento sin exponer credenciales.',
    benefit: 'Entrada rápida y auditable.',
    to: '/operacion/accesos',
    cta: 'Abrir Acceso NFC',
  },
  {
    visual: 'iot',
    title: 'Telemetría IoT de máquinas',
    description: 'Sesiones, latencia y sincronización visibles por equipo y gateway.',
    benefit: 'Operación guiada por datos reales.',
    to: '/operacion/maquinas',
    cta: 'Abrir Telemetría',
    reverse: true,
  },
  {
    visual: 'riesgo',
    title: 'Riesgo médico con escalamiento',
    description: 'Alertas clínicas priorizadas por severidad, contexto y responsable.',
    benefit: 'Decisiones oportunas y trazables.',
    to: '/atencion/alertas',
    cta: 'Abrir Alertas médicas',
  },
  {
    visual: 'agenda',
    title: 'Agenda y capacidad',
    description: 'Reservas por franja y aforo por zona, sin conflictos ni sobrecupo.',
    benefit: 'Disponibilidad clara de un vistazo.',
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
      'Localizar la manilla',
      'Revisar la consecuencia',
      'Confirmar y auditar',
    ],
    to: '/operacion/accesos',
    label: 'Ir a Acceso NFC',
  },
  {
    icon: 'alerta',
    title: 'Atender una alerta médica crítica',
    steps: [
      'Priorizar por severidad',
      'Revisar contexto clínico',
      'Resolver con trazabilidad',
    ],
    to: '/atencion/alertas',
    label: 'Ir a Alertas médicas',
  },
  {
    icon: 'gateway',
    title: 'Inspeccionar un gateway desconectado',
    steps: [
      'Detectar la desconexión',
      'Revisar zona y sincronización',
      'Escalar a mantenimiento',
    ],
    to: '/operacion/maquinas',
    label: 'Ir a Telemetría',
  },
]

const SEGURIDAD: Array<{ term: string; def: string; icon: IconName }> = [
  {
    term: 'Control por roles',
    def: 'Cada persona accede solo a los módulos autorizados por el servidor.',
    icon: 'escudo',
  },
  {
    term: 'Trazabilidad',
    def: 'Cada acción relevante conserva actor, momento y recurso.',
    icon: 'reloj',
  },
  {
    term: 'Consentimiento',
    def: 'Los datos de salud requieren consentimiento vigente y revocable.',
    icon: 'privacidad',
  },
  {
    term: 'Datos sensibles',
    def: 'Credenciales, tokens y valores NFC nunca se muestran en pantalla.',
    icon: 'nfc',
  },
  {
    term: 'Auditoría',
    def: 'El historial permite reconstruir decisiones operativas y clínicas.',
    icon: 'auditoria',
  },
]

const CUSTOM_MODULE_VISUALS: Partial<Record<ModuleVisualName, typeof NfcCard>> = {
  nfc: NfcCard,
  iot: IotCard,
  riesgo: RiesgoMedicoCard,
  agenda: AgendaCard,
}

function FeaturedModuleVisual({ name }: { name: ModuleVisualName }) {
  const Visual = CUSTOM_MODULE_VISUALS[name]

  return (
    <div className={`mod-row__visual${Visual ? ' mod-row__visual--custom' : ''}`}>
      {Visual ? <Visual /> : <ModuleVisual name={name} />}
    </div>
  )
}

interface MediaBandProps {
  id: string
  title: string
  body: string
  desktopSrc: string
  mobileSrc: string
  posterStem: string
  align?: 'left' | 'right'
}

function MediaBand({
  id,
  title,
  body,
  desktopSrc,
  mobileSrc,
  posterStem,
  align = 'left',
}: MediaBandProps) {
  return (
    <section className={`inicio-media-band inicio-media-band--${align}`} aria-labelledby={id}>
      <AmbientVideo
        className="inicio-media-band__media"
        desktopSrc={desktopSrc}
        mobileSrc={mobileSrc}
        posterStem={posterStem}
      />
      <div className="inicio-media-band__overlay" />
      <div className="inicio-media-band__copy" data-reveal>
        <h2 id={id}>{title}</h2>
        <p>{body}</p>
      </div>
    </section>
  )
}

export default function InicioPage() {
  usePageMeta(
    'SmartGym · Tecnología deportiva UCACUE',
    'Ecosistema universitario de tecnología deportiva: acceso NFC, telemetría IoT, salud y exergames XR en la Universidad Católica de Cuenca.',
  )
  const pageRef = useRef<HTMLDivElement>(null)
  const enterPlatform = usePlatformTransition()
  const goIngresar = (event: React.MouseEvent) => {
    event.preventDefault()
    enterPlatform('/ingresar')
  }

  /* Anclas internas: scroll manejado aquí en un solo clic. Sin esto,
     ScrollRestoration (router) anula el salto nativo del primer clic. */
  const goToAnchor = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href')
    if (!href?.startsWith('#')) return
    const target = document.getElementById(href.slice(1))
    if (!target) return
    event.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', href)
  }

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
        const heroMedia = page.querySelector<HTMLElement>('.inicio-hero__media video, .inicio-hero__media img')

        /* Intro del hero: fromTo + clearProps para que nada quede invisible. */
        if (desktop) {
          const intro = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.5 } })
          if (heroMedia) {
            intro.fromTo(heroMedia, { scale: 1.12, autoAlpha: 0.4 }, { scale: 1.06, autoAlpha: 1, duration: 1.1, ease: 'power2.out' })
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
        if (desktop && heroMedia) {
          gsap.to(heroMedia, {
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
        if (fine && heroMedia) {
          const xTo = gsap.quickTo(heroMedia, 'x', { duration: 1, ease: 'power3.out' })
          const yTo = gsap.quickTo(heroMedia, 'y', { duration: 1, ease: 'power3.out' })
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
      // Revelado editorial por sección (elementos sueltos). clearProps al
      // terminar: ningún transform residual puede desalinear el layout.
      gsap.utils.toArray<HTMLElement>('[data-reveal]', page).forEach((el) => {
        gsap.from(el, {
          y: 18,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto',
          /* immediateRender: false = el contenido nunca queda pre-oculto;
             si el trigger no llega a disparar, la sección sigue visible. */
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onComplete: () => gsap.set(el, { clearProps: 'all' }),
        })
      })

      // Grupos con stagger corto y temprano: la cascada termina antes de que
      // la fila esté en zona de lectura (nada queda a media altura).
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]', page).forEach((group) => {
        gsap.from(group.children, {
          y: 16,
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power3.out',
          overwrite: 'auto',
          immediateRender: false,
          scrollTrigger: { trigger: group, start: 'top 96%', once: true },
          onComplete: () => gsap.set(group.children, { clearProps: 'all' }),
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
        <BrandLockup />
        <nav className="inicio-nav__links" aria-label="Secciones de la presentación">
          <NavDropdown
            label="Módulos"
            triggerClassName="inicio-nav__link"
            items={NAV_GROUPS.flatMap((group) => group.items)}
          />
          <a className="inicio-nav__link" href="#flujos" onClick={goToAnchor}>
            Flujos
          </a>
          <a className="inicio-nav__link" href="#seguridad" onClick={goToAnchor}>
            Seguridad
          </a>
          <a className="inicio-nav__link" href="#ubicacion" onClick={goToAnchor}>
            Ubicación
          </a>
        </nav>
        <div className="ms-auto d-flex align-items-center gap-2">
          <ThemeToggle />
          <AppButton to="/ingresar" size="sm" onClick={goIngresar}>
            Ingresar
          </AppButton>
        </div>
      </header>

      <main id="contenido-principal">
        {/* ---------- Hero audiovisual ---------- */}
        <section className="inicio-hero" aria-labelledby="hero-titulo">
          <div className="inicio-hero__media" aria-hidden="true">
            <AmbientVideo
              className="inicio-hero__video"
              desktopSrc="/media/smartgym-piscina-loop.mp4"
              mobileSrc="/media/smartgym-piscina-loop-mobile.mp4"
              posterStem="smartgym-piscina"
              priority
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
              Acceso, salud, telemetría y control para el campus deportivo.
            </p>
            <div className="inicio-hero__ctas">
              <AppButton to="/ingresar" size="lg" iconEnd="flechaDerecha" onClick={goIngresar}>
                Ingresar a la plataforma
              </AppButton>
              <a className="sg-btn sg-btn--secondary sg-btn--lg" href="#modulos" onClick={goToAnchor}>
                Explorar módulos
              </a>
            </div>
          </div>
          <div className="inicio-scrollcue" aria-hidden="true">
            Desplaza
          </div>
        </section>

        {/* ---------- Ecosistema: baraja de cards ---------- */}
        <EcosystemCards />

        <MediaBand
          id="campus-en-movimiento"
          title="El campus también entrena"
          body="Espacios y personas conectados por una misma operación."
          desktopSrc="/media/smartgym-campus-loop.mp4"
          mobileSrc="/media/smartgym-campus-loop-mobile.mp4"
          posterStem="smartgym-campus"
        />

        {/* ---------- Módulos ---------- */}
        <section id="modulos" className="inicio-section" aria-labelledby="modulos-titulo">
          <div className="inicio-section__inner">
            <div data-reveal>
              <h2 id="modulos-titulo">Módulos que operan como un solo producto</h2>
              <p className="inicio-section__lead">
                Una experiencia coherente para toda la operación.
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
                <FeaturedModuleVisual name={mod.visual} />
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
                Decisiones importantes resueltas en tres pasos.
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

        <MediaBand
          id="entrenamiento-con-evidencia"
          title="Cada sesión deja evidencia"
          body="Entrenar, registrar y mejorar sin interrumpir el ritmo."
          desktopSrc="/media/smartgym-entrenamiento-loop.mp4"
          mobileSrc="/media/smartgym-entrenamiento-loop-mobile.mp4"
          posterStem="smartgym-piscina"
          align="right"
        />

        {/* ---------- Manifiesto operativo: declaración editorial ---------- */}
        <section className="inicio-section inicio-manifiesto" aria-labelledby="manifiesto-titulo">
          <div className="inicio-section__inner" data-reveal>
            <h2 id="manifiesto-titulo" className="inicio__display inicio-manifiesto__titulo">
              Datos reales <span>o nada.</span>
            </h2>
            <p className="inicio-manifiesto__texto">
              SmartGym no muestra métricas simuladas: cada número del centro de control nace de
              un acceso NFC, una máquina conectada o una alerta médica real.
            </p>
            <AppButton variant="tertiary" to="/panel" iconEnd="flechaDerecha">
              Abrir el centro de control
            </AppButton>
          </div>
        </section>

        {/* ---------- Seguridad y privacidad ---------- */}
        <section id="seguridad" className="inicio-section" aria-labelledby="seguridad-titulo">
          <div className="inicio-section__inner">
            <div data-reveal>
              <h2 id="seguridad-titulo">Seguridad institucional, no candados decorativos</h2>
              <p className="inicio-section__lead">
                Reglas visibles para proteger salud, identidad y acceso.
              </p>
            </div>
            <div className="seguridad-grid" data-reveal-group>
              {SEGURIDAD.map((item, index) => (
                <article key={item.term} className="seg-card">
                  <div className="seg-card__content">
                    <div className="seg-card__top">
                      <span className="seg-card__num">{String(index + 1).padStart(2, '0')}.</span>
                      <h3>{item.term}</h3>
                    </div>
                    <div className="seg-card__bottom">
                      <p className="seg-card__def">{item.def}</p>
                      <svg
                        className="seg-card__dots"
                        aria-hidden="true"
                        viewBox="0 0 32 32"
                        width="26"
                        height="26"
                      >
                        {[5, 16, 27].flatMap((cy) =>
                          [5, 16, 27].map((cx) => (
                            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill="currentColor" />
                          )),
                        )}
                      </svg>
                    </div>
                  </div>
                  <span className="seg-card__icon" aria-hidden="true">
                    <Icon name={item.icon} size={46} />
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Ubicación ---------- */}
        <UbicacionMapa />

        {/* ---------- Cierre ---------- */}
        <section className="inicio-section inicio-cierre" aria-labelledby="cierre-titulo">
          <div className="inicio-section__inner inicio-cierre__content" data-reveal>
            <h2 id="cierre-titulo" className="inicio__display">
              Acceder a SmartGym
            </h2>
            <p className="mt-3 mb-4">
              Deporte, salud y tecnología con trazabilidad.
            </p>
            <AppButton to="/ingresar" size="lg" iconEnd="flechaDerecha" onClick={goIngresar}>
              Ingresar a la plataforma
            </AppButton>
          </div>
        </section>
      </main>

      <footer className="inicio-footer">
        <div className="inicio-footer__inner">
          <div className="inicio-footer__marca">
            <BrandLockup size="sm" />
            <p>
              Plataforma deportiva de la Universidad Católica de Cuenca.
            </p>
            <address className="inicio-footer__direccion">
              Av. González Suárez y Araucana · Cuenca, Ecuador
              <br />
              <a
                href={
                  'https://www.google.com/maps/search/?api=1&query=' +
                  encodeURIComponent('Av. González Suárez y Araucana, Cuenca, Ecuador')
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver en el mapa
                <Icon name="flechaDerecha" size={14} />
              </a>
            </address>
          </div>
          <nav className="inicio-footer__grupo" aria-label="Plataforma">
            <h3>Plataforma</h3>
            <ul>
              <li>
                <Link to="/ingresar" onClick={goIngresar}>
                  Ingresar
                </Link>
              </li>
              <li>
                <Link to="/panel">Centro de control</Link>
              </li>
              <li>
                <Link to="/administracion/privacidad">Privacidad y consentimientos</Link>
              </li>
              <li>
                <Link to="/administracion/auditoria">Auditoría</Link>
              </li>
            </ul>
          </nav>
          <nav className="inicio-footer__grupo" aria-label="Secciones de esta página">
            <h3>Recorrido</h3>
            <ul>
              <li>
                <a href="#modulos" onClick={goToAnchor}>
                  Módulos
                </a>
              </li>
              <li>
                <a href="#flujos" onClick={goToAnchor}>
                  Flujos críticos
                </a>
              </li>
              <li>
                <a href="#seguridad" onClick={goToAnchor}>
                  Seguridad
                </a>
              </li>
              <li>
                <a href="#ubicacion" onClick={goToAnchor}>
                  Ubicación
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="inicio-footer__legal">
          <span>© 2026 Universidad Católica de Cuenca · SmartGym</span>
          <SocialLinks />
        </div>
      </footer>

      <CookieConsent />
    </div>
  )
}
