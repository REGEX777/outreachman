"use client"

import { useState } from "react";
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { Upload } from "@prisma/client";
import { useRouter } from "next/navigation";
import { prisma } from "@/lib/prisma";


type Props = {
    headers: string[];
    uploadId: string;
    upload: Upload
};

export default function ConfigureModal({headers, uploadId, upload}: Props) {

    const router = useRouter();

    const [emailColumn, setEmailColumn] = useState(
        headers.find(h => h.toLowerCase().includes("email")) ?? ""
    );

    const [nameColumn, setNameColumn] = useState(
        headers.find(h => h.toLowerCase().includes("name")) ?? ""
    );

    const [isDeleting, setIsDeleting] = useState(false)

    const [areusure, setAreusure] = useState(false)


    function onCancel(){
        router.push(`/my/history`);
    }

    function onClose(){
        setAreusure(true)
    }

    async function onConfirm() {
        setIsDeleting(true);

        try {
            const res = await fetch("/api/upload/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uploadId }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error ?? "Failed to delete upload.");
                setIsDeleting(false);
                return;
            }

            router.push("/my/history");
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
            setIsDeleting(false);
        }
    }

    async function handleSave() {
        if (!emailColumn) {
            alert("Please select an email column.");
            return;
        }

        const res = await fetch("/api/upload/configure", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uploadId,
                emailColumn,
                nameColumn: nameColumn || null,
            }),
        });

        if (!res.ok) {
            alert("Something went wrong.");
            return;
        }

        router.refresh();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
        >
        {areusure && 
        
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
                <div className="w-full max-w-sm bg-[#111113] border border-white/[0.06] rounded-xl p-5 shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-row items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                            <HugeiconsIcon icon={Delete02Icon} size={18} className="text-red-400" />
                        </div>
                        <div className="flex flex-col items-start pt-0.5">
                            <p className="text-[15px] font-medium tracking-tight">Delete this upload?</p>
                            <p className="text-xs text-white/40 mt-1 leading-relaxed">
                                This will permanently remove <span className="text-white/60">{upload.fileName}</span> and its data. This can't be undone.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-end gap-2.5 mt-5">
                        <button
                            onClick={onCancel}
                            disabled={isDeleting}
                            className="bg-[#1C1C1E] hover:bg-[#242427] border disabled:opacity-50 disabled:cursor-not-allowed border-white/[0.06] transition-colors duration-200 rounded-lg cursor-pointer py-1.5 px-3.5 text-sm text-white/80"
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


        }
            <div
                className="w-full max-w-md bg-[#111113] border border-white/[0.06] rounded-xl p-5 shadow-2xl shadow-black/50"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <span className="text-blue-400 text-lg">✦</span>
                    </div>

                    <div className="flex flex-col items-start pt-0.5">
                        <p className="text-[15px] font-medium tracking-tight">
                            Configure Spreadsheet
                        </p>

                        <p className="text-xs text-white/40 mt-1 leading-relaxed">
                            Tell Sheetload which columns contain recipient
                            information.
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wide">
                            Email Column
                        </label>

                        <select
                            value={emailColumn}
                            onChange={(e) => setEmailColumn(e.target.value)}
                            className="w-full rounded-lg bg-[#1C1C1E] border border-white/[0.06] px-3 py-2 text-sm outline-none focus:border-white/20"
                        >
                            <option value="">Select column...</option>

                            {headers.map((header) => (
                                <option key={header} value={header}>
                                    {header}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wide">
                            Name Column
                            <span className="text-white/20 normal-case ml-1">
                                (optional)
                            </span>
                        </label>

                        <select
                            value={nameColumn}
                            onChange={(e) => setNameColumn(e.target.value)}
                            className="w-full rounded-lg bg-[#1C1C1E] border border-white/[0.06] px-3 py-2 text-sm outline-none focus:border-white/20"
                        >
                            <option value="">None</option>

                            {headers.map((header) => (
                                <option key={header} value={header}>
                                    {header}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-row items-center justify-end gap-2.5 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-[#1C1C1E] hover:bg-[#242427] border border-white/[0.06] transition-colors duration-200 rounded-lg cursor-pointer py-1.5 px-3.5 text-sm text-white/80"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="bg-white hover:bg-white/90 transition-colors duration-200 rounded-lg cursor-pointer py-1.5 px-3.5 text-sm font-medium text-black"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}