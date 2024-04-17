import { useSidenavStore } from './Sidenav'
import React, { KeyboardEvent, useEffect, useRef } from 'react'
import { useDrag } from '@use-gesture/react'
import { create } from 'zustand'
import { isDebugEnabled, tabIndexGroupMain } from '../../constants/general_constants'
import { useSearchStore } from '../atoms/Search'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { useLayoutStore } from './Layout'

export default Main
export { useMainStore }

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

    const layoutStore = useLayoutStore()
    const mainStore = useMainStore()
    const sidenavStore = useSidenavStore()
    const searchStore = useSearchStore()

    // close sidenav by swipe / panning gesture;
    const dragAttributes: ReactDOMAttributes = useDrag<PointerEvent>(({ movement: [dx, dy], last }) => {
        // `offset` does not reset when panning ends; `movement` does;
        const sidenavElement = sidenavStore.element
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
            sidenavStore.setIsOpen(false)
            return
        }

        // not needed; the isOpen state is not changed;
        // sidenavContext.openState.setIsOpen(true)
        // cannot call applySidenavState() for this since it depends on this function, i.e. enableTouchEvents();
        sidenavElement.style.transition = 'transform 0.5s ease-out 0s'
        sidenavElement.style.transform = `translateX(${sidenavElement.offsetWidth}px)`
    }, { eventOptions: { capture: true }, enabled: sidenavStore.isOpen })()

    //
    // functions
    //

    function initializeMainReference(element: HTMLElement | null): void {
        if (mainStore.element != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Main: Initialize main reference.')
        mainStore.setElement(element)
    }

    function handleKeyInputTabIndex(event: KeyboardEvent): void {
        if (event.key == 'Enter' && layoutStore.activeTabIndexGroup != tabIndexGroupMain) {
            event.preventDefault()
            layoutStore.setActiveTabIndexGroup(tabIndexGroupMain)
            focusAnchor.current?.focus()
            return
        }

        if (event.key == 'Escape' && layoutStore.activeTabIndexGroup != 0) {
            event.preventDefault()
            layoutStore.setActiveTabIndexGroup(0)
            mainStore.element?.focus()
            return
        }
    }

    //
    // effects
    //

    // update state;
    useEffect(() => {
        if (mainStore.isActive == (!sidenavStore.isOpen && !searchStore.isOpen)) return
        mainStore.setIsActive(!mainStore.isActive)
    }, [mainStore, searchStore.isOpen, sidenavStore.isOpen])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // [mainStore.setIsActive, searchStore.isOpen, sidenavStore.isOpen])

    // synchronize state and attributes;
    useEffect(() => {
        if (mainStore.element == null) return
        if (mainStore.isActive) {
            delete mainStore.element.dataset.inactive
            return
        }
        mainStore.element.dataset.inactive = ''
    }, [mainStore.element, mainStore.isActive])

    //
    //
    //

    return (<>
        <main
            className="h-[calc(100vh-var(--height-topnav))] pl-16 pr-8 text-wrap break-words overflow-y-auto overscroll-contain scrollbar-stable-both transition-colors ease-out duration-300 data-inactive:opacity-20 data-inactive:overflow-y-hidden data-inactive:select-none data-inactive:touch-none"
            ref={initializeMainReference}
            tabIndex={(mainStore.isActive && layoutStore.activeTabIndexGroup == 0 ? 0 : -1)}
            onKeyDown={handleKeyInputTabIndex}
            {...dragAttributes}
        >
            <div
                ref={focusAnchor}
                tabIndex={layoutStore.activeTabIndexGroup == tabIndexGroupMain ? 0 : -1}
            />
            {children}
        </main >
    </>)
}