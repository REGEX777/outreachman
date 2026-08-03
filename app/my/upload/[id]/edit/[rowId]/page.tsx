import Nav from "@/app/my/components/Nav";
import Form from "../../outreach/component/form";
import { prisma } from "@/lib/prisma";
import { notFound, unauthorized } from "next/navigation";


type props = {
    params: Promise<{
        id: string,
        rowId: string
    }>
}

export default async function Edit({params}: props){
    const {id} = await params
    const {rowId} = await params

    const upload = await prisma.upload.findUnique({where: {id}});

    if(!upload){
        return notFound()
    }

    const row = await prisma.uploadRow.findUnique({where: {id: rowId}})

    if(!row){
        return notFound()
    }

    if(row.uploadId !== upload.id){
        return unauthorized()
    }

    return (
        <div className="min-h-screen w-full bg-[#0a0a0b] text-white font-sans antialiased flex flex-col">
         <Nav />
         <Form />
        </div>
    )
}