import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request){
    let request;
    
    try{
        request = await req.json();
        console.log(request)
    }catch{
       return Response.json({
            success: false,
            error: "Invalid Request"
        }, { status: 400 });
    }

    if(!request || typeof request.fromNameEnabled !== "boolean"){
        return Response.json({
            success: false,
            error: "Invalid Request"
        });
    }

    try{
        const config = await prisma.config.update({
            where: {id: "global"},
            data: {
                fromNameEnabled: request.fromNameEnabled
            }
        })

        return Response.json({
            success: true,
            config
        });
    }catch(err){
        console.log(err);
        return Response.json({
            success: false,
            error: "Something went wrong."
        });
    }
}