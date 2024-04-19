import { KeyboardEvent, useCallback, useEffect, useRef } from 'react'
import { useSidenavStore } from './Sidenav'
import Link from 'next/link'
import { create } from 'zustand'
import SearchBox, { useSearchStore } from '../atoms/Search'
import { initialDelay, maximumDelay, repeatDelay, isDebugEnabled, tabIndexGroupDefault, tabIndexGroupSidenav, tabIndexGroupTopnav } from '../../constants/general_constants'
import { triggerFlashEffect } from '../../constants/event_constants'
import { useLayoutStore } from './Layout'
import { useMainStore } from './Main'

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

    const layoutState = useLayoutStore()
    // const mainState = useMainStore()
    const searchStore = useSearchStore()
    const sidenavState = useSidenavStore()
    const topnavState = useTopnavStore()

    const homeLinkRef = useRef<HTMLAnchorElement | null>(null)
    const menuIconRef = useRef<HTMLElement | null>(null)
    const closeIconRef = useRef<HTMLElement | null>(null)

    const sidenavQueryString = 'a, button'
    const queryString = 'a:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"])'
    let keyDownTimeoutRef = useRef<NodeJS.Timeout | undefined>()
    console.log(keyDownTimeoutRef.current)

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

    const focusNextElement = useCallback(() => {
        const topnavElement = topnavState.element
        if (topnavElement == null) return
        const focusedElement = document.activeElement as HTMLAnchorElement | null
        if (focusedElement == null) return

        const focusableElements = Array.from(topnavElement.querySelectorAll<HTMLElement>(queryString))
        const nextIndex = Math.min(focusableElements.indexOf(focusedElement) + 1, focusableElements.length - 1)
        const nextElement = focusableElements[nextIndex]

        if (searchStore.resultsElement != null && searchStore.resultsElement.contains(nextElement)) return
        nextElement?.focus()
    }, [searchStore.resultsElement, topnavState.element])

    const focusPreviousElement = useCallback(() => {
        const topnavElement = topnavState.element
        if (topnavElement == null) return
        const focusedElement = document.activeElement as HTMLElement | null
        if (focusedElement == null) return

        const focusableElements = Array.from(topnavElement.querySelectorAll<HTMLElement>(queryString))
        const previousIndex = Math.max(focusableElements.indexOf(focusedElement) - 1, 0)
        const previousElement = focusableElements[previousIndex]
        previousElement?.focus()
    }, [topnavState.element])

    function toggleSidenav(): void {
        if (isDebugEnabled) console.log('Topnav: Toggle sidenav.')
        if (!sidenavState.isOpen) {
            layoutState.setActiveTabIndexGroup(tabIndexGroupSidenav)
        } else if (document.activeElement === topnavState.menuButtonElement) {
            layoutState.setActiveTabIndexGroup(tabIndexGroupTopnav)
        }
        sidenavState.setIsOpen(!sidenavState.isOpen)
    }

    function handleKeyDownInput(event: KeyboardEvent): void {
        if (keyDownTimeoutRef.current != null) {
            console.log('timeout ' + keyDownTimeoutRef.current)
            return
        }

        if (isDebugEnabled) console.log('Topnav: Handle element key-down input.')
        let isKeyInputRepeating = false

        function handleKeyInput(event: KeyboardEvent): void {
            const layoutState = useLayoutStore.getState()
            const mainState = useMainStore.getState()
            const sidenavState = useSidenavStore.getState()
            const topnavState = useTopnavStore.getState()

            if (topnavState.element == null) return
            if (!topnavState.element.contains(document.activeElement)) {
                if (isDebugEnabled) console.log('Topnav: Stop key-down input.')
                clearKeyDownTimeout()
                return
            }

            if (document.activeElement === topnavState.element) {
                if (event.key === 'Enter') {
                    event.preventDefault()
                    event.stopPropagation()

                    topnavState.menuButtonElement?.focus()
                    keyDownTimeoutRef.current = setTimeout(() => { handleKeyInput(event) }, maximumDelay)
                    return
                }

                if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    mainState.element?.focus()
                    keyDownTimeoutRef.current = setTimeout(() => { handleKeyInput(event) }, maximumDelay)
                    return
                }
                return
            }

            if (event.key === 'Escape') {
                event.preventDefault()
                layoutState.resetActiveTabIndexGroup()
                topnavState.element?.focus()
                keyDownTimeoutRef.current = setTimeout(() => { handleKeyInput(event) }, maximumDelay)
                return
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
                    keyDownTimeoutRef.current = setTimeout(() => { handleKeyInput(event) }, maximumDelay)
                    return
                }

                if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    event.stopPropagation()

                    // for some reason repeating the down-arrow input skips the focus of the first 
                    // element of the sidenav panel; jump directly to the first element when opening 
                    // instead;
                    if (!sidenavState.isOpen) toggleSidenav()
                    const firstElement = sidenavState.element?.querySelector<HTMLElement>(sidenavQueryString)
                    firstElement?.focus()
                    keyDownTimeoutRef.current = setTimeout(() => { handleKeyInput(event) }, maximumDelay)
                    return
                }

                if ((event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'ArrowRight') && sidenavState.isOpen) {
                    event.preventDefault()
                    event.stopPropagation()

                    toggleSidenav()
                    triggerFlashEffect(event)
                    keyDownTimeoutRef.current = setTimeout(() => { handleKeyInput(event) }, maximumDelay)
                    return
                }
            }

            if (document.activeElement === homeLinkRef.current) {
                if (event.key === 'Enter') {
                    triggerFlashEffect(event)
                    keyDownTimeoutRef.current = setTimeout(() => { handleKeyInput(event) }, maximumDelay)
                    isKeyInputRepeating = true
                    return
                }
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                event.stopPropagation()

                focusPreviousElement()
                keyDownTimeoutRef.current = setTimeout(() => { handleKeyInput(event) }, repeatDelay)
                isKeyInputRepeating = true
                return
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault()
                event.stopPropagation()

                focusNextElement()
                // keyDownTimeoutRef.current = setTimeout(() => { handleKeyInput(event) }, delay_noRepeat)
                keyDownTimeoutRef.current = setTimeout(() => { handleKeyInput(event) }, repeatDelay)
                isKeyInputRepeating = true
                return
            }
        }

        handleKeyInput(event)
        if (!isKeyInputRepeating) return
        clearTimeout(keyDownTimeoutRef.current)

        keyDownTimeoutRef.current = setTimeout(() => {
            handleKeyInput(event)
        }, initialDelay)
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
            onKeyDown={handleKeyDownInput}
            onKeyUp={clearKeyDownTimeout}
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