import { useContext, useEffect, useMemo } from 'react'
import MobileDropdown1Component from './Dropdown1'
import { SidebarContext, mainElement } from '../Layout'
import MobileDropdown2Component from './Dropdown2'
import Hammer from 'hammerjs'
import { buttonElement } from './Topbar'

let sidebarElement: HTMLElement | null = null

function MobileSidebarComponent() {
    const sidebarContext = useContext(SidebarContext)
    const bodyElement = document.querySelector('main')

    const manager = useMemo(() => {
        return bodyElement != null ? new Hammer.Manager(bodyElement) : undefined
    }, [bodyElement])
    const recognizer = useMemo(() => new Hammer.Pan(), [])

    //
    // swipe
    //

    // apply current sidebar state;
    useEffect(() => {
        if (sidebarContext == null) return
        if (manager == null) return
        if (sidebarElement == null) return
        if (mainElement == null) return

        const disableTouchEvents = () => {
            console.log('disableTouchEvents')
            manager.remove(recognizer)
        }

        const enableTouchEvents = () => {
            console.log('enableTouchEvents')
            manager.add(recognizer)
            var startX = 0
            var currentX = 0

            manager.on('panstart', (event) => {
                console.log('panstart')
                // console.log('target ' + event.target)
                startX = 0
                currentX = 0
            })

            manager.on('panmove', (event) => {
                if (sidebarElement == null) return
                // console.log('panmove')
                var deltaX = event.deltaX
                currentX = startX + deltaX
                if (currentX >= 0) return

                sidebarElement.style.transition = 'transform 0s ease'
                const currentOffset = sidebarElement.offsetWidth + currentX
                sidebarElement.style.transform = `translateX(${currentOffset}px)`
            })

            manager.on('panend', () => {
                if (sidebarElement == null) return
                console.log('panend')

                if (currentX < -0.5 * sidebarElement.offsetWidth) {
                    // isOpen is not updated immediately;
                    // this is enough since the isOpen state is changed; hence, applySidebarState()
                    // is called automatically;
                    sidebarContext.openState.setIsOpen(false)
                    return
                }

                // not needed; the isOpen state is not changed;
                // sidebarContext.openState.setIsOpen(true)

                // cannot call applySidebarState() for this since it depends on this function, i.e. enableTouchEvents();
                sidebarElement.style.transition = 'transform 0.5s ease-out 0s'
                sidebarElement.style.transform = `translateX(${sidebarElement.offsetWidth}px)`
            })
        }

        console.log('update sidebar state')
        // sidebar.style.transition = 'transform 0.5s ease'
        sidebarElement.style.transition = 'transform 0.5s ease-out 0s'

        if (sidebarContext.openState.isOpen) {
            console.log('open')
            // sidebar.classList.remove('hidden')
            mainElement.style.backgroundColor = "hsla(0, 0%, 0%, 0.3)"
            sidebarElement.style.transform = `translateX(${sidebarElement.offsetWidth}px)`
            enableTouchEvents()
            return
        }

        console.log('closed')
        mainElement.style.backgroundColor = "hsla(0, 0%, 0%, 0)"
        sidebarElement.style.transform = 'translateX(0)'
        disableTouchEvents()
    }, [manager, recognizer, sidebarContext])

    //
    // click
    //

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarContext == null) return
            console.log('isOpen ' + sidebarContext.openState.isOpen)
            if (!sidebarContext.openState.isOpen) return
            if (sidebarElement == null) return
            if (sidebarElement.contains(event.target as Node)) return

            // const topbar = topbarContext?.topbarState.topbar
            // if (topbar == null) return
            // if (topbar.contains(event.target as Node)) return

            if (buttonElement == null) return
            if (buttonElement.contains(event.target as Node)) return

            console.log('close sidebar because clicked outside')
            sidebarContext.openState.setIsOpen(false)
        }

        document.addEventListener('click', handleClickOutside)
        return () => { document.removeEventListener('click', handleClickOutside) }

        // this is bad; arrow functions override the "this" keyword; normally it would
        // refer to document; this way the listener changes and is registered multiple times;
        // document.addEventListener('click', (event) => handleClickOutside(event))
        // return () => { document.removeEventListener('click', (event) => handleClickOutside(event)) }
    }, [sidebarContext])

    //
    //
    //

    // this is called when the component mounts or unmounts; and called when it re-renders;
    const initializeSidebarReference = (element: HTMLElement | null) => {
        if (sidebarElement != null) return
        if (element == null) return // should never happen!!;
        console.log('initializeSidebarReference')
        sidebarElement = element
        Object.freeze(sidebarElement)
    }

    return (<nav ref={initializeSidebarReference} className="mobile-sidebar">
        <a href="/home">Link 1</a>
        <a href="/home">Link 2</a>
        <MobileDropdown1Component />
        <MobileDropdown2Component />
    </nav>)
}

export default MobileSidebarComponent
export { sidebarElement }