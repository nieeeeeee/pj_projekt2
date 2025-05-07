import NextAuth from 'next-auth';
import { authOptions } from './config';

// Directly use authOptions with NextAuth
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
