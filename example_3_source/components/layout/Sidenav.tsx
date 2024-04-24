import { KeyboardEvent, useEffect } from 'react'
import DropdownMenu, { handleKeyDown_DropdownMenu } from '../atoms/DropdownMenu'
import Link from 'next/link'
import { useClick } from '../../hooks/gestures'
import { focusableElementSelectors, isDebugEnabled, sidenavIndexGroup, sidenavTransitionDuration, topnavIndexGroup } from '../../constants/parameters'
import { triggerFlashEffect } from '../../constants/functions'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { NullableBoolean, GlobalState } from '../../constants/types'
import { useGlobalStore } from '../../hooks/stores'
import { useIndexGroupEffect } from '../../hooks/indexGroup'

export default Sidenav
export { handleKeyDown as handleInput_Sidenav }

//TODO; holding arrow keys;

//
// parameters and variables
//

const queryString = 'a:not([tabindex="-1"]), button:not([tabindex="-1"])'

//
// functions
//

function closeSidenav(): void {
    const { layoutState, sidenavState, topnavState } = useGlobalStore.getState()
    // layoutState.resetIndexGroup()
    sidenavState.setIsOpen(false)
    topnavState.element?.focus()
}

function focusNextElement() {
    const { sidenavState, topnavState } = useGlobalStore.getState()
    if (topnavState.menuButtonElement == null) return
    if (sidenavState.element == null) return
    const focusedElement = document.activeElement as HTMLAnchorElement | null

    if (focusedElement == null) return
    const focusableElements = [topnavState.menuButtonElement, ...Array.from(sidenavState.element.querySelectorAll<HTMLAnchorElement>(queryString))]
    const nextIndex = Math.min(focusableElements.indexOf(focusedElement) + 1, focusableElements.length - 1)
    focusableElements[nextIndex]?.focus()
}

function focusPreviousElement() {
    const { sidenavState, topnavState } = useGlobalStore.getState()
    if (topnavState.menuButtonElement == null) return
    if (sidenavState.element == null) return
    const focusedElement = document.activeElement as HTMLElement | null

    if (focusedElement == null) return
    const focusableElements = [topnavState.menuButtonElement, ...Array.from(sidenavState.element.querySelectorAll<HTMLElement>(queryString))]
    const previousIndex = Math.max(focusableElements.indexOf(focusedElement) - 1, 0)
    focusableElements[previousIndex]?.focus()
}

function handleKeyDown(event: KeyboardEvent, router: AppRouterInstance): NullableBoolean {
    const { dropdownMenuStateArray, layoutState, sidenavState, topnavState } = useGlobalStore.getState()
    if (sidenavState.element == null) return null
    if (!sidenavState.element.contains(document.activeElement)) return null

    for (let index = 0; index < dropdownMenuStateArray.length; ++index) {
        const isKeyInputRepeating = handleKeyDown_DropdownMenu(dropdownMenuStateArray[index], event)
        console.log('is key input repeating ' + isKeyInputRepeating)
        if (isKeyInputRepeating != null) return isKeyInputRepeating
    }

    if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        closeSidenav()
        return false
    }

    if (event.target instanceof HTMLAnchorElement) {
        if (event.key === 'Enter') {
            // preventDefault() does not prevent links from being triggered??;
            event.preventDefault()
            event.stopPropagation()

            router.push(event.target.href)
            triggerFlashEffect(event)
            closeSidenav()
            return false
        }
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopPropagation()
        focusNextElement()
        return true
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()
        focusPreviousElement()
        return true
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault()
        event.stopPropagation()

        layoutState.setIndexGroup(topnavIndexGroup)
        sidenavState.setIsOpen(false)
        topnavState.menuButtonElement?.focus()
        return false
    }
    return null
}

//
// main
//

function Sidenav() {
    //
    // paramters and variables
    //

    const globalState = useGlobalStore()
    const { sidenavState, topnavState } = globalState

    //
    // functions
    //

    // this is called when the component mounts or unmounts; and called when it re-renders;
    const initializeSidenavElement = (element: HTMLElement | null) => {
        if (sidenavState.element != null) return
        if (element == null) return // should never happen!! since it gets never unmounted;
        if (isDebugEnabled) console.log('Sidenav: Initialize sidenav element.')
        sidenavState.setElement(element)
    }

    //
    // effects
    //

    // open / close animation;
    useEffect(() => {
        const sidenavElement = sidenavState.element
        if (sidenavElement == null) return
        sidenavElement.style.transitionDuration = sidenavTransitionDuration

        if (sidenavState.isOpen) {
            sidenavElement.style.transform = `translateX(${sidenavElement.offsetWidth}px)`
            return
        }
        sidenavElement.style.transform = 'translateX(0)'
    }, [sidenavState.element, sidenavState.isOpen])

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
            if (!sidenavState.isOpen) return
            if (sidenavState.element == null) return
            if (sidenavState.element.contains(event.target as Node)) return

            if (topnavState.menuButtonElement == null) return
            if (topnavState.menuButtonElement.contains(event.target as Node)) return
            if (isDebugEnabled) console.log('Sidenav: Clicked outside. Close sidenav.')
            closeSidenav()
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('pointerup', handlePointerUp)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('pointerup', handlePointerUp)
        }
    }, [sidenavState.element, sidenavState.isOpen, topnavState.menuButtonElement])

    // apply {...useIndexGroupItem(...)} via script;
    useIndexGroupEffect(sidenavState.element, sidenavIndexGroup, focusableElementSelectors)

    //
    //
    //

    return (<>
        <nav
            className="fixed w-[min(500px,70vw)] h-[calc(100vh-var(--height-topnav))] left-[max(-500px,-70vw)] bg-background shadow-lg shadow-neutral-950 leading-10 overflow-y-auto overflow-x-hidden scrollbar-stable z-[100] transition-none motion-safe:transition-transform motion-safe:ease-out"
            ref={initializeSidenavElement}
            style={{ transitionDuration: sidenavTransitionDuration }}
        >
            <hr />
            <Link
                {...useClick(() => closeSidenav())}
                className="block pl-4 py-[2px]"
                href="/image_examples"
            // tabIndex={sidenavState.isOpen ? undefined : -1}
            >Image Examples</Link><hr />
            <Link
                {...useClick(() => closeSidenav())}
                className="block pl-4 py-[2px]"
                href="/form_examples"
            // tabIndex={sidenavState.isOpen ? undefined : -1}
            >Form Examples</Link><hr />
            <Link
                {...useClick(() => closeSidenav())}
                className="block pl-4 py-[2px]"
                href="/back_end_examples"
            // tabIndex={sidenavState.isOpen ? undefined : -1}
            >Back-End Examples</Link><hr />
            <DropdownMenu id={0} text="Dropdown 1">
                <Link href="#" className="block pl-8 py-[2px]">Link 3</Link>
                <Link href="#" className="block pl-8 py-[2px]">Link 4</Link>
                <Link href="#" className="block pl-8 py-[2px]">Link 5</Link>
                <Link href="#" className="block pl-8 py-[2px]">Link 6</Link>
                <Link href="#" className="block pl-8 py-[2px]">Link 7</Link>
                <Link href="#" className="block pl-8 py-[2px]">Link 8</Link>
            </DropdownMenu><hr />
            <DropdownMenu id={1} text="Dropdown 2">
                <Link href="#" className="block pl-8 py-[2px]">Link 9</Link>
                <Link href="#" className="block pl-8 py-[2px]">Link 10</Link>
            </DropdownMenu><hr />
        </nav>
    </>)
}