import { StepperProps } from './types'
import styles from './Stepper.module.css'
import clsx from 'clsx'

export const Stepper = ({ currentStep, totalSteps = 3 }: StepperProps) => {
  const step = currentStep > totalSteps ? totalSteps : currentStep

  return (
    <div className={styles.container}>
      <span id="stepper-title" className={styles.stepCount}>
        Шаг {step} из {totalSteps}
      </span>

      <ol aria-labelledby="stepper-title" className={styles.stepSection}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <li
            key={index}
            className={clsx(styles.oneStepContainer, {
              [styles.activeStep]: index + 1 <= step,
            })}
          />
        ))}
      </ol>
    </div>
  )
}
