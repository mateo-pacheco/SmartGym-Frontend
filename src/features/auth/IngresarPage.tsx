import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { gsap } from '../../lib/gsap'
import { AppButton } from '../../components/actions/AppButton'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { Icon } from '../../components/icons/Icon'
import { BrandLockup } from '../../components/navigation/BrandLockup'
import { ResponsivePicture } from '../../components/media/ResponsivePicture'
import { usePageMeta } from '../../lib/usePageMeta'
import { usePlatformTransition } from '../../components/feedback/PlatformTransition'
import { iniciarSesion } from '../../services/api/auth'
import './ingresar.scss'

interface Campos {
  correo: string
  clave: string
}

type AuthView = 'login' | 'recovery' | 'confirmation'
type Notice = 'auth' | 'credenciales' | 'red' | null

const correoValido = (correo: string) => /^\S+@\S+\.\S+$/.test(correo.trim())

export default function IngresarPage() {
  usePageMeta(
    'Ingresar · SmartGym UCACUE',
    'Accede a la plataforma SmartGym de la Universidad Católica de Cuenca.',
  )
  const pageRef = useRef<HTMLDivElement>(null)
  const recoveryEmailRef = useRef<HTMLInputElement>(null)
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null)
  const reduceMotion = useReducedMotion()
  const [view, setView] = useState<AuthView>('login')
  const [campos, setCampos] = useState<Campos>({ correo: '', clave: '' })
  const [errores, setErrores] = useState<Partial<Campos>>({})
  const [verClave, setVerClave] = useState(false)
  const [recordar, setRecordar] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)
  const [enviando, setEnviando] = useState(false)
  const enterPlatform = usePlatformTransition()

  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page) return
    const mm = gsap.matchMedia(page)

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const items = page.querySelectorAll(
        '.ingresar__flow > *, .ingresar__panel-footer > *, .ingresar__visual-caption',
      )
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.48 } })
      tl.fromTo(
        items,
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.045 },
      )
      tl.eventCallback('onComplete', () => {
        gsap.set(items, { clearProps: 'all' })
      })
    })

    return () => mm.revert()
  }, [])

  const set = (key: keyof Campos) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCampos((current) => ({ ...current, [key]: event.target.value }))
    setErrores((current) => ({ ...current, [key]: undefined }))
    setNotice(null)
  }

  const abrirRecuperacion = () => {
    setErrores({})
    setNotice(null)
    setView('recovery')
  }

  const volverIngreso = () => {
    setErrores({})
    setNotice(null)
    setView('login')
  }

  const cambiarCorreo = () => {
    setView('recovery')
  }

  const enviarIngreso = async () => {
    const nextErrors: Partial<Campos> = {}

    if (!correoValido(campos.correo)) {
      nextErrors.correo = 'Escribe tu correo institucional completo.'
    }
    if (campos.clave.length < 8) {
      nextErrors.clave = 'La contraseña debe tener al menos 8 caracteres.'
    }

    setErrores(nextErrors)
    setNotice(null)
    if (Object.keys(nextErrors).length > 0) return

    setEnviando(true)
    const resultado = await iniciarSesion(campos.correo.trim(), campos.clave, recordar)
    setEnviando(false)

    if (resultado === 'ok') {
      enterPlatform('/panel')
      return
    }
    // 'sin-backend' conserva el aviso honesto original ('auth').
    setNotice(resultado === 'sin-backend' ? 'auth' : resultado)
  }

  const enviarRecuperacion = () => {
    if (!correoValido(campos.correo)) {
      setErrores({ correo: 'Escribe tu correo institucional completo.' })
      return
    }

    setErrores({})
    setView('confirmation')
  }

  const enviar = (event: React.FormEvent) => {
    event.preventDefault()
    if (view === 'login') void enviarIngreso()
    if (view === 'recovery') enviarRecuperacion()
  }

  const flowMotion = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 },
    transition: {
      duration: reduceMotion ? 0.12 : 0.26,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }

  return (
    <div ref={pageRef} className="ingresar">
      <div className="ingresar__form-col">
        <BrandLockup className="ingresar__brand" />

        <form className="ingresar__panel" onSubmit={enviar} noValidate>
          <AnimatePresence initial={false} mode="wait">
            {view === 'login' ? (
              <motion.div key="login" className="ingresar__flow" {...flowMotion}>
                <div className="ingresar__heading">
                  <h1>Ingresar a SmartGym</h1>
                  <p>Accede con tu cuenta institucional.</p>
                </div>

                <div className="ingresar__field">
                  <label htmlFor="ingresar-correo">Correo institucional</label>
                  <div
                    className={`ingresar__input${errores.correo ? ' ingresar__input--invalid' : ''}`}
                  >
                    <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
                      <path d="m30.853 13.87a15 15 0 0 0-29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0-1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1-4.158-.759v-10.856a1 1 0 0 0-2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1-6 6z" />
                    </svg>
                    <input
                      id="ingresar-correo"
                      type="email"
                      autoComplete="username"
                      placeholder="nombre.apellido@est.ucacue.edu.ec"
                      value={campos.correo}
                      onChange={set('correo')}
                      aria-invalid={!!errores.correo}
                      aria-describedby={errores.correo ? 'ingresar-correo-error' : undefined}
                    />
                  </div>
                  {errores.correo ? (
                    <span id="ingresar-correo-error" className="ingresar__error">
                      {errores.correo}
                    </span>
                  ) : null}
                </div>

                <div className="ingresar__field">
                  <label htmlFor="ingresar-clave">Contraseña</label>
                  <div
                    className={`ingresar__input${errores.clave ? ' ingresar__input--invalid' : ''}`}
                  >
                    <svg viewBox="-64 0 512 512" width="20" height="20" aria-hidden="true">
                      <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                      <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                    </svg>
                    <input
                      id="ingresar-clave"
                      type={verClave ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Tu contraseña"
                      value={campos.clave}
                      onChange={set('clave')}
                      aria-invalid={!!errores.clave}
                      aria-describedby={errores.clave ? 'ingresar-clave-error' : undefined}
                    />
                    <button
                      type="button"
                      className="ingresar__password-toggle"
                      onClick={() => setVerClave((visible) => !visible)}
                      aria-pressed={verClave}
                    >
                      {verClave ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  {errores.clave ? (
                    <span id="ingresar-clave-error" className="ingresar__error">
                      {errores.clave}
                    </span>
                  ) : null}
                </div>

                <div className="ingresar__options">
                  <label className="ingresar__remember" htmlFor="ingresar-recordar">
                    <input
                      id="ingresar-recordar"
                      type="checkbox"
                      checked={recordar}
                      onChange={(event) => setRecordar(event.target.checked)}
                    />
                    <span>Recordarme</span>
                  </label>
                  <button type="button" className="ingresar__forgot" onClick={abrirRecuperacion}>
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {notice === 'auth' ? (
                  <div className="ingresar__aviso" role="status">
                    <StatusBadge tone="info" label="Autenticación pendiente" icon="privacidad" />
                    <span>
                      El servicio de autenticación aún no está conectado; ninguna credencial fue
                      enviada.
                    </span>
                  </div>
                ) : null}
                {notice === 'credenciales' ? (
                  <div className="ingresar__aviso" role="alert">
                    <StatusBadge tone="danger" label="Credenciales inválidas" icon="privacidad" />
                    <span>El correo o la contraseña no coinciden con una cuenta autorizada.</span>
                  </div>
                ) : null}
                {notice === 'red' ? (
                  <div className="ingresar__aviso" role="alert">
                    <StatusBadge tone="warning" label="Sin conexión" icon="alerta" />
                    <span>
                      No se pudo contactar al servidor SmartGym. Verifica que la API esté en línea
                      y que su CORS permita este origen.
                    </span>
                  </div>
                ) : null}

                <AppButton type="submit" size="lg" icon="privacidad" disabled={enviando}>
                  {enviando ? 'Verificando…' : 'Ingresar'}
                </AppButton>
              </motion.div>
            ) : null}

            {view === 'recovery' ? (
              <motion.div
                key="recovery"
                className="ingresar__flow ingresar__flow--recovery"
                onAnimationComplete={() => recoveryEmailRef.current?.focus()}
                {...flowMotion}
              >
                <button type="button" className="ingresar__back" onClick={volverIngreso}>
                  <Icon name="flechaDerecha" size={18} />
                  <span>Volver a ingresar</span>
                </button>

                <div className="ingresar__heading">
                  <h1>Recuperar contraseña</h1>
                  <p>Ingresa el correo asociado a tu cuenta SmartGym.</p>
                </div>

                <div className="ingresar__field">
                  <label htmlFor="recuperar-correo">Correo institucional</label>
                  <div
                    className={`ingresar__input${errores.correo ? ' ingresar__input--invalid' : ''}`}
                  >
                    <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
                      <path d="m30.853 13.87a15 15 0 0 0-29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0-1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1-4.158-.759v-10.856a1 1 0 0 0-2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1-6 6z" />
                    </svg>
                    <input
                      ref={recoveryEmailRef}
                      id="recuperar-correo"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="nombre.apellido@est.ucacue.edu.ec"
                      value={campos.correo}
                      onChange={set('correo')}
                      aria-invalid={!!errores.correo}
                      aria-describedby={
                        errores.correo
                          ? 'recuperar-correo-error recuperar-correo-ayuda'
                          : 'recuperar-correo-ayuda'
                      }
                    />
                  </div>
                  {errores.correo ? (
                    <span id="recuperar-correo-error" className="ingresar__error">
                      {errores.correo}
                    </span>
                  ) : null}
                  <span id="recuperar-correo-ayuda" className="ingresar__field-help">
                    Las instrucciones solo podrán enviarse al correo registrado.
                  </span>
                </div>

                <div className="ingresar__recovery-note">
                  <Icon name="reloj" size={18} />
                  <span>El enlace será temporal y de un solo uso.</span>
                </div>

                <AppButton type="submit" size="lg" iconEnd="flechaDerecha">
                  Enviar instrucciones
                </AppButton>
              </motion.div>
            ) : null}

            {view === 'confirmation' ? (
              <motion.div
                key="confirmation"
                className="ingresar__flow ingresar__flow--confirmation"
                onAnimationComplete={() => confirmationHeadingRef.current?.focus()}
                {...flowMotion}
              >
                <div className="ingresar__confirmation-mark" aria-hidden="true">
                  <Icon name="check" size={28} />
                </div>

                <div className="ingresar__heading ingresar__heading--centered">
                  <h1 ref={confirmationHeadingRef} tabIndex={-1}>
                    Solicitud preparada
                  </h1>
                  <p>
                    Validamos <strong>{campos.correo.trim()}</strong> para recuperar el acceso.
                  </p>
                </div>

                <div className="ingresar__aviso" role="status">
                  <StatusBadge tone="info" label="Servicio pendiente" icon="reloj" />
                  <span>
                    El servicio institucional aún no está conectado; no se envió ningún correo.
                  </span>
                </div>

                <div className="ingresar__confirmation-actions">
                  <AppButton type="button" size="lg" onClick={volverIngreso} icon="privacidad">
                    Volver a ingresar
                  </AppButton>
                  <AppButton type="button" variant="secondary" onClick={cambiarCorreo}>
                    Usar otro correo
                  </AppButton>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="ingresar__panel-footer">
            <p className="ingresar__legal">Acceso institucional protegido y auditable.</p>
          </div>
        </form>
      </div>

      <div className="ingresar__visual" aria-hidden="true">
        <ResponsivePicture
          stem="smartgym-campus"
          alt=""
          sizes="(min-width: 992px) 55vw, 100vw"
          width={1600}
          height={904}
          loading="eager"
          decoding="async"
        />
        <div className="ingresar__visual-caption">
          <strong>Escuela Nacional del Deporte</strong>
          <span>Un campus conectado para entrenar, cuidar y medir.</span>
        </div>
      </div>
    </div>
  )
}
