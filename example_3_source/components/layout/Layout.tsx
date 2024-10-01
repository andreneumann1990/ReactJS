'use client'

import Topnav from './Topnav'
import Sidenav from './Sidenav'
import React, { Suspense, useEffect } from 'react'
import Main from './Main'
import { triggerFlashEffect } from '../../constants/functions'
import { NullableHTMLElement, NullableNumber } from '../../constants/types'
import { useGlobalStore } from '../../hooks/useStore'
import { maximumDelay } from '../../constants/parameters'

export default Layout
export { handleKeyDown_Global as handleKeyDown_Layout }

//
// functions
//

function handleKeyDown_Global(event: React.KeyboardEvent): NullableNumber {
    const globalState = useGlobalStore.getState()
    const { layoutState, mainState, searchState, topnavState } = globalState

    // focus search input in topnav by ctrl+k;
    if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        event.stopPropagation()

        if (document.activeElement === searchState.inputElement) {
            layoutState.previousFocusedElement?.focus()
            searchState.inputElement?.blur()
            return maximumDelay
        }

        layoutState.setPreviousFocusedElement(document.activeElement as NullableHTMLElement)
        searchState.inputElement?.focus()
        return maximumDelay
    }

    if (document.activeElement instanceof HTMLBodyElement) {
        if (event.key === 'Enter' || event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault()
            event.stopPropagation()
            mainState.element?.focus()
            return maximumDelay
        }

        if (event.key === 'Escape' || event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault()
            event.stopPropagation()
            topnavState.element?.focus()
            return maximumDelay
        }
    }
    return null
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
        document.addEventListener('pointerup', triggerFlashEffect)
        return () => { document.removeEventListener('pointerup', triggerFlashEffect) }
    }, [])

    // for debugging only;
    // useEffect(() => {
    //     const interval = setInterval(() => { console.log(document.activeElement) }, 5000)
    //     return () => clearInterval(interval)
    // }, [])

    // useEffect(() => {
    //     setTimeout(() => { console.log(window.getSelection()) }, 5000)
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