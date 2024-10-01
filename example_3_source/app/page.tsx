'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default Page

//
// main
//

function Page() {
    const router = useRouter()
    const { push } = router
    useEffect(() => { push('/home') }, [push])
    return null
}
