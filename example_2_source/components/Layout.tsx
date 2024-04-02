'use client'

// import { Outlet } from 'react-router-dom'
import MobileTopbarComponent from './mobile/Topbar'
import MobileSidebarComponent, { sidebarElement } from './mobile/Sidebar'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import tinycolor from 'tinycolor2'
import { dragAction, useDrag } from '@use-gesture/react'
// import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'

interface SidebarState {
    openState: {
        isOpen: boolean
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    }

    lastActiveDropdownState: {
        element: HTMLDivElement | null
        setElement: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>
    }
}

// createContext<>(undefined) is weird; I read that undefined mean to default value; yet
// I have to set a default value and "undefined" is accepted as one; :/
const SidebarContext = React.createContext<SidebarState | undefined>(undefined)
const isDebugEnabled = true
let mainElement: HTMLElement | null = null

interface eventData {
    target: EventTarget | null
}

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

function LayoutComponent({ children }: React.PropsWithChildren<{}>) {
    //
    // side effects
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

    //
    //
    //

    const sidebarContext = useContext(SidebarContext)

    // close sidebar by swipe / panning gesture;
    const dragAttributes = useDrag<PointerEvent>(({ movement: [dx, dy], first, last }) => {
        // offset does not reset when panning ends; movement does;
        if (sidebarContext == null) return
        console.log(`dx ${dx} first ${first} last ${last}`)
        if (!sidebarContext.openState.isOpen) return
        if (sidebarElement == null) return
        if (dx > -10) return
        if (Math.abs(dy) > Math.abs(dx)) return

        // pan move;
        if (!last) {
            sidebarElement.style.transition = 'transform 0s ease'
            const currentOffset = sidebarElement.offsetWidth + dx
            sidebarElement.style.transform = `translateX(${currentOffset}px)`
        }

        // pan end;
        if (isDebugEnabled) console.log('Sidebar: Pan gesture has ended.')
        if (dx < -0.5 * sidebarElement.offsetWidth) {
            // isOpen is not updated immediately;
            // this is enough since the isOpen state is changed; hence, applySidebarState()
            // is called automatically;
            sidebarContext.openState.setIsOpen(false)
            return
        }

        // not needed; the isOpen state is not changed;
        // sidebarContext.openState.setIsOpen(true)
        // cannot call applySidebarState() for this since it depends on this function, i.e. enableTouchEvents();
        sidebarElement.style.transition = 'transform 0.5s ease-out 0s'
        sidebarElement.style.transform = `translateX(${sidebarElement.offsetWidth}px)`
    }, { eventOptions: { capture: true } })

    // const dragAttributes = function () { return {} }
    // if (isServer) dragAttributes = function () { return {} }
    // const temp: ReactDOMAttributes | null = null

    const [isOpen, setIsOpen] = useState(false)
    const [activeDropdownElement, setActiveDropdownElement] = useState<HTMLDivElement | null>(null)

    const initializeMainReference = (element: HTMLElement | null) => {
        if (mainElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Layout: Initialize main reference.')
        mainElement = element

        // only accounts for properties; the reference can still be changed;
        // Object.freeze(mainElement)
    }

    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => setIsLoading(false), [])
    if (isLoading) return <></>

    return (<>
        <div className="mobile sticky">
            <SidebarContext.Provider value={{
                openState: { isOpen, setIsOpen },
                lastActiveDropdownState: { element: activeDropdownElement, setElement: setActiveDropdownElement }
            }}>
                <header>
                    <MobileTopbarComponent />
                </header>
                <aside>
                    <MobileSidebarComponent />
                </aside>
            </SidebarContext.Provider>
        </div>

        <main className="touch-none" ref={initializeMainReference} {...dragAttributes()} tabIndex={1}>
            <div className="padding-main-lr">
                {children}
            </div>
            <footer />
        </main >
    </>)
}

export default LayoutComponent
export type { SidebarState }
export { SidebarContext, isDebugEnabled }
export { triggerFlashEffect }
export { mainElement }