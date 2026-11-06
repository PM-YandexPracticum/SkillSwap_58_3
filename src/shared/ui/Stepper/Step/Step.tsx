import { StepProps } from '../types'
import styles from '../Stepper.module.css'
import clsx from 'clsx'

const Step = ({ isActive = false }: StepProps) => {
  return (
    <div
      className={clsx(styles.oneStepContainer, {
        [styles.activeStep]: isActive,
      })}
    />
  )
}

export default Step
