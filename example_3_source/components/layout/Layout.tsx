'use client'

import Topnav from './Topnav'
import Sidenav from './Sidenav'
import React, { useEffect } from 'react'
import Main from './Main'
import { isDebugEnabled, tabIndexGroupDefault } from '../../constants/general_constants'
import { triggerFlashEffect } from '../../constants/event_constants'
import { create } from 'zustand'
import { GlobalState } from '../../constants/types'
import { useGlobalStore } from '../../hooks/stores'

export default Layout

//
// main
//

function Layout({ children }: React.PropsWithChildren) {
    useEffect(() => { console.log(document.activeElement) }, [])

    //
    // parameters and variables
    //

    //TODO
    // const isSearchOpen: boolean = useSearchStore(state => state.isOpen)
    // const isSidenavOpen = useSidenavStore(state => state.isOpen)
    const { layoutState, mainState, topnavState } = useGlobalStore()
    //
    // functions
    //

    //
    // effects
    //

    // click highlights links; up / down selects topnav / main;
    useEffect(() => {
        const handleKeyUpInput = function (event: KeyboardEvent) {
            const element = event.target as HTMLElement | null
            if (element == null) return

            if (layoutState.activeTabIndexGroup === tabIndexGroupDefault) {
                if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    event.stopPropagation()
                    topnavState.element?.focus()
                    return
                }

                if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    event.stopPropagation()
                    mainState.element?.focus()
                    return
                }
                return
            }
        }

        document.addEventListener('pointerup', triggerFlashEffect)
        document.addEventListener('keyup', handleKeyUpInput)

        return () => {
            document.removeEventListener('pointerup', triggerFlashEffect)
            document.removeEventListener('keyup', handleKeyUpInput)
        }
    }, [layoutState.activeTabIndexGroup, mainState.element, topnavState.element])

    //
    //
    //

    return (<>
        <div className="sticky top-0 z-[100]">
            <header><Topnav /></header>
            <aside><Sidenav /></aside>
        </div>
        <Main>
            {children}
        </Main>
    </>)
}