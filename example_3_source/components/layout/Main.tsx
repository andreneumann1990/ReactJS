import { useSidenavStore } from './Sidenav'
import React from 'react'
import { useDrag } from '@use-gesture/react'
import { create } from 'zustand'
import { isDebugEnabled } from '../../constants/general_constants'

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

    const mainElement = useMainStore(state => state.element)
    const setMainElement = useMainStore(state => state.setElement)

    const sidenavElement = useSidenavStore(state => state.element)
    const isSidenavOpen = useSidenavStore(state => state.isOpen)
    const setIsSidenavOpen = useSidenavStore(state => state.setIsOpen)

    //
    // functions
    //

    // close sidebar by swipe / panning gesture;
    const onDrag = useDrag<PointerEvent>(({ movement: [dx, dy], last }) => {
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
    }, { eventOptions: { capture: true }, enabled: isSidenavOpen })

    const initializeMainReference = (element: HTMLElement | null) => {
        if (mainElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Layout: Initialize main reference.')
        setMainElement(element)

        // only accounts for properties; the reference can still be changed;
        // Object.freeze(mainElement)
    }

    //
    //
    //

    //TODO: export main component;
    return (<>
        <main ref={initializeMainReference} className="flex flex-col justify-between h-[calc(100vh-var(--height-topnav))] pl-16 pr-8 text-wrap break-words overflow-y-auto overscroll-contain scrollbar-stable-both transition-colors ease-out duration-300" {...onDrag()} tabIndex={1}>
            <div>{children}</div>
            <div>
                <footer className="border grid content-center h-32 overflow-hidden">
                    <h1 className="text-center text-xl">Footer; not sure what I want to do here; TODO;</h1>
                </footer>
            </div>
        </main >
    </>)
}