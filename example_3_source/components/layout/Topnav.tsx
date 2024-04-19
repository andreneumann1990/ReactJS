import { KeyboardEvent, useCallback, useEffect, useRef } from 'react'
import { useSidenavStore } from './Sidenav'
import Link from 'next/link'
import SearchBox from '../atoms/Search'
import { initialDelay, maximumDelay, repeatDelay, isDebugEnabled, tabIndexGroupDefault, tabIndexGroupSidenav, tabIndexGroupTopnav } from '../../constants/general_constants'
import { triggerFlashEffect } from '../../constants/event_constants'
import { useLayoutStore } from './Layout'
import { useMainStore } from './Main'
import { GlobalState, NullableBoolean, TopnavState } from '../../constants/types'
import { useGlobalStore, useSearchStore, useTopnavStore } from '../../hooks/stores'

export default Topnav
export { handleKeyDownInput as handleKeyInput_Topnav }

//
// parameters and variables
//

const sidenavQueryString = 'a, button'
const queryString = 'a:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"])'

//
// functions
//

function focusNextElement(): void {
    const searchState = useSearchStore.getState()
    const topnavState = useTopnavStore.getState()
    const topnavElement = topnavState.element
    if (topnavElement == null) return

    const focusedElement = document.activeElement as HTMLAnchorElement | null
    if (focusedElement == null) return
    const focusableElements = Array.from(topnavElement.querySelectorAll<HTMLElement>(queryString))
    const nextIndex = Math.min(focusableElements.indexOf(focusedElement) + 1, focusableElements.length - 1)

    const nextElement = focusableElements[nextIndex]
    if (searchState.resultsElement != null && searchState.resultsElement.contains(nextElement)) return
    nextElement?.focus()
}

function focusPreviousElement(): void {
    const topnavState = useTopnavStore.getState()
    const topnavElement = topnavState.element
    if (topnavElement == null) return
    const focusedElement = document.activeElement as HTMLElement | null

    if (focusedElement == null) return
    const focusableElements = Array.from(topnavElement.querySelectorAll<HTMLElement>(queryString))
    const previousIndex = Math.max(focusableElements.indexOf(focusedElement) - 1, 0)

    const previousElement = focusableElements[previousIndex]
    previousElement?.focus()
}

function handleKeyDownInput(event: KeyboardEvent): NullableBoolean {
    const { layoutState, mainState, sidenavState, topnavState } = useGlobalStore.getState()
    if (topnavState.element == null) return null

    if (!topnavState.element.contains(document.activeElement)) {
        // if (isDebugEnabled) console.log('Topnav: Stop key-down input.')
        // clearKeyDownTimeout()
        return null
    }

    if (document.activeElement === topnavState.element) {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            topnavState.menuButtonElement?.focus()
            return false
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            mainState.element?.focus()
            return false
        }
        return null
    }

    if (event.key === 'Escape') {
        event.preventDefault()
        layoutState.resetActiveTabIndexGroup()
        topnavState.element?.focus()
        return false
    }

    if (document.activeElement === topnavState.menuButtonElement) {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()

            if (!sidenavState.isOpen) {
                const firstElement = sidenavState.element?.querySelector<HTMLElement>(sidenavQueryString)
                firstElement?.focus()
            } else {
                triggerFlashEffect(event)
            }

            toggleSidenav()
            return false
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            event.stopPropagation()

            if (!sidenavState.isOpen) {
                toggleSidenav()
                return true
            }

            // for some reason repeating the down-arrow input skips the focus of the first 
            // element of the sidenav panel; jump directly to the first element when opening 
            // instead;
            const firstElement = sidenavState.element?.querySelector<HTMLElement>(sidenavQueryString)
            firstElement?.focus()
            return true
        }

        if ((event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'ArrowRight') && sidenavState.isOpen) {
            event.preventDefault()
            event.stopPropagation()

            toggleSidenav()
            triggerFlashEffect(event)
            return false
        }
    }

    if (document.activeElement === topnavState.homeLinkElement) {
        if (event.key === 'Enter') {
            triggerFlashEffect(event)
            return true
        }
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault()
        event.stopPropagation()
        focusPreviousElement()
        return true
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault()
        event.stopPropagation()
        focusNextElement()
        return true
    }
    return null
}

function toggleSidenav(): void {
    const { layoutState, sidenavState, topnavState } = useGlobalStore.getState()
    if (isDebugEnabled) console.log('Topnav: Toggle sidenav.')

    if (!sidenavState.isOpen) {
        layoutState.setActiveTabIndexGroup(tabIndexGroupSidenav)
    } else if (document.activeElement === topnavState.menuButtonElement) {
        layoutState.setActiveTabIndexGroup(tabIndexGroupTopnav)
    }
    sidenavState.setIsOpen(!sidenavState.isOpen)
}

//
// main
//

function Topnav() {
    //
    // parameters and variables
    //

    const { layoutState, searchState, sidenavState, topnavState } = useGlobalStore()

    const homeLinkRef = useRef<HTMLAnchorElement | null>(null)
    const menuIconRef = useRef<HTMLElement | null>(null)
    const closeIconRef = useRef<HTMLElement | null>(null)

    let keyDownTimeoutRef = useRef<NodeJS.Timeout | undefined>()

    //
    // functions
    //

    function clearKeyDownTimeout(): void {
        if (isDebugEnabled) console.log('Topnav: Clear key-down timeout.')
        clearTimeout(keyDownTimeoutRef.current)
        keyDownTimeoutRef.current = undefined
    }

    const initializeMenuButtonReference = (element: HTMLButtonElement | null) => {
        if (topnavState.menuButtonElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Topnav: Initialize menu reference.')
        topnavState.setMenuButtonElement(element)
    }

    const initializeTopnavReference = (element: HTMLElement | null) => {
        if (topnavState.element != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Topnav: Initialize topbar reference.')
        topnavState.setElement(element)
    }

    function setActiveTabIndexGroupToTopnav() {
        console.log('focus') //TODO
        layoutState.setActiveTabIndexGroup(tabIndexGroupTopnav)
    }

    //
    // effects
    //

    // switch image for the sidenav toggle button;
    useEffect(() => {
        const menuButtonElement = topnavState.menuButtonElement
        if (menuButtonElement == null) return
        if (menuIconRef.current == null) return
        if (closeIconRef.current == null) return

        if (sidenavState.isOpen) {
            menuIconRef.current.classList.add('hidden')
            closeIconRef.current.classList.remove('hidden')
            return
        }

        menuIconRef.current.classList.remove('hidden')
        closeIconRef.current.classList.add('hidden')
    }, [sidenavState.isOpen, topnavState.menuButtonElement])

    //
    //
    //

    // tabIndex for onFocus(); TODO;
    return (<>
        {/* TODO; does not work; you tab behind the elements afterwards for some reason; */}
        {/* <div
            ref={focusAnchorRef}
            tabIndex={layoutState.activeTabIndexGroup === tabIndexGroupTopnav ? 0 : -1}
        >test</div> */}

        <nav
            className="bg-background h-[--height-topnav] shadow-md"
            ref={initializeTopnavReference}
            tabIndex={layoutState.activeTabIndexGroup === tabIndexGroupDefault ? 0 : -1}
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
                        tabIndex={layoutState.activeTabIndexGroup === tabIndexGroupTopnav ? tabIndexGroupTopnav : -1}
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
                        ref={homeLinkRef}
                        tabIndex={layoutState.activeTabIndexGroup === tabIndexGroupTopnav ? tabIndexGroupTopnav : -1}
                    >
                        <i className="p-1 icon-medium material-icons">home</i>
                    </Link>
                </div>
                <SearchBox />
            </div>
        </nav >
    </>)
}