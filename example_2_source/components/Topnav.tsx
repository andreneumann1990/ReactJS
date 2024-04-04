'use client'

import { KeyboardEvent, useCallback, useEffect } from 'react'
import { isDebugEnabled, triggerFlashEffect } from './Layout'
import { useSidenavStore } from './Sidenav'
import Link from 'next/link'
import { create } from 'zustand'
import { useMainStore } from './Main'
import InstantSearch from './InstantSearchPlaceholder'
import SearchBox, { useSearchStore } from './SearchBoxPlaceholder'

export default Topnav
export { useTopnavStore }

//
//
//

interface topnavState {
    element: HTMLElement | null,
    setElement: (element: HTMLElement | null) => void,

    menuButtonElement: HTMLAnchorElement | null,
    setMenuButtonElement: (element: HTMLAnchorElement | null) => void,
}

const useTopnavStore = create<topnavState>(set => ({
    element: null,
    setElement: (element) => set(() => ({ element })),

    menuButtonElement: null,
    setMenuButtonElement: (element) => set(() => ({ menuButtonElement: element }))
}))

//
// main
//

function Topnav() {
    //
    // parameters and variables
    //

    const mainElement = useMainStore(state => state.element)

    const searchInputElement = useSearchStore(state => state.inputElement)

    const sidenavElement = useSidenavStore(state => state.element)
    const isSidenavOpen = useSidenavStore(state => state.isOpen)
    const setIsSidenavOpen = useSidenavStore(state => state.setIsOpen)

    const topnavElement = useTopnavStore(state => state.element)
    const setTopnavElement = useTopnavStore(state => state.setElement)
    const menuButtonElement = useTopnavStore(state => state.menuButtonElement)
    const setMenuButtonElement = useTopnavStore(state => state.setMenuButtonElement)

    //
    // functions
    //

    const initializeMenuButtonReference = (element: HTMLAnchorElement | null) => {
        if (menuButtonElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Topnav: Initialize menu reference.')
        setMenuButtonElement(element)
    }

    const initializeTopnavReference = (element: HTMLElement | null) => {
        if (topnavElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Topnav: Initialize topbar reference.')
        setTopnavElement(element)
    }

    const focusNextElement = useCallback(() => {
        if (menuButtonElement == null) return
        if (topnavElement == null) return
        const focusedElement = document.activeElement as HTMLAnchorElement | null
        if (focusedElement == null) return

        const focusableElements = [menuButtonElement, ...Array.from(topnavElement.querySelectorAll<HTMLAnchorElement>('a[tabindex="1000"]'))]
        const currentIndex = focusableElements.indexOf(focusedElement)
        const nextIndex = (currentIndex + 1) % focusableElements.length
        const nextElement = focusableElements[nextIndex]

        if (nextElement == null) return
        if (nextElement === menuButtonElement) return
        nextElement.focus()
    }, [menuButtonElement, topnavElement])

    const focusPreviousElement = useCallback(() => {
        if (menuButtonElement == null) return
        if (topnavElement == null) return
        const focusedElement = document.activeElement as HTMLElement | null
        if (focusedElement == null) return

        if (focusedElement === menuButtonElement) return
        const focusableElements = [menuButtonElement, ...Array.from(topnavElement.querySelectorAll<HTMLElement>('a[tabindex="1000"]'))]
        const currentIndex = focusableElements.indexOf(focusedElement)
        const previousIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length

        const previousElement = focusableElements[previousIndex]
        if (previousElement == null) return
        previousElement.focus()
    }, [menuButtonElement, topnavElement])

    const toggleSidenav = useCallback(() => {
        if (isDebugEnabled) console.log('Topnav: Toggle sidebar.')

        // not updated immediately;
        setIsSidenavOpen(!isSidenavOpen)
    }, [isSidenavOpen, setIsSidenavOpen])

    const handleKeyInputs = useCallback((event: KeyboardEvent) => {
        if (document.activeElement == searchInputElement) return
        if (mainElement == null) return
        if (menuButtonElement == null) return
        if (sidenavElement == null) return

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
                    const firstElement = sidenavElement.querySelector<HTMLAnchorElement>('a')
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
    }, [focusNextElement, focusPreviousElement, isSidenavOpen, mainElement, menuButtonElement, searchInputElement, sidenavElement, toggleSidenav])

    function handleSearch(query: string): void {
        if (isDebugEnabled) console.log(`Topnav: search query ${query}`)
    }

    //
    // effects
    //

    // switch image for the sidebar toggle button;
    useEffect(() => {
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
    }, [isSidenavOpen, menuButtonElement])

    //
    //
    //

    return (<>
        <nav ref={initializeTopnavReference} className="bg-[var(--color-dark-1)] h-[var(--height-topnav)] shadow-md">
            <div className="grid grid-flow-col [grid-template-columns:20%_60%_20%] justify-items-center justify-between" onKeyUp={handleKeyInputs}>
                <div className="grid grid-flow-col justify-self-start">
                    <Link className="h-[--height-topnav]" ref={initializeMenuButtonReference} onPointerUp={toggleSidenav} href="" tabIndex={2}>
                        <i className="p-1 icon-medium material-icons">menu</i>
                        <i className="p-1 icon-medium material-icons hidden">close</i>
                    </Link>
                    <Link className="h-[--height-topnav]" href="/home" tabIndex={1000}>
                        <i className="p-1 icon-medium material-icons">home</i>
                    </Link>
                </div>

                <InstantSearch>
                    <SearchBox onSearch={handleSearch} />
                </InstantSearch>

                {/* <Image className="p-1" src="/svg/Algolia-mark-rounded-blue.svg" alt="Algolia logo" height={40} width={40} priority={false} /> */}
            </div>
        </nav>
    </>)
}