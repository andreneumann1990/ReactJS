import { Outlet } from 'react-router-dom'
import DesktopTopbarComponent from './desktop/Topbar'
import MobileTopbarComponent from './mobile/Topbar'
import MobileSidebarComponent from './mobile/Sidebar'
import React, { useEffect, useState } from 'react'
import tinycolor from 'tinycolor2'

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

function LayoutComponent() {
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

    return (<>
        <div className="desktop sticky">
            <header>
                <DesktopTopbarComponent />
            </header>
        </div>

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
        </div >

        <main ref={initializeMainReference} tabIndex={1}>
            <Outlet />
            <footer />
        </main>
    </>)
}

export default LayoutComponent
export type { SidebarState }
export { SidebarContext, isDebugEnabled }
export { triggerFlashEffect }
export { mainElement }