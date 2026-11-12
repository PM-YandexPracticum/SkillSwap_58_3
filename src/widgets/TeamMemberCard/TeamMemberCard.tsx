import type { TeamMemberCardProps } from './interface'
import styles from './TeamMemberCard.module.css'
import { Avatar } from '@/shared/ui/Avatar'
import { Icon } from '@/shared/ui/icons'

export const TeamMemberCard = ({
  avatarUrl,
  name,
  role,
  description,
  githubUrl,
}: TeamMemberCardProps) => {
  return (
    <section className={styles.teamMemberCard}>
      <div className={styles.content}>
        <div className={styles.headingContainer}>
          <Avatar src={avatarUrl} alt={name} size="large" />
          <div className={styles.headingTextContainer}>
            <h3 className={styles.headingText}>{name}</h3>
            <p>Роль в проекте: {role}</p>
          </div>
        </div>
        <div className={styles.aboutContainer}>
          <h4 className={styles.subheadingText}>Обо мне:</h4>
          <p>{description}</p>
        </div>
        <div>
          <h4 className={styles.subheadingText}>Связаться со мной:</h4>
          <div className={styles.contactsGit}>
            <Icon name="github" />
            <a
              className={styles.contactsGitLink}
              href={githubUrl}
              target="_blank"
              aria-label="Открыть профиль GitHub в новом окне"
              rel="noopener noreferrer"
            >
              {githubUrl}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
