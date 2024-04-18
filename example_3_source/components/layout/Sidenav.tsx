import { KeyboardEvent, useCallback, useEffect, useRef } from 'react'
import DropdownMenu from '../atoms/DropdownMenu'
import { create } from 'zustand'
import Link from 'next/link'
import { useTopnavStore } from './Topnav'
import { useClick } from '../../hooks/gesture_hooks'
import { initialDelay, isDebugEnabled, noRepeatDelay, repeatDelay } from '../../constants/general_constants'
import { triggerFlashEffect } from '../../constants/event_constants'
import { useLayoutStore } from './Layout'

export default Sidenav
export { useSidenavStore }

//TODO; holding arrow keys;

//
//
//

interface SidenavState {
    element: HTMLElement | null,
    setElement: (element: HTMLElement | null) => void,

    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,

    lastActiveDropdownElement: HTMLButtonElement | null,
    setLastActiveDropdownElement: (element: HTMLButtonElement | null) => void,
}

const useSidenavStore = create<SidenavState>((set) => ({
    element: null,
    setElement: (element) => set(() => ({ element })),

    isOpen: false,
    setIsOpen: (isOpen) => set(() => ({ isOpen })),

    lastActiveDropdownElement: null,
    setLastActiveDropdownElement: (element) => set(() => ({ lastActiveDropdownElement: element })),
}))

//
// main
//

function Sidenav() {
    //
    // paramters and variables
    //

    const layoutStore = useLayoutStore()
    const sidenavStore = useSidenavStore()
    const topnavStore = useTopnavStore()

    const queryString = 'a:not([tabindex="-1"]), button:not([tabindex="-1"])'
    let keyDownTimeoutRef = useRef<NodeJS.Timeout | undefined>()

    //
    // functions
    //

    function clearKeyDownTimeout(): void {
        if (isDebugEnabled) console.log('Sidenav: Clear key-down timeout.')
        clearTimeout(keyDownTimeoutRef.current)
        keyDownTimeoutRef.current = undefined
    }

    const closeSidenav = useCallback(() => {
        layoutStore.resetActiveTabIndexGroup()
        sidenavStore.setIsOpen(false)
        topnavStore.element?.focus()
    }, [layoutStore, sidenavStore, topnavStore.element])

    function focusNextElement() {
        const menuButtonElement = topnavStore.menuButtonElement
        if (menuButtonElement == null) return
        const sidenavElement = sidenavStore.element
        if (sidenavElement == null) return
        const focusedElement = document.activeElement as HTMLAnchorElement | null
        if (focusedElement == null) return

        const focusableElements = [menuButtonElement, ...Array.from(sidenavElement.querySelectorAll<HTMLAnchorElement>(queryString))]
        const nextIndex = Math.min(focusableElements.indexOf(focusedElement) + 1, focusableElements.length - 1)
        focusableElements[nextIndex]?.focus()
    }

    function focusPreviousElement() {
        const menuButtonElement = topnavStore.menuButtonElement
        if (menuButtonElement == null) return
        const sidenavElement = sidenavStore.element
        if (sidenavElement == null) return
        const focusedElement = document.activeElement as HTMLElement | null
        if (focusedElement == null) return

        const focusableElements = [menuButtonElement, ...Array.from(sidenavElement.querySelectorAll<HTMLElement>(queryString))]
        const previousIndex = Math.max(focusableElements.indexOf(focusedElement) - 1, 0)
        focusableElements[previousIndex]?.focus()
    }

    function handleKeyDownInput(event: KeyboardEvent): void {
        if (keyDownTimeoutRef.current != null) return
        if (isDebugEnabled) console.log('Sidenav: Handle key-down input.')
        let isNoRepeat = true

        function handleInput(event: KeyboardEvent): void {
            if (sidenavStore.element == null) return
            if (!sidenavStore.element.contains(document.activeElement)) {
                clearTimeout(keyDownTimeoutRef.current)
                keyDownTimeoutRef.current = undefined
                return
            }

            if (event.key === 'ArrowDown') {
                event.preventDefault()
                event.stopPropagation()

                focusNextElement()
                keyDownTimeoutRef.current = setTimeout(() => { handleInput(event) }, repeatDelay)
                isNoRepeat = false
                return
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault()
                event.stopPropagation()

                console.log('focus previous element')
                focusPreviousElement()
                keyDownTimeoutRef.current = setTimeout(() => { handleInput(event) }, repeatDelay)
                isNoRepeat = false
                return
            }

            if (event.key === 'Enter') {
                //TODO
                // preventDefault() does not prevent links from being triggered;
                // event.preventDefault()
                // event.stopPropagation()

                console.log('input')
                // closeSidenav()
                triggerFlashEffect(event)
                // keyDownTimeoutRef.current = setTimeout(() => { handleInput(event) }, noRepeatDelay)
                return
            }

            if (event.key === 'Escape') {
                event.preventDefault()
                event.stopPropagation()
                closeSidenav()
                keyDownTimeoutRef.current = setTimeout(() => { handleInput(event) }, noRepeatDelay)
                return
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                event.stopPropagation()
                closeSidenav()
                keyDownTimeoutRef.current = setTimeout(() => { handleInput(event) }, noRepeatDelay)
                return
            }
        }

        handleInput(event)
        if (isNoRepeat) return
        clearTimeout(keyDownTimeoutRef.current)

        keyDownTimeoutRef.current = setTimeout(() => {
            handleInput(event)
        }, initialDelay)
    }

    // this is called when the component mounts or unmounts; and called when it re-renders;
    const initializeSidenavReference = (element: HTMLElement | null) => {
        if (sidenavStore.element != null) return
        if (element == null) return // should never happen!! since it gets never unmounted;
        if (isDebugEnabled) console.log('Sidenav: Initialize sidenav reference.')
        sidenavStore.setElement(element)
    }

    //
    // effects
    //

    // open / close animation;
    useEffect(() => {
        const sidenavElement = sidenavStore.element
        if (sidenavElement == null) return

        //make changes by adding and removing classes only??; not possible if the value is dynamic;
        sidenavElement.style.transition = 'transform 0.5s ease-out 0s'
        if (sidenavStore.isOpen) {
            sidenavElement.style.transform = `translateX(${sidenavElement.offsetWidth}px)`
            return
        }
        sidenavElement.style.transform = 'translateX(0)'
    }, [sidenavStore.element, sidenavStore.isOpen])

    // close when clicking outside;
    useEffect(() => {
        let startX = 0
        let startY = 0

        const thresholdSquared = 81
        const distanceSquared = (x: number, y: number) => {
            return x * x + y * y
        }

        const handlePointerDown = (event: PointerEvent) => {
            startX = event.screenX
            startY = event.screenY
        }

        const handlePointerUp = (event: PointerEvent) => {
            if (distanceSquared(event.screenX - startX, event.screenY - startY) > thresholdSquared) return
            if (!sidenavStore.isOpen) return
            if (sidenavStore.element == null) return
            if (sidenavStore.element.contains(event.target as Node)) return

            if (topnavStore.menuButtonElement == null) return
            if (topnavStore.menuButtonElement.contains(event.target as Node)) return
            if (isDebugEnabled) console.log('Sidenav: Clicked outside. Close sidenav.')
            closeSidenav()
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('pointerup', handlePointerUp)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('pointerup', handlePointerUp)
        }
    }, [closeSidenav, layoutStore, sidenavStore, topnavStore.menuButtonElement])

    //
    //
    //

    return (<>
        <nav
            className="fixed w-[min(500px,70vw)] h-[calc(100vh-var(--height-topnav))] left-[max(-500px,-70vw)] bg-background shadow-lg shadow-neutral-950 leading-10 overflow-y-auto overflow-x-hidden scrollbar-stable z-[100]"
            ref={initializeSidenavReference}
            onBlur={clearKeyDownTimeout}
            onFocus={clearKeyDownTimeout}
            onKeyDown={handleKeyDownInput}
            onKeyUp={clearKeyDownTimeout}
        >
            <hr />
            <Link
                className="block pl-4 py-[2px]"
                href="/image_examples"
                tabIndex={sidenavStore.isOpen ? undefined : -1}
                {...useClick(closeSidenav)}
            >Image Examples</Link><hr />
            <Link
                className="block pl-4 py-[2px]"
                href="/form_examples"
                tabIndex={sidenavStore.isOpen ? undefined : -1}
                {...useClick(closeSidenav)}
            >Form Examples</Link><hr />
            <Link
                className="block pl-4 py-[2px]"
                href="/back_end_examples"
                tabIndex={sidenavStore.isOpen ? undefined : -1}
                {...useClick(closeSidenav)}
            >Back-End Examples</Link><hr />
            <DropdownMenu text="Dropdown 1">
                <Link href="#" className="block pl-8 py-[2px]">Link 3</Link>
                <Link href="#" className="block pl-8 py-[2px]">Link 4</Link>
                <Link href="#" className="block pl-8 py-[2px]">Link 5</Link>
                <Link href="#" className="block pl-8 py-[2px]">Link 6</Link>
                <Link href="#" className="block pl-8 py-[2px]">Link 7</Link>
                <Link href="#" className="block pl-8 py-[2px]">Link 8</Link>
            </DropdownMenu><hr />
            <DropdownMenu text="Dropdown 2">
                <Link href="#" className="block pl-8 py-[2px]">Link 9</Link>
                <Link href="#" className="block pl-8 py-[2px]">Link 10</Link>
            </DropdownMenu><hr />
        </nav>
    </>)
}