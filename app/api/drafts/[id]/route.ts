import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
export async function PATCH(req: Request) {
    const body = await req.json()
    console.log(body)
    
    if (!body.uploadRowId) {
        return Response.json(
            { error: "Missing uploadRowId" },
            { status: 400 }
        );
    }



    try{
        const row = await prisma.uploadRow.update({
            where: {id: body.uploadRowId},
            data: {subject: body.subject, body: body.body}
        })

        return Response.json(row)
    }catch(error){
        if(
            error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"
        ){
            return Response.json(
                { error: "Draft not found" },
                { status: 404 }
            );
        }
        throw error;
    }

    

    return Response.json({ success: true });
}