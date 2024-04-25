import { useEffect } from 'react'
import DropdownMenu, { handleKeyDown_DropdownMenu } from '../atoms/DropdownMenu'
import Link from 'next/link'
import { useClick } from '../../hooks/gestures'
import { focusableElementSelectors, isDebugEnabled, maximumDelay, repeatDelay, sidenavIndexGroup, sidenavTransitionDuration, topnavIndexGroup } from '../../constants/parameters'
import { focusNextElement, focusPreviousElement, triggerFlashEffect } from '../../constants/functions'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { NullableHTMLElement, NullableNumber } from '../../constants/types'
import { useGlobalStore } from '../../hooks/stores'
import { useIndexGroupContainer, useIndexGroupEffect } from '../../hooks/indexGroup'

export default Sidenav
export { handleKeyDown_Global as handleInput_Sidenav }

//
// parameters and variables
//

const queryString = 'a:not([tabindex="-1"]), button:not([tabindex="-1"])'

//
// functions
//

function closeSidenav(): void {
    const { sidenavState, topnavState } = useGlobalStore.getState()
    sidenavState.setIsOpen(false)
    topnavState.element?.focus()
}

function handleKeyDown_Global(event: React.KeyboardEvent, router: AppRouterInstance): NullableNumber {
    const { dropdownMenuStateArray, layoutState, sidenavState, topnavState } = useGlobalStore.getState()
    if (sidenavState.element == null) return null
    if (!sidenavState.element.contains(document.activeElement)) return null

    for (let id = 0; id < dropdownMenuStateArray.length; ++id) {
        const newCooldown: NullableNumber = handleKeyDown_DropdownMenu(id, event)
        if (newCooldown != null) return newCooldown
    }

    if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        closeSidenav()
        return maximumDelay
    }

    if (event.target instanceof HTMLAnchorElement) {
        if (event.key === 'Enter') {
            // preventDefault() does not prevent links from being triggered??;
            event.preventDefault()
            event.stopPropagation()

            router.push(event.target.href)
            triggerFlashEffect(event)
            closeSidenav()
            return maximumDelay
        }
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopPropagation()
        focusNextElement(sidenavState.element, queryString)
        return repeatDelay
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()

        if (document.activeElement === focusPreviousElement(sidenavState.element, queryString)) {
            topnavState.menuButtonElement?.focus()
            return maximumDelay
        }
        return repeatDelay
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault()
        event.stopPropagation()

        layoutState.setIndexGroup(topnavIndexGroup)
        sidenavState.setIsOpen(false)
        topnavState.menuButtonElement?.focus()
        return maximumDelay
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
    const { sidenavState } = globalState

    //
    // functions
    //

    // this is called when the component mounts or unmounts; and called when it re-renders;
    const initializeSidenavElement = (element: NullableHTMLElement) => {
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

    // apply {...useIndexGroupItem(...)} via script;
    useIndexGroupEffect(sidenavState.element, focusableElementSelectors)

    //
    //
    //

    return (
        <nav
            {...useIndexGroupContainer(sidenavIndexGroup)}
            className="fixed w-[min(500px,70vw)] h-[calc(100vh-var(--height-topnav))] left-[max(-500px,-70vw)] bg-background shadow-lg shadow-neutral-950 leading-10 overflow-y-auto overflow-x-hidden scrollbar-stable z-[100] transition-none motion-safe:transition-transform motion-safe:ease-out"
            ref={initializeSidenavElement}
            style={{ transitionDuration: sidenavTransitionDuration }}
        >
            <hr />
            <Link
                {...useClick(closeSidenav)}
                className="block pl-4 py-[2px]"
                href="/image_examples"
            // tabIndex={sidenavState.isOpen ? undefined : -1}
            >Image Examples</Link><hr />
            <Link
                {...useClick(closeSidenav)}
                className="block pl-4 py-[2px]"
                href="/form_examples"
            // tabIndex={sidenavState.isOpen ? undefined : -1}
            >Form Examples</Link><hr />
            <Link
                {...useClick(closeSidenav)}
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
    )
}