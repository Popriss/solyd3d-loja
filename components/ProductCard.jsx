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
          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#a1a1aa", marginBottom: "0.25rem" }}>Cor do Material</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #3f3f46", background: "rgba(0,0,0,0.2)", color: "#f4f4f5", outline: "none", cursor: "pointer", fontSize: "0.9rem" }}
            >
              {availableColors.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
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
