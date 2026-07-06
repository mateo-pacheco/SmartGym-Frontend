import { PageHeader } from '../../components/navigation/PageHeader'
import { MetricInline } from '../../components/data-display/MetricInline'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { getApiConfig } from '../../services/api/client'

/* Centro de control: composición tipo sala de mando. Sin datos inventados;
   cada indicador declara su estado real de integración. */
export default function PanelPage() {
  const api = getApiConfig()

  return (
    <>
      <PageHeader
        title="Centro de control"
        lead="Estado operativo del ecosistema SmartGym: accesos, telemetría, alertas y aforo en una sola vista."
        breadcrumbs={[{ label: 'SmartGym', to: '/panel' }, { label: 'Centro de control' }]}
      />

      <section aria-label="Indicadores operativos" className="sg-surface p-3 p-md-4 mb-4">
        <div className="row g-4">
          <div className="col-6 col-lg-3">
            <MetricInline label="Accesos NFC hoy" value="N/D" tone="neutral" statusLabel="Sin datos" />
          </div>
          <div className="col-6 col-lg-3">
            <MetricInline label="Gateways conectados" value="N/D" tone="neutral" statusLabel="Sin datos" />
          </div>
          <div className="col-6 col-lg-3">
            <MetricInline label="Alertas médicas activas" value="N/D" tone="neutral" statusLabel="Sin datos" />
          </div>
          <div className="col-6 col-lg-3">
            <MetricInline label="Aforo actual" value="N/D" tone="neutral" statusLabel="Sin datos" />
          </div>
        </div>
      </section>

      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="fs-6 fw-semibold mb-3">Trazabilidad reciente</h2>
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
                moduleName="La trazabilidad operativa"
                detail="Aquí aparecerán accesos, sincronizaciones y alertas en orden cronológico."
                contract="Eventos operativos"
                expectedAction="seguir en vivo accesos NFC, sincronizaciones IoT y alertas médicas."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <h2 className="fs-6 fw-semibold mb-3">Estado de integración</h2>
          <div className="sg-surface--inset p-3 d-grid gap-3">
            <dl className="sg-deflist">
              <div>
                <dt>Contrato API</dt>
                <dd>
                  {api.status === 'configurado' ? (
                    <StatusBadge tone="success" label="Configurado" />
                  ) : (
                    <StatusBadge tone="warning" label="No confirmado" />
                  )}
                </dd>
              </div>
              <div>
                <dt>Sesión</dt>
                <dd>
                  <StatusBadge tone="neutral" label="Sin autenticación" icon="privacidad" />
                </dd>
              </div>
              <div>
                <dt>Entorno</dt>
                <dd>Desarrollo</dd>
              </div>
            </dl>
            <p className="m-0" style={{ fontSize: '0.83rem', color: 'var(--sg-text-secondary)' }}>
              Los módulos se activan a medida que el backend confirma sus contratos. Esta pantalla
              no muestra datos simulados.
            </p>
            <AppButton variant="secondary" size="sm" to="/inicio" iconEnd="flechaDerecha">
              Conocer los módulos
            </AppButton>
          </div>

          <h2 className="fs-6 fw-semibold mb-3 mt-4">Próximos pasos de integración</h2>
          <ol className="sg-nextsteps sg-surface--inset p-3 m-0">
            {[
              {
                paso: 'Contrato de autenticación y roles',
                habilita: 'Sesión real, permisos por rol y reportes.',
              },
              {
                paso: 'Contrato de manillas y accesos NFC',
                habilita: 'Alta, bloqueo, reposición y trazabilidad de intentos.',
              },
              {
                paso: 'Contrato de telemetría IoT',
                habilita: 'Gateways, latencia y estado de máquinas en vivo.',
              },
              {
                paso: 'Contratos clínicos y de planes',
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
                <StatusBadge tone="warning" label="Pendiente" icon="reloj" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  )
}
