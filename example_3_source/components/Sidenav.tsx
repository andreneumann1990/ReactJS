import { KeyboardEvent, useEffect } from 'react'
import Dropdown from './Dropdown'
import { isDebugEnabled, triggerFlashEffect } from './Layout'
import { create } from 'zustand'
import Link from 'next/link'
import { useTopnavStore } from './Topnav'
import { useMainStore } from './Main'
import { useClick } from './CustomGestures'

export default Sidenav
export { useSidenavStore }

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

    const mainElement = useMainStore(state => state.element)

    const sidenavElement = useSidenavStore(state => state.element)
    const setSidenavElement = useSidenavStore(state => state.setElement)
    const isSidenavOpen = useSidenavStore(state => state.isOpen)
    const setIsSidenavOpen = useSidenavStore(state => state.setIsOpen)

    const menuButtonElement = useTopnavStore(state => state.menuButtonElement)

    //
    // functions
    //

    function closeSidenav(): void {
        setIsSidenavOpen(false)
    }

    function focusNextElement() {
        if (menuButtonElement == null) return
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
        if (menuButtonElement == null) return
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

        if (event.key === 'ArrowLeft' && isSidenavOpen) {
            event.preventDefault()
            event.stopPropagation()
            setIsSidenavOpen(false)

            setTimeout(() => {
                if (menuButtonElement == null) return
                menuButtonElement.focus()
            }, 500)
            return
        }
    }

    // this is called when the component mounts or unmounts; and called when it re-renders;
    const initializeSidenavReference = (element: HTMLElement | null) => {
        if (sidenavElement != null) return
        if (element == null) return // should never happen!! since it gets never unmounted;
        if (isDebugEnabled) console.log('Sidenav: Initialize sidenav reference.')
        setSidenavElement(element)
    }

    //
    // effects
    //

    // update state
    useEffect(() => {
        if (sidenavElement == null) return
        if (mainElement == null) return

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
        if (isDebugEnabled) console.log(`Sidenav: isOpen ${isSidenavOpen}`)

        if (isSidenavOpen) {
            enableTabIndex()
            mainElement.classList.add('inactive')
            sidenavElement.style.transform = `translateX(${sidenavElement.offsetWidth}px)`
            return
        }

        disableTabIndex()
        mainElement.classList.remove('inactive')
        sidenavElement.style.transform = 'translateX(0)'
    }, [isSidenavOpen, mainElement, sidenavElement])

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
            if (!isSidenavOpen) return
            if (sidenavElement == null) return
            if (sidenavElement.contains(event.target as Node)) return

            if (menuButtonElement == null) return
            if (menuButtonElement.contains(event.target as Node)) return

            if (isDebugEnabled) console.log('Sidenav: Clicked outside. Close sidebar.')
            setIsSidenavOpen(false)
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('pointerup', handlePointerUp)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('pointerup', handlePointerUp)
        }
    }, [isSidenavOpen, menuButtonElement, setIsSidenavOpen, sidenavElement])

    //
    //
    //

    //TODO; was this strictly necessary?;
    // const [isLoading, setIsLoading] = useState(true)
    // useEffect(() => setIsLoading(false), [])
    // if (isLoading) return <></>

    return (<>
        <nav ref={initializeSidenavReference} className="mobile-sidebar" tabIndex={-1} onKeyUp={handleKeyInput}>
            <hr />
            <Link href="/image_examples" {...useClick(closeSidenav)}>Image Examples</Link><hr />
            <Link href="/form_examples" {...useClick(closeSidenav)}>Form Examples</Link><hr />
            <Link href="/back_end_examples" {...useClick(closeSidenav)}>Back-End Examples</Link><hr />
            <Dropdown text="Dropdown 1">
                <Link href="#">Link 3</Link>
                <Link href="#">Link 4</Link>
                <Link href="#">Link 5</Link>
                <Link href="#">Link 6</Link>
                <Link href="#">Link 7</Link>
                <Link href="#">Link 8</Link>
            </Dropdown><hr />
            <Dropdown text="Dropdown 2">
                <Link href="#">Link 9</Link>
                <Link href="#">Link 10</Link>
            </Dropdown><hr />
        </nav>
    </>)
}