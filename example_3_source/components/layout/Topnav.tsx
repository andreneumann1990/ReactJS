import { KeyboardEvent, useCallback, useEffect, useRef } from 'react'
import { useSidenavStore } from './Sidenav'
import Link from 'next/link'
import { create } from 'zustand'
import SearchBox, { useSearchStore } from '../atoms/Search'
import { isDebugEnabled, tabIndexGroupDefault, tabIndexGroupSidenav, tabIndexGroupTopnav } from '../../constants/general_constants'
import { triggerFlashEffect } from '../../constants/event_constants'
import { useLayoutStore } from './Layout'

export default Topnav
export { useTopnavStore }

//
//
//

interface topnavState {
    element: HTMLElement | null,
    setElement: (element: HTMLElement | null) => void,

    menuButtonElement: HTMLButtonElement | null,
    setMenuButtonElement: (element: HTMLButtonElement | null) => void,
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

    const layoutStore = useLayoutStore()
    const searchStore = useSearchStore()
    const sidenavStore = useSidenavStore()
    const topnavStore = useTopnavStore()

    const menuIconRef = useRef<HTMLElement | null>(null)
    const closeIconRef = useRef<HTMLElement | null>(null)

    const sidenavQueryString = 'a, button'
    const queryString = 'a:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"])'

    //
    // functions
    //

    const initializeMenuButtonReference = (element: HTMLButtonElement | null) => {
        if (topnavStore.menuButtonElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Topnav: Initialize menu reference.')
        topnavStore.setMenuButtonElement(element)
    }

    const initializeTopnavReference = (element: HTMLElement | null) => {
        if (topnavStore.element != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Topnav: Initialize topbar reference.')
        topnavStore.setElement(element)
    }

    const focusNextElement = useCallback(() => {
        const topnavElement = topnavStore.element
        if (topnavElement == null) return
        const focusedElement = document.activeElement as HTMLAnchorElement | null
        if (focusedElement == null) return

        const focusableElements = Array.from(topnavElement.querySelectorAll<HTMLElement>(queryString))
        const nextIndex = Math.min(focusableElements.indexOf(focusedElement) + 1, focusableElements.length - 1)
        const nextElement = focusableElements[nextIndex]

        if (searchStore.resultsElement != null && searchStore.resultsElement.contains(nextElement)) return
        nextElement?.focus()
    }, [searchStore.resultsElement, topnavStore.element])

    const focusPreviousElement = useCallback(() => {
        const topnavElement = topnavStore.element
        if (topnavElement == null) return
        const focusedElement = document.activeElement as HTMLElement | null
        if (focusedElement == null) return

        const focusableElements = Array.from(topnavElement.querySelectorAll<HTMLElement>(queryString))
        const previousIndex = Math.max(focusableElements.indexOf(focusedElement) - 1, 0)
        const previousElement = focusableElements[previousIndex]
        previousElement?.focus()
    }, [topnavStore.element])

    function toggleSidenav(): void {
        if (isDebugEnabled) console.log('Topnav: Toggle sidenav.')
        if (!sidenavStore.isOpen) {
            layoutStore.setActiveTabIndexGroup(tabIndexGroupSidenav)
        } else if (document.activeElement == topnavStore.menuButtonElement) {
            layoutStore.setActiveTabIndexGroup(tabIndexGroupTopnav)
        }
        sidenavStore.setIsOpen(!sidenavStore.isOpen)
    }

    function handleKeyInput(event: KeyboardEvent): void {
        // if (document.activeElement == searchStore.inputElement) return
        if (document.activeElement == topnavStore.element) {
            if (event.key == 'Enter') {
                event.preventDefault()
                event.stopPropagation()
                topnavStore.menuButtonElement?.focus()
                return
            }
        }

        if (event.key == 'Escape' && layoutStore.activeTabIndexGroup != 0) {
            event.preventDefault()
            layoutStore.resetActiveTabIndexGroup()
            topnavStore.element?.focus()
            return
        }

        if (document.activeElement == topnavStore.menuButtonElement) {
            if (event.key == 'Enter') {
                event.preventDefault()
                event.stopPropagation()
                toggleSidenav()
                triggerFlashEffect(event)
                return
            }

            // ignore ArrowRight because other icons are displayed to the right;
            // but for consistency it would be nice; hmmm...; //TODO
            if (event.key == 'ArrowDown') {
                if (sidenavStore.isOpen) {
                    event.preventDefault()
                    event.stopPropagation()
                    const firstElement = sidenavStore.element?.querySelector<HTMLAnchorElement>(sidenavQueryString)
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

            if ((event.key == 'ArrowLeft' || event.key == 'ArrowUp' || event.key == 'ArrowRight') && sidenavStore.isOpen) {
                event.preventDefault()
                event.stopPropagation()
                toggleSidenav()
                triggerFlashEffect(event)
                return
            }
        }

        if (event.key == 'ArrowLeft') {
            event.preventDefault()
            event.stopPropagation()
            focusPreviousElement()
            return
        }

        if (event.key == 'ArrowRight') {
            event.preventDefault()
            event.stopPropagation()
            focusNextElement()
            return
        }
    }

    function handleKeyInputHome(event: KeyboardEvent): void {
        if (event.key == 'Enter') {
            triggerFlashEffect(event)
            return
        }
    }

    function setActiveTabIndexGroupToTopnav() {
        console.log('focus') //TODO
        layoutStore.setActiveTabIndexGroup(tabIndexGroupTopnav)
    }

    //
    // effects
    //

    // switch image for the sidenav toggle button;
    useEffect(() => {
        const menuButtonElement = topnavStore.menuButtonElement
        if (menuButtonElement == null) return
        if (menuIconRef.current == null) return
        if (closeIconRef.current == null) return

        if (sidenavStore.isOpen) {
            menuIconRef.current.classList.add('hidden')
            closeIconRef.current.classList.remove('hidden')
            return
        }

        menuIconRef.current.classList.remove('hidden')
        closeIconRef.current.classList.add('hidden')
    }, [sidenavStore.isOpen, topnavStore.menuButtonElement])

    //
    //
    //

    // tabIndex for onFocus(); TODO;
    return (<>
        {/* TODO; does not work; you tab behind the elements afterwards for some reason; */}
        {/* <div
            ref={focusAnchorRef}
            tabIndex={layoutStore.activeTabIndexGroup == tabIndexGroupTopnav ? 0 : -1}
        >test</div> */}

        <nav
            className="bg-background h-[--height-topnav] shadow-md"
            // onKeyUp={handleKeyInputTabIndex}
            onKeyUp={handleKeyInput}
            ref={initializeTopnavReference}
            tabIndex={layoutStore.activeTabIndexGroup == tabIndexGroupDefault ? 0 : -1}
        >
            <div
                className="grid grid-flow-col [grid-template-columns:20%_60%_20%] justify-items-center justify-between"
            >
                <div className="grid grid-flow-col justify-self-start">
                    <button
                        className="h-[--height-topnav]"
                        onFocusCapture={setActiveTabIndexGroupToTopnav}
                        onPointerUp={toggleSidenav}
                        ref={initializeMenuButtonReference}
                        tabIndex={layoutStore.activeTabIndexGroup == tabIndexGroupTopnav ? tabIndexGroupTopnav : -1}
                    >
                        <i
                            className="p-1 icon-medium material-icons"
                            ref={menuIconRef}
                        >menu</i>
                        <i
                            className="p-1 icon-medium material-icons hidden"
                            ref={closeIconRef}
                        >close</i>
                    </button>
                    <Link
                        className="block h-[--height-topnav]"
                        href="/home"
                        onKeyDownCapture={handleKeyInputHome}
                        tabIndex={layoutStore.activeTabIndexGroup == tabIndexGroupTopnav ? tabIndexGroupTopnav : -1}
                    >
                        <i className="p-1 icon-medium material-icons">home</i>
                    </Link>
                </div>
                <SearchBox />
            </div>
        </nav >
    </>)
}