import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      accessToken: string;
      refreshToken: string;
      userState: "old" | "new";
    };
    error?: "RefreshAccessTokenError";
  }

  interface User {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    userState: "old" | "new";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    userState: "old" | "new";
    expiresAt: number;
    error?: "RefreshAccessTokenError";
  }
}
