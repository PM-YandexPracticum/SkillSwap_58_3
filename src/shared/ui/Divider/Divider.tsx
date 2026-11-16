import styles from './Divider.module.css'

export const Divider = ({ text = 'или' }) => {
  return (
    <div className={styles.divider}>
      <span className={styles.dividerLine} />
      <span className={styles.dividerText}>{text}</span>
      <span className={styles.dividerLine} />
    </div>
  )
}
