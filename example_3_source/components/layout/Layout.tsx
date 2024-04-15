'use client'

import Topnav from './Topnav'
import Sidenav from './Sidenav'
import React, { useEffect, useState } from 'react'
import Main from './Main'
import { isDebugEnabled } from '../../constants/general_constants'
import { triggerFlashEffect } from '../../constants/event_constants'

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
        const pressKey = function (event: KeyboardEvent) {
            if (event.key !== 'Enter') return
            const element = event.target as HTMLElement | null
            if (element == null) return
            if (element.tagName !== 'A') return
            if (isDebugEnabled) console.log('Layout: Enter pressed on anchor element.')
            triggerFlashEffect(event)
        }

        document.addEventListener('pointerup', triggerFlashEffect)
        document.addEventListener('keypress', pressKey)

        return () => {
            document.removeEventListener('pointerup', triggerFlashEffect)
            document.removeEventListener('keypress', pressKey)
        }
    }, [])

    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => setIsLoading(false), [])
    if (isLoading) return <></>

    //
    //
    //

    return (<>
        <div className="mobile sticky">
            <header><Topnav /></header>
            <aside><Sidenav /></aside>
        </div>
        <Main>
            {children}
        </Main>
    </>)
}