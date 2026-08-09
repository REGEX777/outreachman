"use client"

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon, Settings02Icon, MailAtSign02Icon, Database02Icon, UserIcon } from '@hugeicons/core-free-icons'

import { useSettingsStore } from '@/store/settingsStore';
import ApiConfig from './subElements/ApiConfig';

const tabs = [
    { id: "api", label: "API Configuration", icon: Settings02Icon },
    { id: "email", label: "Email Settings", icon: MailAtSign02Icon }
]


export default function Settings(){

    const [activeTab, setActiveTab] = useState("api")

    const isOpen = useSettingsStore((state)=> state.isOpen);
    const close = useSettingsStore((state)=> state.close)


    if(!isOpen){
        return null
    }

   return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
            <div className="w-[130vh] h-[80vh] flex flex-col items-center justify-start overflow-hidden bg-[#0a0a0b] border border-white/[0.06] relative z-10 rounded-xl shadow-2xl shadow-black/50">
                {/* Top bar */}
                <div className="w-full bg-[#111113] border-b border-white/[0.06] flex flex-row items-center justify-between h-12 px-4 shrink-0">
                    <p className="text-sm text-white/60 font-medium">Settings</p>
                    <button onClick={close} className="p-1.5 rounded-lg hover:bg-white/[0.06] cursor-pointer transition-colors duration-200 text-white/50 hover:text-white">
                        <HugeiconsIcon icon={ArrowRight02Icon} size={20} color="currentColor" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="w-full flex flex-row items-start justify-start flex-1 font-sans min-h-0">
                    {/* Sidebar */}
                    <div className="w-[20%] h-full bg-[#111113] border-r border-white/[0.06] flex flex-col items-center justify-start px-3 py-3 gap-1">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-start gap-2.5 h-10 rounded-lg px-3 cursor-pointer transition-all duration-200 ease-out group ${
                                        isActive
                                            ? "bg-white/[0.06]"
                                            : "hover:bg-white/[0.04] hover:pl-4"
                                    }`}
                                >
                                    <HugeiconsIcon
                                        icon={tab.icon}
                                        size={16}
                                        strokeWidth={1.5}
                                        className={`shrink-0 transition-colors duration-200 ${
                                            isActive ? "text-emerald-400" : "text-white/40 group-hover:text-white/70"
                                        }`}
                                    />
                                    <p className={`text-sm transition-colors duration-200 ${
                                        isActive ? "text-white" : "text-white/60 group-hover:text-white/90"
                                    }`}>
                                        {tab.label}
                                    </p>
                                </button>
                            )
                        })}
                    </div>

                    {/* Content */}
                    <div className="flex-1 h-full overflow-y-auto px-6 py-5">
                        {activeTab === "api" && <ApiConfig />}
                        {activeTab === "email" && <p className="text-white/70 text-sm">Email Settings content</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}