import { useNavigate } from "react-router-dom";
import { useOrder } from "../../context/useOrder";
import styles from "./OrderSummary.module.css";
import Navbar from "../../components/Navbar/Navbar";

export default function OrderSummary() {
  const navigate = useNavigate();
  const { state, dispatch } = useOrder();
  const { orderItems } = state;

  // Guard clause — se não há itens, volta ao menu
  if (orderItems.length === 0) {
    navigate("/menu");
    return null;
  }

  const total = orderItems.reduce((acc, item) => acc + item.prato.preco, 0);

  function handleRemover(index) {
    dispatch({ type: "REMOVE_ITEM", payload: index });
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <h1 className={styles.title}>Resumo do Pedido</h1>

        <div className={styles.card}>
          <p className={styles.cardLabel}>SEU PEDIDO</p>

          <ul className={styles.lista}>
            {orderItems.map((item, index) => (
              <li key={index} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemEmoji}>{item.prato.emoji}</span>
                  <div>
                    <p className={styles.itemNome}>
                      1x {item.prato.nome} = {item.prato.preco} MZN
                    </p>
                    <p className={styles.itemCustom}>
                      {[
                        ...item.customizations.free,
                        item.customizations.salt !== "Normal" &&
                          item.customizations.salt,
                        item.customizations.paid,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "Sem personalização"}
                    </p>
                  </div>
                </div>
                <button
                  className={styles.btnRemover}
                  onClick={() => handleRemover(index)}
                  title="Remover item"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>TOTAL</span>
            <span className={styles.totalValor}>{total} MZN</span>
          </div>
        </div>

        <div className={styles.acoes}>
          <button
            className={styles.btnAlterar}
            onClick={() => navigate("/menu")}
          >
            Alterar o seu pedido
          </button>
          <button
            className={styles.btnConfirmar}
            onClick={() => navigate("/delivery")}
          >
            Fazer o seu pedido
          </button>
        </div>
      </main>
    </div>
  );
}
