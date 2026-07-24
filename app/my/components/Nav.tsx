export default function Nav(){
    return(
            <header className="flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-2">
                <span className="text-[15px] font-medium tracking-tight text-white">
                    Sheetload
                </span>
                <svg
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    className="text-white/40"
                    fill="none"
                >
                    <path
                    d="M4.5 0L9 4.5L4.5 9L0 4.5L4.5 0Z"
                    stroke="currentColor"
                    strokeWidth="1"
                    />
                </svg>
                </div>
                <nav className="text-[13px] text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                History
                </nav>
            </header>
    )
}