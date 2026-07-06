import { PageHeader } from '../../components/navigation/PageHeader'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { MetricInline } from '../../components/data-display/MetricInline'

/* Telemetría IoT: estados diferenciados (normal, degradado, retrasado,
   desconectado). Prohibido simular datos en vivo con timers o aleatorios. */
export default function MaquinasPage() {
  return (
    <>
      <PageHeader
        title="Máquinas y telemetría"
        lead="Estado de máquinas conectadas, gateways y sincronización. Los datos llegan del backend IoT; no se simula telemetría."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Operación' },
          { label: 'Máquinas y telemetría' },
        ]}
      />

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="sg-surface p-3 h-100">
            <MetricInline label="Gateways en línea" value="N/D" tone="neutral" statusLabel="Sin datos" />
          </div>
        </div>
        <div className="col-md-4">
          <div className="sg-surface p-3 h-100">
            <MetricInline label="Máquinas sincronizadas" value="N/D" tone="neutral" statusLabel="Sin datos" />
          </div>
        </div>
        <div className="col-md-4">
          <div className="sg-surface p-3 h-100">
            <MetricInline label="Latencia media" value="N/D" tone="neutral" statusLabel="Sin datos" />
          </div>
        </div>
      </div>

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
            moduleName="El inventario IoT"
            detail="Cada máquina mostrará su gateway, latencia y eventos de sincronización."
            contract="Telemetría IoT"
            expectedAction="ver gateways, latencia y sincronización de cada máquina en vivo."
          />
        }
      />

      <section aria-label="Taxonomía de estados de telemetría" className="mt-4">
        <h2 className="fs-6 fw-semibold mb-2">Cómo leer los estados</h2>
        <dl className="sg-deflist sg-surface--inset p-3" style={{ maxWidth: 560 }}>
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
      </section>
    </>
  )
}
