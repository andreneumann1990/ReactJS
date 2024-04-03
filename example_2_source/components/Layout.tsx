'use client'

import Topnav from './Topnav'
import Sidenav, { sidebarElement } from './Sidenav'
import React, { useEffect, useState } from 'react'
import tinycolor from 'tinycolor2'
import { useDrag } from '@use-gesture/react'
import { create } from 'zustand'

//
//
//

export default Layout
export type { SidenavState }
export { isDebugEnabled }
export { triggerFlashEffect }
export { mainElement }

export const useSidenavStore = create<SidenavState>(set => ({
    isOpen: false,
    setIsOpen: (isOpen) => set(() => ({ isOpen })),

    lastActiveDropdownElement: null,
    setLastActiveDropdownElement: (element) => set(() => ({ lastActiveDropdownElement: element })),
}))

//
//
//

interface SidenavState {
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,

    lastActiveDropdownElement: HTMLDivElement | null,
    setLastActiveDropdownElement: (element: HTMLDivElement | null) => void,
}

interface eventData {
    target: EventTarget | null
}

//
//
//

const isDebugEnabled = true
let mainElement: HTMLElement | null = null

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
    // parameters and variables
    //

    // const sidebarContext = useContext(SidenavContext)
    // const [activeDropdownElement, setActiveDropdownElement] = useState<HTMLDivElement | null>(null)
    // const [isDragEnabled, setIsDragEnabled] = useState(false)
    const isSidenavOpen = useSidenavStore(state => state.isOpen)
    const setIsSidenavOpen = useSidenavStore(state => state.setIsOpen)
    // const [isOpen, setIsOpen] = useState(false)

    //
    // functions
    //

    // close sidebar by swipe / panning gesture;
    const dragAttributes = useDrag<PointerEvent>(({ movement: [dx, dy], first, last, distance }) => {
        // offset does not reset when panning ends; movement does;
        // if (sidebarContext == null) return
        console.log(`dx ${dx} first ${first} last ${last} distance ${distance}`)
        if (sidebarElement == null) return
        if (dx > -10) return
        if (Math.abs(dy) > Math.abs(dx)) return

        // pan move;
        if (!last) {
            sidebarElement.style.transition = 'transform 0s ease'
            const currentOffset = sidebarElement.offsetWidth + dx
            sidebarElement.style.transform = `translateX(${currentOffset}px)`
            return
        }

        // pan end;
        if (isDebugEnabled) console.log('Sidenav: Pan gesture has ended.')
        if (dx < -0.5 * sidebarElement.offsetWidth) {
            // isOpen is not updated immediately;
            // this is enough since the isOpen state is changed; hence, applySidenavState()
            // is called automatically;
            setIsSidenavOpen(false)
            return
        }

        // not needed; the isOpen state is not changed;
        // sidebarContext.openState.setIsOpen(true)
        // cannot call applySidenavState() for this since it depends on this function, i.e. enableTouchEvents();
        sidebarElement.style.transition = 'transform 0.5s ease-out 0s'
        sidebarElement.style.transform = `translateX(${sidebarElement.offsetWidth}px)`
    }, { eventOptions: { capture: true }, enabled: isSidenavOpen })

    // const dragAttributes = function () { return { } }
    // if (isServer) dragAttributes = function () { return { } }
    // const temp: ReactDOMAttributes | null = null

    const initializeMainReference = (element: HTMLElement | null) => {
        if (mainElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Layout: Initialize main reference.')
        mainElement = element

        // only accounts for properties; the reference can still be changed;
        // Object.freeze(mainElement)
    }

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

        <main className="flex flex-col justify-between h-[calc(100vh-var(--height-topnav))] pl-16 pr-8 text-wrap break-words overflow-y-auto overscroll-contain scrollbar-gutter-stable-both transition-colors ease-out duration-300" ref={initializeMainReference} {...dragAttributes()} tabIndex={1}>
            <div>{children}</div>
            <div>
                <footer className="border grid content-center h-32">
                    <h1 className="text-center text-xl">Footer</h1>
                </footer>
            </div>
        </main >
    </>)
}