'use client'

import Topnav from './Topnav'
import Sidenav from './Sidenav'
import React, { useEffect } from 'react'
import Main from './Main'
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

    //
    // effects
    //

    // click highlights links;
    useEffect(() => {
        const pressKey = function (event: KeyboardEvent) {
            if (event.key !== 'Enter') return
            const element = event.target as HTMLElement | null
            if (element == null) return
            if (element.tagName != 'A' && element.tagName != 'button') return
            if (isDebugEnabled) console.log('Layout: Enter pressed.')
            triggerFlashEffect(event)
        }

        document.addEventListener('pointerup', triggerFlashEffect)
        document.addEventListener('keypress', pressKey)

        return () => {
            document.removeEventListener('pointerup', triggerFlashEffect)
            document.removeEventListener('keypress', pressKey)
        }
    }, [])

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