import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02Icon, FileSpreadsheetIcon } from '@hugeicons/core-free-icons'

interface ConfirmationModalProps {
    fileName: string
    onConfirm: () => void
    onCancel: () => void
    isDeleting?: boolean
}

export default function ConfirmationModal({ fileName, onConfirm, onCancel, isDeleting }: ConfirmationModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6" onClick={onCancel}>
            <div className="w-full max-w-sm bg-[#111113] border border-white/[0.06] rounded-xl p-5 shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-row items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={Delete02Icon} size={18} className="text-red-400" />
                    </div>
                    <div className="flex flex-col items-start pt-0.5">
                        <p className="text-[15px] font-medium tracking-tight">Delete this upload?</p>
                        <p className="text-xs text-white/40 mt-1 leading-relaxed">
                            This will permanently remove <span className="text-white/60">{fileName}</span> and its data. This can't be undone.
                        </p>
                    </div>
                </div>

                <div className="flex flex-row items-center justify-end gap-2.5 mt-5">
                    <button
                        onClick={onCancel}
                        className="bg-[#1C1C1E] hover:bg-[#242427] border border-white/[0.06] transition-colors duration-200 rounded-lg cursor-pointer py-1.5 px-3.5 text-sm text-white/80"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg cursor-pointer py-1.5 px-3.5 text-sm font-medium text-white"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    )
}