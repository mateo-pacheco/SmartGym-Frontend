import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../../components/icons/Icon'
import './ecosystem-cards.scss'

/* Baraja del ecosistema: tres cards en abanico sobre tokens SmartGym.
   El detalle aparece dentro de la misma superficie, sin alterar tamaños
   ni abrir paneles laterales. En táctiles permanece visible. */

interface EcoCard {
  id: string
  tone: 'one' | 'two' | 'three'
  icon: IconName
  title: string
  detail: string
  to: string
  cta: string
}

const CARDS: EcoCard[] = [
  {
    id: 'identidad',
    tone: 'one',
    icon: 'nfc',
    title: 'Identidad y acceso',
    detail: 'La manilla NFC valida cada ingreso sin exponer credenciales.',
    to: '/operacion/accesos',
    cta: 'Abrir Acceso NFC',
  },
  {
    id: 'operacion',
    tone: 'two',
    icon: 'maquina',
    title: 'Operación conectada',
    detail: 'Máquinas, gateways y aforo reportan su estado en vivo.',
    to: '/operacion/maquinas',
    cta: 'Abrir Telemetría',
  },
  {
    id: 'salud',
    tone: 'three',
    icon: 'pulso',
    title: 'Salud que decide',
    detail: 'Las alertas médicas se priorizan con contexto clínico.',
    to: '/atencion/alertas',
    cta: 'Abrir Alertas',
  },
]

export function EcosystemCards() {
  return (
    <section id="ecosistema" className="inicio-section eco-section" aria-labelledby="eco-titulo">
      <div className="inicio-section__inner">
        <div data-reveal>
          <h2 id="eco-titulo">Un ecosistema, una sola operación</h2>
          <p className="inicio-section__lead">
            La identidad entra primero, las máquinas se conectan y la salud vigila el sistema.
          </p>
        </div>

        <div className="eco-deck" data-reveal>
          {CARDS.map((card) => (
            <article key={card.id} className={`eco-card eco-card--${card.tone}`}>
              <div className="eco-card__face" aria-hidden="true">
                <Icon name={card.icon} size={30} />
                <strong>{card.title}</strong>
              </div>
              <div className="eco-card__details">
                <div>
                  <span className="eco-card__details-icon" aria-hidden="true">
                    <Icon name={card.icon} size={22} />
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.detail}</p>
                </div>
                <Link className="eco-card__cta" to={card.to}>
                  {card.cta}
                  <Icon name="flechaDerecha" size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
