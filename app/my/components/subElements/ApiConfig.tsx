"use client"

import { POST } from "@/app/api/drafts/route"
import { useEffect, useState } from "react"
import {toast} from "sonner"
import { Oval } from "react-loader-spinner"
import { prisma } from "@/lib/prisma"



export default function ApiConfig() {

    const [secure, setSecure] = useState("none")
    const [host, setHost] = useState("")
    const [port, setPort] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [fromName, setFromName] = useState("")
    const [fromEmail, setFromEmail] = useState("")
    const [testResult, setTestResult] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const [HasSavedPassword, setHasSavedPassword] = useState(false)

    const [isTesting, setIsTesting] = useState(false)

    useEffect(()=>{
        async function loadConfig(){
            const res = await fetch('/api/smtp/config')
            const data = await res.json()
            
            if (!data.config) return


            setHost(data.config.host)
            setPort(String(data.config.port))
            setUsername(data.config.username)
            setFromName(data.config.fromName)
            setFromEmail(data.config.fromEmail)
            setSecure(data.config.security)

            setHasSavedPassword(true)
        }

        loadConfig()
    }, [])

    function isFormValid(){
        return (
            host.trim() !== "" &&
            port.trim() !== "" &&
            username.trim() !== "" &&
            (HasSavedPassword || password.trim() !== "") &&
            fromName.trim() !== "" &&
            fromEmail.trim() !== ""
        )
    }

    async function handleTest(){
        setIsTesting(true)
        setTestResult("loading")
        if (!isFormValid()) {
            toast.error('Please Fill The Required Fields')
            return
        }
        const body = JSON.stringify({
            host,
            port: Number(port),
            secure: secure === "ssl",
            username,
            password: password || undefined,
            fromName,
            fromEmail
        })

        const test = await fetch('/api/smtp/test', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })

        const result = await test.json();
        if(!result.success){
            setTestResult("error")
            return setIsTesting(false)
        }


        setTestResult("success")

        return setIsTesting(false)
    }

    async function handleSave(){
        setIsSaving(true)
        setTestResult("loading")
        if (!isFormValid()) {
            toast.error('Please Fill The Required Fields')
            return setIsSaving(false)
        }


        const body = JSON.stringify({
            host,
            port: Number(port),
            secure: secure === "ssl",
            security: secure,
            username,
            password: password || undefined,
            fromName,
            fromEmail
        })


        const test = await fetch('/api/smtp/save', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })

        const result = await test.json();
        if(result.error && !result.success){
            setTestResult("error")
            return setIsSaving(false)
        }


        setTestResult("success")
        setIsSaving(false)
    }

    return (
        <div className="w-full rounded-lg bg-[#111113] border border-white/[0.06] flex flex-col gap-4 px-6 py-6">
            <div>
                <h2 className="text-sm font-medium text-white">SMTP Configuration</h2>
                <p className="text-xs text-white/40 mt-1">Configure the outgoing mail server used for outreach</p>
            </div>
            {/* Host + Port */}
            <div className="flex flex-row gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">Host</label>
                    <input
                        type="text"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        placeholder="smtp.example.com"
                        className="w-full bg-[#1C1C1E] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                    />
                </div>
                <div className="w-28 flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">Port</label>
                    <input
                        type="number"
                        inputMode="numeric"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        placeholder="587"
                        className="w-full bg-[#1C1C1E] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                    />
                </div>
            </div>

            {/* Security */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40">Security</label>
                <div className="flex flex-row gap-2">
                    <button
                        type="button"
                        onClick={() => setSecure("none")}
                        className={secure === "none" ? "flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-medium border transition-colors bg-white text-black border-white" : "flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-medium border transition-colors bg-[#1C1C1E] text-white/60 border-white/[0.06] hover:border-white/20" }
                    >
                        None
                    </button>
                    <button
                        type="button"
                        onClick={() => setSecure("starttls")}
                        className={secure === "starttls" ? "flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-medium border transition-colors bg-white text-black border-white" : "flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-medium border transition-colors bg-[#1C1C1E] text-white/60 border-white/[0.06] hover:border-white/20" }
                    >
                        STARTTLS
                    </button>
                    <button
                        type="button"
                        onClick={() => setSecure("ssl")}
                        className={secure === "ssl" ? "flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-medium border transition-colors bg-white text-black border-white" : "flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-medium border transition-colors bg-[#1C1C1E] text-white/60 border-white/[0.06] hover:border-white/20" }
                        >
                        SSL/TLS
                    </button>
                </div>
            </div>

            {/* Username + Password */}
            <div className="flex flex-row gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-[#1C1C1E] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                    />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={HasSavedPassword ? "••••••••••••" : "Password"}
                        className="w-full bg-[#1C1C1E] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                    />
                </div>
            </div>

            {/* From name + email */}
            <div className="flex flex-row gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">From name</label>
                    <input
                        type="text"
                        value={fromName}
                        onChange={(e) => setFromName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full bg-[#1C1C1E] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                    />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">From email</label>
                    <input
                        type="email"
                        value={fromEmail}
                        onChange={(e) => setFromEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-[#1C1C1E] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row items-center justify-between mt-1">
                <div className="text-xs">
                    {testResult === "success" && <span className="text-emerald-400">Connection successful</span>}
                    {testResult === "loading" &&  
                        <Oval
                            height={30}
                            color="#fff"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            ariaLabel='oval-loading'
                            secondaryColor="#fefefe"
                            strokeWidth={3}
                            strokeWidthSecondary={3}
                        />
                    }

                    {testResult === "error" && <span className="text-red-400">Connection failed</span>}
                </div>
                <div className="flex flex-row gap-2">
                    <button
                        type="button"
                        onClick={handleTest}
                        disabled={isTesting || !isFormValid()}
                        className="bg-[#1C1C1E] border border-white/[0.06] text-white hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg cursor-pointer py-2 px-4 text-sm font-medium"
                    >
                        
                        {isTesting ? "Testing..." : "Test Connection"}
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || !isFormValid()}
                        className="bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg cursor-pointer py-2 px-4 text-sm font-medium"
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    )
}