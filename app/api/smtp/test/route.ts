import { testSMTPConnection } from "@/lib/smtp/testConnection"

export async function POST(req: Request){
    console.log("HITTTTT ROUTE")
    const response = await req.json()
    const testRes = await testSMTPConnection(response)


    return Response.json({
        success: testRes.success,
        error: testRes.error
    });
}