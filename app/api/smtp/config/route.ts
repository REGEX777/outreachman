import { prisma } from "@/lib/prisma";

export async function GET(){
    const config = await prisma.sMTPconfig.findUnique({where: {id: "default"}})

    return Response.json({
        config
    })
}