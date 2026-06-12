import Image from "next/image"

interface F {
    file: File | null
}

export default function ImagePreview({ file }: F) {
    const url = file ? URL.createObjectURL(file) : null

    if (!url) return null
    return <Image src={url} alt={"Image missing"} width={300} height={200} />
}