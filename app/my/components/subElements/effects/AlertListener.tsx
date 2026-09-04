'use client'

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";



export function AlertListener(){
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();


    useEffect(()=>{
        const type = searchParams.get('type');
        const msg = searchParams.get('msg');


        if(type && msg){
            type === "success" ? toast.success(msg) : toast.error(msg);
            router.replace(pathname)
        }
    }, [searchParams])

    return null;
}