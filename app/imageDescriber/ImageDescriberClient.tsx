"use client"

import { useEffect, useState } from "react"
import type { Image } from "@/app/generated/prisma/client"
import { fileToB64 } from "@/app/lib/helpers"
import Button from "@/components/Button"
import ImageUpload from "@/components/ImageUpload"

export default function ImageDescriberClient() {
  const [images, setImages] = useState<Image[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState<string>("")
  const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(true)

  useEffect(() => { fetchImages() }, [])

  async function fetchImages() {
    const res = await fetch("/api/upload")
    const data = await res.json()
    setImages(data)
  }

  async function handleUpload() {
    if (!file) return
    setButtonsDisabled(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("description", description)

    await fetch("/api/upload", { method: "POST", body: formData })
    fetchImages()
    setButtonsDisabled(false)
  }

  async function handleDescription() {
    setDescription("")
    setButtonsDisabled(true)
    if (!file) {
      console.log("NO FILE")
      return
    }

    const b64File = await fileToB64(file)

    const resp = await fetch("/api/describe", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ b64File })
    })

    if (!resp.body) {
      throw new Error("Readable is not Supported")
    }

    const reader = resp.body.getReader()

    const read = async () => {
      while (true) {
        const { done, value } = await reader.read()
        if (done) return
        const text = new TextDecoder("utf-8").decode(value)
        if (!text.includes("END_STREAM")) {
          setDescription((prev) => prev + text)
        }
      }
    }

    await read()
    setButtonsDisabled(false)
  }

  function onFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null)
    setDescription("")
    setButtonsDisabled(false)
  }

  return (
    <>
      <h1>Image upload</h1>
      <div className="flex flex-col">
        <ImageUpload onChange={onFileSelect} file={file} />
        <Button onClick={handleDescription} disabled={buttonsDisabled} extraStyles="bg-orange-300">DESCRIBE!</Button>
        <Button onClick={handleUpload} disabled={buttonsDisabled} extraStyles="bg-green-300">SAVE!</Button>
        <div>{description}</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 32 }}>
        {images.map(img => (
          <div key={img.id}>
            <img
              src={`/api/images/${encodeURIComponent(img.filename)}`}
              style={{ width: 200, height: 200, objectFit: "cover" }}
            />
            <label>{img.description}</label>
          </div>
        ))}
      </div>
    </>
  )
}
