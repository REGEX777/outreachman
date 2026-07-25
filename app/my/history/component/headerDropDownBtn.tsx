import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { prisma } from '@/lib/prisma'

type props = {
    id: string
}


export default async function DropDownBtn({id}: props){
    const headers = await prisma.upload.findUnique({where: {id: id}, select: {headers: true}});
    return (
        <div className="relative group">
            <button className="bg-[#1C1C1E] hover:bg-[#242427] transition-colors duration-200 border border-white/[0.06] rounded-lg cursor-pointer py-1.5 px-3 flex flex-row items-center justify-center gap-1.5 text-sm text-white/80">
                Headers <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="text-white/40" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1C1C1E] border border-white/[0.06] rounded-lg shadow-xl shadow-black/40 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                {headers?.headers?.map((header:string)=>(
                    <button key={header} className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white rounded-md transition-colors">
                        {header}
                    </button>
                ))}
            </div>

        </div>
    )
}