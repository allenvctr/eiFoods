import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🍽️</span>
          <span className={styles.logoText}>eiFoods</span>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.headline}>
            Refeições prontas<br />
            <span className={styles.highlight}>onde quer que esteja</span>
          </h1>
          <p className={styles.subtext}>
            Escolha o seu prato, personalize ao seu gosto e receba no trabalho ou onde quiser.
          </p>
          <button
            className={styles.ctaButton}
            onClick={() => navigate('/menu')}
          >
            Ver menu de hoje
          </button>
        </section>

        <section className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>Como funciona</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepArrow}>🍛</span>
              <p>Escolha o seu prato</p>
            </div>
            <span className={styles.arrow}>→</span>
            <div className={styles.step}>
              <span className={styles.stepArrow}>✏️</span>
              <p>Personalize</p>
            </div>
            <span className={styles.arrow}>→</span>
            <div className={styles.step}>
              <span className={styles.stepArrow}>📦</span>
              <p>Receba no trabalho ou onde quer que seja</p>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}