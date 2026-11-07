import { LoaderProps } from './interface'
import clsx from 'clsx'
import styles from './Loader.module.css'

export const Loader = ({ size = 'medium' }: LoaderProps) => {
  return (
    <div className={clsx(styles.loader, styles[size])} aria-label="идет загрузка" role="status" />
  )
}
