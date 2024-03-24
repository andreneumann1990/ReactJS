import { KeyboardEvent, useContext, useEffect, useMemo } from 'react'
import MobileDropdownComponent from './Dropdown'
import { SidebarContext, isDebugEnabled, mainElement, triggerFlashEffect } from '../Layout'
import Hammer from 'hammerjs'
import { menuButtonElement } from './Topbar'

let sidebarElement: HTMLElement | null = null

function MobileSidebarComponent() {
    const sidebarContext = useContext(SidebarContext)
    const bodyElement = document.querySelector('main')

    const manager = useMemo(() => {
        return bodyElement != null ? new Hammer.Manager(bodyElement) : undefined
    }, [bodyElement])
    const recognizer = useMemo(() => new Hammer.Pan(), [])

    //
    // functions
    //

    // this is called when the component mounts or unmounts; and called when it re-renders;
    const initializeSidebarReference = (element: HTMLElement | null) => {
        if (sidebarElement != null) return
        if (element == null) return // should never happen!!;
        if (isDebugEnabled) console.log('Sidebar: Initialize reference.')
        sidebarElement = element
    }

    //
    // side effects
    //

    // update state
    useEffect(() => {
        if (sidebarContext == null) return
        if (manager == null) return
        if (sidebarElement == null) return
        if (mainElement == null) return

        const disableTabIndex = () => {
            if (sidebarElement == null) return
            for (const childIndex in sidebarElement.children) {
                const child = sidebarElement.children[childIndex] as HTMLElement
                if (child.tagName !== 'A') continue
                child.tabIndex = -1
            }
        }

        // use side effects for handling tab index??; TODO;
        const enableTabIndex = () => {
            if (sidebarElement == null) return
            for (const childIndex in sidebarElement.children) {
                const child = sidebarElement.children[childIndex] as HTMLElement
                if (child.tagName !== 'A') continue
                child.tabIndex = 100
            }
        }

        //TODO; make changes by adding and removing classes only??; not possible if the value is dynamic;
        sidebarElement.style.transition = 'transform 0.5s ease-out 0s'
        if (isDebugEnabled) console.log(`Sidebar: isOpen ${sidebarContext.openState.isOpen}`)

        if (sidebarContext.openState.isOpen) {
            enableTabIndex()
            manager.add(recognizer)
            mainElement.classList.add('inactive')
            sidebarElement.style.transform = `translateX(${sidebarElement.offsetWidth}px)`
            return
        }

        disableTabIndex()
        manager.remove(recognizer)
        mainElement.classList.remove('inactive')
        sidebarElement.style.transform = 'translateX(0)'
    }, [manager, recognizer, sidebarContext])

    // swipe event listener
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

    // click event listener
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

            if (menuButtonElement == null) return
            if (menuButtonElement.contains(event.target as Node)) return

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

    function focusNextElement() {
        if (menuButtonElement == null) return
        if (sidebarElement == null) return
        const focusedElement = document.activeElement as HTMLAnchorElement | null
        if (focusedElement == null) return

        const focusableElements = [menuButtonElement, ...Array.from(sidebarElement.querySelectorAll<HTMLAnchorElement>('a[tabindex="100"]'))]
        const currentIndex = focusableElements.indexOf(focusedElement)
        const nextIndex = (currentIndex + 1) % focusableElements.length
        const nextElement = focusableElements[nextIndex]

        if (nextElement == null) return
        if (nextElement === menuButtonElement) return
        nextElement.focus()
    }

    function focusPreviousElement() {
        if (menuButtonElement == null) return
        if (sidebarElement == null) return
        const focusedElement = document.activeElement as HTMLElement | null
        if (focusedElement == null) return

        const focusableElements = [menuButtonElement, ...Array.from(sidebarElement.querySelectorAll<HTMLElement>('a[tabindex="100"]'))]
        const currentIndex = focusableElements.indexOf(focusedElement)
        const previousIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length
        const previousElement = focusableElements[previousIndex]

        if (previousElement == null) return
        previousElement.focus()
    }

    function handleKeyInput(event: KeyboardEvent): void {
        // if (menuButtonElement == null) return
        if (sidebarContext == null) return
        if (isDebugEnabled) console.log('Sidebar: Handle key inputs.')

        if (event.key === 'Enter') {
            // does not prevent links from being triggered;
            event.preventDefault()

            event.stopPropagation()
            triggerFlashEffect(event)
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

        if (event.key === 'ArrowLeft' && sidebarContext.openState.isOpen) {
            event.preventDefault()
            event.stopPropagation()
            sidebarContext.openState.setIsOpen(false)

            setTimeout(() => {
                if (menuButtonElement == null) return
                menuButtonElement.focus()
            }, 500)
            return
        }
    }

    //
    //
    //

    return (<>
        <nav ref={initializeSidebarReference} className="mobile-sidebar" tabIndex={-1} onKeyUp={handleKeyInput}>
            <hr />
            <a href="#">Link 1</a><hr />
            <a href="#">Link 2</a><hr />
            <MobileDropdownComponent text="Dropdown 1">
                <a href="#">Link 3</a>
                <a href="#">Link 4</a>
                <a href="#">Link 5</a>
                <a href="#">Link 6</a>
                <a href="#">Link 7</a>
                <a href="#">Link 8</a>
            </MobileDropdownComponent><hr />
            <MobileDropdownComponent text="Dropdown 2">
                <a href="#">Link 9</a>
                <a href="#">Link 10</a>
            </MobileDropdownComponent><hr />
        </nav>
    </>)
}

export default MobileSidebarComponent
export { sidebarElement }