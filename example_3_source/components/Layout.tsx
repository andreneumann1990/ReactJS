'use client'

import Topnav from './Topnav'
import Sidenav from './Sidenav'
import React, { useEffect, useState } from 'react'
import tinycolor from 'tinycolor2'
import Main from './Main'

export default Layout
export { isDebugEnabled }
export { triggerFlashEffect }
export { backEndHRef }

//
//
//

const isProduction = process.env.NODE_ENV === 'production'
const backEndHRef = isProduction ? 'https://example-3-b52da596edfb.herokuapp.com/' : 'http://localhost:8080'

interface eventData {
    target: EventTarget | null
}

const isDebugEnabled = true
const triggerFlashEffect = function (event: eventData) {
    const element = event.target as HTMLElement | null
    if (element == null) return

    const getAnchorContainer = function (target: HTMLElement): HTMLAnchorElement | null {
        if (target instanceof HTMLAnchorElement) return target
        if (target.parentElement == null) return null
        return getAnchorContainer(target.parentElement)
    }

    const anchorElement = getAnchorContainer(element)
    if (anchorElement == null) return
    const backgroundColorString = anchorElement.style.backgroundColor
    const backgroundColor = tinycolor(anchorElement.style.backgroundColor)
    anchorElement.animate({ backgroundColor: [backgroundColorString, backgroundColor.brighten(50).toString(), backgroundColorString] }, 300)
}

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