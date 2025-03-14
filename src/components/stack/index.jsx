export function Stack({children, direction = "vertical", style, className}){
    return (
        <div className={`flex flex-${direction === 'vertical' ? 'col' : 'row'} ${className}`} style={style}>
            {children}
        </div>
    )
}