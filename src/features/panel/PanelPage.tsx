import { useState } from 'react'
import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { MetricInline } from '../../components/data-display/MetricInline'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { BotonesReporte } from '../../components/actions/BotonesReporte'
import { useApiData } from '../../services/api/useApiData'
import { useAuth } from '../../services/api/useAuth'
import { useMutation } from '../../services/api/useMutation'
import { accesosNfc, agendamiento, iotFatiga, iotMaquinas, riskAlerts } from '../../services/api/endpoints'
import { estaConectado, estadoVisual } from '../../lib/estadoVisual'
import type { RegistroFatigaResponseDTO } from '../../services/api/types'

const hora = (iso: string) => new Date(iso).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })

export default function PanelPage() {
  const { id: sesionId } = useAuth()

  const resumen = useApiData(async () => {
    const [accesos, maquinas, alertas, espacios] = await Promise.allSettled([
      accesosNfc.consultar({ size: 10 }),
      iotMaquinas.listar(),
      riskAlerts.activas(),
      agendamiento.listarEspacios(),
    ])
    return {
      accesos: accesos.status === 'fulfilled' ? accesos.value : null,
      maquinas: maquinas.status === 'fulfilled' ? maquinas.value : [],
      alertas: alertas.status === 'fulfilled' ? alertas.value : [],
      espacios: espacios.status === 'fulfilled' ? espacios.value : [],
    }
  })
  const datos = resumen.datos

  const [fatiga, setFatiga] = useState<RegistroFatigaResponseDTO | null>(null)
  const [sinRegistro, setSinRegistro] = useState(false)
  /* Calcula el índice a partir de la telemetría del usuario. Si el backend no
     devuelve cuerpo, se recupera el último registro ya calculado. */
  const verFatiga = useMutation(async (usuarioId: string) => {
    const calculado = await iotFatiga.calcular({ usuarioId })
    return calculado ?? (await iotFatiga.ultimo(usuarioId))
  })

  const eventos = [
    ...(datos?.accesos?.content ?? []).slice(0, 4).map((a) => ({
      hora: hora(a.fechaHoraServidor),
      evento: `Acceso ${a.resultado.toLowerCase()}`,
      origen: a.maquinaId,
      estado: <StatusBadge tone={a.resultado === 'EXITOSO' ? 'success' : 'danger'} label={estadoVisual(a.resultado).etiqueta} />,
    })),
    ...(datos?.alertas ?? []).slice(0, 3).map((a) => ({
      hora: hora(a.fechaDeteccion),
      evento: a.descripcion ?? estadoVisual(a.tipoAlerta).etiqueta,
      origen: a.deportistaId,
      estado: <StatusBadge tone="warning" label={estadoVisual(a.nivelRiesgo).etiqueta} />,
    })),
  ]

  const obtenerFatiga = async () => {
    if (!sesionId) return
    setSinRegistro(false)
    try {
      const r = await verFatiga.ejecutar(sesionId)
      if (r) setFatiga(r)
      else setSinRegistro(true) // 204: aún no hay un registro calculado
    } catch { /* error en verFatiga.error */ }
  }

  return (
    <>
      <PageHeader
        title="Centro de control"
        lead="Accesos, telemetría, alertas y aforo del ecosistema SmartGym en una sola vista."
        breadcrumbs={[{ label: 'SmartGym', to: '/panel' }, { label: 'Centro de control' }]}
      />

      <ApiState estado={resumen.estado} contract="Indicadores operativos" error={resumen.error} onRetry={resumen.recargar} />

      <MotionEffect fade slide={{ direction: 'down', offset: 14 }} delay={0.06}>
        <section aria-label="Indicadores operativos" className="sg-surface p-3 p-md-4 mb-4">
          <div className="row g-4">
            <div className="col-6 col-lg-3"><MetricInline label="Accesos recientes" value={datos?.accesos ? String(datos.accesos.totalElements) : '—'} /></div>
            <div className="col-6 col-lg-3"><MetricInline label="Máquinas en línea" value={String((datos?.maquinas ?? []).filter((m) => estaConectado(m.estadoConexion)).length)} /></div>
            <div className="col-6 col-lg-3"><MetricInline label="Alertas médicas activas" value={String(datos?.alertas.length ?? 0)} /></div>
            <div className="col-6 col-lg-3"><MetricInline label="Espacios operativos" value={String(datos?.espacios.length ?? 0)} /></div>
          </div>
        </section>
      </MotionEffect>

      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="sg-section-title">Trazabilidad reciente</h2>
          <DataTable
            caption="Últimos eventos operativos registrados por el sistema"
            columns={[
              { key: 'hora', header: 'Hora' },
              { key: 'evento', header: 'Evento' },
              { key: 'origen', header: 'Origen' },
              { key: 'estado', header: 'Estado' },
            ]}
            rows={eventos}
            emptyState={
              <NoContractState
                illustration="auditoria"
                title="Aún no hay eventos recientes"
                body="Los accesos y alertas recientes aparecerán aquí en orden cronológico."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <MotionEffect fade slide={{ direction: 'right', offset: 18 }} delay={0.18}>
            <h2 className="sg-section-title">Mi índice de fatiga</h2>
            <div className="sg-surface--inset p-3 d-grid gap-3">
              {fatiga ? (
                <>
                  <dl className="sg-deflist m-0">
                    <div>
                      <dt>Nivel de fatiga</dt>
                      <dd>
                        <StatusBadge
                          tone={fatiga.nivelFatiga >= 70 ? 'danger' : fatiga.nivelFatiga >= 40 ? 'warning' : 'success'}
                          label={`${fatiga.nivelFatiga}/100`}
                        />
                      </dd>
                    </div>
                    <div><dt>Recomendación</dt><dd>{fatiga.recomendacion}</dd></div>
                  </dl>
                </>
              ) : (
                <p className="sg-note sg-note--muted m-0">
                  {sinRegistro
                    ? 'Aún no hay un índice de fatiga registrado para tu usuario.'
                    : 'Calcula tu índice de fatiga a partir de tu telemetría reciente registrada en el backend.'}
                </p>
              )}
              {verFatiga.error ? <p className="sg-form-note text-danger m-0" role="alert">{verFatiga.error}</p> : null}
              <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
                <AppButton size="sm" icon="pulso" onClick={obtenerFatiga} disabled={verFatiga.enviando || !sesionId}>
                  {verFatiga.enviando ? 'Calculando…' : 'Calcular mi fatiga'}
                </AppButton>
                <BotonesReporte pdf={iotFatiga.reportePdf} excel={iotFatiga.reporteExcel} />
              </div>
            </div>

            <h2 className="sg-section-title mt-4">Accesos directos</h2>
            <div className="sg-surface--inset p-3 d-grid gap-2">
              <AppButton variant="secondary" size="sm" to="/operacion/maquinas" iconEnd="flechaDerecha">Máquinas y telemetría</AppButton>
              <AppButton variant="secondary" size="sm" to="/atencion/alertas" iconEnd="flechaDerecha">Alertas médicas</AppButton>
              <AppButton variant="secondary" size="sm" to="/analisis/reportes" iconEnd="flechaDerecha">Reportes de gestión</AppButton>
            </div>
          </MotionEffect>
        </div>
      </div>
    </>
  )
}
