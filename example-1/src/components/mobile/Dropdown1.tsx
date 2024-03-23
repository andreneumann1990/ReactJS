import { KeyboardEvent, MouseEvent, ReactNode, useContext, useEffect, useRef, useState } from "react"
import { SidebarContext } from "../Layout"

interface Props {
    children: ReactNode
    text: ReactNode
}

function MobileDropdown1Component({ text, children }: Props) {
    const sidebarContext = useContext(SidebarContext)
    const buttonReference = useRef<HTMLDivElement | null>(null)
    const contentReference = useRef<HTMLDivElement | null>(null)
    const iconReference = useRef<HTMLElement | null>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        if (sidebarContext == null) return
        if (contentReference.current == null) return

        if (sidebarContext.openState.isOpen) {
            for (const childIndex in contentReference.current.children) {
                const child = contentReference.current.children[childIndex] as HTMLElement
                if (child.tabIndex == null) continue
                if (child.tabIndex > -100) continue
                child.tabIndex = 0
            }
            return
        }

        for (const childIndex in contentReference.current.children) {
            const child = contentReference.current.children[childIndex] as HTMLElement
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
        if (buttonReference.current === null) return
        if (contentReference.current === null) return
        if (iconReference.current === null) return
        const classList = contentReference.current.classList

        if (isOpen) {
            classList.add("hidden")
            buttonReference.current.classList.remove('active')
            contentReference.current.classList.remove('active')
            contentReference.current.style.height = '0'

            iconReference.current.style.transform = "rotate(0deg)"
            setIsOpen(false)
            return
        }

        let contentHeight = 0
        contentReference.current.childNodes.forEach((element: Node) => {
            if (!(element instanceof HTMLAnchorElement)) return
            contentHeight += element.offsetHeight
        })

        classList.remove("hidden")
        buttonReference.current.classList.add('active')
        contentReference.current.classList.add('active')
        contentReference.current.style.height = `${contentHeight}px`

        iconReference.current.style.transform = "rotate(-180deg)"
        setIsOpen(true)
    }

    return (<>
        {/* the div block is for changing the background color; the anchor changed its bg-color based on hover; */}
        <div ref={buttonReference} className="mobile-dropdown">
            <a href="" onClick={cancelEvent} onPointerUp={toggleContentMouseAndTouch} onKeyUp={toggleContentKeyboard}>
                <div className="grid grid-row-80-20">
                    {text}
                    <i ref={iconReference} className="icon material-icons grid-row-fit-right">computer</i>
                    <i className="icon material-icons grid-row-fit-right hidden">traffic</i>
                </div>
            </a>
        </div>
        <div ref={contentReference} className="mobile-dropdown-content hidden">
            {children}
        </div>
    </>)
}

export default MobileDropdown1Component