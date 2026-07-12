import type { ReactNode } from 'react'
import { ModuleTilt } from './ModuleTilt'

/* Iconos EXACTOS del diseño original de la card fitness (mismos paths),
   con el color entregado por tokens (currentColor) para ambos temas. */

function AvatarIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" width={size} height={size} aria-hidden="true">
      <path
        d="M37.99 38.293C37.785 34.785 34.733 32 31 32H17c-3.735 0-6.786 2.785-6.99 6.293m27.98 0A19.94 19.94 0 0 0 44 24c0-11.046-8.954-20-20-20S4 12.954 4 24a19.94 19.94 0 0 0 6.01 14.293m27.98 0A19.935 19.935 0 0 1 24 44a19.935 19.935 0 0 1-13.99-5.707M30 20a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        stroke="currentColor"
      />
    </svg>
  )
}

function HeartbeatIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" width={size} height={size} aria-hidden="true">
      <path
        d="m11 32 7-9 6 9 6-9 5 8h9"
        strokeWidth={4}
        strokeMiterlimit={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        stroke="currentColor"
      />
      <path
        d="M44 19c0-6.075-4.925-11-11-11-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326 1.194-.397 2.562-1.016 4.01-1.826"
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
        stroke="currentColor"
      />
    </svg>
  )
}

function MoonIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" width={size} height={size} aria-hidden="true">
      <path
        d="M47.32 28.378a1.776 1.776 0 0 0-1.98-.142c-2.977 1.71-6.122 2.578-9.35 2.578-10.37 0-18.807-8.437-18.807-18.808 0-3.242.869-6.383 2.582-9.336A1.775 1.775 0 0 0 17.738.073 24.833 24.833 0 0 0 5.04 8.7C1.743 12.976 0 18.096 0 23.508c0 13.503 10.985 24.489 24.488 24.489 5.412 0 10.533-1.742 14.81-5.04a24.817 24.817 0 0 0 8.632-12.69 1.774 1.774 0 0 0-.61-1.889ZM24.488 44.446c-11.545 0-20.937-9.393-20.937-20.938 0-7.788 4.457-14.876 11.23-18.438a21.423 21.423 0 0 0-1.149 6.936c0 12.329 10.03 22.36 22.358 22.36a21.49 21.49 0 0 0 6.948-1.154c-3.561 6.775-10.655 11.233-18.45 11.233Z"
        fill="currentColor"
      />
    </svg>
  )
}

function SmileIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" width={size} height={size} aria-hidden="true">
      <path
        d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Z"
        strokeWidth={3}
        strokeLinecap="round"
        stroke="currentColor"
      />
      <path
        d="M18.804 27a5.999 5.999 0 0 0 10.392 0"
        strokeWidth={3}
        strokeLinecap="round"
        stroke="currentColor"
      />
      <path
        d="M18 15.75h-2a2.25 2.25 0 0 0 0 4.5h2a2.25 2.25 0 0 0 0-4.5Zm14 0h-2a2.25 2.25 0 0 0 0 4.5h2a2.25 2.25 0 0 0 0-4.5Z"
        strokeWidth=".25"
        strokeLinecap="round"
        stroke="currentColor"
        fill="currentColor"
      />
    </svg>
  )
}

function FlameIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 52" fill="none" width={size} height={size + 2} aria-hidden="true">
      <path
        d="M32.87 18.07c0-2.808 3.734-3.553 4.725-.925 2.397 6.356 4.144 12.042 4.144 15.116 0 9.797-7.942 17.739-17.74 17.739-9.796 0-17.738-7.942-17.738-17.739 0-3.303 2.016-9.62 4.688-16.544 3.463-8.97 5.194-13.455 7.33-13.696a3.641 3.641 0 0 1 2.04.38c1.907.995 1.907 5.886 1.907 15.67a5.322 5.322 0 0 0 10.643 0Z"
        strokeWidth={3}
        stroke="currentColor"
      />
      <path
        d="m20.452 50-.932-2.331a12.086 12.086 0 0 1 1.784-12.038 3.453 3.453 0 0 1 5.392 0 12.085 12.085 0 0 1 1.784 12.038l-.932 2.33"
        strokeWidth={3}
        stroke="currentColor"
      />
    </svg>
  )
}

function MetricTile({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="sgm-fit__panel sgm-fit__metric">
      <span className="sgm-fit__metric-icon">{icon}</span>
      <span className="sgm-fit__metric-value">{value}</span>
    </div>
  )
}

export function RiesgoMedicoCard() {
  return (
    <ModuleTilt
      className="sgm-visual-tilt sgm-visual-tilt--medical"
      planeClassName="sgm-fit-health"
    >
      <div className="sgm-fit__panel sgm-fit__header">
        <AvatarIcon size={28} />
        <strong>Deportista</strong>
      </div>

      <div className="sgm-fit__overview">
        <div className="sgm-fit__panel sgm-fit__gauge">
          <svg viewBox="0 0 160 160" fill="none">
            <path
              className="sgm-fit__gauge-track"
              d="M130.912 130.912a71.997 71.997 0 0 0-10.911-110.778A71.999 71.999 0 0 0 9.383 94.046a72.004 72.004 0 0 0 19.705 36.866"
            />
            <path
              className="sgm-fit__gauge-progress"
              d="M146.65 52.764A72.004 72.004 0 0 0 69.647 8.748a71.998 71.998 0 0 0-40.559 122.164"
              pathLength={100}
            />
          </svg>
          <span>NIVEL 3 / 4</span>
        </div>

        <div className="sgm-fit__metric-stack">
          <MetricTile icon={<HeartbeatIcon />} value="98 bpm" />
          <MetricTile icon={<MoonIcon />} value="7.5 h" />
        </div>
      </div>

      <div className="sgm-fit__metric-row">
        <MetricTile icon={<SmileIcon />} value="Estable" />
        <MetricTile icon={<FlameIcon />} value="Contexto" />
      </div>

      <div className="sgm-fit__panel sgm-fit__quote">
        <strong>Escalamiento</strong>
        <span>Revisión médica prioritaria</span>
      </div>
    </ModuleTilt>
  )
}
