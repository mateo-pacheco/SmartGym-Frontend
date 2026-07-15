import { useState } from 'react'
import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { MetricInline } from '../../components/data-display/MetricInline'
import { AppButton } from '../../components/actions/AppButton'
import { FormModal, type ValoresForm } from '../../components/forms/FormModal'
import { MaquinaDetalleModal } from './MaquinaDetalleModal'
import { useToast } from '../../app/providers/useToast'
import { useApiData } from '../../services/api/useApiData'
import { useAuth } from '../../services/api/useAuth'
import { useMutation } from '../../services/api/useMutation'
import { iotAlertas, iotMaquinas } from '../../services/api/endpoints'
import { BotonesReporte } from '../../components/actions/BotonesReporte'
import { estadoVisual, estaConectado } from '../../lib/estadoVisual'
import { CONEXION, CALIBRACION, TIPO_ALERTA_MANT } from '../../lib/opcionesContrato'
import type {
  AlertaMantenimientoResponseDTO,
  MaquinaRequestDTO,
  MaquinaResponseDTO,
} from '../../services/api/types'

export default function MaquinasPage() {
  const { esAdministrador } = useAuth()
  const { showToast } = useToast()
  const maquinas = useApiData(() => iotMaquinas.listar())
  const alertas = useApiData(() => iotAlertas.abiertas())

  const [seleccion, setSeleccion] = useState<MaquinaResponseDTO | null>(null)
  const [formMaquina, setFormMaquina] = useState(false)
  const [formAlerta, setFormAlerta] = useState(false)

  const crearMaquina = useMutation((body: MaquinaRequestDTO) => iotMaquinas.crear(body))
  const crearAlerta = useMutation((body: Parameters<typeof iotAlertas.registrar>[0]) => iotAlertas.registrar(body))
  const cambiarEstado = useMutation((id: string, estado: string) =>
    iotAlertas.actualizarEstado(id, { estado: estado as never }),
  )

  const lista = maquinas.datos ?? []
  const enLinea = lista.filter((m) => estaConectado(m.estadoConexion))
  const calibradas = lista.filter((m) => m.estadoCalibracion === 'CALIBRADA')

  const filas = lista.map((m) => {
    const vis = estadoVisual(m.estadoConexion)
    return {
      maquina: m.nombre,
      zona: m.ubicacion,
      tipo: m.tipo,
      sincronizacion: m.fechaUltimoMantenimiento
        ? new Date(m.fechaUltimoMantenimiento).toLocaleDateString('es-EC')
        : 'Sin mantenimiento registrado',
      estado: <StatusBadge tone={vis.tono} label={vis.etiqueta} icon={estaConectado(m.estadoConexion) ? 'check' : 'gateway'} />,
      acciones: (
        <AppButton variant="tertiary" size="sm" onClick={() => setSeleccion(m)}>
          Ver detalle
        </AppButton>
      ),
    }
  })

  const guardarMaquina = async (v: ValoresForm) => {
    try {
      await crearMaquina.ejecutar({
        nombre: v.nombre,
        tipo: v.tipo,
        ubicacion: v.ubicacion,
        estadoConexion: v.estadoConexion as MaquinaRequestDTO['estadoConexion'],
        estadoCalibracion: v.estadoCalibracion as MaquinaRequestDTO['estadoCalibracion'],
      })
      showToast({ title: 'Máquina registrada', body: `${v.nombre} se guardó en el backend.` })
      setFormMaquina(false)
      maquinas.recargar()
    } catch {
      /* error en crearMaquina.error */
    }
  }

  const guardarAlerta = async (v: ValoresForm) => {
    try {
      await crearAlerta.ejecutar({
        maquinaId: v.maquinaId,
        tipoAlerta: v.tipoAlerta as never,
        descripcion: v.descripcion,
      })
      showToast({ title: 'Alerta registrada', body: 'La alerta de mantenimiento se creó en el backend.' })
      setFormAlerta(false)
      alertas.recargar()
    } catch {
      /* error en crearAlerta.error */
    }
  }

  const resolver = async (a: AlertaMantenimientoResponseDTO, estado: string) => {
    try {
      await cambiarEstado.ejecutar(a.id, estado)
      showToast({ title: 'Alerta actualizada', body: `Nuevo estado: ${estadoVisual(estado).etiqueta}.` })
      alertas.recargar()
    } catch {
      /* error reflejado */
    }
  }

  return (
    <>
      <PageHeader
        title="Máquinas y telemetría"
        lead="Inventario IoT, telemetría por máquina y alertas de mantenimiento."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Operación' },
          { label: 'Máquinas y telemetría' },
        ]}
        actions={
          esAdministrador ? (
            <AppButton icon="mas" onClick={() => setFormMaquina(true)} disabled={maquinas.estado !== 'listo'}>
              Registrar máquina
            </AppButton>
          ) : undefined
        }
      />

      <ApiState estado={maquinas.estado} contract="Telemetría IoT" error={maquinas.error} onRetry={maquinas.recargar} />

      <MotionEffect fade slide={{ direction: 'down', offset: 14 }} delay={0.1}>
        <section aria-label="Indicadores de telemetría" className="sg-surface p-3 p-md-4 mb-4">
          <div className="row g-4">
            <div className="col-6 col-md-4"><MetricInline label="Equipos en línea" value={String(enLinea.length)} /></div>
            <div className="col-6 col-md-4"><MetricInline label="Máquinas calibradas" value={String(calibradas.length)} /></div>
            <div className="col-6 col-md-4"><MetricInline label="Inventario total" value={String(lista.length)} /></div>
          </div>
        </section>
      </MotionEffect>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
            <h2 className="sg-section-title m-0">Inventario conectado</h2>
            <BotonesReporte
              pdf={iotMaquinas.reportePdf}
              excel={iotMaquinas.reporteExcel}
              disabled={maquinas.estado !== 'listo'}
            />
          </div>
          <DataTable
            caption="Inventario de máquinas con su estado de telemetría"
            columns={[
              { key: 'maquina', header: 'Máquina' },
              { key: 'zona', header: 'Zona' },
              { key: 'tipo', header: 'Tipo' },
              { key: 'sincronizacion', header: 'Último mantenimiento' },
              { key: 'estado', header: 'Estado' },
              { key: 'acciones', header: '', align: 'end' },
            ]}
            rows={filas}
            emptyState={
              <NoContractState
                illustration="iot"
                title="Sin máquinas registradas"
                body="No existen máquinas registradas en el backend."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <MotionEffect fade slide={{ direction: 'right', offset: 18 }} delay={0.18}>
            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <h2 className="sg-section-title m-0">Alertas de mantenimiento</h2>
              <BotonesReporte pdf={iotAlertas.reportePdf} excel={iotAlertas.reporteExcel} />
              {esAdministrador ? (
                <AppButton variant="tertiary" size="sm" icon="mas" onClick={() => setFormAlerta(true)} disabled={maquinas.estado !== 'listo'}>
                  Registrar
                </AppButton>
              ) : null}
            </div>
            {cambiarEstado.error ? <p className="sg-form-note text-danger m-0 mt-2" role="alert">{cambiarEstado.error}</p> : null}
            <ul className="sg-plain-list d-grid gap-2 mt-2 m-0 p-0">
              {(alertas.datos ?? []).length === 0 ? (
                <li className="sg-note--muted sg-surface--inset p-3">Sin alertas de mantenimiento abiertas.</li>
              ) : (
                (alertas.datos ?? []).map((a) => (
                  <li key={a.id} className="sg-surface--inset p-2 d-grid gap-1">
                    <span>
                      <StatusBadge tone={estadoVisual(a.estado).tono} label={estadoVisual(a.estado).etiqueta} />
                      <span className="ms-2 sg-note">{estadoVisual(a.tipoAlerta).etiqueta}</span>
                    </span>
                    <span className="sg-note--muted">{a.descripcion}</span>
                    {esAdministrador && a.estado !== 'RESUELTA' && a.estado !== 'CERRADA' ? (
                      <span className="d-flex gap-1">
                        <AppButton variant="ghost" size="sm" onClick={() => resolver(a, 'EN_PROCESO')} disabled={cambiarEstado.enviando}>En proceso</AppButton>
                        <AppButton variant="ghost" size="sm" onClick={() => resolver(a, 'RESUELTA')} disabled={cambiarEstado.enviando}>Resolver</AppButton>
                      </span>
                    ) : null}
                  </li>
                ))
              )}
            </ul>
          </MotionEffect>
        </div>
      </div>

      <MaquinaDetalleModal maquina={seleccion} onHide={() => setSeleccion(null)} onCambio={() => { maquinas.recargar(); alertas.recargar() }} />

      <FormModal
        show={formMaquina}
        title="Registrar máquina"
        submitLabel="Registrar"
        enviando={crearMaquina.enviando}
        error={crearMaquina.error}
        onHide={() => setFormMaquina(false)}
        onSubmit={guardarMaquina}
        campos={[
          { key: 'nombre', label: 'Nombre', tipo: 'text', requerido: true },
          { key: 'tipo', label: 'Tipo', tipo: 'text', requerido: true, placeholder: 'CARDIO, FUERZA…', ancho: 'half' },
          { key: 'ubicacion', label: 'Ubicación', tipo: 'text', requerido: true, ancho: 'half' },
          { key: 'estadoConexion', label: 'Estado de conexión', tipo: 'select', requerido: true, opciones: CONEXION, ancho: 'half' },
          { key: 'estadoCalibracion', label: 'Estado de calibración', tipo: 'select', requerido: true, opciones: CALIBRACION, ancho: 'half' },
        ]}
      />

      <FormModal
        show={formAlerta}
        title="Registrar alerta de mantenimiento"
        submitLabel="Registrar"
        enviando={crearAlerta.enviando}
        error={crearAlerta.error}
        onHide={() => setFormAlerta(false)}
        onSubmit={guardarAlerta}
        campos={[
          { key: 'maquinaId', label: 'Máquina', tipo: 'select', requerido: true, opciones: lista.map((m) => ({ value: m.id, label: m.nombre })) },
          { key: 'tipoAlerta', label: 'Tipo de alerta', tipo: 'select', requerido: true, opciones: TIPO_ALERTA_MANT },
          { key: 'descripcion', label: 'Descripción', tipo: 'textarea', requerido: true },
        ]}
      />
    </>
  )
}
