export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function POST(req: NextRequest) {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const description = formData.get("description") as string

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = Date.now() + "_" + file.name
    const filepath = path.join(process.cwd(), "public/uploads", filename)
    await writeFile(filepath, buffer)

    await prisma.image.create({ data: { filename, description } })

    return NextResponse.json({ success: true })
}

export async function GET() {
    const images = await prisma.image.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(images)
}