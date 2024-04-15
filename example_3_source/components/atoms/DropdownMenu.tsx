import { KeyboardEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSidenavStore } from '../layout/Sidenav'
import { triggerFlashEffect } from '../../constants/event_constants'
import { isDebugEnabled } from '../../constants/general_constants'

export default DropdownMenu

//
//
//

function DropdownMenu({ children, className, text }: {
    children?: ReactNode
    className?: string
    text?: ReactNode
}) {
    //
    // parameters and variables
    //

    // const sidebarContext = useContext(SidenavContext)
    const menuReference = useRef<HTMLDivElement | null>(null)
    const contentReference = useRef<HTMLDivElement | null>(null)
    const iconReference = useRef<HTMLElement | null>(null)

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
    const isSidenavOpen = useSidenavStore(state => state.isOpen)
    const lastActiveDropdownElement = useSidenavStore(state => state.lastActiveDropdownElement)
    const setLastActiveDropdownElement = useSidenavStore(state => state.setLastActiveDropdownElement)

    //
    // functions
    //

    function handleArrowLeft(event: KeyboardEvent): void {
        if (menuReference.current == null) return
        if (event.key === 'ArrowLeft' && isDropdownOpen) {
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

        if (event.key === 'ArrowRight' && !isDropdownOpen) {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()
            triggerFlashEffect(event)
            return
        }

        if (event.key === 'ArrowLeft' && isDropdownOpen) {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()
            return
        }
    }

    const toggleContent = useCallback(() => {
        if (menuReference.current === null) return
        if (contentReference.current === null) return

        if (iconReference.current === null) return
        if (isDebugEnabled) console.log(`Dropdown: isOpen ${!isDropdownOpen}`)

        if (isDropdownOpen) {
            setIsDropdownOpen(false)
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

        setIsDropdownOpen(true)
        menuReference.current.classList.add('active')
        contentReference.current.classList.remove('hidden')

        contentReference.current.classList.add('active')
        contentReference.current.style.height = `${contentHeight}px`
        iconReference.current.style.transform = 'rotate(-180deg)'
        setLastActiveDropdownElement(menuReference.current)
    }, [isDropdownOpen, setLastActiveDropdownElement])

    //
    // effects
    //

    // close this one if another dropdown menu got opened;
    useEffect(() => {
        if (isDebugEnabled) console.log(`Dropdown: isOpen ${isDropdownOpen}`)
        if (!isDropdownOpen) return
        if (lastActiveDropdownElement == null) return

        if (menuReference.current == null) return
        if (menuReference.current === lastActiveDropdownElement) return
        toggleContent()
    }, [isDropdownOpen, lastActiveDropdownElement, toggleContent])

    // update tabindex;
    useEffect(() => {
        if (contentReference.current == null) return
        if (menuReference.current == null) return

        if (!isSidenavOpen) {
            menuReference.current.querySelectorAll('a').forEach(element => {
                element.tabIndex = -1
            })
            return
        }

        const menuButton = menuReference.current.querySelector('a')
        if (menuButton != null) menuButton.tabIndex = 100

        if (isDropdownOpen) {
            contentReference.current.querySelectorAll('a').forEach(element => {
                element.tabIndex = 100
            })
            return
        }

        contentReference.current.querySelectorAll('a').forEach(element => {
            element.tabIndex = -1
        })
    }, [isDropdownOpen, isSidenavOpen])

    //
    //
    //

    return (<>
        {/* the div block is for changing the background color; the anchor changed its bg-color based on hover; */}
        <div ref={menuReference} className={className == null ? 'mobile-dropdown-menu' : 'mobile-dropdown-menu ' + className}>
            <Link href="#" onPointerUp={toggleContent} onKeyUp={toggleContentKeyInput}>
                <div className="grid grid-cols-2 items-center">
                    {text}
                    <i ref={iconReference} className="icon-medium material-icons justify-self-end">computer</i>
                </div>
            </Link>
            <div ref={contentReference} className="mobile-dropdown-content hidden" onKeyUp={handleArrowLeft}>
                {children}
            </div>
        </div>
    </>)
}
