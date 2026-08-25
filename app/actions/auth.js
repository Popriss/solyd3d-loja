"use server";

import { cookies } from "next/headers";

export async function loginAction(formData) {
  
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    // Set a simple cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Senha incorreta" };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
