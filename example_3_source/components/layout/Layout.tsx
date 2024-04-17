'use client'

import Topnav from './Topnav'
import Sidenav from './Sidenav'
import React, { useEffect } from 'react'
import Main from './Main'
import { isDebugEnabled } from '../../constants/general_constants'
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
}>(set => ({
    activeTabIndexGroup: 0,
    setActiveTabIndexGroup: (tabIndex) => set(() => ({ activeTabIndexGroup: tabIndex })),
}))

//
// main
//

function Layout({ children }: React.PropsWithChildren) {
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

    // manage tabIndexGroup; //TODO
    // useEffect(() => {
    //     if ()
    // }, [])

    // is this still used??; TODO;
    // const [isLoading, setIsLoading] = useState(true)
    // useEffect(() => setIsLoading(false), [])
    // if (isLoading) return <></>

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