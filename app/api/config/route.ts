export async function PATCH(req: Request){
    const request = await req.json()

    console.log(request)
    return Response.json({
        success: true
    });
}