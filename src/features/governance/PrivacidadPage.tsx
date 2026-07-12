import { PageHeader } from '../../components/navigation/PageHeader'
import { MotionEffect } from '../../components/animate-ui/motion-effect'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { Icon } from '../../components/icons/Icon'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { useApiData } from '../../services/api/useApiData'
import { gymApprovals } from '../../services/api/endpoints'

/* Gobernanza: consentimiento, revocación y privacidad con copy explícito.
   La autorización real siempre vive en el backend. */
export default function PrivacidadPage() {
  const decisiones = useApiData(() => gymApprovals.listar())
  const filas = (decisiones.datos ?? []).map((a) => ({
    titular: a.deportistaId,
    ambito: `Tratamiento de datos de salud — ${a.tipoRestriccion}`,
    otorgado: new Date(a.fechaValidacion).toLocaleDateString('es-EC'),
    estado: (
      <StatusBadge
        tone={a.estado === 'APROBADO' ? 'success' : 'warning'}
        label={a.estado}
      />
    ),
    accion: a.fechaExpiracion ? `Vence ${a.fechaExpiracion}` : 'Vigencia controlada',
  }))
  return (
    <>
      <PageHeader
        title="Privacidad y consentimientos"
        lead="Consentimientos otorgados, revocaciones y política de datos sensibles del ecosistema SmartGym."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Administración' },
          { label: 'Privacidad y consentimientos' },
        ]}
      />

      <ApiState estado={decisiones.estado} contract="Consentimientos y privacidad" error={decisiones.error} onRetry={decisiones.recargar} />

      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="sg-section-title">Consentimientos registrados</h2>
          <DataTable
            caption="Consentimientos registrados y su estado vigente"
            columns={[
              { key: 'titular', header: 'Titular' },
              { key: 'ambito', header: 'Ámbito del consentimiento' },
              { key: 'otorgado', header: 'Otorgado' },
              { key: 'estado', header: 'Estado' },
              { key: 'accion', header: 'Gestión', align: 'end' },
            ]}
            rows={filas}
            emptyState={
              <NoContractState
                illustration="auditoria"
                title="Aún no hay consentimientos registrados"
                body="Otorgar o revocar un consentimiento quedará registrado con fecha, ámbito y responsable."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <MotionEffect fade slide={{ direction: 'right', offset: 18 }} delay={0.18}>
          <h2 className="sg-section-title">Compromisos de datos</h2>
          <ul className="sg-checklist sg-surface--inset p-3">
            {[
              'Los valores NFC, HMAC, tokens y credenciales nunca se muestran en la interfaz.',
              'Los datos clínicos se exponen al mínimo necesario y solo a roles autorizados.',
              'Toda revocación es explícita, trazable y requiere confirmación con su consecuencia.',
              'Ocultar una acción en el frontend no sustituye la autorización del backend.',
            ].map((texto) => (
              <li key={texto}>
                <span className="sg-checklist__check" aria-hidden="true">
                  <Icon name="check" size={15} />
                </span>
                <span>{texto}</span>
              </li>
            ))}
          </ul>
          </MotionEffect>
        </div>
      </div>
    </>
  )
}
