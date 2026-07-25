"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export async function deleteUpload(id: string){
    await prisma.upload.delete({where: {id}});

    revalidatePath("/my/history");
}