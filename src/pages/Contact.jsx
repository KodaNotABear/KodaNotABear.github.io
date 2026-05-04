import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Contact.module.css'
import { EmailIcon, GitHubIcon, ItchIcon, DiscordIcon } from '../components/Icons'

const CONTACT_EMAIL = 'koda@akuro.studio'

const CONTACT_INFO = [
  { icon: <EmailIcon />, label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: <GitHubIcon />, label: 'GitHub', value: 'github.com/KodaNotABear', href: 'https://github.com/KodaNotABear' },
  { icon: <ItchIcon />, label: 'itch.io', value: 'kodanotabear.itch.io', href: 'https://kodanotabear.itch.io' },
  { icon: <DiscordIcon />, label: 'Discord', value: 'kodanotabear', href: 'https://discord.com/users/kodanotabear' },
]

// This form uses Formspree (free, no server needed on GitHub Pages).
// 1. Sign up at formspree.io
// 2. Create a form and replace YOUR_FORM_ID below with your form's id.
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/mqeneykj'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', category: 'general', message: '',
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _replyto: formData.email,
          _subject: `[Portfolio] ${formData.subject}`,
        }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className={styles.eyebrow}>// get in touch</p>
            <h1 className="section-title">Contact</h1>
            <p className={styles.subtitle}>
              Open to full-time game developer roles, internships, collaborations,
              and general conversation. I typically respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.grid}>
            {/* Sidebar */}
            <motion.div
              className={styles.sidebar}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
            >
              <div className={styles.availability}>
                <span className={styles.dot} />
                Available for opportunities
              </div>

              {CONTACT_INFO.map(({ icon, label, value, href }) => (
                <div key={label} className={styles.infoCard}>
                  <span className={styles.infoIcon}>{icon}</span>
                  <div>
                    <div className={styles.infoLabel}>{label}</div>
                    <div className={styles.infoValue}>
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                         rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                        {value}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Form */}
            <motion.div
              className={styles.formCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {status === 'success' ? (
                <div className={styles.success}>
                  <div className={styles.successIcon}>✅</div>
                  <h3>Message Sent!</h3>
                  <p>Thanks for reaching out. I'll get back to you soon.</p>
                </div>
              ) : (
                <>
                  <h2 className={styles.formTitle}>Send a Message</h2>
                  <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label htmlFor="name">Name <span>*</span></label>
                        <input
                          id="name" name="name" type="text" required
                          placeholder="Jane Smith"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="email">Email <span>*</span></label>
                        <input
                          id="email" name="email" type="email" required
                          placeholder="jane@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="category">Category</label>
                      <select
                        id="category" name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="general">General</option>
                        <option value="job">Job Opportunity</option>
                        <option value="collab">Collaboration</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="subject">Subject <span>*</span></label>
                      <input
                        id="subject" name="subject" type="text" required
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="message">Message <span>*</span></label>
                      <textarea
                        id="message" name="message" required
                        placeholder="Tell me about your project, role, or idea..."
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                      />
                    </div>

                    <div className={styles.submitRow}>
                      <span className={styles.submitNote}>
                        {status === 'error' ? (
                          <>
                            ⚠ Something went wrong — email directly at{' '}
                            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                          </>
                        ) : ''}
                      </span>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status === 'sending'}
                      >
                        {status === 'sending' ? 'Sending…' : 'Send Message →'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
