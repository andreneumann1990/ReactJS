import { KeyboardEvent, useEffect } from 'react'
import DropdownMenu from '../atoms/DropdownMenu'
import { create } from 'zustand'
import Link from 'next/link'
import { useTopnavStore } from './Topnav'
import { useClick } from '../../hooks/gesture_hooks'
import { isDebugEnabled } from '../../constants/general_constants'
import { triggerFlashEffect } from '../../constants/event_constants'

export default Sidenav
export { useSidenavStore }

//TODO; check tab indexes;

//
//
//

interface SidenavState {
    element: HTMLElement | null,
    setElement: (element: HTMLElement | null) => void,

    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,

    lastActiveDropdownElement: HTMLDivElement | null,
    setLastActiveDropdownElement: (element: HTMLDivElement | null) => void,
}

const useSidenavStore = create<SidenavState>(set => ({
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

    const sidenavStore = useSidenavStore()
    const topnavStore = useTopnavStore()

    //
    // functions
    //

    function closeSidenav(): void {
        sidenavStore.setIsOpen(false)
    }

    function focusNextElement() {
        const menuButtonElement = topnavStore.menuButtonElement
        if (menuButtonElement == null) return
        const sidenavElement = sidenavStore.element
        if (sidenavElement == null) return
        const focusedElement = document.activeElement as HTMLAnchorElement | null
        if (focusedElement == null) return

        const focusableElements = [menuButtonElement, ...Array.from(sidenavElement.querySelectorAll<HTMLAnchorElement>('a[tabindex="100"]'))]
        const currentIndex = focusableElements.indexOf(focusedElement)
        const nextIndex = (currentIndex + 1) % focusableElements.length
        const nextElement = focusableElements[nextIndex]

        if (nextElement == null) return
        if (nextElement === menuButtonElement) return
        nextElement.focus()
    }

    function focusPreviousElement() {
        const menuButtonElement = topnavStore.menuButtonElement
        if (menuButtonElement == null) return
        const sidenavElement = sidenavStore.element
        if (sidenavElement == null) return
        const focusedElement = document.activeElement as HTMLElement | null
        if (focusedElement == null) return

        const focusableElements = [menuButtonElement, ...Array.from(sidenavElement.querySelectorAll<HTMLElement>('a[tabindex="100"]'))]
        const currentIndex = focusableElements.indexOf(focusedElement)
        const previousIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length
        const previousElement = focusableElements[previousIndex]

        if (previousElement == null) return
        previousElement.focus()
    }

    function handleKeyInput(event: KeyboardEvent): void {
        // if (menuButtonElement == null) return
        if (isDebugEnabled) console.log('Sidenav: Handle key inputs.')

        if (event.key === 'Enter') {
            // does not prevent links from being triggered;
            event.preventDefault()

            event.stopPropagation()
            triggerFlashEffect(event)
            return
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            event.stopPropagation()
            focusNextElement()
            return
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault()
            event.stopPropagation()
            focusPreviousElement()
            return
        }

        if (event.key === 'ArrowLeft' && sidenavStore.isOpen) {
            event.preventDefault()
            event.stopPropagation()
            sidenavStore.setIsOpen(false)

            setTimeout(() => {
                topnavStore.menuButtonElement?.focus()
            }, 500)
            return
        }
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

    // update state;
    useEffect(() => {
        //TODO; check tab index handling;
        const sidenavElement = sidenavStore.element
        if (sidenavElement == null) return
        if (isDebugEnabled) console.log('Sidenav: Update state.')

        const disableTabIndex = () => {
            if (sidenavElement == null) return
            for (const childIndex in sidenavElement.children) {
                const child = sidenavElement.children[childIndex] as HTMLElement
                if (child.tagName !== 'A') continue
                child.tabIndex = -1
            }
        }

        // use effects for handling tab index??; TODO;
        const enableTabIndex = () => {
            if (sidenavElement == null) return
            for (const childIndex in sidenavElement.children) {
                const child = sidenavElement.children[childIndex] as HTMLElement
                if (child.tagName !== 'A') continue
                child.tabIndex = 100
            }
        }

        //TODO; make changes by adding and removing classes only??; not possible if the value is dynamic;
        sidenavElement.style.transition = 'transform 0.5s ease-out 0s'
        if (isDebugEnabled) console.log(`Sidenav: isOpen ${sidenavStore.isOpen}`)

        if (sidenavStore.isOpen) {
            //TODO
            // enableTabIndex()
            sidenavElement.removeAttribute('disabled')
            // mainElement.classList.add('inactive')
            sidenavElement.style.transform = `translateX(${sidenavElement.offsetWidth}px)`
            return
        }

        sidenavElement.setAttribute('disabled', '')
        // disableTabIndex()
        // mainElement.classList.remove('inactive')
        sidenavElement.style.transform = 'translateX(0)'
    }, [sidenavStore.element, sidenavStore.isOpen])

    // click event listener
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
            sidenavStore.setIsOpen(false)
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('pointerup', handlePointerUp)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('pointerup', handlePointerUp)
        }
    }, [sidenavStore, topnavStore.menuButtonElement])

    //
    //
    //

    return (<>
        <nav
            className="fixed w-[min(500px,70vw)] h-[calc(100vh-var(--height-topnav))] left-[max(-500px,-70vw)] bg-background shadow-lg shadow-neutral-950 leading-10 overflow-y-auto overflow-x-hidden scrollbar-stable z-[100]"
            ref={initializeSidenavReference}
            onKeyUp={handleKeyInput}
        // tabIndex={-1}
        >
            <hr />
            <Link
                className="block pl-4 py-[2px]"
                href="/image_examples"
                {...useClick(closeSidenav)}
                tabIndex={sidenavStore.isOpen ? undefined : -1}
            >Image Examples</Link><hr />
            <Link
                className="block pl-4 py-[2px]"
                href="/form_examples"
                {...useClick(closeSidenav)}
                tabIndex={sidenavStore.isOpen ? undefined : -1}
            >Form Examples</Link><hr />
            <Link
                className="block pl-4 py-[2px]"
                href="/back_end_examples"
                {...useClick(closeSidenav)}
                tabIndex={sidenavStore.isOpen ? undefined : -1}
            >Back-End Examples</Link><hr />
            <DropdownMenu text="Dropdown 1">
                {/* TODO; tabIndex; */}
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