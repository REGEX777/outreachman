"use client"

type props = {
    uploadID: string
}


export default function SendMailButton({uploadID}: props) {
    async function sendMails(){
        fetch('/api/smtp/send', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uploadID})
        })
    }

    return (
        <button onClick={sendMails} className="rounded-lg cursor-pointer py-1.5 px-3.5 text-sm font-medium transition-colors duration-200 bg-white text-black hover:bg-white/90">
            Send Emails
        </button> 
    )
}