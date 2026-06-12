import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { readFile } from "fs/promises"
import ollama from "ollama"

export async function POST(req: NextRequest) {

    const { b64File } = await req.json()

    // console.log(b64File)

    const resp = await ollama.chat({
        model: "llava",
        messages: [
            {
                role: "user",
                content: "Describe this image in one sentence. Dont use any fillers, the response you give will be written as a description to the image.",
                images: [b64File],
            }
        ],
        stream: true
    })

    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of resp) {
                const text = chunk.message.content
                controller.enqueue(new TextEncoder().encode(text))
            }
            controller.close()
        }
    })

    return new NextResponse(stream)
}