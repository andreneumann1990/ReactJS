'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import Layout from '../components/Layout'

// export default function ({ Component, pageProps }) {
//     return (<>
//         <React.StrictMode>
//             <Component {...pageProps} />
//         </React.StrictMode>
//     </>)
// }

// pages/app/page.tsx

export default function Page() {
    // return (<>
    //     <Layout />
    // </>)
    const router = useRouter()

    useEffect(() => {
        router.push('/home')
    }, [router])

    return null // Render nothing or a loading indicator while waiting for the redirect
}
