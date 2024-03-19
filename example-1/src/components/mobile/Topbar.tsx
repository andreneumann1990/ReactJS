import { useContext, useEffect } from "react"
import { SidebarContext, TopbarContext } from "../Layout"

function MobileTopbarComponent() {
    const sidebarContext = useContext(SidebarContext)
    const topbarContext = useContext(TopbarContext)

    // switch image for the sidebar toggle button;
    useEffect(() => {
        // useEffect in combination with ref.current is probably bad; .current does not
        // trigger a re-render and cannot be a dependency therefore;
        // => use topbarState instead;
        if (sidebarContext == null) return
        if (topbarContext == null) return

        const button = topbarContext.buttonState.button
        if (button == null) return
        if (button.children.length < 2) return

        //TODO
        // for (let index = 0; index < button.children.length; ++index) {
        //     console.log(button.children[index])
        //     console.log(button.children[index].className)
        //     console.log(button.children[index].classList.contains(""))
        // }

        // this depends on the order; care if I want to leave it as simple as this;
        const burgerClassList = button.children[0].classList
        const xClassList = button.children[1].classList
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
    }, [sidebarContext, topbarContext])

    //
    //
    //

    const initializeButton = (button: HTMLButtonElement | null) => {
        if (button == null) return
        topbarContext?.buttonState.setButton(button)
    }

    const initializeTopbar = (topbar: HTMLElement | null) => {
        if (topbar == null) return
        topbarContext?.topbarState.setTopbar(topbar)
    }

    const toggleSidebar = () => {
        if (sidebarContext == null) return
        sidebarContext.openState.setIsOpen(!sidebarContext.openState.isOpen)
    }

    //
    //
    //

    return (<nav ref={(element) => initializeTopbar(element)} className="mobile-topbar">
        <button ref={(element) => initializeButton(element)} onPointerUp={() => toggleSidebar()}>
            <img className="burger-open" src="/mobile/burger.svg" alt="burger menu button" />
            <img className="x-close hidden" src="/mobile/x.svg" alt="burger menu button" />
        </button>
        {/* <p>very important text</p> */}
        {/* <a href="/home">Link 1</a>
        <a href="/home">Link 2</a> */}
    </nav>)
}

export default MobileTopbarComponent