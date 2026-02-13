import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const DESTAQUES = [
  { emoji: '⚡', titulo: 'Rápido', descricao: 'Pedido feito em menos de 2 minutos' },
  { emoji: '✏️', titulo: 'Personalizável', descricao: 'Adapte cada refeição ao seu gosto' },
  { emoji: '📍', titulo: 'Onde quiser', descricao: 'Entregamos no seu local de trabalho' },
]

const DEPOIMENTOS = [
  { nome: 'Ana Machava', texto: 'Comida deliciosa e sempre a horas. Recomendo!', estrelas: 5 },
  { nome: 'Carlos Sitoe', texto: 'Adoro poder personalizar o meu prato todos os dias.', estrelas: 5 },
  { nome: 'Fátima Nhaca', texto: 'O melhor serviço de refeições de Maputo!', estrelas: 5 },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🍽️</span>
          <span className={styles.logoText}>eiFoods</span>
        </div>
        <nav className={styles.nav}>
          <span onClick={() => navigate('/menu')}>Menu</span>
        </nav>
      </header>

      <main>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroTag}>🔥 Menu do dia disponível</div>
          <h1 className={styles.headline}>
            Refeições prontas<br />
            <span className={styles.highlight}>onde quer que esteja</span>
          </h1>
          <p className={styles.subtext}>
            Escolha, personalize e receba a sua refeição no trabalho ou onde quiser. Simples, rápido e delicioso.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.ctaButton} onClick={() => navigate('/menu')}>
              Ver menu de hoje 🍛
            </button>
            <button className={styles.ctaSecundario} onClick={() => {
              document.getElementById('como-funciona').scrollIntoView({ behavior: 'smooth' })
            }}>
              Como funciona
            </button>
          </div>
        </section>

        {/* Destaques */}
        <section className={styles.destaques}>
          {DESTAQUES.map((d) => (
            <div key={d.titulo} className={styles.destaque}>
              <span className={styles.destaqueEmoji}>{d.emoji}</span>
              <h3 className={styles.destaqueTitulo}>{d.titulo}</h3>
              <p className={styles.destaqueDescricao}>{d.descricao}</p>
            </div>
          ))}
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>Como funciona</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumero}>1</div>
              <span className={styles.stepEmoji}>🍛</span>
              <p className={styles.stepTexto}>Escolha o seu prato</p>
            </div>
            <div className={styles.stepConector}>→</div>
            <div className={styles.step}>
              <div className={styles.stepNumero}>2</div>
              <span className={styles.stepEmoji}>✏️</span>
              <p className={styles.stepTexto}>Personalize ao seu gosto</p>
            </div>
            <div className={styles.stepConector}>→</div>
            <div className={styles.step}>
              <div className={styles.stepNumero}>3</div>
              <span className={styles.stepEmoji}>📦</span>
              <p className={styles.stepTexto}>Receba onde quiser</p>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className={styles.depoimentos}>
          <h2 className={styles.sectionTitle}>O que dizem os nossos clientes</h2>
          <div className={styles.depoimentosGrid}>
            {DEPOIMENTOS.map((d) => (
              <div key={d.nome} className={styles.depoimento}>
                <p className={styles.estrelas}>{'⭐'.repeat(d.estrelas)}</p>
                <p className={styles.depoimentoTexto}>"{d.texto}"</p>
                <p className={styles.depoimentoNome}>— {d.nome}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className={styles.ctaFinal}>
          <h2 className={styles.ctaFinalTitulo}>Pronto para encomendar?</h2>
          <p className={styles.ctaFinalSub}>O menu de hoje já está disponível</p>
          <button className={styles.ctaButton} onClick={() => navigate('/menu')}>
            Ver menu de hoje 🍛
          </button>
        </section>

      </main>

      <footer className={styles.footer}>
        <p>© 2025 eiFoods · Refeições prontas onde quer que esteja</p>
      </footer>

    </div>
  )
}