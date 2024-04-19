import { useSidenavStore } from './Sidenav'
import React, { KeyboardEvent, useEffect, useRef } from 'react'
import { useDrag } from '@use-gesture/react'
import { create } from 'zustand'
import { isDebugEnabled, tabIndexGroupMain } from '../../constants/general_constants'
import { useSearchStore } from '../atoms/Search'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { useLayoutStore } from './Layout'
import { useTopnavStore } from './Topnav'

export default Main
export { useMainStore }

//TODO; focus child elements;
//TODO; uparrow for focus topnav;

//
//
//

interface mainState {
    element: HTMLElement | null,
    setElement: (element: HTMLElement | null) => void,
    isActive: boolean,
    setIsActive: (isActive: boolean) => void,
}

const useMainStore = create<mainState>((set) => ({
    element: null,
    setElement: (element) => set(() => ({ element })),
    isActive: true,
    setIsActive: (isActive) => set(() => ({ isActive })),
}))

//
// main
//

function Main({ children }: React.PropsWithChildren) {
    //
    // parameters and variables
    //

    const focusAnchor = useRef<HTMLDivElement | null>(null)

    const layoutState = useLayoutStore()
    const mainState = useMainStore()
    const sidenavState = useSidenavStore()
    const searchStore = useSearchStore()
    const topnavState = useTopnavStore()

    const queryString = 'a:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"]), summary:not([tabindex="-1"])'

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

    function focusNextElement() {
        const mainElement = mainState.element
        if (mainElement == null) return
        const focusedElement = document.activeElement as HTMLAnchorElement | null
        if (focusedElement == null) return

        const focusableElements = Array.from(mainElement.querySelectorAll<HTMLAnchorElement>(queryString))
        const nextIndex = Math.min(focusableElements.indexOf(focusedElement) + 1, focusableElements.length - 1)
        focusableElements[nextIndex]?.focus()
    }

    function focusPreviousElement() {
        const mainElement = mainState.element
        if (mainElement == null) return
        let focusedElement = document.activeElement as HTMLElement | null
        if (focusedElement == null) return

        // previousIndex is -1 if the element is not found or null;
        const focusableElements = Array.from(mainElement.querySelectorAll<HTMLElement>(queryString))
        const previousIndex = Math.max(focusableElements.indexOf(focusedElement) - 1, 0)
        focusableElements[previousIndex]?.focus()
    }

    //TODO
    function handleKeyUpInput(event: KeyboardEvent): void {
        if (isDebugEnabled) console.log('Main: Handle key-up input.')

        if (document.activeElement === mainState.element) {
            if (event.key === 'Enter') {
                event.preventDefault()
                layoutState.setActiveTabIndexGroup(tabIndexGroupMain)
                // focusAnchor.current?.focus()
                focusPreviousElement()
                return
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault()
                topnavState.element?.focus()
                return
            }
            return
        }

        //TODO
        if (document.activeElement?.tagName === 'SUMMARY') {
            if (event.key === 'ArrowRight') {
                event.preventDefault()
                event.stopPropagation()
                document.activeElement.parentElement?.setAttribute('open', '')
                return
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                event.stopPropagation()
                document.activeElement.parentElement?.removeAttribute('open')
                return
            }
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            layoutState.setActiveTabIndexGroup(0)
            mainState.element?.focus()
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
    }


    //
    // effects
    //

    // update state;
    useEffect(() => {
        if (mainState.isActive === (!sidenavState.isOpen && !searchStore.isOpen)) return
        mainState.setIsActive(!mainState.isActive)
    }, [mainState, searchStore.isOpen, sidenavState.isOpen])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // [mainState.setIsActive, searchStore.isOpen, sidenavState.isOpen])

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
            onKeyUp={handleKeyUpInput}
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