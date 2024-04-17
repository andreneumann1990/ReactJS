import { KeyboardEvent, useCallback, useEffect, useRef } from 'react'
import { useSidenavStore } from './Sidenav'
import Link from 'next/link'
import { create } from 'zustand'
import SearchBox, { useSearchStore } from '../atoms/Search'
import { isDebugEnabled, tabIndexGroupTopnav } from '../../constants/general_constants'
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

    const focusAnchor = useRef<HTMLDivElement | null>(null)

    const layoutStore = useLayoutStore()
    const sidenavStore = useSidenavStore()
    const searchStore = useSearchStore()
    const topnavStore = useTopnavStore()

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
        const menuButtonElement = topnavStore.menuButtonElement
        if (menuButtonElement == null) return
        const topnavElement = topnavStore.element
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
    }, [topnavStore.element, topnavStore.menuButtonElement])

    const focusPreviousElement = useCallback(() => {
        const menuButtonElement = topnavStore.menuButtonElement
        if (menuButtonElement == null) return
        const topnavElement = topnavStore.element
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
    }, [topnavStore.element, topnavStore.menuButtonElement])

    function toggleSidenav(): void {
        if (isDebugEnabled) console.log('Topnav: Toggle sidenav.')
        sidenavStore.setIsOpen(!sidenavStore.isOpen)
    }

    function handleKeyInput(event: KeyboardEvent): void {
        if (document.activeElement == searchStore.inputElement) return
        // if (mainElement == null) return
        // if (menuButtonElement == null) return
        // if (sidenavElement == null) return

        if (document.activeElement === topnavStore.menuButtonElement) {
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
                if (sidenavStore.isOpen) {
                    event.preventDefault()
                    event.stopPropagation()
                    const firstElement = sidenavStore.element?.querySelector<HTMLAnchorElement>('a')
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

            if ((event.key === 'ArrowLeft' || event.key === 'ArrowUp') && sidenavStore.isOpen) {
                event.preventDefault()
                event.stopPropagation()
                toggleSidenav()
                triggerFlashEffect(event)
                return
            }
        }

        // if (event.key === 'ArrowUp' && sidenavContext.openState.isOpen) {
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
    }

    function handleKeyInputTabIndex(event: KeyboardEvent): void {
        console.log('input')
        if (event.key == 'Enter' && layoutStore.activeTabIndexGroup != tabIndexGroupTopnav) {
            event.preventDefault()
            layoutStore.setActiveTabIndexGroup(tabIndexGroupTopnav)
            // topnavStore.menuButtonElement?.focus()
            focusAnchor.current?.focus()
            return
        }

        if (event.key == 'Escape' && layoutStore.activeTabIndexGroup != 0) {
            event.preventDefault()
            layoutStore.setActiveTabIndexGroup(0)
            topnavStore.element?.focus()
            return
        }
    }

    //
    // effects
    //

    // switch image for the sidenav toggle button;
    useEffect(() => {
        const menuButtonElement = topnavStore.menuButtonElement
        if (menuButtonElement == null) return
        if (menuButtonElement.children.length < 2) return

        const menuIcon = menuButtonElement.children[0] as HTMLElement
        const closeIcon = menuButtonElement.children[1] as HTMLElement

        if (sidenavStore.isOpen) {
            menuIcon.classList.add('hidden')
            closeIcon.classList.remove('hidden')
            return
        }

        menuIcon.classList.remove('hidden')
        closeIcon.classList.add('hidden')
    }, [sidenavStore.isOpen, topnavStore.menuButtonElement])

    //
    //
    //

    // tabIndex for onFocus(); TODO;
    return (<>
        <nav
            className="bg-background h-[--height-topnav] shadow-md"
            ref={initializeTopnavReference}
            onKeyDown={handleKeyInputTabIndex}
            tabIndex={layoutStore.activeTabIndexGroup == 0 ? 0 : -1}
        >
            <div
                ref={focusAnchor}
                tabIndex={layoutStore.activeTabIndexGroup == tabIndexGroupTopnav ? 0 : -1}
            />
            <div
                className="grid grid-flow-col [grid-template-columns:20%_60%_20%] justify-items-center justify-between"
                onKeyUp={handleKeyInput}
            >
                <div className="grid grid-flow-col justify-self-start">
                    <button
                        className="h-[--height-topnav]"
                        onPointerUp={toggleSidenav}
                        ref={initializeMenuButtonReference}
                        tabIndex={layoutStore.activeTabIndexGroup == tabIndexGroupTopnav ? tabIndexGroupTopnav : -1}
                    >
                        <i className="p-1 icon-medium material-icons">menu</i>
                        <i className="p-1 icon-medium material-icons hidden">close</i>
                    </button>
                    <Link
                        className="block h-[--height-topnav]"
                        href="/home"
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