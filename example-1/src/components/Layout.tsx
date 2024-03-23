import { Outlet } from "react-router-dom"
import DesktopTopbarComponent from "./desktop/Topbar"
import MobileTopbarComponent from "./mobile/Topbar"
import MobileSidebarComponent from "./mobile/Sidebar"
import React, { useEffect, useState } from "react"
import tinycolor from 'tinycolor2'


interface SidebarState {
    openState: {
        isOpen: boolean
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    }
}

// createContext<>(undefined) is weird; I read that undefined mean to default value; yet
// I have to set a default value and "undefined" is accepted as one; :/
const SidebarContext = React.createContext<SidebarState | undefined>(undefined)
let mainElement: HTMLElement | null = null

function LayoutComponent() {

    //TODO
    useEffect(() => {
        const clickElement = function (event: PointerEvent) {
            const target = event.target as HTMLElement | null
            if (target == null) return

            const getAnchorContainer = function (target: HTMLElement): HTMLAnchorElement | null {
                if (target instanceof HTMLAnchorElement) return target
                if (target.parentElement == null) return null
                return getAnchorContainer(target.parentElement)
            }

            const anchorElement = getAnchorContainer(target)
            if (anchorElement == null) return
            // console.log(`target 1 ${event.target}`)
            // console.log(`target 2 ${event.currentTarget}`)
            // event.curre
            // if (!(target instanceof HTMLAnchorElement)) return
            // if (target.classList == null) return
            const backgroundColorString = anchorElement.style.backgroundColor
            const backgroundColor = tinycolor(anchorElement.style.backgroundColor)
            // const alpha = 0.3
            // target.style.
            anchorElement.animate({ backgroundColor: [backgroundColorString, backgroundColor.brighten(50).toString(), backgroundColorString] }, 300)
            // target.classList.add('clicked')

            // Remove the 'clicked' class after the animation finishes
            // setTimeout(() => {
            // target.classList.remove('clicked')
            // }, 300)

        }

        document.addEventListener('pointerup', clickElement)
        return () => { document.removeEventListener('pointerup', clickElement) }
    }, [])


    const [isOpen, setIsOpen] = useState(false)
    // const [sidebar, setSidebar] = useState<HTMLElement | undefined>()
    // const [topbar, setTopbar] = useState<HTMLElement | undefined>()

    const initializeMainReference = (element: HTMLElement | null) => {
        if (mainElement != null) return
        if (element == null) return
        console.log('initializeMainReference')
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
                // sidebarState: { sidebar, setSidebar }
            }}>
                <header>
                    <MobileTopbarComponent />
                </header>
                <aside>
                    <MobileSidebarComponent />
                </aside>
            </SidebarContext.Provider>
        </div >

        <div className="overlay-anchor">
            <div className="overlay-transparent overlay-front" />
            <main ref={initializeMainReference} tabIndex={1}>
                <Outlet />
                <footer />
            </main>
        </div>
    </>)
}

export default LayoutComponent
export type { SidebarState }
export { SidebarContext }
export { mainElement }