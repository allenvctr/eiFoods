import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const SLIDES = [
  {
    imagem: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
    titulo: 'O seu almoço,',
    destaque: 'onde você trabalha',
    sub: 'Escolha, personalize e receba a sua refeição no escritório. Fresco, rápido e sem complicações.',
  },
  {
    imagem: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1600&q=80',
    titulo: 'Refeições preparadas',
    destaque: 'com ingredientes frescos',
    sub: 'Selecionamos os melhores ingredientes todos os dias para garantir qualidade e sabor em cada prato.',
  },
  {
    imagem: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80',
    titulo: 'Entregamos',
    destaque: 'no seu local de trabalho',
    sub: 'Receba a sua refeição quentinha na secretária, sem sair do escritório nem perder tempo.',
  },
]

const PRATO_DO_DIA = {
  nome: 'Caril de Frango com Arroz Basmati',
  descricao: 'Caril aromático preparado com frango fresco, especiarias selecionadas e arroz basmati perfumado. Disponível até às 11h.',
  preco: '290 MZN',
  imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80',
}

const DESTAQUES = [
  {
    titulo: 'Ingredientes Frescos',
    descricao: 'Selecionamos os melhores ingredientes todos os dias para garantir refeições saudáveis e saborosas.',
    imagem: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
  },
  {
    titulo: 'Entrega no Local de Trabalho',
    descricao: 'Receba a sua refeição quentinha diretamente na secretária, sem sair do escritório.',
    imagem: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
  },
  {
    titulo: 'Personalização Total',
    descricao: 'Molho, sal, extras — adapte cada detalhe do seu prato ao seu gosto e necessidades.',
    imagem: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  },
]

const DEPOIMENTOS = [
  { nome: 'Ana Machava', cargo: 'Gestora de Projetos', texto: 'Comida deliciosa e sempre a horas. O serviço é impecável e as porções são generosas. Recomendo sem hesitar.' },
  { nome: 'Carlos Sitoe', cargo: 'Engenheiro de Software', texto: 'Adoro poder personalizar o meu prato todos os dias. Nunca me arrependo de nenhuma encomenda.' },
  { nome: 'Fátima Nhaca', cargo: 'Diretora Comercial', texto: 'O melhor serviço de refeições em Maputo. Qualidade consistente, entrega pontual e atendimento excelente.' },
]

const INTERVALO_SLIDE = 5000

export default function Home() {
  const navigate = useNavigate()
  const [slideAtivo, setSlideAtivo] = useState(0)
  const [transicao, setTransicao] = useState(true)

  const proximoSlide = useCallback(() => {
    setTransicao(false)
    setTimeout(() => {
      setSlideAtivo((prev) => (prev + 1) % SLIDES.length)
      setTransicao(true)
    }, 50)
  }, [])

  useEffect(() => {
    const timer = setInterval(proximoSlide, INTERVALO_SLIDE)
    return () => clearInterval(timer)
  }, [proximoSlide])

  function irParaSlide(idx) {
    setTransicao(false)
    setTimeout(() => {
      setSlideAtivo(idx)
      setTransicao(true)
    }, 50)
  }

  const slide = SLIDES[slideAtivo]

  return (
    <div className={styles.page}>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <img src="/logo.jpg" alt="Marmita Fresca" className={styles.logoImg} />
        </div>
        <nav className={styles.nav}>
          <span onClick={() => navigate('/menu')}>Menu</span>
          <span onClick={() => navigate('/sorteio')}>Sorteio</span>
        </nav>
        <button className={styles.navCta} onClick={() => navigate('/menu')}>
          Encomendar agora
        </button>
      </header>

      <main>

        {/* Hero Slideshow */}
        <section className={styles.hero}>
          {/* Slides de fundo */}
          {SLIDES.map((s, idx) => (
            <div
              key={idx}
              className={`${styles.slideBackground} ${idx === slideAtivo ? styles.slideAtivo : ''}`}
              style={{ backgroundImage: `url('${s.imagem}')` }}
            />
          ))}

          <div className={styles.heroOverlay} />

          {/* Conteúdo do slide */}
          <div className={`${styles.heroContent} ${transicao ? styles.heroContentVisivel : styles.heroContentOculto}`}>
            <span className={styles.heroBadge}>Menu do dia disponível</span>
            <h1 className={styles.headline}>
              {slide.titulo}<br />
              <span className={styles.highlight}>{slide.destaque}</span>
            </h1>
            <p className={styles.subtext}>{slide.sub}</p>
            <div className={styles.heroBtns}>
              <button className={styles.ctaAccent} onClick={() => navigate('/menu')}>
                Ver menu de hoje
              </button>
              <button className={styles.ctaOutline} onClick={() => {
                document.getElementById('como-funciona').scrollIntoView({ behavior: 'smooth' })
              }}>
                Como funciona
              </button>
            </div>
          </div>

          {/* Indicadores */}
          <div className={styles.slideDots}>
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.dot} ${idx === slideAtivo ? styles.dotAtivo : ''}`}
                onClick={() => irParaSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Stats */}
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>500+</span>
              <span className={styles.statLabel}>Clientes diários</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>4.9</span>
              <span className={styles.statLabel}>Avaliação média</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>98%</span>
              <span className={styles.statLabel}>Entrega pontual</span>
            </div>
          </div>
        </section>

        {/* Banner — Prato do Dia */}
        <section className={styles.pratoDoDia}>
          <div className={styles.pratoConteudo}>
            <div className={styles.pratoTexto}>
              <span className={styles.pratoBadge}>Prato do dia</span>
              <h2 className={styles.pratoNome}>{PRATO_DO_DIA.nome}</h2>
              <p className={styles.pratoDescricao}>{PRATO_DO_DIA.descricao}</p>
              <div className={styles.pratoRodape}>
                <span className={styles.pratoPreco}>{PRATO_DO_DIA.preco}</span>
                <button className={styles.pratoBtn} onClick={() => navigate('/menu')}>
                  Encomendar
                </button>
              </div>
            </div>
            <div className={styles.pratoImagemWrap}>
              <img
                src={PRATO_DO_DIA.imagem}
                alt={PRATO_DO_DIA.nome}
                className={styles.pratoImagem}
              />
            </div>
          </div>
        </section>

        {/* Destaques com fotos */}
        <section className={styles.destaques}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Porquê escolher-nos</h2>
            <p className={styles.sectionSub}>Qualidade e conveniência em cada refeição</p>
          </div>
          <div className={styles.destaquesGrid}>
            {DESTAQUES.map((d) => (
              <div key={d.titulo} className={styles.destaqueCard}>
                <div className={styles.destaqueImagemWrap}>
                  <img src={d.imagem} alt={d.titulo} className={styles.destaqueImagem} />
                </div>
                <div className={styles.destaqueInfo}>
                  <h3 className={styles.destaqueTitulo}>{d.titulo}</h3>
                  <p className={styles.destaqueDescricao}>{d.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className={styles.howItWorks}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Como funciona</h2>
            <p className={styles.sectionSub}>Três passos simples para o seu almoço</p>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumero}>01</div>
              <h3 className={styles.stepTitulo}>Escolha o prato</h3>
              <p className={styles.stepTexto}>Consulte o menu do dia e selecione a refeição que mais lhe apetece.</p>
            </div>
            <div className={styles.stepConector} />
            <div className={styles.step}>
              <div className={styles.stepNumero}>02</div>
              <h3 className={styles.stepTitulo}>Personalize</h3>
              <p className={styles.stepTexto}>Ajuste molhos, sal e adicione extras ao seu gosto, sem custo adicional.</p>
            </div>
            <div className={styles.stepConector} />
            <div className={styles.step}>
              <div className={styles.stepNumero}>03</div>
              <h3 className={styles.stepTitulo}>Receba no escritório</h3>
              <p className={styles.stepTexto}>Confirmamos via WhatsApp e entregamos diretamente no seu local de trabalho.</p>
            </div>
          </div>
        </section>

        {/* Sorteio teaser */}
        <section className={styles.sorteioTeaser}>
          <div className={styles.sorteioTeaserInner}>
            <div className={styles.sorteioTeaserTexto}>
              <span className={styles.sorteioTeaserBadge}>Novidade</span>
              <h2 className={styles.sorteioTeaserTitulo}>Sorteio semanal de refeições</h2>
              <p className={styles.sorteioTeaserSub}>
                Todos os clientes registados concorrem automaticamente ao sorteio semanal. Um cliente sortudo recebe o prato do dia gratuitamente.
              </p>
              <button className={styles.sorteioTeaserBtn} onClick={() => navigate('/sorteio')}>
                Ver sorteio ao vivo
              </button>
            </div>
            <div className={styles.sorteioTeaserVisual}>
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=80"
                alt="Refeição sorteada"
                className={styles.sorteioTeaserImg}
              />
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className={styles.depoimentos}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>O que dizem os nossos clientes</h2>
            <p className={styles.sectionSub}>Mais de 500 clientes satisfeitos em Maputo</p>
          </div>
          <div className={styles.depoimentosGrid}>
            {DEPOIMENTOS.map((d) => (
              <div key={d.nome} className={styles.depoimento}>
                <div className={styles.depoimentoStars}>{'★★★★★'}</div>
                <p className={styles.depoimentoTexto}>"{d.texto}"</p>
                <div className={styles.depoimentoAutor}>
                  <div className={styles.depoimentoAvatar}>{d.nome.charAt(0)}</div>
                  <div>
                    <p className={styles.depoimentoNome}>{d.nome}</p>
                    <p className={styles.depoimentoCargo}>{d.cargo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className={styles.ctaFinal}>
          <h2 className={styles.ctaFinalTitulo}>Pronto para encomendar?</h2>
          <p className={styles.ctaFinalSub}>O menu de hoje está disponível até às 11h</p>
          <button className={styles.ctaFinalBtn} onClick={() => navigate('/menu')}>
            Ver menu de hoje
          </button>
        </section>

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <img src="/logo.jpg" alt="Marmita Fresca" className={styles.footerLogo} />
            <p className={styles.footerTagline}>O seu almoço, onde você trabalha.</p>
          </div>
          <div className={styles.footerLinks}>
            <span onClick={() => navigate('/menu')}>Menu</span>
            <span onClick={() => navigate('/sorteio')}>Sorteio</span>
          </div>
        </div>
        <p className={styles.footerCopy}>© 2025 Marmita Fresca · Todos os direitos reservados</p>
      </footer>

    </div>
  )
}
