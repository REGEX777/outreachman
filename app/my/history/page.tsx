
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
                    {uploads.map((upload)=>(
                        <HistoryCard key={upload.id} upload={upload} />
                    ))}

                </div>
            </main>
        </div>
    )
}