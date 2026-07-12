import { ModuleTilt } from './ModuleTilt'

export function IotCard() {
  return (
    <ModuleTilt
      className="sgm-visual-tilt sgm-visual-tilt--iot"
      planeClassName="sgm-iot-standalone"
    >
      <div className="sgm-wifi-loader">
        <svg viewBox="0 0 86 86" className="sgm-wifi-loader__outer">
          <circle r="40" cy="43" cx="43" className="back" />
          <circle r="40" cy="43" cx="43" className="front" />
          <circle r="40" cy="43" cx="43" className="new" />
        </svg>
        <svg viewBox="0 0 60 60" className="sgm-wifi-loader__middle">
          <circle r="27" cy="30" cx="30" className="back" />
          <circle r="27" cy="30" cx="30" className="front" />
        </svg>
        <svg viewBox="0 0 34 34" className="sgm-wifi-loader__inner">
          <circle r="14" cy="17" cx="17" className="back" />
          <circle r="14" cy="17" cx="17" className="front" />
        </svg>
        <div data-text="Searching" className="sgm-wifi-loader__text" />
      </div>
    </ModuleTilt>
  )
}
