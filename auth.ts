import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Code",
      credentials: {
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.code) return null;
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/code/verification`,
            {
              method: "POST",
              body: JSON.stringify({ code: credentials.code }),
              headers: { "Content-Type": "application/json" },
            }
          );
          const user = await res.json();

          if (res.ok && user) {
            return user;
          }
        } catch (error) {
          return null;
        }

        return null;
      },
    }),
    GoogleProvider({
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              method: "POST",
              body: JSON.stringify({
                email: user.email,
                avatarUrl: user.image,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to authenticate with backend");
          }
          const data = await response.json();

          user.accessToken = data.accessToken as string;
          user.refreshToken = data.refreshToken as string;
          user.userState = data.userState as "old" | "new";

          return true;
        } catch (error) {
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        // Première connexion
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          userState: user.userState,
          expiresAt: Date.now() + 3600 * 1000, // Supposons que le token expire dans 1 heure
        };
      }

      // Vérifier si le token a expiré
      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      // Le token a expiré, essayons de le rafraîchir
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          },
        );

        if (!response.ok) {
          throw new Error("Échec du rafraîchissement du token");
        }

        const refreshedTokens = await response.json();

        return {
          ...token,
          accessToken: refreshedTokens.accessToken,
          refreshToken: refreshedTokens.refreshToken ?? token.refreshToken, // Garder l'ancien refresh token si un nouveau n'est pas fourni
          expiresAt: Date.now() + 3600 * 1000, // Mettre à jour l'expiration
        };
      } catch (error) {
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      session.user.userState = token.userState as "old" | "new";
      session.error = token.error as "RefreshAccessTokenError" | undefined;

      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  debug: process.env.NODE_ENV === "development",
});
