import { PageHeader } from '../../components/navigation/PageHeader'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { Icon } from '../../components/icons/Icon'

/* Gobernanza: consentimiento, revocación y privacidad con copy explícito.
   La autorización real siempre vive en el backend. */
export default function PrivacidadPage() {
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

      <div className="row g-4">
        <div className="col-lg-8">
          <DataTable
            caption="Consentimientos registrados y su estado vigente"
            columns={[
              { key: 'titular', header: 'Titular' },
              { key: 'ambito', header: 'Ámbito del consentimiento' },
              { key: 'otorgado', header: 'Otorgado' },
              { key: 'estado', header: 'Estado' },
              { key: 'accion', header: 'Gestión', align: 'end' },
            ]}
            rows={[]}
            emptyState={
              <NoContractState
                illustration="auditoria"
                moduleName="La gestión de consentimientos"
                detail="Otorgar o revocar un consentimiento quedará registrado con fecha, ámbito y responsable."
                contract="Consentimientos y privacidad"
                expectedAction="otorgar y revocar consentimientos con registro trazable."
              />
            }
          />
        </div>
        <div className="col-lg-4">
          <h2 className="fs-6 fw-semibold mb-3">Compromisos de datos</h2>
          <ul className="list-unstyled d-grid gap-3 m-0 sg-surface--inset p-3">
            {[
              'Los valores NFC, HMAC, tokens y credenciales nunca se muestran en la interfaz.',
              'Los datos clínicos se exponen al mínimo necesario y solo a roles autorizados.',
              'Toda revocación es explícita, trazable y requiere confirmación con su consecuencia.',
              'Ocultar una acción en el frontend no sustituye la autorización del backend.',
            ].map((texto) => (
              <li key={texto} className="d-flex gap-2" style={{ fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--sg-success-700)', flexShrink: 0, marginTop: 2 }}>
                  <Icon name="check" size={15} />
                </span>
                <span style={{ color: 'var(--sg-text-secondary)' }}>{texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
