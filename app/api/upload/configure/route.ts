import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
    const {uploadId, emailColumn, nameColumn} = await req.json();

    console.log(emailColumn, nameColumn)

    const upload = await prisma.upload.findUnique({where: {id: uploadId}})

    if(!upload){
        return Response.json(
            {error: "Upload not found."},
            {status: 404}
        )
    }

    const headers = upload.headers as string[];

    if(!headers.includes(emailColumn)){
        return Response.json(
            { error: "Invalid email column." },
            { status: 400 }
        );
    }
    
    await prisma.upload.update({where: {id: uploadId}, data: {emailColumn, nameColumn: nameColumn??null, configured: true}})
    

    return Response.json({ success: true });
}