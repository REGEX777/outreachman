"use client"

import { useState } from "react"
import { Oval } from "react-loader-spinner"

type props = {
    uploadID: string
}


export default function SendMailButton({uploadID}: props) {

    const [sending, setSending] = useState(false)

    async function sendMails(){
        setSending(true)
        await fetch('/api/smtp/send', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uploadID})
        })
        setSending(false)
    }

    return (
        <button onClick={sendMails} className="rounded-lg cursor-pointer py-1.5 px-3.5 text-sm font-medium transition-colors duration-200 bg-white text-black hover:bg-white/90">
            {sending?
                <Oval
                    height={20}
                    color="#fff"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="#000"
                    strokeWidth={3}
                    strokeWidthSecondary={3}
                />
             : "Send Emails"}
        </button> 
    )
}