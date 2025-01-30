import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export const authOptions: NextAuthOptions = {
  debug: true,  // Add this to enable detailed logging
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: Record<string, any>): Promise<any> {
        await dbConnect();
        try {
          if (!credentials.email || !credentials.password) {
            throw new Error("Missing email or password");
          }
      
          const user = await UserModel.findOne({
            $or: [{ email: credentials.email }, { username: credentials.email }],
          });
      
          if (!user) {
            throw new Error("User not found with the provided Email or Username!");
          }
      
          if (!user.isVerified) {
            throw new Error("User is not Verified!");
          }
      
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid Password!");
          }
      
          return user;
        } catch (err) {
          console.error("Authorization Error:", err.message); // Debugging log
          throw new Error(err.message);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback:", token, user);  // Debugging log
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback:", session, token);  // Debugging log
      if (session.user) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    }
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};


