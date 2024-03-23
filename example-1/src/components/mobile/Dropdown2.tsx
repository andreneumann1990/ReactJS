import { KeyboardEvent, MouseEvent, useContext, useEffect, useRef, useState } from "react"
import { SidebarContext } from "../Layout"

function MobileDropdown2Component() {
    const sidebarContext = useContext(SidebarContext)
    const contentElement = useRef<HTMLDivElement | null>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        if (sidebarContext == null) return
        if (contentElement.current == null) return

        if (sidebarContext.openState.isOpen) {
            for (const childIndex in contentElement.current.children) {
                const child = contentElement.current.children[childIndex] as HTMLElement
                if (child.tabIndex == null) continue
                if (child.tabIndex > -100) continue
                child.tabIndex = 0
            }
            return
        }

        for (const childIndex in contentElement.current.children) {
            const child = contentElement.current.children[childIndex] as HTMLElement
            if (child.tabIndex == null) continue
            if (child.tabIndex < 0) continue
            child.tabIndex = -100
        }
    }, [sidebarContext])

    //
    //
    //

    function cancelEvent(event: MouseEvent): void {
        event.preventDefault()
    }

    function toggleContentKeyboard(event: KeyboardEvent): void {
        if (event.key !== "Enter") return
        toggleContentMouseAndTouch()
    }

    const toggleContentMouseAndTouch = () => {
        if (contentElement.current === null) return
        const transparentOverlay = contentElement.current.parentElement?.children[0] as HTMLElement
        if (transparentOverlay == null) return
        const classList = contentElement.current.classList

        if (isOpen) {
            transparentOverlay.style.backgroundColor = "hsla(0, 0%, 100%, 0)"
            classList.add("hidden")
            setIsOpen(false)
            return
        }

        transparentOverlay.style.backgroundColor = "hsla(0, 0%, 100%, 0.03)"
        classList.remove("hidden")
        setIsOpen(true)
    }

    return (<>
        <div className="overlay-anchor">
            <div className="overlay-transparent overlay-back" />
            <a href="" className="mobile-dropdown" onClick={cancelEvent} onPointerUp={toggleContentMouseAndTouch} onKeyUp={toggleContentKeyboard}>Dropdown 2</a>
            <div ref={contentElement} className="mobile-dropdown-content hidden">
                <a href="/home">Link 9</a>
                <a href="/home">Link 10</a>
            </div>
        </div>
    </>)
}

export default MobileDropdown2Component