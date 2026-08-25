"use server";

import { prisma } from "@/lib/prisma";

export async function trackClick(eventName) {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: "STOREFRONT_METRICS" },
    });

    let metrics = {};
    if (config && config.value) {
      try {
        metrics = JSON.parse(config.value);
      } catch (e) {
        metrics = {};
      }
    }

    // Incrementar o evento específico
    metrics[eventName] = (metrics[eventName] || 0) + 1;

    // Se for uma adição ao carrinho de um item específico, também incrementamos o total
    if (eventName.startsWith("add_to_cart_")) {
      metrics["add_to_cart_total"] = (metrics["add_to_cart_total"] || 0) + 1;
    }

    await prisma.systemConfig.upsert({
      where: { key: "STOREFRONT_METRICS" },
      update: { value: JSON.stringify(metrics) },
      create: { key: "STOREFRONT_METRICS", value: JSON.stringify(metrics), label: "Métricas de Cliques da Loja" },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao rastrear clique:", error);
    return { success: false };
  }
}

export async function getMetrics() {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: "STOREFRONT_METRICS" },
    });
    return config && config.value ? JSON.parse(config.value) : {};
  } catch (error) {
    return {};
  }
}
