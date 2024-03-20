import { Outlet } from "react-router-dom"
import DesktopTopbarComponent from "./desktop/Topbar"
import MobileTopbarComponent from "./mobile/Topbar"
import MobileSidebarComponent from "./mobile/Sidebar"
import React, { useState } from "react"

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

        <main ref={initializeMainReference}>
            <Outlet />
            <footer />
        </main>
    </>)
}

export default LayoutComponent
export type { SidebarState }
export { SidebarContext }
export { mainElement }