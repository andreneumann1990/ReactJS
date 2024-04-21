'use client'

import Topnav from './Topnav'
import Sidenav from './Sidenav'
import React, { Suspense, useEffect } from 'react'
import Main from './Main'
import { triggerFlashEffect } from '../../constants/events'

export default Layout

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
    // const { layoutState, mainState, topnavState } = useGlobalStore()

    //
    // functions
    //

    //
    // effects
    //

    // click highlights links;
    useEffect(() => {
        document.addEventListener('pointerup', triggerFlashEffect)
        return () => { document.removeEventListener('pointerup', triggerFlashEffect) }
    }, [])

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