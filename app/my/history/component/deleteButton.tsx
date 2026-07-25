"use client"

import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { useState } from 'react'
import ConfirmationModal from './confirmationModal'
import { prisma } from '@/lib/prisma'
import { deleteUpload } from '../actions'
import { Upload } from '@prisma/client'


type props = {
    id: string,
    fileName: string
}


export default function DeleteButton({id, fileName}: props){

    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete(){
        setIsDeleting(true)
        await deleteUpload(id)
        setIsDeleting(false)
        return setOpen(false)
    }

    return (
        <>
            <button onClick={()=>{setOpen(true)}} className="bg-red-700 text-black hover:bg-red-700/90 transition-colors duration-200 rounded-lg cursor-pointer py-1.5 px-1.5 text-sm font-medium">
                <HugeiconsIcon icon={Delete02Icon} size={20} strokeWidth={2} className="text-red-200" />
            </button>

            {open && (<ConfirmationModal onCancel={()=>{setOpen(false)}} onConfirm={handleDelete} isDeleting={isDeleting} fileName={fileName} />)}
        </>
    )
}