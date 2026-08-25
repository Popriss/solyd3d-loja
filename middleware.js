import { NextResponse } from "next/server";

export function middleware(request) {
  // Somente protege as rotas /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Permite acessar a tela de login
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    const session = request.cookies.get("admin_session");

    if (!session || session.value !== "true") {
      // Redireciona para o login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
