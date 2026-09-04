"use client"

import { useEffect, useState } from "react"
import { Oval } from "react-loader-spinner"

type props = {
    uploadID: string
}


export default function SendMailButton({uploadID}: props) {

    const [sending, setSending] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [progress, setProgress] = useState(0)
    const [totalRows, setTotalRows] = useState(0)

    async function sendMails(){
        setSending(true)
        setCompleted(false)
        await fetch('/api/smtp/send', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uploadID})
        })
 
        const finished = await hitStats()

        if (finished) { 
            setTimeout(() => {
                setSending(false)
                setCompleted(true)

                setTimeout(() => {
                    setCompleted(false)
                }, 2000)
            }, 300)
        }
    }

    async function hitStats(){
        const record = await fetch('/api/smtp/stats', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uploadID})
        })

        const response = await record.json()

        const sent = response.stats.sentEmails
        const total = response.stats.draftsWritten

        setProgress(sent)
        setTotalRows(total)

        return sent === total
    }

    useEffect(()=>{
        if(!sending) return;

        // console.log("Interval Hit")
        const interval = setInterval(hitStats, 2000)

        return ()=>{
            clearInterval(interval)
        }
    }, [sending])


    return (
        <button onClick={sendMails} className="rounded-lg cursor-pointer py-1.5 px-3.5 text-sm font-medium transition-colors duration-200 bg-white text-black hover:bg-white/90">
            {sending?
            <div className="flex flex-row items-center justify-center gap-4">
                <Oval
                    height={20}
                    width={15}
                    color="#fff"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="#000"
                    strokeWidth={3}
                    strokeWidthSecondary={3}
                /> <span>{progress}/{totalRows} Emails Sent.</span>
            </div>
             : completed ? (
                    "Done!"
                ) : (
                    "Send Emails"
            )}
        </button>  
    )
}