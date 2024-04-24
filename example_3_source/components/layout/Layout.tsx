'use client'

import Topnav from './Topnav'
import Sidenav from './Sidenav'
import React, { Suspense, useEffect } from 'react'
import Main from './Main'
import { triggerFlashEffect } from '../../constants/functions'

export default Layout

//
// main
//

function Layout({ children }: React.PropsWithChildren) {
    //
    // effects
    //

    // click highlights links;
    useEffect(() => {
        document.addEventListener('pointerup', triggerFlashEffect)
        return () => { document.removeEventListener('pointerup', triggerFlashEffect) }
    }, [])

    // for debugging only;
    // useEffect(() => {
    //     const interval = setInterval(() => { console.log(document.activeElement) }, 5000)
    //     return () => clearInterval(interval)
    // }, [])

    //
    //
    //

    return (<>
        <div className="sticky top-0 z-[100]">
            <header><Topnav /></header>
            <aside><Sidenav /></aside>
        </div>
        <Suspense>
            <Main>
                {children}
            </Main>
        </Suspense>
    </>)
}