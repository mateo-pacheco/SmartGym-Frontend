import { Icon } from '../../../components/icons/Icon'
import { ModuleTilt } from './ModuleTilt'

const CLOUD_PATH =
  'M39.1,-11.5C46.9,11.5,47,38.1,34.9,46.6C22.8,55.1,-1.6,45.4,-16.5,32.3C-31.3,19.2,-36.8,2.8,-32.4,-15.3C-28.1,-33.4,-14.1,-53,0.8,-53.3C15.6,-53.5,31.2,-34.4,39.1,-11.5Z'

export function AgendaCard() {
  return (
    <ModuleTilt
      className="sgm-visual-tilt sgm-visual-tilt--agenda"
      planeClassName="sgm-agenda-cloud"
    >
      <div className="sgm-agenda-cloud__front" />
      <div className="sgm-agenda-cloud__back">
        <svg viewBox="0 0 200 200">
          <path d={CLOUD_PATH} transform="translate(100 100)" />
        </svg>
        <svg viewBox="0 0 200 200">
          <path d={CLOUD_PATH} transform="translate(100 100)" />
        </svg>
      </div>

      <p className="sgm-agenda-cloud__day">Agenda</p>
      <p className="sgm-agenda-cloud__date">Próxima franja</p>
      <p className="sgm-agenda-cloud__hour">20:00</p>

      <div className="sgm-agenda-cloud__icon">
        <Icon name="sol" size={24} />
      </div>

      <div className="sgm-agenda-cloud__capacity">
        <span>CAPACIDAD</span>
        <strong>AFORO DISPONIBLE</strong>
        <i>
          <b />
          <b />
          <b />
          <b />
        </i>
      </div>
    </ModuleTilt>
  )
}
