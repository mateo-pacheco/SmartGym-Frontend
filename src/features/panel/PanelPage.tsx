import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { MetricInline } from '../../components/data-display/MetricInline'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { getApiConfig } from '../../services/api/client'
import { haySesion } from '../../services/api/auth'

/* Centro de control: composición tipo sala de mando. Sin datos inventados;
   el estado de integración refleja la conexión real con el backend. */
export default function PanelPage() {
  const api = getApiConfig()
  const conectado = api.status === 'configurado'
  const conSesion = haySesion()

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
            {['Accesos NFC hoy', 'Gateways conectados', 'Alertas médicas activas', 'Aforo actual'].map(
              (label, i) => (
                <div key={label} className="col-6 col-lg-3">
                  <MotionEffect fade zoom={{ initialScale: 0.92 }} delay={0.12 + i * 0.05}>
                    <MetricInline label={label} />
                  </MotionEffect>
                </div>
              ),
            )}
          </div>
          <p className="sg-note sg-note--muted mt-3 mb-0">
            {conectado
              ? 'Los indicadores mostrarán datos reales al iniciar sesión con un rol autorizado.'
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
            rows={[]}
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
                ? 'El backend está conectado. Inicia sesión para consultar los datos reales según tu rol. Esta pantalla no muestra datos simulados.'
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
