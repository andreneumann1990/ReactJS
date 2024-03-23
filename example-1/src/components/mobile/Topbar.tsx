import { KeyboardEvent, useCallback, useContext, useEffect } from "react"
import { SidebarContext } from "../Layout"

let buttonElement: HTMLButtonElement | null = null
let topbarElement: HTMLElement | null = null

function MobileTopbarComponent() {
    const sidebarContext = useContext(SidebarContext)

    // switch image for the sidebar toggle button;
    useEffect(() => {
        // useEffect in combination with ref.current is probably bad; .current does not
        // trigger a re-render and cannot be a dependency therefore;
        // => use topbarState instead;
        if (sidebarContext == null) return
        if (buttonElement == null) return
        if (buttonElement.children.length < 2) return

        // this depends on the order; careful, if I want to leave it as simple as this;
        const menuIconClassList = buttonElement.children[0].classList
        const closeIconClassList = buttonElement.children[1].classList

        if (!sidebarContext.openState.isOpen) {
            menuIconClassList.remove("hidden")
            closeIconClassList.add("hidden")
            return
        }

        menuIconClassList.add("hidden")
        closeIconClassList.remove("hidden")
    }, [sidebarContext])

    //
    //
    //

    const initializeButtonReference = (element: HTMLButtonElement | null) => {
        if (buttonElement != null) return
        if (element == null) return
        console.log('initializeButtonReference')
        buttonElement = element
        // Object.freeze(buttonElement)
        // buttonElement.className = "5px" //TODO
    }

    const initializeTopbarReference = (element: HTMLElement | null) => {
        if (topbarElement != null) return
        if (element == null) return
        console.log('initializeTopbarReference')
        topbarElement = element
        Object.freeze(topbarElement)
    }

    const toggleSidebarMouseAndTouch = useCallback(() => {
        if (sidebarContext == null) return
        console.log('toggleSidebar')

        // not updated immediately;
        sidebarContext.openState.setIsOpen(!sidebarContext.openState.isOpen)
    }, [sidebarContext])

    const toggleSidebarKeyboard = useCallback((event: KeyboardEvent) => {
        if (event.key !== "Enter") return
        toggleSidebarMouseAndTouch()
    }, [toggleSidebarMouseAndTouch])

    //
    //
    //

    return (<nav ref={(element) => initializeTopbarReference(element)} className="mobile-topbar">
        <div className="grid grid-row-20-80">
            <button className="sidebar-toggle-button" ref={initializeButtonReference} onPointerUp={toggleSidebarMouseAndTouch} onKeyUp={toggleSidebarKeyboard}>
                <i className="icon material-icons">menu</i>
                <i className="icon material-icons hidden">close</i>
            </button>
            <div className="flex flex-row flex-main-center flex-cross-evenly">
                <i className="material-icons">cloud</i>
                <i className="material-icons">favorite</i>
                <i className="material-icons">attachment</i>
                <i className="material-icons">computer</i>
                <i className="material-icons">traffic</i>
            </div>
        </div>
        {/* <p>very important text</p> */}
        {/* <a href="/home">Link 1</a>
        <a href="/home">Link 2</a> */}
    </nav>)
}

export default MobileTopbarComponent
export { buttonElement }
export { topbarElement }