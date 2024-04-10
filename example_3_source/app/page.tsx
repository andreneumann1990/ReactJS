'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default Page

//
//
//

function Page() {
    const router = useRouter()
    useEffect(() => {
        router.push('/home')
    }, [router])

    return null
}
