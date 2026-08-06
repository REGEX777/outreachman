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

    const row = await prisma.uploadRow.findFirst({
        where: {
            id: rowId,
            uploadId: id,
        },
        include: {
            upload: true,
        },
    });

    const data = row?.data as Record<string, any>;
    const name = row?.upload.nameColumn ? data[row.upload.nameColumn] : null
    const email = row?.upload.emailColumn ? data[row.upload.emailColumn] : null


    const initialSubject = row?.subject ?? undefined;
    const initialBody = row?.body ?? undefined;


    if(!row){
        return notFound()
    }

    return (
        <div className="min-h-screen w-full bg-[#0a0a0b] text-white font-sans antialiased flex flex-col">
         <Nav />
         {/* <Form email={row.recipientEmail} name={row.recipientName} extraData={row.} /> */}
         <Form name={name} email={email} extraData={data} emailColumn={row.upload.emailColumn} nameColumn={row.upload.nameColumn} uploadRowId={row.id} index={row.upload.currentRow} initialSubject={initialSubject} initialBody={initialBody} mode="edit"/>
         
        </div>
    )
}