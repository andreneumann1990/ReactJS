'use client'

import { KeyboardEvent, useCallback, useEffect } from 'react'
import { isDebugEnabled, mainElement, triggerFlashEffect, useSidenavStore } from './Layout'
import { sidebarElement } from './Sidenav'
import SearchComponent from './SearchComponent'
import Image from 'next/image'

let menuButtonElement: HTMLAnchorElement | null = null
let topbarElement: HTMLElement | null = null

function Topnav() {
    //
    // parameters and variables
    //

    const isSidenavOpen = useSidenavStore(state => state.isOpen)
    const setIsSidenavOpen = useSidenavStore(state => state.setIsOpen)

    //
    //
    //

    // switch image for the sidebar toggle button;
    useEffect(() => {
        console.log(isSidenavOpen)
        if (menuButtonElement == null) return
        if (menuButtonElement.children.length < 2) return

        const menuIcon = menuButtonElement.children[0] as HTMLElement
        const closeIcon = menuButtonElement.children[1] as HTMLElement

        if (isSidenavOpen) {
            menuIcon.classList.add('hidden')
            closeIcon.classList.remove('hidden')
            return
        }

        menuIcon.classList.remove('hidden')
        closeIcon.classList.add('hidden')
    }, [isSidenavOpen])

    //
    //
    //

    const initializeMenuButtonReference = (element: HTMLAnchorElement | null) => {
        if (menuButtonElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Topbar: Initialize menu reference.')
        menuButtonElement = element
    }

    const initializeTopbarReference = (element: HTMLElement | null) => {
        if (topbarElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Topbar: Initialize topbar reference.')
        topbarElement = element
    }

    const toggleSidenav = useCallback(() => {
        if (isDebugEnabled) console.log('Topbar: Toggle sidebar.')

        // not updated immediately;
        setIsSidenavOpen(!isSidenavOpen)
    }, [isSidenavOpen, setIsSidenavOpen])

    function focusNextElement() {
        if (menuButtonElement == null) return
        if (topbarElement == null) return
        const focusedElement = document.activeElement as HTMLAnchorElement | null
        if (focusedElement == null) return

        const focusableElements = [menuButtonElement, ...Array.from(topbarElement.querySelectorAll<HTMLAnchorElement>('a[tabindex="1000"]'))]
        const currentIndex = focusableElements.indexOf(focusedElement)
        const nextIndex = (currentIndex + 1) % focusableElements.length
        const nextElement = focusableElements[nextIndex]

        if (nextElement == null) return
        if (nextElement === menuButtonElement) return
        nextElement.focus()
    }

    function focusPreviousElement() {
        if (menuButtonElement == null) return
        if (topbarElement == null) return
        const focusedElement = document.activeElement as HTMLElement | null
        if (focusedElement == null) return

        if (focusedElement === menuButtonElement) return
        const focusableElements = [menuButtonElement, ...Array.from(topbarElement.querySelectorAll<HTMLElement>('a[tabindex="1000"]'))]
        const currentIndex = focusableElements.indexOf(focusedElement)
        const previousIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length

        const previousElement = focusableElements[previousIndex]
        if (previousElement == null) return
        previousElement.focus()
    }

    const handleKeyInputs = useCallback((event: KeyboardEvent) => {
        if (mainElement == null) return
        if (menuButtonElement == null) return
        if (sidebarElement == null) return

        //TODO; up + down for switching between main and topbar;

        // doesn't even work; but it's not that great anyway; you can tab forward; so
        // you should be able to tab backwards;
        // if (event.shiftKey && event.key === 'Tab') {
        //     event.preventDefault()
        //     event.stopPropagation()
        //     mainElement.focus()
        //     return
        // }

        if (document.activeElement === menuButtonElement) {
            if (event.key === 'Enter') {
                event.preventDefault()
                event.stopPropagation()
                toggleSidenav()
                triggerFlashEffect(event)
                return
            }

            // ignore ArrowRight because other icons are displayed to the right;
            // but for consistency it would be nice; hmmm...;
            if (event.key === 'ArrowDown') {
                if (isSidenavOpen) {
                    event.preventDefault()
                    event.stopPropagation()
                    const firstElement = sidebarElement.querySelector<HTMLAnchorElement>('a')
                    if (firstElement == null) return
                    firstElement.focus()
                    return
                }

                event.preventDefault()
                event.stopPropagation()
                toggleSidenav()
                triggerFlashEffect(event)
                return
            }

            if ((event.key === 'ArrowLeft' || event.key === 'ArrowUp') && isSidenavOpen) {
                event.preventDefault()
                event.stopPropagation()
                toggleSidenav()
                triggerFlashEffect(event)
                return
            }
        }

        // if (event.key === 'ArrowUp' && sidebarContext.openState.isOpen) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault()
            event.stopPropagation()
            focusPreviousElement()
            return
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault()
            event.stopPropagation()
            focusNextElement()
            return
        }
    }, [isSidenavOpen, toggleSidenav])

    //
    //
    //

    return (<>
        <nav ref={initializeTopbarReference} className="mobile-topbar">
            <div className="grid grid-topbar fg-items-center-main fg-space-between" onKeyUp={handleKeyInputs}>
                <div>
                    <a className="menu-button inline" ref={initializeMenuButtonReference} onPointerUp={toggleSidenav} href="#" tabIndex={2}>
                        <i className="icon-medium material-icons">menu</i>
                        <i className="icon-medium material-icons hidden">close</i>
                    </a>
                    <a className="inline" href="/home" tabIndex={1000}>
                        <i className="material-icons icon-medium">home</i>
                    </a>
                </div>
                <SearchComponent />
                <Image src="/svg/Algolia-mark-rounded-blue.svg" alt="Algolia logo" height={40} width={40} priority={false} />
            </div>
        </nav>
    </>)
}

export default Topnav
export { menuButtonElement }
export { topbarElement }