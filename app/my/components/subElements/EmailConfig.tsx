import { prisma } from "@/lib/prisma"

export default async function EmailConfig(){

    const config = await prisma.config.upsert({
        where: {id: "global"},
        update: {},
        create: {id: "global", fromNameEnabled: false}
    })

    console.log(config)

    return(
        <div className="flex flex-col items-start justify-center gap-4">
            <p>Email Settings</p>

            <div className="w-full h-10 bg-[#111113] border border-white/[0.06] rounded-lg flex items-center justify-between px-4">
                <p className="text-sm">
                    Enable{" "}
                    <code className="px-0.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.08] font-mono text-xs text-white/90">
                        From Name
                    </code>{" "}
                    at the end of email body?
                </p>
                <div className="relative h-4 w-4 flex items-center justify-center">
                    <input
                        type="checkbox"
                        id="terms"
                        className="peer absolute inset-0 h-4 w-4 rounded bg-[#1C1C1E] border border-white/[0.06] appearance-none checked:bg-blue-600 checked:border-blue-600 cursor-pointer m-0"
                    />
                    <svg
                        className="pointer-events-none relative h-2.5 w-2.5 opacity-0 peer-checked:opacity-100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            </div>
        </div>
    )
}