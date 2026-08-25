"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProductAction(id, data) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        salePrice: data.salePrice !== "" ? Number(data.salePrice) : null,
      },
    });

    // Revalidate paths so the changes appear immediately
    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return { success: false, error: "Falha ao atualizar o produto." };
  }
}
