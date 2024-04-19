'use client'

import Topnav, { useTopnavStore } from './Topnav'
import Sidenav from './Sidenav'
import React, { useEffect } from 'react'
import Main, { useMainStore } from './Main'
import { isDebugEnabled, tabIndexGroupDefault } from '../../constants/general_constants'
import { triggerFlashEffect } from '../../constants/event_constants'
import { create } from 'zustand'

export default Layout
export { useLayoutStore }

//
//
//

const useLayoutStore = create<{
    activeTabIndexGroup: number,
    setActiveTabIndexGroup: (tabIndex: number) => void,
    resetActiveTabIndexGroup: () => void,
}>(set => ({
    activeTabIndexGroup: 0,
    setActiveTabIndexGroup: (tabIndex) => set(() => {
        if (isDebugEnabled) console.log(`Layout: tabIndex ${tabIndex}`)
        return { activeTabIndexGroup: tabIndex }
    }),
    resetActiveTabIndexGroup: () => set(() => {
        if (isDebugEnabled) console.log(`Layout: tabIndex ${tabIndexGroupDefault}`)
        return { activeTabIndexGroup: tabIndexGroupDefault }
    })
}))

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
    const layoutState = useLayoutStore()
    const mainState = useMainStore()
    const topnavState = useTopnavStore()

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