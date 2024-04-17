import React, { KeyboardEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useSidenavStore } from '../layout/Sidenav'
import { triggerFlashEffect } from '../../constants/event_constants'
import { isDebugEnabled } from '../../constants/general_constants'

export default DropdownMenu

//
// main
//

function DropdownMenu(props: {
    children?: ReactNode,
    className?: string,
    text?: ReactNode,
}) {
    //
    // parameters and variables
    //

    const sidenavStore = useSidenavStore()

    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const iconRef = useRef<HTMLElement | null>(null)

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
    const queryString = 'a, button'

    //
    // functions
    //

    function handleArrowLeft(event: KeyboardEvent): void {
        if (event.key == 'ArrowLeft' && isDropdownOpen) {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()
            buttonRef.current?.focus()
            return
        }
    }

    function toggleContentKeyInput(event: KeyboardEvent): void {
        if (event.key == 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()
            triggerFlashEffect(event)
            return
        }

        if (event.key == 'ArrowRight' && !isDropdownOpen) {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()
            triggerFlashEffect(event)
            return
        }

        if (event.key == 'ArrowLeft' && isDropdownOpen) {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()
            return
        }
    }

    const toggleContent = useCallback(() => {
        if (contentRef.current == null) return
        if (iconRef.current == null) return
        if (isDebugEnabled) console.log(`Dropdown: isOpen ${!isDropdownOpen}`)

        if (isDropdownOpen) {
            setIsDropdownOpen(false)
            delete contentRef.current.dataset.active
            console.log('deactivate')

            contentRef.current.style.height = '0'
            iconRef.current.style.transform = 'rotate(0deg)'
            return
        }

        setIsDropdownOpen(true)
        contentRef.current.dataset.active = ''

        let contentHeight = 0
        contentRef.current.childNodes.forEach((element: Node) => {
            if (!(element instanceof HTMLAnchorElement)) return
            contentHeight += element.offsetHeight
        })

        contentRef.current.style.height = `${contentHeight}px`
        iconRef.current.style.transform = 'rotate(-180deg)'
        sidenavStore.setLastActiveDropdownElement(buttonRef.current)
    }, [contentRef, isDropdownOpen, sidenavStore])

    //
    // effects
    //

    // close this one if another dropdown menu got opened;
    useEffect(() => {
        if (isDebugEnabled) console.log(`Dropdown: isOpen ${isDropdownOpen}`)
        if (!isDropdownOpen) return
        if (sidenavStore.lastActiveDropdownElement == null) return

        if (buttonRef.current == null) return
        if (buttonRef.current == sidenavStore.lastActiveDropdownElement) return
        toggleContent()
    }, [isDropdownOpen, sidenavStore.lastActiveDropdownElement, toggleContent])

    // update tabindex;
    useEffect(() => {
        if (buttonRef.current == null) return
        if (contentRef.current == null) return
        if (dropdownRef.current == null) return

        if (!sidenavStore.isOpen) {
            dropdownRef.current.querySelectorAll(queryString).forEach(element => {
                if (!(element instanceof HTMLElement)) return
                element.tabIndex = -1
            })
            return
        }

        buttonRef.current.removeAttribute('tabIndex')
        if (isDropdownOpen) {
            contentRef.current.querySelectorAll(queryString).forEach(element => {
                element.removeAttribute('tabIndex')
            })
            return
        }

        contentRef.current.querySelectorAll(queryString).forEach(element => {
            if (!(element instanceof HTMLElement)) return
            element.tabIndex = -1
        })
    }, [contentRef, isDropdownOpen, sidenavStore.isOpen])

    //
    //
    //

    return (<>
        {/* the div block is for changing the background color; the anchor changed its bg-color based on hover; */}
        <div
            className={props.className}
            ref={dropdownRef}
        >
            <button
                className="block p-5 w-full text-left text-2xl"
                onKeyUp={toggleContentKeyInput}
                onPointerUp={toggleContent}
                ref={buttonRef}
            >
                <div className="grid grid-cols-2 items-center">
                    {props.text}
                    <i ref={iconRef} className="icon-medium material-icons justify-self-end transition-all ease-out duration-300">computer</i>
                </div>
            </button>
            <div
                ref={contentRef}
                // the height needs to be directly changed; otherwise, the transition will not 
                // work;
                className="bg-background transition-all duration-300 ease-out overflow-y-hidden"
                style={{ height: 0 }}
                onKeyUp={handleArrowLeft}
            >
                {props.children}
            </div>
        </div>
    </>)
}
