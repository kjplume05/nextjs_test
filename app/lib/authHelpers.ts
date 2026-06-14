import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function getUserFromDb(email: string) {
    const user = await prisma.user.findUnique({
        where: { email: email }
    })

    if (!user) {
        return null
    }

    return user
}