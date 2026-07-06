import { Icon } from '../icons/Icon'

export interface StepperProps {
  steps: string[]
  current: number
}

/* Stepper para flujos guiados de varios pasos (AGENTS.md §10/§15). */
export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="sg-stepper" aria-label={`Paso ${current + 1} de ${steps.length}`}>
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'pending'
        return (
          <li
            key={step}
            className={`sg-stepper__step sg-stepper__step--${state}`}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <span className="sg-stepper__dot">
              {state === 'done' ? <Icon name="check" size={12} /> : i + 1}
            </span>
            <span className="sg-stepper__label">{step}</span>
          </li>
        )
      })}
    </ol>
  )
}
