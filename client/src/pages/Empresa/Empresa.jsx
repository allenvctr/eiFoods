import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { empresasApi } from '../../api'
import { useOrder } from '../../context/useOrder'
import styles from './Empresa.module.css'

export default function Empresa() {
	const navigate = useNavigate()
	const { state, dispatch } = useOrder()
	const [codigo, setCodigo] = useState(state.empresaCodigo ?? '')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const menuPratos = useMemo(() => {
		if (!state.selectedEmpresa?.menu?.pratoIds) return []
		return state.selectedEmpresa.menu.pratoIds.filter((p) => typeof p !== 'string')
	}, [state.selectedEmpresa])

	async function handleValidar(e) {
		e.preventDefault()
		if (!codigo.trim()) {
			setError('Informe o código da empresa')
			return
		}

		try {
			setLoading(true)
			setError('')
			const data = await empresasApi.validateCode(codigo)
			dispatch({ type: 'SET_EMPRESA_CODIGO', payload: codigo.trim().toUpperCase() })
			dispatch({ type: 'SET_EMPRESA_SELECIONADA', payload: data })
		} catch (e) {
			setError(e.message)
			dispatch({ type: 'SET_EMPRESA_SELECIONADA', payload: null })
		} finally {
			setLoading(false)
		}
	}

	function handleEscolherPrato(prato) {
		dispatch({ type: 'SELECT_DISH', payload: prato })
		navigate('/customize')
	}

	return (
		<div className={styles.page}>
			<Navbar />
			<main className={styles.main}>
				<h1>Acesso por empresa</h1>
				<p>Insira seu código para ver o menu exclusivo da sua empresa.</p>

				<form className={styles.form} onSubmit={handleValidar}>
					<input
						value={codigo}
						onChange={(e) => setCodigo(e.target.value.toUpperCase())}
						placeholder="Ex.: EMP-AB12CD"
					/>
					<button type="submit" disabled={loading}>{loading ? 'A validar...' : 'Validar código'}</button>
				</form>

				{error && <p className={styles.error}>{error}</p>}

				{state.selectedEmpresa && (
					<section className={styles.result}>
						<div className={styles.meta}>
							<h2>{state.selectedEmpresa.empresaNome}</h2>
							<p>Código: {state.selectedEmpresa.codigo}</p>
							<p>Usos restantes hoje: {state.selectedEmpresa.usosRestantesHoje}</p>
							<p>Menu ativo: {state.selectedEmpresa.menu.nome}</p>
						</div>

						<div className={styles.cards}>
							{menuPratos.map((prato) => (
								<article key={prato._id} className={styles.card}>
									<img src={prato.imagem?.url ?? prato.imagem} alt={prato.nome} />
									<div>
										<strong>{prato.nome}</strong>
										<p>{prato.descricao}</p>
										<span>{prato.preco} MZN</span>
									</div>
									<button type="button" onClick={() => handleEscolherPrato(prato)}>Selecionar</button>
								</article>
							))}
							{menuPratos.length === 0 && <p>Este menu ainda não possui pratos.</p>}
						</div>
					</section>
				)}
			</main>
		<Footer />
		</div>
	)
}
