import { NextResponse, NextRequest } from "next/server";

import { auth, signOut } from "@/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  const { pathname } = request.nextUrl;

  // Gestion de l'erreur de rafraîchissement du token
  if (session?.error === "RefreshAccessTokenError") {
    // Utiliser signOut pour déconnecter l'utilisateur
    await signOut({ redirectTo: "/auth" });

    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (!session && !pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    session &&
    session.user.userState === "new" &&
    !pathname.startsWith("/auth")
  ) {
    return NextResponse.redirect(new URL("/auth?step=3", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|$|faqs|about|help|terms|auth|api/auth).*)",
    "/workspaces/:path*",
  ],
};
