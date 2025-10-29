import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";



export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email', type: 'email', placeholder: 'Enter your email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
      },
      async authorize(credentials) {
        // for sign in 
        // console.log("credentials : ", credentials)
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.identifier },
        });

        if (!user) {
          throw new Error('No user found with this email');
        }
        if (!user.isVerified) {
          throw new Error("Please verify your email before logging in");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id.toString(),
          email: user.email,
          fullname: user.fullName,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth',
    signOut: '/auth',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try{
        // console.log("Provider:", account?.provider);
        // console.log("User:", user);
        if (!user.email) {
          return false;
        }

        let existingUser  = await prisma.user.findUnique({
            where: { email: user.email },
        });

        if (!existingUser) {
          const strongPassword = crypto.randomBytes(16).toString("hex");

          existingUser = await prisma.user.create({
            data: {
              email: user.email,
              fullName: user.name || profile?.name || "Unnamed User",
              image: user.image || null,
              password: strongPassword,
              verifyCode: crypto.randomInt(100000, 999999).toString(),
              isVerified: true,
              experienceLevel: "junior",
              targetCompanySize: "small",
              industry: [],
              targetRoles: [],
              focusArea: [],
              provider: account?.provider || "credentials",
            },
          });
        }
        
        user.id = existingUser.id;
        user.name = existingUser.fullName;

        return true
      }
      catch(err){
         console.log("SIGNIN ERROR: ", err);
        return false;
      }
    },
    async jwt({ token, user }) {
      // console.log("user : ", user);
      // console.log("Token :", token)

      if(user){
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      
      return token
    },
    async session({ session, token }) {
      // console.log("Session : ", session)
      // console.log("Token: ", token)
      if(token){
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
