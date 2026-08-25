"use client";

import { ShoppingCart } from "lucide-react";
import styles from "./components.module.css";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function ProductCard({ product, availableColors = [] }) {
  const { dispatch } = useCart();
  const [selectedColor, setSelectedColor] = useState(availableColors.length > 0 ? availableColors[0] : "");

  const handleAddToCart = () => {
    import("@/app/actions/metrics").then((m) => m.trackClick(`add_to_cart_${product.id}`));
    dispatch({ type: "ADD_ITEM", payload: { ...product, selectedColor } });
  };

  const formattedPrice = `R$ ${Number(product.salePrice || 0).toFixed(2).replace('.', ',')}`;

  return (
    <div className={`glass ${styles.productCard}`}>
      <div className={styles.imageWrapper}>
        <img
          src={product.imageUrl || "https://via.placeholder.com/250x250?text=Sem+Imagem"}
          alt={product.name}
          className={styles.productImage}
        />
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{product.name}</h3>
        <div className={styles.productDesc}>
          {product.description || "Nenhuma descrição disponível."}
        </div>
        
        {availableColors.length > 0 && (
          <div style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#a1a1aa", marginBottom: "0.5rem" }}>Cor do Material</label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: "0.35rem 0.85rem",
                    borderRadius: "9999px",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    border: selectedColor === color ? "1px solid #3b82f6" : "1px solid #3f3f46",
                    background: selectedColor === color ? "rgba(59, 130, 246, 0.15)" : "rgba(0,0,0,0.2)",
                    color: selectedColor === color ? "#3b82f6" : "#a1a1aa",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (selectedColor !== color) {
                      e.target.style.borderColor = "#71717a";
                      e.target.style.color = "#e4e4e7";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedColor !== color) {
                      e.target.style.borderColor = "#3f3f46";
                      e.target.style.color = "#a1a1aa";
                    }
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className={styles.productFooter}>
          <span className={styles.productPrice}>{formattedPrice}</span>
          <button className={`btn ${styles.btn}`} onClick={handleAddToCart}>
            <ShoppingCart size={18} /> Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
