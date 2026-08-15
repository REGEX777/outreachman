"use client"

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Upload } from "@prisma/client";

type props = {
    email: string,
    name: string,
    extraData: Record<string, unknown>,
    uploadRowId: string,
    emailColumn: string | null,
    nameColumn: string | null,
    mode: "create" | "edit",
    initialSubject?: string;
    initialBody?: string;
    index: number,
    upload?: Upload
}

export default function Form({name, email, extraData, uploadRowId, index, initialSubject, initialBody, upload, mode}: props) {

    const router = useRouter();
    const {emailColumn, nameColumn, currentRow} = upload ?? {};

    const [submitting, setSubmitting] = useState(false)
    const [subject, setSubject] = useState(initialSubject ?? "")
    const [body, setBody] = useState(initialBody ?? "")
    const [loading, setLoading] = useState(false);

    if(upload?.status === "COMPLETED"){
        return redirect(`/my/upload/${upload.id}`)
    }


    async function handleSubmit(){
        if (!subject.trim()) {
            alert("Subject cannot be empty");
            return;
        }

        if (!body.trim()) {
            alert("Body cannot be empty");
            return;
        }

        setSubmitting(true)

        const url =
            mode === "create"
                ? "/api/drafts"
                : `/api/drafts/${uploadRowId}`;

        const method =
            mode === "create"
                ? "POST"
                : "PATCH";


        try {
            setLoading(true)
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uploadRowId,
                    subject,
                    body,
                }),
            })
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error);
            }

            if(mode!=="edit"){
                setSubject("")
                setBody("")
            }

            router.refresh();
            setLoading(false)
            // do stuff
        } catch (error) {
            console.log(error)
            alert('Something went wrong')
            setLoading(false)
        }finally{
            setSubmitting(false)
        }
    }

    const filteredData = Object.fromEntries(
        Object.entries(extraData).filter(([key]) =>
            key !== emailColumn &&
            key !== nameColumn
        )
    );
    return (
            <main className="flex-1 flex flex-row gap-4 px-6 py-6">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
                    </div>
                )}
                {/* Left — compose panel */}
                <div className="flex-1 flex flex-col gap-3">
                    <input
                        type="text"
                        value={subject}
                        required
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                        className="w-full bg-[#111113] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                    />

                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        placeholder="Body"
                        className="w-full flex-1 min-h-[400px] bg-[#111113] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors resize-none leading-relaxed"
                    />

                    <div className="flex flex-row justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg cursor-pointer py-2 px-4 text-sm font-medium"
                        >
                            {mode === "edit" ? "Submit" : submitting ? "Sending..." : "Submit / Next" }
                        </button>
                    </div>
                </div>

                {/* Right — row data panel */}
                <div className="w-80 flex flex-col gap-3">
                    <div className="bg-[#111113] border border-white/[0.06] rounded-lg px-4 py-3">
                        {upload && (
                            <div className="flex flex-col items-end w-full">
                                <p className="text-xs text-white/40">Current progress</p>
                                <div className="flex flex-row items-center gap-2 mt-0.5 w-full">
                                    <p className="text-sm font-medium w-[20%]">
                                        {upload?.currentRow} <span className="text-white/40">/ {upload.totalRows}</span>
                                    </p>
                                    <div className="w-[80%] h-1.5 rounded-full bg-white/10 overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-400 rounded-full"
                                            style={{ width: `${upload.totalRows > 0 ? (upload.currentRow / upload.totalRows) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bg-[#111113] border border-white/[0.06] rounded-lg px-4 py-3">
                        <p className="text-xs text-white/40 mb-1">Index</p>
                        <p className="text-sm text-white/60">{currentRow}</p>
                    </div>

                    <div className="bg-[#111113] border border-white/[0.06] rounded-lg px-4 py-3">
                        <p className="text-xs text-white/40 mb-1">Email</p>
                        <p className="text-sm text-white/60">{email}</p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-lg px-4 py-3">
                        <p className="text-xs text-white/40 mb-1">Name</p>
                        <p className="text-sm text-white">{name}</p>
                    </div>

                    {Object.entries(filteredData).map(([key, value]) => (
                        <div key={key} className="bg-[#1C1C1E] border border-white/[0.06] rounded-lg px-4 py-3">
                            <p className="text-xs text-white/40 mb-1">{key}</p>
                            <p className="text-sm text-white">{String(value)}</p>
                        </div>
                    ))}
                </div>
            </main>
    )
}