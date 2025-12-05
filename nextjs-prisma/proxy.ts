import { NextRequest, NextResponse } from "next/server";

// Rotas protegidas - personalize conforme o app
const protectedPaths = ["/dashboard", "/api/users"];
// NextAuth v5 cookie
const SESSION_COOKIE = "authjs.session-token";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;
  const session = req.cookies.get(SESSION_COOKIE)?.value;

  // Logging
  console.log(`[PROXY] ${req.method} ${path}`);

  // NUNCA retorne resposta no Edge (apenas next(), redirect() ou rewrite())
  // Em vez de handle CORS diretamente para OPTIONS, siga o fluxo normalmente, adicione headers no next

  // Exemplo: reescrever URLs antigas/padrões
  if (path === "/login-old") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Bloqueio com redirecionamento para login
  if (protectedPaths.some(p => path.startsWith(p)) && !session) {
    url.pathname = "/login";
    url.searchParams.set("from", path);
    return NextResponse.redirect(url);
  }

  // Headers customizados & CORS leve adicionados em todas respostas
  const res = NextResponse.next();
  res.headers.set("X-Proxy", "enabled");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  // Use headers pass-through, mas nunca retorne uma resposta body no middleware

  // Cache leve apenas para rotas públicas (exemplo)
  if (path.startsWith("/public")) {
    res.headers.set("Cache-Control", "public,max-age=60,s-maxage=60");
  } else {
    res.headers.set("Cache-Control", "no-store");
  }

  // Logging extra para APIs
  if (path.startsWith("/api")) {
    console.log(`[PROXY][API] headers:`, Object.fromEntries(req.headers));
  }

  // Bloquear rota banida: faça redirect ou apenas next, mas NÃO envie resposta body
  if (path === "/api/banido") {
    url.pathname = "/error/forbidden";
    return NextResponse.redirect(url);
  }

  return res;
}

// Configuração de matcher para Next.js 16+
export const config = {
  matcher: ["/((?!_next|static|favicon.ico|logo|fonts).*)"],
};
