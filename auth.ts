import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import { getUserFromDb } from "@/app/lib/authHelpers"
import { ZodError } from "zod";
import { signInSchema } from "./app/lib/zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub, 
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "email",
                    placeholder: "johndoe@gmail.com",
                },
                password: {
                    type: "password",
                    label: "Password",
                    placeholder: "*****",
                }
            },
            authorize: async (credentials) => {
                try {
                    const { email, password } = await signInSchema.parseAsync(credentials)

                    let user = await getUserFromDb(email as string)

                    if (!user || !user.passwordHash) return null

                    const match = await bcrypt.compare(password as string, user.passwordHash)

                    if (!match) return null
                    
                    return {
                        id: String(user.id),
                        email: user.email,
                    }
                } catch (error) {
                    if (error instanceof ZodError) {
                        return null
                    }
                    throw error
                }
            }
        }),
    ]
})