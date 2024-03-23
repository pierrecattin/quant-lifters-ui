export function InfoButton({ onClick }: { onClick: any }) {
    return (
        <button
            className="ml-3 h-6 w-6 flex justify-center items-center rounded-full bg-purple-950 border border-purple-800 shadow-black shadow-lg text-white text-xl hover:bg-green-800"
            onClick={onClick}>
            ?
        </button>
    )
}