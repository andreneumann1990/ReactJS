import { useCallback, useContext, useEffect } from "react"
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

        //TODO
        // for (let index = 0; index < button.children.length; ++index) {
        //     console.log(button.children[index])
        //     console.log(button.children[index].className)
        //     console.log(button.children[index].classList.contains(""))
        // }

        // this depends on the order; careful, if I want to leave it as simple as this;
        const burgerClassList = buttonElement.children[0].classList
        const xClassList = buttonElement.children[1].classList
        // const iconBurger = button.children[0] as HTMLElement
        // const iconX = button.children[1] as HTMLElement

        if (!sidebarContext.openState.isOpen) {
            // iconBurger.style.visibility = "visible"
            // iconX.style.visibility = "hidden"
            burgerClassList.remove("hidden")
            xClassList.add("hidden")
            return
        }

        // iconBurger.style.visibility = "hidden"
        // iconX.style.visibility = "visible"
        burgerClassList.add("hidden")
        xClassList.remove("hidden")
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

    const toggleSidebar = useCallback(() => {
        if (sidebarContext == null) return
        console.log('toggleSidebar')

        // not updated immediately;
        sidebarContext.openState.setIsOpen(!sidebarContext.openState.isOpen)
    }, [sidebarContext])

    //
    //
    //

    const imgSize = "32px"
    return (<nav ref={(element) => initializeTopbarReference(element)} className="mobile-topbar">
        <div className="grid grid-row-20-80">
            <button className="sidebar-toggle-button" ref={initializeButtonReference} onPointerUp={toggleSidebar}>
                <img className="burger-open" src="/mobile/burger.svg" alt="burger-open button" width={imgSize} height={imgSize} />
                <img className="x-close hidden" src="/mobile/x.svg" alt="x-close button" width={imgSize} height={imgSize} />
                {/* <img className="burger-open" src="/mobile/burger.svg" alt="burger-open button" width={imgSize} height={imgSize} />
            <img className="x-close hidden" src="/mobile/x.svg" alt="x-close button" width={imgSize} height={imgSize} /> */}
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