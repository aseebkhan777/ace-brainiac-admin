export default function Chip({children, className, color}){
    const colors = {
        'gray': 'bg-gray-200 text-gray-600',
        'blue': 'bg-blue-200 text-blue-600',
        'red': 'bg-red-200 text-red-600',
        'green': 'bg-green-200 text-green-600',
        'yellow': 'bg-yellow-200 text-yellow-600',
        'indigo': 'bg-indigo-200 text-indigo-600',
        'purple': 'bg-purple-200 text-purple-600',
        'pink': 'bg-pink-200 text-pink-600',
    }
    return (
        <span className={`rounded-full !w-fit text-sm inline-flex items-center justify-center w-full px-2 pb-[2px] bg-gray-200 text-gray-200 ${colors[color]} ${className}`}>
            {children}
        </span>
    )

}