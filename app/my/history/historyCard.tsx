import { Upload } from "@prisma/client"

type props = {
    uploads: Upload[]
}

export default function HistoryCard(props: props) {
    return (
        <>
            {props.uploads.map((upload)=>(  
                <p>{upload.fileName}</p>
            ))}
        </>
    )
}