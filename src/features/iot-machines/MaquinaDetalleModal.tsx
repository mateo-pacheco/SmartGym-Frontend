import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { AppButton } from '../../components/actions/AppButton'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { DataTable } from '../../components/data-display/DataTable'
import { useToast } from '../../app/providers/useToast'
import { useAuth } from '../../services/api/useAuth'
import { useMutation } from '../../services/api/useMutation'
import { iotAlertas, iotTelemetria } from '../../services/api/endpoints'
import { BotonesReporte } from '../../components/actions/BotonesReporte'
import { ApiError } from '../../services/api/http'
import { estadoVisual } from '../../lib/estadoVisual'
import type {
  AlertaMantenimientoResponseDTO,
  LecturaTelemetriaResponseDTO,
  MaquinaResponseDTO,
} from '../../services/api/types'

interface Props {
  maquina: MaquinaResponseDTO | null
  onHide: () => void
  onCambio: () => void
}

const fecha = (iso: string) => new Date(iso).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })

/* Detalle de una máquina: telemetría reciente + alertas de mantenimiento con
   acciones reales (evaluar, cambiar estado). Todo consulta y escribe al backend. */
export function MaquinaDetalleModal({ maquina, onHide, onCambio }: Props) {
  const { esAdministrador } = useAuth()
  const { showToast } = useToast()
  const [telemetria, setTelemetria] = useState<LecturaTelemetriaResponseDTO[]>([])
  const [alertas, setAlertas] = useState<AlertaMantenimientoResponseDTO[]>([])
  const [cargando, setCargando] = useState(false)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)

  const evaluar = useMutation((id: string) => iotAlertas.evaluarMaquina(id))
  const cambiarEstado = useMutation((id: string, estado: string) =>
    iotAlertas.actualizarEstado(id, { estado: estado as never }),
  )

  useEffect(() => {
    if (!maquina) return
    const controller = new AbortController()
    let activo = true
    setCargando(true)
    setErrorCarga(null)
    Promise.all([
      iotTelemetria.porMaquina(maquina.id, { size: 8 }),
      iotAlertas.porMaquina(maquina.id),
    ])
      .then(([tele, ale]) => {
        if (!activo) return
        setTelemetria(tele.content)
        setAlertas(ale)
      })
      .catch((e: unknown) => {
        if (!activo || controller.signal.aborted) return
        setErrorCarga(e instanceof ApiError ? e.userMessage : 'No se pudo cargar el detalle.')
      })
      .finally(() => activo && setCargando(false))
    return () => {
      activo = false
      controller.abort()
    }
  }, [maquina])

  const recargar = () => {
    if (!maquina) return
    iotAlertas.porMaquina(maquina.id).then(setAlertas).catch(() => undefined)
    onCambio()
  }

  const alEvaluar = async () => {
    if (!maquina) return
    try {
      await evaluar.ejecutar(maquina.id)
      showToast({ title: 'Evaluación ejecutada', body: 'El backend re-evaluó las alertas de la máquina.' })
      recargar()
    } catch {
      /* error ya reflejado en evaluar.error */
    }
  }

  const alCambiarEstado = async (id: string, estado: string) => {
    try {
      await cambiarEstado.ejecutar(id, estado)
      showToast({ title: 'Alerta actualizada', body: `Nuevo estado: ${estadoVisual(estado).etiqueta}.` })
      recargar()
    } catch {
      /* error ya reflejado */
    }
  }

  const vis = maquina ? estadoVisual(maquina.estadoConexion) : null

  return (
    <Modal show={!!maquina} onHide={onHide} centered size="lg" aria-labelledby="titulo-maquina">
      <Modal.Header closeButton>
        <Modal.Title id="titulo-maquina" className="fs-5">
          {maquina?.nombre}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-grid gap-3">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {vis ? <StatusBadge tone={vis.tono} label={`Conexión: ${vis.etiqueta}`} /> : null}
          {maquina ? (
            <StatusBadge tone={estadoVisual(maquina.estadoCalibracion).tono} label={`Calibración: ${estadoVisual(maquina.estadoCalibracion).etiqueta}`} />
          ) : null}
          <span className="sg-note--muted">{maquina?.tipo} · {maquina?.ubicacion}</span>
        </div>

        {errorCarga ? <p className="sg-form-note text-danger m-0" role="alert">{errorCarga}</p> : null}

        <div>
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <h3 className="sg-field-label m-0">Telemetría reciente</h3>
            <BotonesReporte pdf={iotTelemetria.reportePdf} excel={iotTelemetria.reporteExcel} />
          </div>
          <DataTable
            caption={`Últimas lecturas de telemetría de ${maquina?.nombre ?? ''}`}
            pageSize={5}
            columns={[
              { key: 'tipo', header: 'Tipo' },
              { key: 'valor', header: 'Valor', align: 'end' },
              { key: 'origen', header: 'Origen' },
              { key: 'cuando', header: 'Capturado' },
            ]}
            rows={telemetria.map((t) => ({
              tipo: estadoVisual(t.tipoDato).etiqueta,
              valor: `${t.valor} ${t.unidad}`,
              origen: estadoVisual(t.origen).etiqueta,
              cuando: fecha(t.capturadoEn),
            }))}
            loading={cargando ? <p className="sg-note--muted p-3 m-0">Cargando telemetría…</p> : undefined}
            emptyState={<p className="sg-note--muted p-3 m-0">Sin lecturas de telemetría para esta máquina.</p>}
          />
        </div>

        <div>
          <div className="d-flex align-items-center justify-content-between gap-2">
            <h3 className="sg-field-label m-0">Alertas de mantenimiento</h3>
            {esAdministrador ? (
              <AppButton variant="tertiary" size="sm" icon="check" onClick={alEvaluar} disabled={evaluar.enviando}>
                {evaluar.enviando ? 'Evaluando…' : 'Evaluar máquina'}
              </AppButton>
            ) : null}
          </div>
          {evaluar.error ? <p className="sg-form-note text-danger m-0 mt-1" role="alert">{evaluar.error}</p> : null}
          {cambiarEstado.error ? <p className="sg-form-note text-danger m-0 mt-1" role="alert">{cambiarEstado.error}</p> : null}
          <ul className="sg-plain-list d-grid gap-2 mt-2 m-0 p-0">
            {alertas.length === 0 ? (
              <li className="sg-note--muted">Sin alertas de mantenimiento para esta máquina.</li>
            ) : (
              alertas.map((a) => (
                <li key={a.id} className="sg-surface--inset p-2 d-flex flex-wrap gap-2 align-items-center justify-content-between">
                  <span>
                    <StatusBadge tone={estadoVisual(a.estado).tono} label={estadoVisual(a.estado).etiqueta} />
                    <span className="ms-2">{estadoVisual(a.tipoAlerta).etiqueta} — {a.descripcion}</span>
                  </span>
                  {esAdministrador && a.estado !== 'CERRADA' ? (
                    <span className="d-flex gap-1">
                      {a.estado !== 'EN_PROCESO' ? (
                        <AppButton variant="ghost" size="sm" onClick={() => alCambiarEstado(a.id, 'EN_PROCESO')} disabled={cambiarEstado.enviando}>En proceso</AppButton>
                      ) : null}
                      <AppButton variant="ghost" size="sm" onClick={() => alCambiarEstado(a.id, 'RESUELTA')} disabled={cambiarEstado.enviando}>Resolver</AppButton>
                    </span>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <AppButton variant="secondary" onClick={onHide}>Cerrar</AppButton>
      </Modal.Footer>
    </Modal>
  )
}
