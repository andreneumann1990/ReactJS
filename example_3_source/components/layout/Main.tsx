import React, { KeyboardEvent, useEffect, useRef } from 'react'
import { useDrag } from '@use-gesture/react'
import { create } from 'zustand'
import { isDebugEnabled, tabIndexGroupMain } from '../../constants/general_constants'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { useGlobalStore, useMainStore } from '../../hooks/stores'
import { NullableBoolean } from '../../constants/types'

export default Main
export { handleKeyDownInput as handleKeyDownInput_Main }

//TODO; focus child elements;
//TODO; uparrow for focus topnav;

//
// paramters and variables
//

const queryString = 'a:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"]), summary:not([tabindex="-1"])'

//
// functions
//

function focusNextElement() {
    const mainElement = useMainStore.getState().element
    if (mainElement == null) return
    const focusedElement = document.activeElement as HTMLAnchorElement | null
    if (focusedElement == null) return

    const focusableElements = Array.from(mainElement.querySelectorAll<HTMLAnchorElement>(queryString))
    //TODO
    console.log(focusableElements)
    const nextIndex = Math.min(focusableElements.indexOf(focusedElement) + 1, focusableElements.length - 1)
    focusableElements[nextIndex]?.focus()
}

function focusPreviousElement() {
    const mainElement = useMainStore.getState().element
    if (mainElement == null) return
    let focusedElement = document.activeElement as HTMLElement | null
    if (focusedElement == null) return

    // previousIndex is -1 if the element is not found or null;
    const focusableElements = Array.from(mainElement.querySelectorAll<HTMLElement>(queryString))
    const previousIndex = Math.max(focusableElements.indexOf(focusedElement) - 1, 0)
    focusableElements[previousIndex]?.focus()
}

function handleKeyDownInput(event: KeyboardEvent): NullableBoolean {
    const { layoutState, mainState, topnavState } = useGlobalStore.getState()
    if (mainState.element == null) return null
    if (!mainState.element.contains(document.activeElement)) return null

    if (document.activeElement === mainState.element) {
        if (event.key === 'Enter') {
            event.preventDefault()
            layoutState.setActiveTabIndexGroup(tabIndexGroupMain)
            // focusPreviousElement()
            setTimeout(() => focusNextElement(), 1)
            return false
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault()
            topnavState.element?.focus()
            return false
        }
        return null
    }

    //TODO
    if (document.activeElement?.tagName === 'SUMMARY') {
        if (event.key === 'ArrowRight') {
            event.preventDefault()
            event.stopPropagation()
            document.activeElement.parentElement?.setAttribute('open', '')
            return false
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault()
            event.stopPropagation()
            document.activeElement.parentElement?.removeAttribute('open')
            return false
        }
    }

    if (event.key === 'Escape') {
        event.preventDefault()
        layoutState.setActiveTabIndexGroup(0)
        mainState.element?.focus()
        return false
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
    return null
}

//
// main
//

function Main({ children }: React.PropsWithChildren) {
    //
    // parameters and variables
    //

    const focusAnchor = useRef<HTMLDivElement | null>(null)
    const { layoutState, mainState, searchState, sidenavState, topnavState } = useGlobalStore()

    // close sidenav by swipe / panning gesture;
    const dragAttributes: ReactDOMAttributes = useDrag<PointerEvent>(({ movement: [dx, dy], last }) => {
        // `offset` does not reset when panning ends; `movement` does;
        const sidenavElement = sidenavState.element
        if (sidenavElement == null) return
        if (dx > -10) return
        if (Math.abs(dy) > Math.abs(dx)) return

        // pan move;
        if (!last) {
            sidenavElement.style.transition = 'transform 0s ease'
            const currentOffset = sidenavElement.offsetWidth + dx
            sidenavElement.style.transform = `translateX(${currentOffset}px)`
            return
        }

        // pan end;
        if (isDebugEnabled) console.log('Sidenav: Pan gesture has ended.')
        if (dx < -0.5 * sidenavElement.offsetWidth) {
            // isOpen is not updated immediately;
            // this is enough since the isOpen state is changed; hence, applySidenavState()
            // is called automatically;
            sidenavState.setIsOpen(false)
            return
        }

        // not needed; the isOpen state is not changed;
        // sidenavContext.openState.setIsOpen(true)
        // cannot call applySidenavState() for this since it depends on this function, i.e. enableTouchEvents();
        sidenavElement.style.transition = 'transform 0.5s ease-out 0s'
        sidenavElement.style.transform = `translateX(${sidenavElement.offsetWidth}px)`
    }, { eventOptions: { capture: true }, enabled: sidenavState.isOpen })()

    //
    // functions
    //

    function initializeMainReference(element: HTMLElement | null): void {
        if (mainState.element != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Main: Initialize main reference.')
        mainState.setElement(element)
    }

    //
    // effects
    //

    // update state;
    useEffect(() => {
        if (mainState.isActive === (!sidenavState.isOpen && !searchState.isOpen)) return
        mainState.setIsActive(!mainState.isActive)
    }, [mainState, searchState.isOpen, sidenavState.isOpen])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // [mainState.setIsActive, searchState.isOpen, sidenavState.isOpen])

    // synchronize state and attributes;
    useEffect(() => {
        if (mainState.element == null) return
        if (mainState.isActive) {
            delete mainState.element.dataset.inactive
            return
        }
        mainState.element.dataset.inactive = ''
    }, [mainState.element, mainState.isActive])

    //
    //
    //

    return (<>
        <main
            {...dragAttributes}
            className="h-[calc(100vh-var(--height-topnav))] pl-16 pr-8 text-wrap break-words overflow-y-auto overscroll-contain scrollbar-stable-both transition-colors ease-out duration-300 data-inactive:opacity-20 data-inactive:overflow-y-hidden data-inactive:select-none data-inactive:touch-none"
            ref={initializeMainReference}
            tabIndex={(mainState.isActive && layoutState.activeTabIndexGroup === 0 ? 0 : -1)}
        >
            <div
                ref={focusAnchor}
                tabIndex={layoutState.activeTabIndexGroup === tabIndexGroupMain ? 0 : -1}
            />
            {children}
        </main >
    </>)
}