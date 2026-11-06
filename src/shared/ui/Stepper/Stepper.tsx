import { StepperProps } from './types'
import styles from './Stepper.module.css'
import Step from './Step/Step'

export const Stepper = ({ currentStep, totalSteps = 3 }: StepperProps) => {
  const checkedCurrentStep = currentStep > totalSteps ? totalSteps : currentStep;

  return (
    <div className={styles.container}>
      <span className={styles.stepCount}>
        Шаг {checkedCurrentStep} из {totalSteps}
      </span>

      <section className={styles.stepSection}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <Step isActive={index + 1 <= currentStep} key={index} />
        ))}
      </section>
    </div>
  )
}
