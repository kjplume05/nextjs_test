
import ImagePreview from "./ImagePreview"

interface Props {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    file: File | null
}

export default function ImageUpload ({onChange, file}: Props) {
    return (
        <>
            <label className="cursor-pointer bg-blue-300 text-blue-700 px-4 py-2 rounded">
                Choose photo
                <input className="hidden" type="file" accept="image/*" onChange={onChange}/>
            </label>
            <ImagePreview file={file}/>
        </>
    )
}