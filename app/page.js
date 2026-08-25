import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";

export const revalidate = 60;

export default async function Home() {
  let products = [];
  let availableColors = [];
  try {
    products = await prisma.product.findMany({
      where: {
        salePrice: {
          not: null,
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    products = products.map(product => ({
      ...product,
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      estimatedWeightG: product.estimatedWeightG ? Number(product.estimatedWeightG) : null,
      profitMarginPct: product.profitMarginPct ? Number(product.profitMarginPct) : null,
      powerWatts: product.powerWatts ? Number(product.powerWatts) : null,
      weight1G: product.weight1G ? Number(product.weight1G) : null,
      weight2G: product.weight2G ? Number(product.weight2G) : null,
      weight3G: product.weight3G ? Number(product.weight3G) : null,
    }));

    const rolls = await prisma.filamentRoll.findMany({
      where: {
        active: true,
        status: { in: ["AVAILABLE", "LOW"] },
      },
      select: { color: true },
      distinct: ['color']
    });
    availableColors = rolls.map(r => r.color).sort();
  } catch (error) {
    console.error("Erro ao buscar produtos do ERP:", error);
  }

  return (
    <>
      <Header />
      <CartSidebar />

      {/* ===================== HERO SECTION ===================== */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Materializando o Futuro com Precisão Absoluta</h1>
          <p>
            Peças exclusivas impressas em 3D sob demanda. Qualidade profissional,
            design personalizado e a tecnologia mais avançada do mercado — direto
            para as suas mãos.
          </p>
          <a href="#catalogo" className="btn hero-cta">
            Explorar Catálogo
          </a>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Por Que Escolher a Solyd3D?</h2>
            <p>
              Combinamos tecnologia, criatividade e compromisso para entregar o
              melhor da impressão 3D.
            </p>
            <div className="section-divider" />
          </div>

          <div className="features-grid">
            <div className="glass feature-card fade-in-up fade-in-up-delay-1">
              <div
                className="feature-icon"
                style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}
              >
                🚀
              </div>
              <h3>Tecnologia de Ponta</h3>
              <p>
                Impressões de alta resolução com acabamento profissional usando
                equipamentos de última geração.
              </p>
            </div>

            <div className="glass feature-card fade-in-up fade-in-up-delay-2">
              <div
                className="feature-icon"
                style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}
              >
                ♻️
              </div>
              <h3>Materiais de Qualidade</h3>
              <p>
                Filamentos selecionados de marcas renomadas que garantem
                resistência e durabilidade em cada peça.
              </p>
            </div>

            <div className="glass feature-card fade-in-up fade-in-up-delay-3">
              <div
                className="feature-icon"
                style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}
              >
                🎨
              </div>
              <h3>Cores Exclusivas</h3>
              <p>
                Ampla variedade de cores para personalização do seu projeto.
                Escolha a cor ideal direto na loja.
              </p>
            </div>

            <div className="glass feature-card fade-in-up fade-in-up-delay-4">
              <div
                className="feature-icon"
                style={{ background: "rgba(236, 72, 153, 0.1)", color: "#ec4899" }}
              >
                ⚡
              </div>
              <h3>Produção Rápida</h3>
              <p>
                Fabricação sob demanda sem atrasos. Seu pedido entra na fila de
                produção assim que confirmado via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SOBRE NÓS ===================== */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Quem Somos</h2>
              <p>
                A <strong>Solyd3D</strong> nasceu da paixão por transformar
                ideias digitais em objetos reais. Somos um estúdio especializado
                em impressão 3D profissional, focado em entregar peças
                funcionais, decorativas e personalizadas com o mais alto padrão
                de qualidade.
              </p>
              <p>
                Desde a escolha dos materiais até o acabamento final, cada
                produto passa por um rigoroso controle de qualidade. Nosso
                compromisso é simples: materializar o que você imagina, com
                precisão absoluta.
              </p>
              <p style={{ color: "#f4f4f5", fontWeight: "500" }}>
                📍 Produção local &nbsp;·&nbsp; 🛡️ Qualidade garantida &nbsp;·&nbsp; 💬 Atendimento direto
              </p>
            </div>
            <div className="about-image-wrapper glass">
              <img
                src="/hero-bg.png"
                alt="Estúdio Solyd3D com impressora 3D em operação"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CATÁLOGO ===================== */}
      <section className="catalog-section" id="catalogo">
        <div className="container">
          <div className="section-header">
            <h2>Nossas Criações</h2>
            <p>
              Explore nossos produtos exclusivos impressos sob demanda com
              tecnologia e qualidade de ponta.
            </p>
            <div className="section-divider" />
          </div>

          {products.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "16px",
              }}
            >
              <h2>Nenhum produto encontrado.</h2>
              <p style={{ color: "#a1a1aa", marginTop: "1rem" }}>
                O banco de dados pode estar vazio ou ocorreu um erro de conexão.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  availableColors={availableColors}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="site-footer">
        <div className="container">
          <div style={{ marginBottom: "1rem" }}>
            <img src="/logo.png" alt="Solyd3D" style={{ height: "48px", objectFit: "contain" }} />
          </div>
          <div className="footer-links">
            <a href="#catalogo">Catálogo</a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
          <p className="footer-copy">
            &copy; 2025 Solyd3D — Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
