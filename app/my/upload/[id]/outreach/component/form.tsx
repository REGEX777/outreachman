"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

type props = {
    email: string,
    name: string,
    extraData: Record<string, unknown>,
    uploadRowId: string,
    emailColumn: string | null,
    nameColumn: string | null,
    index: number
}

export default function Form({name, email, extraData, emailColumn, nameColumn, uploadRowId, index}: props) {

    const router = useRouter();

    const [submitting, setSubmitting] = useState(false)
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")

    async function handleSubmit(){
        setSubmitting(true)
        try {
            const response = await fetch("/api/drafts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uploadRowId,
                    subject,
                    body,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to save draft");
            }

            setSubject("")
            setBody("")
            router.refresh();
            // do stuff
        } catch (error) {
            console.log(error)
            alert('something went wrong')
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
                {/* Left — compose panel */}
                <div className="flex-1 flex flex-col gap-3">
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject"
                        className="w-full bg-[#111113] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                    />

                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Body"
                        className="w-full flex-1 min-h-[400px] bg-[#111113] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors resize-none leading-relaxed"
                    />

                    <div className="flex flex-row justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg cursor-pointer py-2 px-4 text-sm font-medium"
                        >
                            {submitting ? "Sending..." : "Submit / Next"}
                        </button>
                    </div>
                </div>

                {/* Right — row data panel */}
                <div className="w-80 flex flex-col gap-3">
                    <div className="bg-[#111113] border border-white/[0.06] rounded-lg px-4 py-3">
                        <p className="text-xs text-white/40 mb-1">Index</p>
                        <p className="text-sm text-white/60">{index}</p>
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