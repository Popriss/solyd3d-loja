import { prisma } from "@/lib/prisma";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic"; // Sempre busca dados frescos no admin

export default async function AdminPage() {
  let products = [];
  try {
    products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    products = products.map((product) => ({
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
    console.error("Erro ao carregar produtos no Admin:", error);
  }

  let wppNumber = "5511999999999";
  let metrics = {};
  
  try {
    const configModule = await import("@/app/actions/config");
    wppNumber = await configModule.getWhatsAppNumber();
    
    const metricsModule = await import("@/app/actions/metrics");
    metrics = await metricsModule.getMetrics();
  } catch (err) {
    console.error("Erro ao buscar configurações no Admin:", err);
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminPanel initialProducts={products} initialWppNumber={wppNumber} initialMetrics={metrics} />
    </div>
  );
}
