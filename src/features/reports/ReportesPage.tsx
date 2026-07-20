import { useMemo } from 'react'
import { PageHeader } from '../../components/navigation/PageHeader'
import { ApiState } from '../../components/feedback/ApiState'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { BotonesReporte } from '../../components/actions/BotonesReporte'
import { Icon, type IconName } from '../../components/icons/Icon'
import { useApiData } from '../../services/api/useApiData'
import { managementAnalytics } from '../../services/api/endpoints'

const aFecha = (date: Date) => date.toISOString().slice(0, 10)

const porcentaje = (valor?: number) =>
  valor === undefined || valor === null ? '—' : `${valor.toFixed(1)} %`

const numero = (valor?: number) =>
  valor === undefined || valor === null ? '—' : valor.toLocaleString('es-EC')

interface ReporteCatalogo {
  icon: IconName
  nombre: string
  descripcion: string
  rol: string
}

const CATALOGO: ReporteCatalogo[] = [
  {
    icon: 'nfc',
    nombre: 'Asistencia y accesos',
    descripcion: 'Frecuencia de uso, horas pico y accesos por zona.',
    rol: 'Coordinación',
  },
  {
    icon: 'pulso',
    nombre: 'Salud y riesgo',
    descripcion: 'Alertas por severidad, resoluciones y tiempos de atención.',
    rol: 'Equipo médico',
  },
  {
    icon: 'maquina',
    nombre: 'Uso de máquinas',
    descripcion: 'Sesiones por equipo, disponibilidad y mantenimiento.',
    rol: 'Operaciones',
  },
  {
    icon: 'planes',
    nombre: 'Planes y adherencia',
    descripcion: 'Estado de planes, revisiones y cumplimiento por programa.',
    rol: 'Entrenadores',
  },
  {
    icon: 'agenda',
    nombre: 'Ocupación y aforo',
    descripcion: 'Reservas por franja, capacidad por zona y conflictos evitados.',
    rol: 'Coordinación',
  },
]

/* Reportes: catálogo visible, datos restringidos. El acceso real se verifica
   por rol contra el backend; el frontend nunca decide permisos. */
export default function ReportesPage() {
  /* Rango consultado: últimos 30 días. Se calcula una vez para que la lectura
     del dashboard y su exportación usen exactamente el mismo período. */
  const [desde, hasta] = useMemo(() => {
    const fin = new Date()
    const inicio = new Date(fin)
    inicio.setDate(inicio.getDate() - 30)
    return [aFecha(inicio), aFecha(fin)]
  }, [])

  const dashboard = useApiData(() => managementAnalytics.dashboard(desde, hasta))

  const kpis = dashboard.datos

  return (
    <>
      <PageHeader
        title="Reportes"
        lead="Reportes operativos y analíticos autorizados por rol, con filtros y exportación."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Análisis' },
          { label: 'Reportes' },
        ]}
      />

      <ApiState
        estado={dashboard.estado}
        contract="Analítica de gestión"
        error={dashboard.error}
        onRetry={dashboard.recargar}
      />

      {dashboard.estado === 'listo' && kpis ? (
        <section aria-label="Indicadores de los últimos 30 días" className="mb-4">
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
            <h2 className="sg-section-title m-0">
              Indicadores del período
              <span className="sg-note--muted ms-2">
                {kpis.startDate} → {kpis.endDate}
              </span>
            </h2>
            <BotonesReporte
              pdf={() => managementAnalytics.reportePdf(desde, hasta)}
              excel={() => managementAnalytics.reporteExcel(desde, hasta)}
            />
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="sg-surface--inset p-3 h-100">
                <h3 className="sg-field-label">Gestión</h3>
                {kpis.businessKpis.dataAvailable ? (
                  <dl className="sg-deflist mb-0">
                    <div>
                      <dt>Membresías activas (promedio)</dt>
                      <dd>{numero(kpis.businessKpis.averageActiveMemberships)}</dd>
                    </div>
                    <div>
                      <dt>Tasa de retención</dt>
                      <dd>{porcentaje(kpis.businessKpis.averageRetentionRate)}</dd>
                    </div>
                    <div>
                      <dt>Ocupación horaria</dt>
                      <dd>{porcentaje(kpis.businessKpis.averageHourlyOccupancy)}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="sg-note sg-note--muted mb-0">
                    {kpis.businessKpis.message ?? 'Sin registros en el período consultado.'}
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="sg-surface--inset p-3 h-100">
                <h3 className="sg-field-label">Impacto en salud</h3>
                {kpis.healthImpact.dataAvailable ? (
                  <dl className="sg-deflist mb-0">
                    <div>
                      <dt>Mejora clínica</dt>
                      <dd>{porcentaje(kpis.healthImpact.clinicalImprovementPercentage)}</dd>
                    </div>
                    <div>
                      <dt>Trazabilidad comunitaria</dt>
                      <dd>{porcentaje(kpis.healthImpact.communityTraceabilityPercentage)}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="sg-note sg-note--muted mb-0">
                    {kpis.healthImpact.message ?? 'Sin registros en el período consultado.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="row g-4">
        <div className="col-lg-8">
          <MotionEffect fade slide={{ direction: 'down', offset: 16 }} delay={0.12}>
            <h2 className="sg-section-title">Catálogo de reportes</h2>
            <ul className="sg-catalog sg-surface" aria-label="Reportes disponibles por rol">
              {CATALOGO.map((r, i) => (
                <li key={r.nombre}>
                  <MotionEffect
                    className="sg-catalog__row"
                    fade
                    slide={{ direction: 'right', offset: 14 }}
                    delay={0.18 + i * 0.05}
                  >
                    <span className="sg-catalog__icon" aria-hidden="true">
                      <Icon name={r.icon} size={18} />
                    </span>
                    <span>
                      <span className="sg-catalog__name">{r.nombre}</span>
                      <span className="sg-catalog__desc">{r.descripcion}</span>
                    </span>
                    <StatusBadge tone="neutral" label={r.rol} />
                  </MotionEffect>
                </li>
              ))}
            </ul>
          </MotionEffect>
        </div>
        <div className="col-lg-4">
          <MotionEffect fade slide={{ direction: 'right', offset: 18 }} delay={0.18}>
            <h2 className="sg-section-title">Acceso por rol</h2>
            <div className="sg-surface--inset p-3 d-grid gap-2">
              <StatusBadge tone="warning" label="Requiere sesión verificada" icon="privacidad" />
              <p className="sg-note">
                Cada reporte se habilita según el rol de la sesión. La exportación queda registrada
                en auditoría con fecha y responsable.
              </p>
            </div>
          </MotionEffect>
        </div>
      </div>
    </>
  )
}
