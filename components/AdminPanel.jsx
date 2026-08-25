"use client";

import { useState } from "react";
import { updateProductAction } from "@/app/actions/product";
import { setWhatsAppNumber } from "@/app/actions/config";
import { Edit2, X, LogOut, Package, Settings, BarChart2, MessageCircle, MousePointer2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

export default function AdminPanel({ initialProducts, initialWppNumber, initialMetrics }) {
  const [activeTab, setActiveTab] = useState("catalogo");
  
  // Catalog State
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Config State
  const [wppNumber, setWpp] = useState(initialWppNumber);
  const [wppSaving, setWppSaving] = useState(false);

  const router = useRouter();

  const handleEditClick = (product) => {
    setEditingProduct({ ...product });
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await updateProductAction(editingProduct.id, {
      name: editingProduct.name,
      description: editingProduct.description,
      imageUrl: editingProduct.imageUrl,
      salePrice: editingProduct.salePrice,
    });

    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...editingProduct } : p))
      );
      setEditingProduct(null);
    } else {
      alert(res.error || "Erro ao salvar.");
    }
    setLoading(false);
  };

  const handleSaveWpp = async (e) => {
    e.preventDefault();
    setWppSaving(true);
    const res = await setWhatsAppNumber(wppNumber);
    if (res.success) {
      alert("Número do WhatsApp atualizado com sucesso!");
    } else {
      alert(res.error || "Erro ao atualizar WhatsApp.");
    }
    setWppSaving(false);
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push("/admin/login");
  };

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>Painel Admin</h1>
        <button onClick={handleLogout} className="btn" style={{ background: "#ef4444" }}>
          <LogOut size={18} /> Sair
        </button>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #27272a", paddingBottom: "1rem" }}>
        <button 
          onClick={() => setActiveTab("catalogo")} 
          style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: activeTab === "catalogo" ? "rgba(59, 130, 246, 0.1)" : "transparent", color: activeTab === "catalogo" ? "#3b82f6" : "#a1a1aa", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "500", transition: "all 0.2s" }}
        >
          <Package size={18} /> Catálogo
        </button>
        <button 
          onClick={() => setActiveTab("configuracoes")} 
          style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: activeTab === "configuracoes" ? "rgba(59, 130, 246, 0.1)" : "transparent", color: activeTab === "configuracoes" ? "#3b82f6" : "#a1a1aa", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "500", transition: "all 0.2s" }}
        >
          <Settings size={18} /> Configurações
        </button>
        <button 
          onClick={() => setActiveTab("metricas")} 
          style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: activeTab === "metricas" ? "rgba(59, 130, 246, 0.1)" : "transparent", color: activeTab === "metricas" ? "#3b82f6" : "#a1a1aa", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "500", transition: "all 0.2s" }}
        >
          <BarChart2 size={18} /> Métricas
        </button>
      </div>

      {activeTab === "catalogo" && (
        <div className="glass" style={{ padding: "1rem", overflowX: "auto", background: "rgba(20, 20, 25, 0.6)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: "600" }}>ID</th>
                <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: "600" }}>Imagem</th>
                <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: "600" }}>Nome do Produto</th>
                <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: "600" }}>Preço</th>
                <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: "600", textAlign: "center" }}>Editar</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1rem", color: "#a1a1aa" }}>#{product.id}</td>
                  <td style={{ padding: "1rem" }}>
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/50"}
                      alt={product.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  </td>
                  <td style={{ padding: "1rem", fontWeight: "500" }}>{product.name}</td>
                  <td style={{ padding: "1rem", color: "var(--success)" }}>
                    {product.salePrice
                      ? `R$ ${Number(product.salePrice).toFixed(2).replace(".", ",")}`
                      : "-"}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {product.salePrice ? (
                      <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>
                        Disponível
                      </span>
                    ) : (
                      <span style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>
                        Oculto
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <button onClick={() => handleEditClick(product)} className="btn" style={{ padding: "0.5rem 1rem", background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                      <Edit2 size={16} /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "configuracoes" && (
        <div className="glass" style={{ padding: "2rem", maxWidth: "600px", background: "rgba(20, 20, 25, 0.6)" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "600" }}>Configurações Gerais</h2>
          <form onSubmit={handleSaveWpp}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#a1a1aa", fontSize: "0.9rem" }}>
                Número do WhatsApp para Receber Pedidos
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#10b981" }}>
                  <MessageCircle size={20} />
                </span>
                <input 
                  type="text" 
                  value={wppNumber}
                  onChange={(e) => setWpp(e.target.value)}
                  style={{ width: "100%", padding: "0.875rem 0.875rem 0.875rem 3rem", borderRadius: "8px", border: "1px solid #3f3f46", background: "#18181b", color: "#f4f4f5", outline: "none", transition: "border 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#10b981"}
                  onBlur={(e) => e.target.style.borderColor = "#3f3f46"}
                  placeholder="Ex: 5511999999999"
                  required
                />
              </div>
              <p style={{ marginTop: "0.5rem", color: "#71717a", fontSize: "0.8rem" }}>
                Inclua o código do país e DDD (ex: 55 para Brasil). Apenas números.
              </p>
            </div>
            <button type="submit" className="btn" disabled={wppSaving} style={{ background: "#10b981", color: "#000" }}>
              {wppSaving ? "Salvando..." : "Salvar Configurações"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "metricas" && (
        <div>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "600" }}>Métricas de Interação</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
            
            <div className="glass" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", background: "rgba(20, 20, 25, 0.6)" }}>
              <div style={{ padding: "1rem", background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", borderRadius: "12px" }}>
                <ShoppingCart size={28} />
              </div>
              <div>
                <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Adições ao Carrinho</p>
                <p style={{ fontSize: "1.8rem", fontWeight: "700" }}>{initialMetrics["add_to_cart_total"] || 0}</p>
              </div>
            </div>

            <div className="glass" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", background: "rgba(20, 20, 25, 0.6)" }}>
              <div style={{ padding: "1rem", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "12px" }}>
                <MessageCircle size={28} />
              </div>
              <div>
                <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Finalização (Checkout)</p>
                <p style={{ fontSize: "1.8rem", fontWeight: "700" }}>{initialMetrics["checkout"] || 0}</p>
              </div>
            </div>

            <div className="glass" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", background: "rgba(20, 20, 25, 0.6)" }}>
              <div style={{ padding: "1rem", background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", borderRadius: "12px" }}>
                <MousePointer2 size={28} />
              </div>
              <div>
                <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Abertura do Carrinho</p>
                <p style={{ fontSize: "1.8rem", fontWeight: "700" }}>{initialMetrics["open_cart"] || 0}</p>
              </div>
            </div>

            <div className="glass" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", background: "rgba(20, 20, 25, 0.6)" }}>
              <div style={{ padding: "1rem", background: "rgba(236, 72, 153, 0.1)", color: "#ec4899", borderRadius: "12px" }}>
                <Settings size={28} />
              </div>
              <div>
                <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Cliques no Admin</p>
                <p style={{ fontSize: "1.8rem", fontWeight: "700" }}>{initialMetrics["admin_button"] || 0}</p>
              </div>
            </div>

          </div>

          <div style={{ marginTop: "3rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem" }}>Adições ao Carrinho (Por Produto)</h3>
            <div className="glass" style={{ padding: "1rem", overflowX: "auto", background: "rgba(20, 20, 25, 0.6)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: "600" }}>ID Produto</th>
                    <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: "600" }}>Qtd de Cliques</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(initialMetrics)
                    .filter(([key]) => key.startsWith("add_to_cart_") && key !== "add_to_cart_total")
                    .sort((a, b) => b[1] - a[1])
                    .map(([key, count]) => {
                      const productId = key.split("_").pop();
                      return (
                        <tr key={key} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "1rem", color: "#f4f4f5" }}>#{productId}</td>
                          <td style={{ padding: "1rem", color: "#10b981", fontWeight: "600" }}>{count}</td>
                        </tr>
                      );
                    })}
                  {Object.keys(initialMetrics).filter(k => k.startsWith("add_to_cart_") && k !== "add_to_cart_total").length === 0 && (
                    <tr>
                      <td colSpan="2" style={{ padding: "1rem", textAlign: "center", color: "#a1a1aa" }}>Nenhum produto foi adicionado ainda.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
        }}>
          <div style={{ 
            width: "100%", maxWidth: "550px", padding: "2.5rem", position: "relative",
            background: "#121214", border: "1px solid #27272a", borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
          }}>
            <button onClick={handleCloseModal} style={{ 
              position: "absolute", top: "1.5rem", right: "1.5rem", background: "rgba(255,255,255,0.05)", 
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", padding: "0.5rem",
              color: "#a1a1aa", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: "2rem", fontSize: "1.5rem", fontWeight: "700", borderBottom: "1px solid #27272a", paddingBottom: "1rem" }}>
              Editar Produto
            </h2>
            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#e4e4e7", fontWeight: "500" }}>Nome do Produto</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  style={{ width: "100%", padding: "0.875rem", borderRadius: "8px", border: "1px solid #3f3f46", background: "#18181b", color: "#f4f4f5", outline: "none", transition: "border 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#3f3f46"}
                  required
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#e4e4e7", fontWeight: "500" }}>Link da Imagem (URL)</label>
                <input
                  type="text"
                  value={editingProduct.imageUrl || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  style={{ width: "100%", padding: "0.875rem", borderRadius: "8px", border: "1px solid #3f3f46", background: "#18181b", color: "#f4f4f5", outline: "none", transition: "border 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#3f3f46"}
                  placeholder="https://exemplo.com/imagem.png"
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#e4e4e7", fontWeight: "500" }}>
                  Preço de Venda <span style={{ color: "#a1a1aa", fontWeight: "400", fontSize: "0.8rem" }}>(Deixe vazio para ocultar da loja)</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#a1a1aa" }}>R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.salePrice || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value })}
                    style={{ width: "100%", padding: "0.875rem 0.875rem 0.875rem 2.5rem", borderRadius: "8px", border: "1px solid #3f3f46", background: "#18181b", color: "#f4f4f5", outline: "none", transition: "border 0.2s" }}
                    onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                    onBlur={(e) => e.target.style.borderColor = "#3f3f46"}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#e4e4e7", fontWeight: "500" }}>Descrição</label>
                <textarea
                  rows="4"
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  style={{ width: "100%", padding: "0.875rem", borderRadius: "8px", border: "1px solid #3f3f46", background: "#18181b", color: "#f4f4f5", fontFamily: "inherit", outline: "none", transition: "border 0.2s", resize: "vertical" }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#3f3f46"}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: "0.75rem 1.5rem", background: "transparent", color: "#a1a1aa", border: "none", cursor: "pointer", fontWeight: "500" }}
                  onMouseEnter={(e) => e.target.style.color = "white"}
                  onMouseLeave={(e) => e.target.style.color = "#a1a1aa"}>
                  Cancelar
                </button>
                <button type="submit" className="btn" disabled={loading} style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
