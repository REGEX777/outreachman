import { Upload } from "@prisma/client"
import { HugeiconsIcon } from '@hugeicons/react'
import Link from "next/link";
import { FileSpreadsheetIcon, Delete02Icon } from '@hugeicons/core-free-icons'
import DropDownBtn from "./component/headerDropDownBtn";
import DeleteButton from "./component/deleteButton";

type props = {
    upload: Upload;
}

export default function HistoryCard({upload}: props) {

    return (
        <div className="w-full py-3 rounded-xl bg-[#111113] border border-white/[0.06] flex flex-row items-center justify-between px-5">
            <div className="flex flex-row items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1C1C1E] flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={FileSpreadsheetIcon} size={18} className="text-emerald-400" />
                </div>
                <div className="flex flex-col items-start justify-center">
                    <Link href={`/my/upload/${upload.id}`} className="text-[15px] font-medium tracking-tight flex flex-row items-center justify-center gap-2">
                        {upload.fileName}
                        {upload.configured ? null : 
                            <div className="rounded-lg px-1.5 bg-red-500/40 border border-red-500/50">
                                <p className="text-xs text-[#EEEE]">Needs Configuration</p>
                            </div>
                        }
                    </Link>
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
                <DropDownBtn id={upload.id} />

                <button className="bg-white text-black hover:bg-white/90 transition-colors duration-200 rounded-lg cursor-pointer py-1.5 px-3.5 text-sm font-medium">
                    Start Campaign
                </button>

                <DeleteButton id={upload.id} fileName={upload.fileName} />

            </div>
        </div>
    )
}