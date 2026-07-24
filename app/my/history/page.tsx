import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon, FileSpreadsheetIcon } from '@hugeicons/core-free-icons'

import HistoryCard from './historyCard'

import Nav from "../components/Nav"
import { prisma } from '@/lib/prisma'

export default async function history(){
    const uploads = await prisma.upload.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })
    return(
        <div className="min-h-screen w-full bg-[#0a0a0b] text-white font-sans antialiased flex flex-col">
            <Nav />

            <main className="flex-1 flex items-start justify-center px-6 pb-24">
                <div className="flex flex-col items-center justify-center gap-2 w-full">
                    <HistoryCard uploads={uploads} />
                    {uploads.map((upload)=>(
                        <div className="w-full py-3 rounded-xl bg-[#111113] border border-white/[0.06] flex flex-row items-center justify-between px-5">
                            <div className="flex flex-row items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-[#1C1C1E] flex items-center justify-center shrink-0">
                                    <HugeiconsIcon icon={FileSpreadsheetIcon} size={18} className="text-emerald-400" />
                                </div>
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[15px] font-medium tracking-tight">{upload.fileName}</p>
                                    <div className="flex flex-row items-center gap-2 mt-0.5">
                                        <p className="text-xs text-white/40">
                                            <span className="text-white/60 font-medium">{upload.currentRow}</span> / {upload.totalRows} rows
                                        </p>
                                        <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                                                style={{ width: `${(upload.currentRow / upload.totalRows) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row items-center justify-center gap-2.5">
                                <div className="relative group">
                                    <button className="bg-[#1C1C1E] hover:bg-[#242427] transition-colors duration-200 border border-white/[0.06] rounded-lg cursor-pointer py-1.5 px-3 flex flex-row items-center justify-center gap-1.5 text-sm text-white/80">
                                        Headers <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="text-white/40" />
                                    </button>

                                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1C1C1E] border border-white/[0.06] rounded-lg shadow-xl shadow-black/40 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                        <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white rounded-md transition-colors">
                                            Column A
                                        </button>
                                        <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white rounded-md transition-colors">
                                            Column B
                                        </button>
                                    </div>
                                </div>

                                <button className="bg-white text-black hover:bg-white/90 transition-colors duration-200 rounded-lg cursor-pointer py-1.5 px-3.5 text-sm font-medium">
                                    Start Campaign
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </main>
        </div>
    )
}