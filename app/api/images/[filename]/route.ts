import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params
    const filepath = path.join(process.cwd(), "public/uploads", filename)
    const file = await readFile(filepath)

    return new NextResponse(file, {
        headers: { "Content-Type": "image/*" }
    })
}