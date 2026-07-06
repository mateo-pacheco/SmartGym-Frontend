import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import { gsap } from '../../lib/gsap'
import { AppButton } from '../../components/actions/AppButton'
import { ContourField } from '../../components/visual/ContourField'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { Icon } from '../../components/icons/Icon'
import brandMark from '../../assets/brand/smartgym-mark.svg'
import './ingresar.scss'

/* Página de acceso. Honestidad de integración: el contrato de autenticación
   no existe todavía, así que el envío lo declara y ofrece el modo desarrollo.
   Entrada coreografiada suave (stagger corto), reduced-motion respetado. */

const VISUAL_URL =
  'https://images.unsplash.com/photo-1560281105-d58d81dfc5bc?auto=format&fit=crop&w=1400&q=70'
const VISUAL_SRCSET = [900, 1400, 2000]
  .map(
    (w) =>
      `https://images.unsplash.com/photo-1560281105-d58d81dfc5bc?auto=format&fit=crop&w=${w}&q=70 ${w}w`,
  )
  .join(', ')

interface Campos {
  correo: string
  clave: string
}

export default function IngresarPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [campos, setCampos] = useState<Campos>({ correo: '', clave: '' })
  const [errores, setErrores] = useState<Partial<Campos>>({})
  const [verClave, setVerClave] = useState(false)
  const [avisoVisible, setAvisoVisible] = useState(false)

  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page) return
    const mm = gsap.matchMedia(page)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.5 } })
      tl.fromTo(
        '.ingresar__panel > *',
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.06 },
      ).fromTo(
        '.ingresar__visual-caption',
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6 },
        '-=0.35',
      )
      tl.eventCallback('onComplete', () => {
        gsap.set(page.querySelectorAll('.ingresar__panel > *, .ingresar__visual-caption'), {
          clearProps: 'all',
        })
      })
    })
    return () => mm.revert()
  }, [])

  const set = (k: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCampos((c) => ({ ...c, [k]: e.target.value }))
    setErrores((err) => ({ ...err, [k]: undefined }))
  }

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    const err: Partial<Campos> = {}
    if (!/^\S+@\S+\.\S+$/.test(campos.correo.trim())) {
      err.correo = 'Escribe tu correo institucional completo.'
    }
    if (campos.clave.length < 8) {
      err.clave = 'La contraseña debe tener al menos 8 caracteres.'
    }
    setErrores(err)
    setAvisoVisible(Object.keys(err).length === 0)
  }

  return (
    <div ref={pageRef} className="ingresar">
      <div className="ingresar__form-col">
        <ContourField />
        <Link to="/inicio" className="ingresar__brand">
          <img src={brandMark} alt="" width="30" height="30" />
          SmartGym
        </Link>

        <Form className="ingresar__panel" onSubmit={enviar} noValidate>
          <h1>Ingresar a SmartGym</h1>
          <p className="ingresar__lead">
            Plataforma deportiva de la Universidad Católica de Cuenca. Usa tu cuenta institucional.
          </p>

          <Form.Group controlId="ingresar-correo">
            <Form.Label className="sg-field-label">Correo institucional</Form.Label>
            <Form.Control
              type="email"
              autoComplete="username"
              placeholder="nombre.apellido@ucacue.edu.ec"
              value={campos.correo}
              onChange={set('correo')}
              isInvalid={!!errores.correo}
            />
            <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="ingresar-clave">
            <Form.Label className="sg-field-label">Contraseña</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={verClave ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                value={campos.clave}
                onChange={set('clave')}
                isInvalid={!!errores.clave}
                style={{ paddingRight: 76 }}
              />
              <button
                type="button"
                className="ingresar__password-toggle"
                onClick={() => setVerClave((v) => !v)}
                aria-pressed={verClave}
              >
                {verClave ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <Form.Control.Feedback type="invalid" className={errores.clave ? 'd-block' : ''}>
              {errores.clave}
            </Form.Control.Feedback>
          </Form.Group>

          {avisoVisible ? (
            <div className="ingresar__aviso" role="status">
              <StatusBadge tone="info" label="Autenticación aún no disponible" icon="privacidad" />
              <span>
                El contrato del servicio de autenticación no está confirmado, así que ninguna
                credencial se envía ni se valida. Mientras tanto puedes explorar la plataforma en
                modo desarrollo.
              </span>
            </div>
          ) : null}

          <AppButton type="submit" size="lg" icon="privacidad">
            Ingresar
          </AppButton>

          <span className="ingresar__divider">o</span>

          <AppButton variant="secondary" to="/panel" iconEnd="flechaDerecha">
            Explorar en modo desarrollo
          </AppButton>

          <p className="ingresar__legal">
            El acceso queda registrado en la auditoría del sistema. Los datos de salud se tratan
            según los consentimientos vigentes.
          </p>
        </Form>
      </div>

      <div className="ingresar__visual" aria-hidden="true">
        <img
          src={VISUAL_URL}
          srcSet={VISUAL_SRCSET}
          sizes="(min-width: 992px) 55vw, 0px"
          alt=""
          width="1400"
          height="933"
          loading="lazy"
        />
        <ContourField tone="inverse" />
        <div className="ingresar__visual-caption">
          <span
            className="d-inline-flex align-items-center gap-2 mb-2"
            style={{ color: 'rgb(255 247 248 / 85%)' }}
          >
            <Icon name="pulso" size={16} />
          </span>
          <strong>Campus deportivo UCACUE</strong>
          <span>
            Acceso, salud y telemetría del gimnasio universitario operando como un solo sistema
            trazable.
          </span>
        </div>
      </div>
    </div>
  )
}
