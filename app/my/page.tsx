"use client"

import { useRef, useState } from "react"


export default function my(){
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);

    function browse(){
        inputRef.current?.click()
    }

    function processFile(file: File){
        const allowedTypes = [
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please select a CSV or Excel file.");
            inputRef.current!.value = "";
            return;
        }

        setFile(file)
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0];
        if(!file) return;

        processFile(file);
    }

    function fileSizeHandler(bytes:number){
        if (bytes >= 1024 * 1024) {
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        }

        if (bytes >= 1024) {
            return `${(bytes / 1024).toFixed(2)} KB`;
        }

        return `${bytes} B`;
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault();
    }

    function handleDragEnter(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault();
        setIsDragging(true)
    }

    function handleDrageLeave(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault();
        setIsDragging(false)
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>){
        e.preventDefault(); 
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0];

        if(!file) return;

        processFile(file)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        if(!file) return;

        const formData = new FormData();
        formData.append("file", file)

        const res = await fetch('/api/upload', {
            method: "POST",
            body: formData
        })

        setLoading(true)

        const data = await res.json();
        console.log(data)
        setLoading(false)
        inputRef.current!.value = "";
    }


    return (
        <div className="min-h-screen w-full bg-[#0a0a0b] text-white font-sans antialiased flex flex-col">
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
            {loading && (
                <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
                </div>
            )}

            <main className="flex-1 flex items-center justify-center px-6 pb-24">
                

                <form onSubmit={handleSubmit} className="w-full max-w-[560px]">
                    <div onDragOver={handleDragOver} onDrop={handleDrop} onDragEnter={handleDragEnter} onDragLeave={handleDrageLeave} className={[
                    "relative rounded-2xl bg-[#111113] transition-all duration-200",
                    "flex flex-col items-center justify-center text-center",
                    "px-10 py-20",
                    dragging?"border-2 border-blue-500 bg-blue-500/10":"border-2 border-zinc-700"
                    ].join(" ")}>
                        {file ?<p className="text-2xl font-mono">{file.name}</p>:<p className="text-2xl font-mono">Drop your files here.</p>}
                        
                        <br />
                        <input name="file" accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ref={inputRef} hidden type="file" className="h-10 w-40 border-2 rounded-lg" onChange={handleFileChange} />
                        {file?<p className="text-sm text-gray-500">{fileSizeHandler(file?.size)} </p>:<p className="text-sm text-gray-500">Or <button type="button" className="text-gray-300 underline decoration-gray-500 decoration-wavy underline-offset-2 cursor-pointer" onClick={browse}>Click Me</button> </p>
                        }
                        {file?<button className="w-full py-2 rounded-lg text-black mt-5 bg-white">Submit</button>:null}
                    </div>
                </form>
            </main>

        
        </div>
    )
}