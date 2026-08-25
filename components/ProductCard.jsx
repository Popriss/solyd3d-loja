"use client";

import { ShoppingCart } from "lucide-react";
import styles from "./components.module.css";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    import("@/app/actions/metrics").then((m) => m.trackClick(`add_to_cart_${product.id}`));
    dispatch({ type: "ADD_ITEM", payload: product });
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
