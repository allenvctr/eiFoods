import { useNavigate } from "react-router-dom";
import { useOrder } from "../../context/useOrder";
import styles from "./Customize.module.css";
import Navbar from "../../components/Navbar/Navbar";
const OPCOES_GRATUITAS = [
  "Sem Molho",
  "Com Molho",
  "Sem Piripiri",
  "Com Piripiri",
];
const OPCOES_SAL = ["Sem Sal", "Pouco Sal", "Normal"];
const EXTRAS_PAGOS = [
  "+ Frango extra (50 MZN)",
  "+ Ovo estrelado (30 MZN)",
  "+ Queijo (40 MZN)",
];

export default function Customize() {
  const navigate = useNavigate();
  const { state, dispatch } = useOrder();
  const { selectedDish, customizations } = state;

  // Se não há prato seleccionado, volta ao menu
  if (!selectedDish) {
    navigate("/menu");
    return null;
  }

  function toggleFree(opcao) {
    const jaSeleccionada = customizations.free.includes(opcao);
    const novaLista = jaSeleccionada
      ? customizations.free.filter((o) => o !== opcao)
      : [...customizations.free, opcao];
    dispatch({ type: "SET_CUSTOMIZATION", payload: { free: novaLista } });
  }

  function handleSal(opcao) {
    dispatch({ type: "SET_CUSTOMIZATION", payload: { salt: opcao } });
  }

  function handlePago(extra) {
    const jaSeleccionado = customizations.paid === extra;
    dispatch({
      type: "SET_CUSTOMIZATION",
      payload: { paid: jaSeleccionado ? "" : extra },
    });
  }

  function handleAdicionar() {
    dispatch({
      type: "ADD_TO_ORDER",
      payload: {
        prato: selectedDish,
        customizations: { ...customizations },
      },
    });
    navigate("/order-summary");
  }

  return (
    <div className={styles.page}>
      <Navbar />{" "}
      {/* Reutiliza o header do Navbar para manter consistência visual e navegação fácil */}
      <main className={styles.main}>
        <div className={styles.pratoSeleccionado}>
          <span className={styles.pratoEmoji}>{selectedDish.emoji}</span>
          <div>
            <h1 className={styles.pratoNome}>{selectedDish.nome}</h1>
            <p className={styles.pratoPreco}>{selectedDish.preco} MZN</p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Personalização gratuita */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>✅ Personalização Gratuita</h2>

            <div className={styles.grupo}>
              <p className={styles.grupoLabel}>Molho e Picante</p>
              <div className={styles.checkboxLista}>
                {OPCOES_GRATUITAS.map((opcao) => (
                  <label key={opcao} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={customizations.free.includes(opcao)}
                      onChange={() => toggleFree(opcao)}
                    />
                    <span>{opcao}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.grupo}>
              <p className={styles.grupoLabel}>Sal</p>
              <div className={styles.radioLista}>
                {OPCOES_SAL.map((opcao) => (
                  <label key={opcao} className={styles.radioItem}>
                    <input
                      type="radio"
                      name="sal"
                      checked={customizations.salt === opcao}
                      onChange={() => handleSal(opcao)}
                    />
                    <span>{opcao}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Personalização paga */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>⭐ Personalização Paga</h2>
            <div className={styles.checkboxLista}>
              {EXTRAS_PAGOS.map((extra) => (
                <label key={extra} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={customizations.paid === extra}
                    onChange={() => handlePago(extra)}
                  />
                  <span>{extra}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button className={styles.btnAdicionar} onClick={handleAdicionar}>
          Adicionar ao pedido
        </button>
      </main>
    </div>
  );
}
