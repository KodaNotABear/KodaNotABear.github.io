import styles from './Toolbox.module.css'

// Grouped by how much I actually reach for each thing, not by a made-up score.
const TIERS = [
  { label: 'Daily drivers',    cls: 'core', items: ['C#', 'C++', 'Unity', 'Git'] },
  { label: 'Comfortable with', cls: 'mid',  items: ['Java', 'Blender', 'Python', 'Visual Studio', 'Rider', 'Minecraft modding'] },
  { label: 'Have worked with', cls: 'low',  items: ['FMOD', 'React', 'Gradle', 'Server admin', 'Embedded / DAQ'] },
]

export default function Toolbox() {
  return (
    <div className={styles.wrap}>
      {TIERS.map(({ label, cls, items }) => (
        <div key={label} className={styles.tier}>
          <p className={styles.tierLabel}>{label}</p>
          <div className={styles.tags}>
            {items.map(i => (
              <span key={i} className={`${styles.chip} ${styles[cls]}`}>{i}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
