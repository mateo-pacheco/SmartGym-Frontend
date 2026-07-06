import { PageHeader } from '../../components/navigation/PageHeader'
import { PermissionDeniedState } from '../../components/feedback/PermissionDeniedState'

/* Reportes: autorizados por rol. Sin contrato de autorización confirmado,
   el frontend no puede verificar permisos y lo declara explícitamente. */
export default function ReportesPage() {
  return (
    <>
      <PageHeader
        title="Reportes"
        lead="Reportes operativos y analíticos autorizados por rol, con filtros, exportación y trazabilidad de acceso."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Análisis' },
          { label: 'Reportes' },
        ]}
      />

      <div className="sg-surface">
        <PermissionDeniedState body="Los reportes requieren verificación de rol contra el backend. Mientras el contrato de autorización no esté confirmado, esta sección permanece restringida y no muestra datos." />
      </div>
    </>
  )
}
