import { prisma } from "@/lib/prisma";
import Nav from "../../components/Nav";
import { notFound, redirect } from "next/navigation";
import { HugeiconsIcon } from '@hugeicons/react'
import { FileSpreadsheetIcon } from '@hugeicons/core-free-icons'
import ConfigureModal from "../../components/ConfigureModal";
import Link from "next/link";

type Props = {
    params: Promise<{
        id: string
    }>;
}

export default async function upload({params}: Props) {

    const {id} = await params;
    const upload = await prisma.upload.findUnique({where: {id}, include: {rows: true}})
    if(!upload){
        //404
        notFound()
    }

    function startOutreach(){
        return redirect(`/my/upload/${id}/outreach`)
    }

    return(
        <div className="min-h-screen w-full bg-[#0a0a0b] text-white font-sans antialiased flex flex-col">
            <Nav />
            {upload.configured?null:<ConfigureModal headers={upload.headers} uploadId={upload.id} upload={upload} />}
            <main className="flex-1 flex flex-col items-center px-6 pb-24 gap-4">
                {/* Meta card */}
                <div className="w-full rounded-xl bg-[#111113] border border-white/[0.06] px-5 py-4 flex flex-row items-start justify-between">
                    <div className="flex flex-row items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#1C1C1E] flex items-center justify-center shrink-0">
                            <HugeiconsIcon icon={FileSpreadsheetIcon} size={18} className="text-emerald-400" />
                        </div>
                        <div className="flex flex-col items-start gap-3">
                            <div>
                                <p className="text-xs text-white/40">File name</p>
                                <p className="text-[15px] font-medium tracking-tight">{upload.fileName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-white/40 mb-1">Headers</p>
                                <div className="flex flex-row flex-wrap gap-1.5">
                                    {upload.headers.map((header) => (
                                        <span
                                            key={header}
                                            className="text-xs px-2 py-0.5 rounded-full bg-[#1C1C1E] border border-white/[0.06] text-white/70"
                                        >
                                            {header}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row items-center gap-6">

                        <Link
                            href={`/my/upload/${id}/outreach`}
                            className={`
                                rounded-lg py-1.5 px-3.5 text-sm font-medium transition-colors duration-200
                                ${
                                    upload.status === "DRAFT"
                                        ? "bg-white text-black hover:bg-white/90"
                                        : "bg-white/20 text-white/40 pointer-events-none cursor-not-allowed"
                                }
                            `}
                        >
                            {upload.currentRow > 0 ? "Continue" : "Start"} composing draft
                        </Link>
                        <div className="flex flex-col items-end">
                            <p className="text-xs text-white/40">Rows</p>
                            <p className="text-sm font-medium mt-0.5">{upload.totalRows}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-xs text-white/40">Current progress</p>
                            <div className="flex flex-row items-center gap-2 mt-0.5">
                                <p className="text-sm font-medium">
                                    {upload.currentRow} <span className="text-white/40">/ {upload.totalRows}</span>
                                </p>
                                <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-400 rounded-full"
                                        style={{ width: `${upload.totalRows > 0 ? (upload.currentRow / upload.totalRows) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rows list */}
                <div className="w-full rounded-xl bg-[#111113] border border-white/[0.06] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-[#1C1C1E] border-b border-white/6">
                                    <th className="text-left font-medium text-white/50 text-xs uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                                        #
                                    </th>
                                    <th className="text-left font-medium text-white/50 text-xs uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                                        Status
                                    </th>
                                    {upload.headers.map((header) => (
                                        <th
                                            key={header}
                                            className="text-left font-medium text-white/50 text-xs uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                    <th className="text-left font-medium text-white/50 text-xs uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {upload.rows.map((row) => {
                                    const data = row.data as Record<string, string>
                                    return (
                                        <tr
                                            key={row.id}
                                            className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-4 py-3 text-white/40 whitespace-nowrap">
                                                {row.rowIndex}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                                        row.status === "SENT"
                                                            ? "bg-emerald-500/10 text-emerald-400"
                                                            : row.status === "FAILED"
                                                            ? "bg-red-500/10 text-red-400"
                                                            : "bg-white/[0.06] text-white/50"
                                                    }`}
                                                >
                                                    {row.status}
                                                </span>
                                            </td>
                                            {upload.headers.map((header) => (
                                                <td key={header} className="px-4 py-3 text-white/70 whitespace-nowrap">
                                                    {data?.[header] ?? "—"}
                                                </td>
                                            ))}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <button className="h-5 flex items-center justify-center px-2 cursor-pointer text-black bg-white text-sm rounded-sm">
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}