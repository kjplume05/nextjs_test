
interface Props {
    onClick: () => void
    disabled: boolean
    extraStyles? : string
    children: string
}

export default function Button({ extraStyles, disabled, onClick, children }: Props) {
    return (
        <button className={`
            cursor-pointer
            ${extraStyles}
            disabled:cursor-not-allowed disabled:opacity-50
            enabled:hover:opacity-80
            `} 
            onClick={onClick} 
            disabled={disabled}
        >
            {children}
        </button> 
    )
}