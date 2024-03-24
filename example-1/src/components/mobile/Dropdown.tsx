import { KeyboardEvent, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { SidebarContext, isDebugEnabled, triggerFlashEffect } from '../Layout'

interface Props {
    children: ReactNode
    text: ReactNode
}

function MobileDropdownComponent({ text, children }: Props) {
    const sidebarContext = useContext(SidebarContext)
    const menuReference = useRef<HTMLDivElement | null>(null)
    const contentReference = useRef<HTMLDivElement | null>(null)
    const iconReference = useRef<HTMLElement | null>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    //
    //
    //

    // what was this used for again?; TODO;
    // function cancelEvent(event: MouseEvent): void {
    //     event.preventDefault()
    // }

    function handleArrowLeft(event: KeyboardEvent): void {
        if (menuReference.current == null) return
        if (event.key === 'ArrowLeft' && isOpen) {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()

            const menuButton = menuReference.current.querySelector('a')
            if (menuButton != null) menuButton.focus()
            return
        }
    }

    function toggleContentKeyInput(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()
            triggerFlashEffect(event)
            return
        }

        if (event.key === 'ArrowRight' && !isOpen) {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()
            triggerFlashEffect(event)
            return
        }

        if (event.key === 'ArrowLeft' && isOpen) {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()
            return
        }
    }

    const toggleContent = useCallback(() => {
        if (sidebarContext == null) return
        if (menuReference.current === null) return
        if (contentReference.current === null) return

        if (iconReference.current === null) return
        if (isDebugEnabled) console.log(`Dropdown: isOpen ${!isOpen}`)

        if (isOpen) {
            setIsOpen(false)
            menuReference.current.classList.remove('active')
            contentReference.current.classList.add('hidden')

            contentReference.current.classList.remove('active')
            contentReference.current.style.height = '0'
            iconReference.current.style.transform = 'rotate(0deg)'
            return
        }

        let contentHeight = 0
        contentReference.current.childNodes.forEach((element: Node) => {
            if (!(element instanceof HTMLAnchorElement)) return
            contentHeight += element.offsetHeight
        })

        setIsOpen(true)
        menuReference.current.classList.add('active')
        contentReference.current.classList.remove('hidden')

        contentReference.current.classList.add('active')
        contentReference.current.style.height = `${contentHeight}px`
        iconReference.current.style.transform = 'rotate(-180deg)'
        sidebarContext.lastActiveDropdownState.setElement(menuReference.current)
    }, [isOpen, sidebarContext])

    //
    // side effects
    //

    // close this one if another dropdown menu got opened;
    useEffect(() => {
        if (isDebugEnabled) console.log(`Dropdown: isOpen ${isOpen}`)
        if (!isOpen) return
        if (sidebarContext == null) return
        if (sidebarContext.lastActiveDropdownState.element == null) return

        if (menuReference.current == null) return
        if (menuReference.current === sidebarContext.lastActiveDropdownState.element) return
        toggleContent()
    }, [isOpen, sidebarContext, toggleContent])

    // update tabindex;
    useEffect(() => {
        if (sidebarContext == null) return
        if (contentReference.current == null) return
        if (menuReference.current == null) return

        if (!sidebarContext.openState.isOpen) {
            menuReference.current.querySelectorAll('a').forEach(element => {
                element.tabIndex = -1
            })
            return
        }

        const menuButton = menuReference.current.querySelector('a')
        if (menuButton != null) menuButton.tabIndex = 100

        if (isOpen) {
            contentReference.current.querySelectorAll('a').forEach(element => {
                element.tabIndex = 100
            })
            return
        }

        contentReference.current.querySelectorAll('a').forEach(element => {
            element.tabIndex = -1
        })
    }, [isOpen, sidebarContext])

    //
    //
    //

    return (<>
        {/* the div block is for changing the background color; the anchor changed its bg-color based on hover; */}
        <div ref={menuReference} className="mobile-dropdown-menu">
            <a href="#" onPointerUp={toggleContent} onKeyUp={toggleContentKeyInput}>
                <div className="grid grid-dropdown">
                    {text}
                    <i ref={iconReference} className="icon material-icons grid-fit-right">computer</i>
                </div>
            </a>
            <div ref={contentReference} className="mobile-dropdown-content hidden" onKeyUp={handleArrowLeft}>
                {children}
            </div>
        </div>
    </>)
}

export default MobileDropdownComponent