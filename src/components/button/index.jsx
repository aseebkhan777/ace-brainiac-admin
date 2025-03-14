import { colors, theme } from "../../utils/theme";

export default function Button({children, className, color, onClick, variant = 'contained'}){

    if(color === 'theme'){
        colors[color] = `bg-[${theme.main}] text-[${theme.soft}]`
    }

    if(variant === 'outlined'){
        return (
            <button onClick={onClick} className={`cursor-pointer px-4 py-2 border border-gray-200 text-gray-600 ${colors[color]} ${className}`}>
                {children}
            </button>
        )
    }

    return (
        <button onClick={onClick} className={`cursor-pointer px-4 py-2 bg-gray-200 text-gray-600 ${colors[color]} ${className}`}>
            {children}
        </button>
    )
}