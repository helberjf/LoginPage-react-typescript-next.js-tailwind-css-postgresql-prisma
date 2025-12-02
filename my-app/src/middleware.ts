// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware para proteger rotas (dashboard).
 * Lógica:
 *  - captura cookie da requisição
 *  - fetch para /api/auth/session passando o cookie
 *  - se session válida -> next
 *  - se não -> redireciona para /(auth)/login
 *
 * Nota: esse fetch funciona com Auth.js endpoint /api/auth/session que retornamos no projeto.
 * Em produção use a URL absoluta (request.nextUrl.origin) para evitar problemas com builds no vercel/railway.
 */

export async function middleware(req: NextRequest) {
  const { nextUrl, headers } = req;

  // caminhos protegidos (ajuste se necessário)
  const pathname = nextUrl.pathname;

  // Proteger tudo sob /dashboard (e subpaths)
  const shouldProtect = pathname.startsWith("/dashboard") || pathname.startsWith("/(dashboard)");

  if (!shouldProtect) {
    return NextResponse.next();
  }

  // pega cookies da requisição
  const cookie = headers.get("cookie") ?? "";

  // monta URL absoluta
  const base = req.nextUrl.origin; // funciona tanto local quanto em produção
  const sessionUrl = `${base}/api/auth/session`;

  try {
    const res = await fetch(sessionUrl, {
      headers: { cookie },
      cache: "no-store",
    });

    if (!res.ok) {
      // não autenticado
      const loginUrl = new URL("/(auth)/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    const session = await res.json().catch(() => null);

    if (!session?.user) {
      const loginUrl = new URL("/(auth)/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // autenticado -> permite continuar
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware auth error:", err);
    const loginUrl = new URL("/(auth)/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure o matcher para os caminhos que você quer proteger (opcional).
export const config = {
  matcher: ["/dashboard/:path*", "/(dashboard)/:path*"],
};
