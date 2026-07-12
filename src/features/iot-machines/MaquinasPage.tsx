import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ModuleGate } from '../../components/feedback/ModuleGate'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { MetricInline } from '../../components/data-display/MetricInline'

/* Telemetría IoT: estados diferenciados (normal, degradado, retrasado,
   desconectado). Prohibido simular datos en vivo con timers o aleatorios. */
export default function MaquinasPage() {
  return (
    <>
      <PageHeader
        title="Máquinas y telemetría"
        lead="Estado de máquinas conectadas, gateways y sincronización en tiempo real."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Operación' },
          { label: 'Máquinas y telemetría' },
        ]}
      />

      <ModuleGate contract="Telemetría IoT" />

      <MotionEffect fade slide={{ direction: 'down', offset: 14 }} delay={0.1}>
        <section aria-label="Indicadores de telemetría" className="sg-surface p-3 p-md-4 mb-4">
          <div className="row g-4">
            {['Gateways en línea', 'Máquinas sincronizadas', 'Latencia media'].map((label, i) => (
              <div key={label} className="col-6 col-md-4">
                <MotionEffect fade zoom={{ initialScale: 0.92 }} delay={0.16 + i * 0.05}>
                  <MetricInline label={label} />
                </MotionEffect>
              </div>
            ))}
          </div>
        </section>
      </MotionEffect>

      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="sg-section-title">Inventario conectado</h2>
          <DataTable
            caption="Inventario de máquinas conectadas con su estado de telemetría"
            columns={[
              { key: 'maquina', header: 'Máquina' },
              { key: 'zona', header: 'Zona' },
              { key: 'gateway', header: 'Gateway' },
              { key: 'sincronizacion', header: 'Última sincronización' },
              { key: 'estado', header: 'Estado' },
            ]}
            rows={[]}
            emptyState={
              <NoContractState
                illustration="iot"
                title="Sin máquinas conectadas"
                body="El inventario aparecerá cuando el gateway IoT reporte telemetría."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <MotionEffect fade slide={{ direction: 'right', offset: 18 }} delay={0.18}>
          <h2 className="sg-section-title">Cómo leer los estados</h2>
          <dl className="sg-deflist sg-surface--inset p-3">
            <div>
              <dt>Operación normal</dt>
              <dd><StatusBadge tone="success" label="Normal" /></dd>
            </div>
            <div>
              <dt>Datos con retraso mayor al umbral</dt>
              <dd><StatusBadge tone="warning" label="Retrasado" icon="reloj" /></dd>
            </div>
            <div>
              <dt>Funciona con capacidades reducidas</dt>
              <dd><StatusBadge tone="warning" label="Degradado" /></dd>
            </div>
            <div>
              <dt>Sin comunicación con el gateway</dt>
              <dd><StatusBadge tone="danger" label="Desconectado" icon="gateway" /></dd>
            </div>
          </dl>
          </MotionEffect>
        </div>
      </div>
    </>
  )
}
