"use client"

import { useEffect, useState } from "react"
import type { Image } from "@/app/generated/prisma/client"
import { fileToB64 } from "./lib/helpers"

export default function Home() {
  const [images, setImages] = useState<Image[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState<string>("")
  const [saveDisabled, setSaveDisabled] = useState<boolean>(true)

  async function fetchImages() {
    const res = await fetch("/api/upload")
    const data = await res.json()
    setImages(data)
  }

  async function handleUpload() {
    if (!file) {
      return
    }
    setSaveDisabled(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("description", description)

    await fetch("/api/upload", { method: "POST", body: formData })
    fetchImages()
    setSaveDisabled(false)
  }

  async function handleDescription() {
    setDescription("")
    setSaveDisabled(true)
    if (!file) return 

    const b64File = await fileToB64(file)

    const resp = await fetch("/api/describe", { 
      method: "POST", 
      headers: {"Content-type": "application/json"}, 
      body: JSON.stringify({ b64File })
    })

    if (!resp.body) {
      throw new Error("Readable is not Supported")
    }

    const reader = resp.body.getReader()

    const read = async () => {
      while (true) {
        const { done, value } = await reader.read();
        console.log("done:", done, "value:", value)
        if (done) {
          return
        }

        const text = new TextDecoder("utf-8").decode(value);
        if (!text.includes("END_STREAM")) {
          setDescription((prev) => prev + text);
        }
      }
    }

    await read()
    setSaveDisabled(false)
    return
  }

  useEffect(() => { fetchImages() }, [])

  return (
    <main style={{ padding: 40 }}>
      <h1>Image upload</h1>
      <input type="file" accept="image/*" onChange={(event) => {
        setFile(event.target.files?.[0] ?? null)
        setDescription("")
      }}/>
      <button onClick={handleDescription}>DESCRIBE!</button>
      <button onClick={handleUpload} disabled={saveDisabled}>SAVE!</button>
      <div>{description}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 32}}>
        {images.map(img => (
          <div key={img.id}>
            <img
              key={img.id}
              src={`/api/images/${encodeURIComponent(img.filename)}`}
              style={{ width: 200, height: 200, objectFit: "cover"}}
            />
            <label>{img.description}</label>
          </div>
        ))}
      </div>
    </main>
  )
}
