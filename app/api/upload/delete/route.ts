import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { uploadId } = await req.json();

    await prisma.upload.delete({
        where: { id: uploadId },
    });

    return Response.json({
        success: true,
    });
}