import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(params: any) {
      // Allow all Google users
      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Always redirect to homepage after login
      return baseUrl;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Pass user info to session
      if (token && session.user) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        // Call backend to upsert user
        try {
          await fetch('http://localhost:8000/api/users/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: token.email,
              full_name: token.name,
              avatar_url: token.picture,
              google_id: token.sub || token.id
            }),
          });
        } catch (e) {
          // Optionally log error
        }
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      // Add user info to token on sign in
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
