import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";

export const revalidate = 60; // ISR para manter performance e atualizar a cada 60s

export default async function Home() {
  let products = [];
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
    
    // Convert decimal numbers to string/number for client components
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
  } catch (error) {
    console.error("Erro ao buscar produtos do ERP:", error);
  }

  return (
    <>
      <Header />
      <CartSidebar />
      <main className="container" style={{ padding: "4rem 2rem" }}>
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1rem" }}>
            Catálogo de Produtos 3D
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Explore nossos produtos exclusivos impressos sob demanda com tecnologia e qualidade de ponta.
          </p>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", background: "rgba(255,255,255,0.02)", borderRadius: "16px" }}>
            <h2>Nenhum produto encontrado.</h2>
            <p style={{ color: "#a1a1aa", marginTop: "1rem" }}>
              O banco de dados pode estar vazio ou ocorreu um erro de conexão.
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "2rem"
          }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
