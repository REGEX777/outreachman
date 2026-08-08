import { prisma } from "@/lib/prisma"
import Nav from "../../../components/Nav"
import Form from "./component/form"
import { notFound } from "next/navigation";
import {redirect} from 'next/navigation'

type props = {
    params: Promise<{
        id: string
    }>
}

export default async function ContactViewer({params}: props) {
    
    const {id} = await params

    const upload = await prisma.upload.findUnique({
        where: {
            id,
        },
    });

    if (!upload) {
        notFound();
    }

    if(upload.currentRow >= upload.totalRows){
        await prisma.upload.update({where: {id: upload.id}, data: {status: 'READY'}})
        redirect(`/my/upload/${id}`)
    }

    const row = await prisma.uploadRow.findFirst({
        where: {
            uploadId: upload.id,
            rowIndex: upload.currentRow
        }
    })

    if(!row){
        notFound()
    }

    const data = row?.data as Record<string, any>;
    const name = upload.nameColumn
        ? data[upload.nameColumn]
        : null;
    const email = upload.emailColumn
        ? data[upload.emailColumn]
        : null;


    return (
        <div className="min-h-screen w-full bg-[#0a0a0b] text-white font-sans antialiased flex flex-col">
            <Nav />
            <Form name={name} email={email} extraData={data} emailColumn={upload.emailColumn} nameColumn={upload.nameColumn} uploadRowId={row.id} index={upload.currentRow} upload={upload} mode="create"/>
        </div>
    )
}