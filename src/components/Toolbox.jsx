import styles from './Toolbox.module.css'

// Grouped by how much I actually reach for each thing, not by a made-up score.
const TIERS = [
  { label: 'Daily drivers',    cls: 'core', items: ['C#', 'C++', 'Unity', 'Git', 'Python'] },
  { label: 'Comfortable with', cls: 'mid',  items: ['Java', 'Blender', 'Visual Studio', 'Rider'] },
  { label: 'Have worked with', cls: 'low',  items: ['FMOD', 'React', 'Gradle', 'Game servers', 'Docker / VPS', 'Embedded'] },
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
