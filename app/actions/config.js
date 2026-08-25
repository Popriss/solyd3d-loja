"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWhatsAppNumber() {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: "WHATSAPP_NUMBER" },
    });
    return config ? config.value : "5511999999999";
  } catch (error) {
    console.error("Erro ao buscar WHATSAPP_NUMBER", error);
    return "5511999999999";
  }
}

export async function setWhatsAppNumber(number) {
  try {
    await prisma.systemConfig.upsert({
      where: { key: "WHATSAPP_NUMBER" },
      update: { value: number },
      create: { key: "WHATSAPP_NUMBER", value: number, label: "Número do WhatsApp para Pedidos" },
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar WHATSAPP_NUMBER", error);
    return { success: false, error: "Erro ao salvar o número." };
  }
}
