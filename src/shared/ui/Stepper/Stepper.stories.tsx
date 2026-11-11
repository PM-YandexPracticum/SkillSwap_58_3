import { Stepper } from './Stepper'

export default {
  title: 'Shared/Stepper',
  component: Stepper,
}

export const Default = {
  args: {
    currentStep: 1,
  },
}

export const SecondStep = {
  args: {
    currentStep: 2,
  },
}

export const ThirdStep = {
  args: {
    currentStep: 3,
  },
}
