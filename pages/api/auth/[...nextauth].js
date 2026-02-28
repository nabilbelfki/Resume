import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                emailOrUsername: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();

                if (!credentials?.emailOrUsername || !credentials?.password) {
                    throw new Error("Credentials required");
                }

                const user = await User.findOne({
                    $or: [
                        { email: credentials.emailOrUsername.toLowerCase() },
                        { username: credentials.emailOrUsername.toLowerCase() },
                    ],
                }).select("+password");

                if (!user || user.status !== "Active") {
                    throw new Error("Invalid credentials");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                // Return user object without the password
                return {
                    id: user._id.toString(), // Needs to be string for NextAuth
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                // Initial sign-in
                token.id = user.id;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.role = user.role;
                token.image = user.image;
            }

            // Handle session updates if needed
            if (trigger === "update" && session) {
                return { ...token, ...session };
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
                session.user.role = token.role;
                session.user.image = token.image;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    pages: {
        signIn: "/admin",
        error: "/admin", // Error code passed in query string as ?error=
    },
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "your-very-secure-secret-at-least-32-chars",
};

export default NextAuth(authOptions);
