import {prisma} from '../../../lib/prisma'
import * as XLSX from "xlsx";
export async function POST(req: Request) {
    const formData = await req.formData();

    console.log(formData)

    const file = formData.get('file') as File;

    if(!file){
        return Response.json(
            { error: "No file uploaded" },
            { status: 400 }
        );
    }

    console.log(file)

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

    const headers = Object.keys(rows[0]);


    const upload = await prisma.upload.create({data: {
        fileName: file.name,
        headers,
        totalRows: rows.length,
    }})

    await prisma.uploadRow.createMany({
        data: rows.map((row, index)=>({
            uploadId: upload.id,
            rowIndex: index,
            recipientEmail: row.Email,
            data: row
        }))
    })

    return Response.json({
        success: true,
        uploadId: upload.id
    });

}