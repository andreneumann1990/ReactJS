import { useContext, useEffect, useMemo } from 'react'
import MobileDropdown1Component from './Dropdown1'
import { SidebarContext, mainElement } from '../Layout'
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

    // event listeners;
    useEffect(() => {
        if (sidebarContext == null) return
        if (manager == null) return
        let startX = 0
        let currentX = 0

        const handlePanStart = function () {
            console.log('panstart')
            // console.log('target ' + event.target)
            startX = 0
            currentX = 0
        }

        // eslint-disable-next-line no-undef
        const handlePanMove = function (event: HammerInput) {
            if (sidebarElement == null) return
            // console.log('panmove')
            const deltaX = event.deltaX
            currentX = startX + deltaX
            if (currentX >= 0) return

            sidebarElement.style.transition = 'transform 0s ease'
            const currentOffset = sidebarElement.offsetWidth + currentX
            sidebarElement.style.transform = `translateX(${currentOffset}px)`
        }

        const handlePanEnd = function () {
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
        }

        manager.on('panstart', handlePanStart)
        manager.on('panmove', handlePanMove)
        manager.on('panend', handlePanEnd)

        return () => {
            manager.off('panstart', handlePanStart)
            manager.off('panmove', handlePanMove)
            manager.off('panend', handlePanEnd)
        }
    }, [manager, sidebarContext])

    // apply current sidebar state;
    useEffect(() => {
        if (sidebarContext == null) return
        if (manager == null) return
        if (sidebarElement == null) return
        if (mainElement == null) return

        const transparentOverlay = mainElement.parentElement?.children[0] as HTMLElement
        if (transparentOverlay == null) return

        const disableTabIndex = () => {
            if (sidebarElement == null) return
            for (const childIndex in sidebarElement.children) {
                const child = sidebarElement.children[childIndex] as HTMLElement
                if (child.tabIndex == null) continue
                // if (child instanceof HTMLButtonElement) console.log('button')
                if (child.tabIndex < 0) continue
                // child.setAttribute('tabindex', '-1')
                child.tabIndex = -100
            }
        }

        const enableTabIndex = () => {
            if (sidebarElement == null) return
            for (const childIndex in sidebarElement.children) {
                const child = sidebarElement.children[childIndex] as HTMLElement
                if (child.tabIndex == null) continue
                // console.log('tabIndex ' + child.tabIndex)
                if (child.tabIndex > -100) continue
                child.tabIndex = 0
            }
        }

        const disableTouchEvents = () => {
            console.log('disableTouchEvents')
            manager.remove(recognizer)
        }

        const enableTouchEvents = () => {
            console.log('enableTouchEvents')
            manager.add(recognizer)
        }

        console.log('update sidebar state')
        sidebarElement.style.transition = 'transform 0.5s ease-out 0s'

        if (sidebarContext.openState.isOpen) {
            console.log('open')
            transparentOverlay.style.backgroundColor = "hsla(0, 0%, 0%, 0.3)"
            mainElement.style.overflowY = "hidden"
            sidebarElement.style.transform = `translateX(${sidebarElement.offsetWidth}px)`

            enableTabIndex()
            enableTouchEvents()
            return
        }

        console.log('closed')
        transparentOverlay.style.backgroundColor = "transparent"
        mainElement.style.overflowY = "auto"
        sidebarElement.style.transform = 'translateX(0)'

        disableTabIndex()
        disableTouchEvents()
    }, [manager, recognizer, sidebarContext])

    //
    // click
    //

    useEffect(() => {
        if (sidebarContext == null) return
        let startX = 0
        let startY = 0

        // console.log(`threshold ${new Hammer.Tap().defaults.threshold}`) // 9
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
            console.log(`isOpen ${sidebarContext.openState.isOpen}`)
            if (!sidebarContext.openState.isOpen) return
            if (sidebarElement == null) return
            if (sidebarElement.contains(event.target as Node)) return

            if (buttonElement == null) return
            if (buttonElement.contains(event.target as Node)) return

            console.log('close sidebar because clicked outside')
            sidebarContext.openState.setIsOpen(false)
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('pointerup', handlePointerUp)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('pointerup', handlePointerUp)
        }
    }, [sidebarContext])

    //     useEffect(() => {
    //         const handleClickOutside = (event: MouseEvent) => {
    //             if (sidebarContext == null) return
    //             console.log(`isOpen ${sidebarContext.openState.isOpen}`)
    //             if (!sidebarContext.openState.isOpen) return
    //             if (sidebarElement == null) return
    //             if (sidebarElement.contains(event.target as Node)) return
    // 
    //             // const topbar = topbarContext?.topbarState.topbar
    //             // if (topbar == null) return
    //             // if (topbar.contains(event.target as Node)) return
    // 
    //             if (buttonElement == null) return
    //             if (buttonElement.contains(event.target as Node)) return
    // 
    //             console.log('close sidebar because clicked outside')
    //             sidebarContext.openState.setIsOpen(false)
    //         }
    // 
    //         document.addEventListener('click', handleClickOutside)
    //         return () => { document.removeEventListener('click', handleClickOutside) }
    // 
    //         // this is bad; arrow functions override the "this" keyword; normally it would
    //         // refer to document; this way the listener changes and is registered multiple times;
    //         // document.addEventListener('click', (event) => handleClickOutside(event))
    //         // return () => { document.removeEventListener('click', (event) => handleClickOutside(event)) }
    //     }, [sidebarContext])

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

    return (<nav ref={initializeSidebarReference} className="mobile-sidebar" tabIndex={-1}>
        <hr />
        <a href="/home">Link 1</a><hr />
        <a href="/home">Link 2</a><hr />
        <MobileDropdown1Component text="Dropdown 1">
            <a href="/home">Link 3</a>
            <a href="/home">Link 4</a>
            <a href="/home">Link 5</a>
            <a href="/home">Link 6</a>
            <a href="/home">Link 7</a>
            <a href="/home">Link 8</a>
        </MobileDropdown1Component><hr />
        <MobileDropdown1Component text="Dropdown 2">
            <a href="/home">Link 9</a>
            <a href="/home">Link 10</a>
        </MobileDropdown1Component><hr />
        {/* <MobileDropdown2Component /><hr /> */}
    </nav>)
}

export default MobileSidebarComponent
export { sidebarElement }