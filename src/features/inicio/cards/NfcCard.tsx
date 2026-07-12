import { ModuleCard } from './ModuleCard'

/* Credencial NFC de miembro: adaptación del diseño entregado por el usuario
   a los tokens SmartGym (acento crimson, superficies por tema). Decorativa:
   el copy adyacente del módulo describe el contenido. */
export function NfcCard() {
  return (
    <ModuleCard className="sgm-parallax--nfc">
      <div className="sgm-nfc__header">
        <svg className="sgm-nfc__logo" viewBox="0 0 100 70" fill="none">
          <rect x="4" y="4" width="92" height="62" rx="14" fill="var(--mc-logo-plate)" stroke="var(--mc-logo-stroke)" strokeWidth="6" />
          <rect x="22" y="31" width="56" height="8" rx="4" fill="var(--mc-logo-bar)" />
          <path
            d="M14 22H24V48H14C10.7 48 8 45.3 8 42V28C8 24.7 10.7 22 14 22ZM76 22H86C89.3 22 92 24.7 92 28V42C92 45.3 89.3 48 86 48H76V22Z"
            fill="var(--sg-brand)"
          />
        </svg>
        <svg
          className="sgm-nfc__wave"
          viewBox="-2 -2 28 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20M17 5c2.5 3 2.5 11 0 14M21 2c4 4 4 16 0 20M7 5c-2.5 3-2.5 11 0 14M3 2c-4 4-4 16 0 20" />
        </svg>
      </div>

      <div className="sgm-nfc__chiprow">
        <div className="sgm-nfc__chip">
          <i />
          <i />
          <i />
          <b />
        </div>
        <div className="sgm-nfc__type">SMARTGYM · IDENTIFICACIÓN NFC</div>
      </div>

      <div className="sgm-nfc__numbers">
        <span>SGYM</span>
        <span>NFC</span>
        <span>ID</span>
        <span>0001</span>
      </div>

      <div className="sgm-nfc__footer">
        <div className="sgm-nfc__group">
          <div className="sgm-nfc__label">MIEMBRO</div>
          <div className="sgm-nfc__value">USUARIO SMARTGYM</div>
        </div>
        <div className="sgm-nfc__group">
          <div className="sgm-nfc__label">ESTADO DE ACCESO</div>
          <div className="sgm-nfc__value">ACTIVO</div>
        </div>
      </div>
    </ModuleCard>
  )
}
