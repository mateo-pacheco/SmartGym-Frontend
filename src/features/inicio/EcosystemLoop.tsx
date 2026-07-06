import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { Icon, type IconName } from '../../components/icons/Icon'
import brandMark from '../../assets/brand/smartgym-mark.svg'

/* Loop pseudo-3D del ecosistema SmartGym (v2).
   Técnica: CSS perspective + preserve-3d + transforms billboard
   rotateY(a) translateZ(r) rotateY(-a). Reprogramado para que la rotación
   esté DIRIGIDA por el scroll durante el pin: cada etapa gira la órbita hasta
   dejar sus nodos de frente, la profundidad se comunica con opacidad, y la
   sección termina con una revolución completa; solo entonces arranca el giro
   libre lento. En móvil no hay 3D: los nodos se ordenan en una retícula plana.
   Sin WebGL, sin canvas, sin librerías 3D. */

const NODES: Array<{ id: string; label: string; icon: IconName }> = [
  { id: 'nfc', label: 'Manilla NFC', icon: 'nfc' },
  { id: 'seguridad', label: 'Seguridad', icon: 'escudo' },
  { id: 'iot', label: 'Nodo IoT', icon: 'maquina' },
  { id: 'salud', label: 'Pulso médico', icon: 'pulso' },
  { id: 'planes', label: 'Planes', icon: 'planes' },
  { id: 'xr', label: 'Exergames XR', icon: 'xr' },
  { id: 'reportes', label: 'Reportes', icon: 'reportes' },
]

const STAGES = [
  {
    title: 'La identidad entra primero',
    body: 'La manilla NFC valida a cada deportista contra el control de acceso, sin exponer credenciales.',
  },
  {
    title: 'Las máquinas se conectan',
    body: 'Cada equipo reporta telemetría a su gateway: latencia, sesiones y estado de sincronización.',
  },
  {
    title: 'La salud vigila el sistema',
    body: 'El riesgo médico se escala con severidad y justificación, siempre visible para el equipo clínico.',
  },
  {
    title: 'Planes y evidencia cierran el ciclo',
    body: 'Revisión humana, sesiones XR y reportes trazables completan la operación diaria.',
  },
]

/* Nodos por etapa y ángulo de órbita que los deja de frente al espectador. */
const STEP = 360 / NODES.length
const STAGE_PLAN = [
  { nodes: [0, 1], angle: -0.5 * STEP },
  { nodes: [2], angle: -2 * STEP },
  { nodes: [3], angle: -3 * STEP },
  { nodes: [4, 5, 6], angle: -5 * STEP },
]
const FINAL_ANGLE = -360 // revolución completa: termina como empezó

const RING_LENGTH = 2 * Math.PI * 95

export function EcosystemLoop() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const mm = gsap.matchMedia(section)

    mm.add(
      {
        desktop: '(min-width: 992px)',
        motionOk: '(prefers-reduced-motion: no-preference)',
        fine: '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const { desktop, motionOk, fine } = ctx.conditions as {
          desktop: boolean
          motionOk: boolean
          fine: boolean
        }
        const nodes = gsap.utils.toArray<HTMLElement>('.loop-node', section)
        const chips = gsap.utils.toArray<HTMLElement>('.loop-node__chip', section)
        const caps = gsap.utils.toArray<HTMLElement>('.loop-caption', section)
        const hub = section.querySelector<HTMLElement>('.loop-hub')
        const ring = section.querySelector<SVGCircleElement>('.loop-ring-draw')
        const world = section.querySelector<HTMLElement>('.loop-world')

        if (!desktop) {
          // Móvil/tablet: retícula plana por CSS; se limpian transforms 3D.
          nodes.forEach((el) => {
            el.style.transform = ''
            el.style.opacity = ''
          })
          if (motionOk) {
            gsap.from(chips, {
              autoAlpha: 0,
              y: 14,
              stagger: 0.06,
              duration: 0.4,
              ease: 'power2.out',
              scrollTrigger: { trigger: section, start: 'top 75%', once: true },
            })
          }
          return
        }

        /* ---------- Desktop: escena 3D ---------- */
        const radius = 250
        const orbit = { angle: STAGE_PLAN[0].angle }
        const apply = () => {
          nodes.forEach((el, i) => {
            const a = orbit.angle + i * STEP
            // Profundidad: 1 = de frente, 0 = detrás del hub.
            const depth = (Math.cos((a * Math.PI) / 180) + 1) / 2
            el.style.transform = `translate(-50%, -50%) rotateY(${a}deg) translateZ(${radius}px) rotateY(${-a}deg)`
            el.style.opacity = String(0.3 + 0.7 * depth)
          })
        }
        apply()

        if (!motionOk) {
          // Reduced motion: composición estática completa, sin giro ni pin.
          return
        }

        // Giro libre muy lento: SOLO cuando la construcción ya terminó.
        const spin = gsap.to(orbit, {
          angle: '-=360',
          duration: 95,
          ease: 'none',
          repeat: -1,
          onUpdate: apply,
          paused: true,
        })
        let pinActive = false
        let buildDone = false
        let inView = false
        const syncSpin = () => {
          if (inView && buildDone && !pinActive) spin.play()
          else spin.pause()
        }
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            inView = self.isActive
            syncSpin()
          },
        })

        // Estados iniciales de la construcción.
        gsap.set(chips, { autoAlpha: 0, y: 18, scale: 0.94 })
        if (hub) gsap.set(hub, { autoAlpha: 0, scale: 0.86 })
        if (ring) gsap.set(ring, { strokeDasharray: RING_LENGTH, strokeDashoffset: RING_LENGTH })
        gsap.set(caps, { opacity: 0.32 })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=170%',
            scrub: 0.5,
            pin: true,
            onLeave: () => {
              buildDone = true
              pinActive = false
              syncSpin()
            },
            onEnterBack: () => {
              buildDone = false
              pinActive = true
              syncSpin()
            },
            onToggle: (self) => {
              pinActive = self.isActive && !buildDone
              syncSpin()
            },
          },
        })

        if (hub) tl.to(hub, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power2.out' })
        if (ring) tl.to(ring, { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, '<0.1')

        STAGE_PLAN.forEach((stage, i) => {
          const pos = i === 0 ? '<0.2' : '+=0.12'
          // La órbita gira hasta dejar los nodos de la etapa de frente.
          tl.to(orbit, { angle: stage.angle, duration: 0.6, onUpdate: apply }, pos)
          tl.to(caps[i], { opacity: 1, duration: 0.25, ease: 'power2.out' }, '<0.1')
          if (i > 0) tl.to(caps[i - 1], { opacity: 0.45, duration: 0.25 }, '<')
          tl.to(
            stage.nodes.map((n) => chips[n]),
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.12, ease: 'power2.out' },
            '<0.15',
          )
        })

        // Cierre: revolución completa; el sistema queda como al inicio, entero.
        tl.to(orbit, { angle: FINAL_ANGLE, duration: 0.8, onUpdate: apply })
        tl.to(caps[STAGES.length - 1], { opacity: 0.45, duration: 0.2 }, '<')
        tl.to(caps, { opacity: 1, duration: 0.3, stagger: 0.04 }, '<0.2')

        // El cursor inclina la escena con suavidad (±4°).
        let quitarPuntero: (() => void) | undefined
        if (fine && world) {
          const rotX = gsap.quickTo(world, 'rotationX', { duration: 0.8, ease: 'power3.out' })
          const rotY = gsap.quickTo(world, 'rotationY', { duration: 0.8, ease: 'power3.out' })
          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5
            const ny = e.clientY / window.innerHeight - 0.5
            rotY(nx * 7)
            rotX(ny * -5)
          }
          window.addEventListener('pointermove', onMove, { passive: true })
          quitarPuntero = () => window.removeEventListener('pointermove', onMove)
        }

        return () => quitarPuntero?.()
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} className="loop-section" aria-labelledby="loop-titulo">
      <div className="loop-stage">
        <div>
          <h2 id="loop-titulo">Un solo sistema, conectado de extremo a extremo</h2>
          <p className="inicio-section__lead" style={{ marginBottom: 28 }}>
            Del acceso con manilla a la evidencia auditable: cada pieza del ecosistema aparece a
            medida que recorres esta sección.
          </p>
          <ol className="loop-captions">
            {STAGES.map((stage) => (
              <li key={stage.title} className="loop-caption">
                <h3>{stage.title}</h3>
                <p>{stage.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div
          className="loop-scene"
          role="img"
          aria-label="Composición tridimensional de los módulos SmartGym orbitando alrededor del escudo institucional"
        >
          <div className="loop-world">
            <div className="loop-ground" aria-hidden="true">
              <svg viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="60" stroke="var(--sg-border-strong)" strokeWidth="1" strokeDasharray="2 5" />
                <circle
                  className="loop-ring-draw"
                  cx="100"
                  cy="100"
                  r="95"
                  stroke="var(--sg-brand)"
                  strokeWidth="1.6"
                  opacity="0.55"
                />
              </svg>
            </div>
            <div className="loop-hub">
              <img src={brandMark} alt="" width="60" height="60" />
              <span>SmartGym</span>
            </div>
            {NODES.map((node) => (
              <div key={node.id} className="loop-node">
                <div className="loop-node__chip">
                  <Icon name={node.icon} size={22} />
                  <strong>{node.label}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
