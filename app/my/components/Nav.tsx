"use client"

import { HugeiconsIcon } from '@hugeicons/react';
import { Settings01Icon  } from '@hugeicons/core-free-icons';

import Link from 'next/link'
import { useSettingsStore } from '@/store/settingsStore';

export default function Nav(){


    const open = useSettingsStore((state)=> state.open)

    return(
            <header className="flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-2">
                <span className="text-[15px] font-medium tracking-tight text-white">
                    Sheetload
                </span>
                <svg
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    className="text-white/40"
                    fill="none"
                >
                    <path
                    d="M4.5 0L9 4.5L4.5 9L0 4.5L4.5 0Z"
                    stroke="currentColor"
                    strokeWidth="1"
                    />
                </svg>
                </div>
                <nav className="flex flex-row items-center justify-center gap-2">
                    <Link className="text-[13px] text-white/40 hover:text-white/70 transition-colors cursor-pointer" href='/my/history'>History</Link>
                    <Link className="text-[13px] text-white/40 hover:text-white/70 transition-colors cursor-pointer" href='/my'>Upload</Link>
                    <button onClick={open} className='px-1 py-1 rounded-lg hover:bg-white/20 cursor-pointer transition-all duration-300'>
                        <HugeiconsIcon icon={Settings01Icon} size={20} />
                    </button>
                </nav>
            </header>
    )
}