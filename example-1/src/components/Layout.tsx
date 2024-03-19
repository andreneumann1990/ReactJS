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
    sidebarState: {
        sidebar: HTMLElement | undefined
        setSidebar: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>
    }
}

interface TopbarContextData {
    // maybe split in burger and X;
    buttonState: {
        button: HTMLButtonElement | undefined
        setButton: React.Dispatch<React.SetStateAction<HTMLButtonElement | undefined>>
    }
    topbarState: {
        topbar: HTMLElement | undefined
        setTopbar: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>
    }
}

// createContext<>(undefined) is weird; I read that undefined mean to default value; yet
// I have to set a default value and "undefined" is accepted as one; :/
const SidebarContext = React.createContext<SidebarState | undefined>(undefined)
const TopbarContext = React.createContext<TopbarContextData | undefined>(undefined)

function LayoutComponent() {
    const [button, setButton] = useState<HTMLButtonElement | undefined>()
    const [isOpen, setIsOpen] = useState(false)
    const [sidebar, setSidebar] = useState<HTMLElement | undefined>()
    const [topbar, setTopbar] = useState<HTMLElement | undefined>()

    return (<>
        <div className="desktop sticky">
            <header>
                <DesktopTopbarComponent />
            </header>
        </div>

        <div className="mobile sticky">
            <TopbarContext.Provider value={{
                buttonState: { button, setButton },
                topbarState: { topbar, setTopbar }
            }}>
                <SidebarContext.Provider value={{
                    openState: { isOpen, setIsOpen },
                    sidebarState: { sidebar, setSidebar }
                }}>
                    <header>
                        <MobileTopbarComponent />
                    </header>
                    <aside>
                        <MobileSidebarComponent />
                    </aside>
                </SidebarContext.Provider>
            </TopbarContext.Provider>
        </div >

        <main>
            <Outlet />
        </main>

        <footer>

        </footer>
    </>)
}

export default LayoutComponent
export type { SidebarState }
export { SidebarContext }
export { TopbarContext }