import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: "Email/Username", type: "text" }, // ✅ Match "identifier"
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, any>): Promise<any> {
        await dbConnect();
        try {
          // Check for "identifier" instead of "email"
          if (!credentials.identifier || !credentials.password) {
            throw new Error("Missing identifier or password");
          }
      
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier }, // Search by email
              { username: credentials.identifier }, // Search by username
            ],
          });
          console.log("User found:", user); // Debugging log

          if (!user) {
            throw new Error('User not found with the provided Email or Username!');
          }

          if (!user.isVerified) {
            throw new Error('Please verify your email before signing in.');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error('Invalid Password!');
          }

          return user;
        } catch (error) {
          console.error('Authorization Error:', error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};