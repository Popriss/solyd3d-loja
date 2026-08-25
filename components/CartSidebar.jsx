"use client";

import { X, Plus, Minus, Trash2 } from "lucide-react";
import styles from "./components.module.css";
import { useCart } from "@/context/CartContext";
import { generateWhatsAppLink } from "@/utils/whatsapp";
import { getWhatsAppNumber } from "@/app/actions/config";

export default function CartSidebar() {
  const { isCartOpen, setIsCartOpen, cartItems, dispatch, cartTotal } = useCart();

  const handleUpdateQty = (id, newQty) => {
    if (newQty < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQty } });
  };

  const handleRemoveItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const formattedTotal = `R$ ${Number(cartTotal).toFixed(2).replace('.', ',')}`;

  const handleCheckout = async () => {
    import("@/app/actions/metrics").then((m) => m.trackClick("checkout"));
    
    // Fetch directly from DB to bypass any page cache
    const currentWppNumber = await getWhatsAppNumber();
    
    const link = generateWhatsAppLink(cartItems, cartTotal, currentWppNumber);
    window.open(link, "_blank");
  };

  return (
    <>
      <div
        className={`${styles.sidebarOverlay} ${isCartOpen ? styles.open : ""}`}
        onClick={() => setIsCartOpen(false)}
      />
      <div className={`${styles.sidebar} ${isCartOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2>Seu Carrinho</h2>
          <button
            className={styles.closeBtn}
            onClick={() => setIsCartOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className={styles.cartItems}>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: "center", color: "#a1a1aa", marginTop: "2rem" }}>
              Seu carrinho está vazio.
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={item.imageUrl || "https://via.placeholder.com/60"}
                  alt={item.name}
                  className={styles.cartItemImg}
                />
                <div className={styles.cartItemInfo}>
                  <h4 className={styles.cartItemTitle}>{item.name}</h4>
                  <div className={styles.cartItemPrice}>
                    {`R$ ${Number(item.salePrice || 0).toFixed(2).replace('.', ',')}`}
                  </div>
                  <div className={styles.qtyControls}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveItem(item.id)}
                  title="Remover Item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.sidebarFooter}>
            <div className={styles.totalRow}>
              <span>Total:</span>
              <span>{formattedTotal}</span>
            </div>
            <button className={`btn ${styles.checkoutBtn}`} onClick={handleCheckout}>
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
}
