import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json()

    console.log(body)

    const row = await prisma.uploadRow.update({
        where: {id: body.uploadRowId},
        data: {subject: body.subject, body: body.body}
    })
    console.log(row)
    return Response.json({ success: true });
}