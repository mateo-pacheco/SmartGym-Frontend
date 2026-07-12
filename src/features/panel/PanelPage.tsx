import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { MetricInline } from '../../components/data-display/MetricInline'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { getApiConfig } from '../../services/api/client'
import { haySesion } from '../../services/api/auth'
import { useApiData } from '../../services/api/useApiData'
import { accesosNfc, agendamiento, iotMaquinas, riskAlerts } from '../../services/api/endpoints'

/* Centro de control: composición tipo sala de mando. Sin datos inventados;
   el estado de integración refleja la conexión real con el backend. */
export default function PanelPage() {
  const api = getApiConfig()
  const conectado = api.status === 'configurado'
  const conSesion = haySesion()
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
  const eventos = [
    ...(datos?.accesos?.content ?? []).slice(0, 4).map((a) => ({
      hora: new Date(a.fechaHoraServidor).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
      evento: `Acceso ${a.resultado.toLowerCase()}`,
      origen: a.maquinaId,
      estado: <StatusBadge tone={a.resultado === 'EXITOSO' ? 'success' : 'danger'} label={a.resultado} />,
    })),
    ...(datos?.alertas ?? []).slice(0, 3).map((a) => ({
      hora: new Date(a.fechaDeteccion).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
      evento: a.descripcion ?? a.tipoAlerta,
      origen: a.deportistaId,
      estado: <StatusBadge tone="warning" label={a.nivelRiesgo} />,
    })),
  ]

  return (
    <>
      <PageHeader
        title="Centro de control"
        lead="Accesos, telemetría, alertas y aforo del ecosistema SmartGym en una sola vista."
        breadcrumbs={[{ label: 'SmartGym', to: '/panel' }, { label: 'Centro de control' }]}
      />

      <MotionEffect fade slide={{ direction: 'down', offset: 14 }} delay={0.06}>
        <section aria-label="Indicadores operativos" className="sg-surface p-3 p-md-4 mb-4">
          <div className="row g-4">
            <div className="col-6 col-lg-3"><MetricInline label="Accesos recientes" value={datos?.accesos ? String(datos.accesos.totalElements) : 'Restringido'}/></div>
            <div className="col-6 col-lg-3"><MetricInline label="Máquinas conectadas" value={String((datos?.maquinas ?? []).filter((m) => m.estadoConexion === 'CONECTADO').length)}/></div>
            <div className="col-6 col-lg-3"><MetricInline label="Alertas médicas activas" value={String(datos?.alertas.length ?? 0)}/></div>
            <div className="col-6 col-lg-3"><MetricInline label="Espacios operativos" value={String(datos?.espacios.length ?? 0)}/></div>
          </div>
          <p className="sg-note sg-note--muted mt-3 mb-0">
            {conectado
              ? resumen.estado === 'cargando' ? 'Consultando indicadores reales…' : 'Indicadores obtenidos del backend según los permisos de la sesión.'
              : 'Los indicadores se activan con los contratos de eventos y telemetría.'}
          </p>
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
                title="Aún no hay eventos registrados"
                body="Los accesos, sincronizaciones y alertas aparecerán aquí en orden cronológico."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <MotionEffect fade slide={{ direction: 'right', offset: 18 }} delay={0.18}>
          <h2 className="sg-section-title">Estado de integración</h2>
          <div className="sg-surface--inset p-3 d-grid gap-3">
            <dl className="sg-deflist">
              <div>
                <dt>Contrato API</dt>
                <dd>
                  {conectado ? (
                    <StatusBadge tone="success" label="Configurado" icon="check" />
                  ) : (
                    <StatusBadge tone="warning" label="No confirmado" />
                  )}
                </dd>
              </div>
              <div>
                <dt>Sesión</dt>
                <dd>
                  {conSesion ? (
                    <StatusBadge tone="success" label="Activa" icon="check" />
                  ) : (
                    <StatusBadge tone="neutral" label="Sin autenticación" icon="privacidad" />
                  )}
                </dd>
              </div>
              <div>
                <dt>Datos en vivo</dt>
                <dd>
                  {conSesion ? (
                    <StatusBadge tone="success" label="Disponibles" icon="check" />
                  ) : (
                    <StatusBadge tone="neutral" label="Requieren sesión" icon="reloj" />
                  )}
                </dd>
              </div>
            </dl>
            <p className="sg-note">
              {conectado
                ? 'El backend está conectado y los módulos consultan datos reales según tu rol. Esta pantalla no muestra datos simulados.'
                : 'Los módulos se activan a medida que el backend confirma sus contratos. Esta pantalla no muestra datos simulados.'}
            </p>
            <AppButton
              variant="secondary"
              size="sm"
              to={conSesion ? '/inicio' : '/ingresar'}
              iconEnd="flechaDerecha"
            >
              {conSesion ? 'Conocer los módulos' : 'Iniciar sesión'}
            </AppButton>
          </div>

          <h2 className="sg-section-title mt-4">Contratos del backend</h2>
          <ol className="sg-nextsteps sg-surface--inset p-3 m-0">
            {[
              {
                paso: 'Autenticación y roles',
                habilita: 'Sesión real, permisos por rol y reportes.',
              },
              {
                paso: 'Manillas y accesos NFC',
                habilita: 'Alta, bloqueo, reposición y trazabilidad de intentos.',
              },
              {
                paso: 'Telemetría IoT',
                habilita: 'Gateways, latencia y estado de máquinas en vivo.',
              },
              {
                paso: 'Clínicos y de planes',
                habilita: 'Expediente, alertas con severidad y revisión humana.',
              },
            ].map((item, i) => (
              <li key={item.paso}>
                <span className="sg-nextsteps__num" aria-hidden="true">
                  {i + 1}
                </span>
                <span>
                  <strong>{item.paso}</strong>
                  <span className="sg-nextsteps__detail">{item.habilita}</span>
                </span>
                {conectado ? (
                  <StatusBadge tone="success" label="Disponible" icon="check" />
                ) : (
                  <StatusBadge tone="warning" label="Pendiente" icon="reloj" />
                )}
              </li>
            ))}
          </ol>
          </MotionEffect>
        </div>
      </div>
    </>
  )
}
