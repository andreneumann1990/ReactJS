import { useSidenavStore } from './Sidenav'
import React, { useEffect } from 'react'
import { useDrag } from '@use-gesture/react'
import { create } from 'zustand'
import { isDebugEnabled } from '../../constants/general_constants'
import { useSearchStore } from '../atoms/Search'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'

export default Main
export { useMainStore }

//
//
//

interface mainState {
    element: HTMLElement | null,
    setElement: (element: HTMLElement | null) => void
}

const useMainStore = create<mainState>((set) => ({
    element: null,
    setElement: (element) => set(() => ({ element })),
}))

//
// main
//

function Main({ children }: React.PropsWithChildren) {
    //
    // parameters and variables
    //

    const mainElement: HTMLElement | null = useMainStore(state => state.element)
    const sidenavElement: HTMLElement | null = useSidenavStore(state => state.element)
    const setMainElement: (element: HTMLElement | null) => void = useMainStore(state => state.setElement)

    const isSearchOpen: boolean = useSearchStore(state => state.isOpen)
    const isSidenavOpen: boolean = useSidenavStore(state => state.isOpen)
    const setIsSidenavOpen: (isOpen: boolean) => void = useSidenavStore(state => state.setIsOpen)

    // close sidebar by swipe / panning gesture;
    const dragAttributes: ReactDOMAttributes = useDrag<PointerEvent>(({ movement: [dx, dy], last }) => {
        // offset does not reset when panning ends; movement does;
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
            setIsSidenavOpen(false)
            return
        }

        // not needed; the isOpen state is not changed;
        // sidebarContext.openState.setIsOpen(true)
        // cannot call applySidenavState() for this since it depends on this function, i.e. enableTouchEvents();
        sidenavElement.style.transition = 'transform 0.5s ease-out 0s'
        sidenavElement.style.transform = `translateX(${sidenavElement.offsetWidth}px)`
    }, { eventOptions: { capture: true }, enabled: isSidenavOpen })()

    //
    // functions
    //

    function initializeMainReference(element: HTMLElement | null): void {
        if (mainElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Main: Initialize main reference.')
        setMainElement(element)
    }

    //
    // effects
    //

    // update state;
    useEffect(() => {
        if (mainElement == null) return
        if (isDebugEnabled) console.log('Main: Update state.')

        if (isSidenavOpen) {
            mainElement.dataset.inactive = ''
            return
        }

        if (isSearchOpen) {
            mainElement.dataset.inactive = ''
            return
        }

        delete mainElement.dataset.inactive
    }, [isSearchOpen, isSidenavOpen, mainElement])

    //
    //
    //

    return (<>
        <main
            ref={initializeMainReference}
            className="flex flex-col justify-between h-[calc(100vh-var(--height-topnav))] pl-16 pr-8 text-wrap break-words overflow-y-auto overscroll-contain scrollbar-stable-both transition-colors ease-out duration-300 data-inactive:opacity-20 data-inactive:overflow-y-hidden data-inactive:select-none data-inactive:touch-none"
            {...dragAttributes}
            tabIndex={1}
        >
            <div>{children}</div>
        </main >
    </>)
}