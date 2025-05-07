import NextAuth from "next-auth";
import { authOptions } from "~/server/auth/config";

// For NextAuth v5 with App Router, we need to use the handler function directly
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
