import { KeyboardEvent, useEffect, useRef } from 'react'
import Link from 'next/link'
import { isDebugEnabled, defaultIndexGroup, mainIndexGroup, sidenavIndexGroup, topnavIndexGroup, focusableElementSelectors } from '../../constants/parameters'
import { stopKeyDownInput, triggerFlashEffect } from '../../constants/functions'
import { NullableBoolean, NullableHTMLElement } from '../../constants/types'
import { useGlobalStore, useSearchStore, useSidenavStore, useTopnavStore } from '../../hooks/stores'
import Search, { handleKeyDown_Search } from '../atoms/Search'
import { keyDownTimeout } from '../../app/layout'
import { useRouter } from 'next/navigation'
import { useIndexGroupContainer, useIndexGroupEffect, useIndexGroupItem } from '../../hooks/indexGroup'

export default Topnav
export { handleKeyDown_Global as handleKeyInput_Topnav }

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
    const focusedElement = document.activeElement as NullableHTMLElement

    if (focusedElement == null) return
    const focusableElements = Array.from(topnavElement.querySelectorAll<HTMLElement>(queryString))
    const previousIndex = Math.max(focusableElements.indexOf(focusedElement) - 1, 0)

    const previousElement = focusableElements[previousIndex]
    previousElement?.focus()
}

function handleKeyDown_Global(event: KeyboardEvent): NullableBoolean {
    const { layoutState, mainState, sidenavState, topnavState } = useGlobalStore.getState()
    if (topnavState.element == null) return null
    if (!topnavState.element.contains(document.activeElement)) return null

    if (layoutState.indexGroup === defaultIndexGroup) {
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            event.stopPropagation()
            mainState.element?.focus()
            return true
        }

        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            layoutState.setIndexGroup(topnavIndexGroup)
            topnavState.menuButtonElement?.focus()
            return false
        }
        return null
    }

    const isKeyInputRepeating = handleKeyDown_Search(event)
    if (isKeyInputRepeating != null) return isKeyInputRepeating

    if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        sidenavState.setIsOpen(false)
        topnavState.element?.focus()
        return false
    }

    if (document.activeElement === topnavState.menuButtonElement) {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()

            triggerFlashEffect(event)
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

        if ((event.key === 'ArrowLeft' || event.key === 'ArrowUp') && sidenavState.isOpen) {
            event.preventDefault()
            event.stopPropagation()

            toggleSidenav()
            triggerFlashEffect(event)
            return false
        }

        if (event.key === 'ArrowRight' && sidenavState.isOpen) {
            event.preventDefault()
            event.stopPropagation()

            toggleSidenav()
            triggerFlashEffect(event)
            return true
        }
    }

    // if (document.activeElement === topnavState.homeLinkElement) {
    //     if (event.key === 'Enter') {
    //         console.log('homeLink')
    //         triggerFlashEffect(event)
    //         layoutState.resetIndexGroup()
    //         topnavState.element.focus()
    //         return true
    //     }
    // }

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
    const sidenavState = useSidenavStore.getState()
    if (isDebugEnabled) console.log('Topnav: Toggle sidenav.')
    sidenavState.setIsOpen(!sidenavState.isOpen)
}

//
// main
//

function Topnav() {
    //
    // parameters and variables
    //

    const router = useRouter()
    const { layoutState, sidenavState, topnavState } = useGlobalStore()

    const homeLinkRef = useRef<HTMLAnchorElement | null>(null)
    const menuIconRef = useRef<NullableHTMLElement>(null)
    const closeIconRef = useRef<NullableHTMLElement>(null)

    //
    // functions
    //

    function handleKeyDown_HomeLink(event: React.KeyboardEvent): void {
        if (keyDownTimeout.current != null) return
        if (event.key === 'Enter') {
            router.push('/home')
            triggerFlashEffect(event)

            // layoutState.resetIndexGroup()
            topnavState.element?.focus()
            keyDownTimeout.current = stopKeyDownInput()
            return
        }
    }

    const initializeMenuButtonElement = (element: HTMLButtonElement | null) => {
        if (topnavState.menuButtonElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Topnav: Initialize menu element.')
        topnavState.setMenuButtonElement(element)
    }

    const initializeTopnavElement = (element: NullableHTMLElement) => {
        if (topnavState.element != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Topnav: Initialize topnav element.')
        topnavState.setElement(element)
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

    // update tabIndex values for focusable elements;
    useIndexGroupEffect(topnavState.element, focusableElementSelectors)

    //
    //
    //

    return (
        <nav
            // indexGroupItems are focusable as well;
            {...useIndexGroupItem(defaultIndexGroup)}
            className="bg-background h-[--height-topnav] shadow-md"
            ref={initializeTopnavElement}
        >
            <div
                // does not work on topnavElement since it changes indexGroup onFocusCapture;
                {...useIndexGroupContainer(topnavIndexGroup)}
                className="h-[--height-topnav] lg:h-auto grid [grid-template-columns:20%_60%_20%] lg:[grid-template-columns:20%_1fr_410px] justify-items-center justify-between"
            >
                <div className="grid grid-flow-col justify-self-start">
                    {/* sidenav menu and home link; left; */}
                    <button
                        className="h-[--height-topnav]"
                        onPointerUp={toggleSidenav}
                        ref={initializeMenuButtonElement}

                        data-no-tab-index-override
                        tabIndex={layoutState.indexGroup === topnavIndexGroup || layoutState.indexGroup === sidenavIndexGroup ? 0 : -1}
                    >
                        <i
                            className="p-1 icon-medium material-icons"
                            ref={(element) => { menuIconRef.current = element }}
                        >menu</i>
                        <i
                            className="p-1 icon-medium material-icons hidden"
                            ref={(element) => { closeIconRef.current = element }}
                        >close</i>
                    </button>
                    <Link
                        className="block h-[--height-topnav]"
                        href="/home"
                        onKeyDown={handleKeyDown_HomeLink}
                        ref={homeLinkRef}
                    >
                        <i className="p-1 icon-medium material-icons">home</i>
                    </Link>
                </div>
                {/* search input; middle; */}
                <Search />
                {/* key input hints; right; */}
                <div className="hidden lg:flex w-full px-5 justify-between items-center text-right">
                    <div className="grid grid-flow-col justify-center">
                        <i className="material-icons rotate-90">arrow_downward</i>
                        <i className="material-icons rotate-90">arrow_upward</i>
                        <i className="material-icons">arrow_upward</i>
                        <i className="material-icons">arrow_downward</i>
                        <span className="inline-block p-1 text-xs">to navigate</span>
                    </div>
                    <div className="text-center">
                        <img className="inline bg-white rounded-md p-1" src="./icons/enter-arrow-svgrepo-com.svg" alt="enter" height="24px" width="24px"></img>
                        <span> </span>
                        <img className="inline bg-white rounded-md p-1" src="./icons/spacebar-svgrepo-com.svg" alt="spacebar" height="24px" width="24px"></img>
                        <span className="inline-block p-1 text-xs">to select</span>
                    </div>
                    <div>
                        <img className="inline bg-white rounded-md p-1" src="./icons/esc-a-svgrepo-com.svg" alt="escape" height="24px" width="24px"></img>
                        <span className="inline-block p-1 text-xs">to go back</span>
                    </div>
                </div>
            </div>
        </nav >
    )
}