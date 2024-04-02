'use client'

import { KeyboardEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import MobileDropdownComponent from './Dropdown'
import { SidebarContext, isDebugEnabled, mainElement, triggerFlashEffect } from '../Layout'
import { menuButtonElement } from './Topbar'
import { useDrag } from '@use-gesture/react'

let sidebarElement: HTMLElement | null = null

function MobileSidebarComponent() {
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => setIsLoading(false), [])

    const sidebarContext = useContext(SidebarContext)
    // const mainElement = document.querySelector('main')

    //         // Drag (pan) handler
    //         const bindSwipe = useDrag(({ offset: [dx, dy], direction: [x], velocity: [vx], last }) => {
    //             if (sidebarContext == null) return
    //             if (!sidebarContext.openState.isOpen) return
    //             if (sidebarElement == null) return
    //             if (dx > -10) return
    //             if (Math.abs(dy) > Math.abs(dx)) return
    //
    //             // pan move;
    //             if (!last) {
    //                 sidebarElement.style.transition = 'transform 0s ease'
    //                 const currentOffset = sidebarElement.offsetWidth + dx
    //                 sidebarElement.style.transform = `translateX(${currentOffset}px)`
    //             }
    //
    //             // pan end;
    //             if (isDebugEnabled) console.log('Sidebar: Pan gesture has ended.')
    //             if (dx < -0.5 * sidebarElement.offsetWidth) {
    //                 // isOpen is not updated immediately;
    //                 // this is enough since the isOpen state is changed; hence, applySidebarState()
    //                 // is called automatically;
    //                 sidebarContext.openState.setIsOpen(false)
    //                 return
    //             }
    //
    //             // not needed; the isOpen state is not changed;
    //             // sidebarContext.openState.setIsOpen(true)
    //             // cannot call applySidebarState() for this since it depends on this function, i.e. enableTouchEvents();
    //             sidebarElement.style.transition = 'transform 0.5s ease-out 0s'
    //             sidebarElement.style.transform = `translateX(${sidebarElement.offsetWidth}px)`
    //         }, {
    //             domTarget: mainElement,
    //             eventOptions: { capture: true },
    //         })

    // Ensure the effect hooks into the domTarget

    console.log('TEMP 2') //TODO

    //
    // functions
    //

    // this is called when the component mounts or unmounts; and called when it re-renders;
    const initializeSidebarReference = (element: HTMLElement | null) => {
        if (sidebarElement != null) return
        if (element == null) return // should never happen!! since it gets never unmounted;
        if (isDebugEnabled) console.log('Sidebar: Initialize reference.')
        sidebarElement = element
    }

    //
    // side effects
    //

    // update state
    useEffect(() => {
        if (sidebarContext == null) return
        // if (manager == null) return
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
            // manager.add(recognizer)
            mainElement.classList.add('inactive')
            sidebarElement.style.transform = `translateX(${sidebarElement.offsetWidth}px)`
            return
        }

        disableTabIndex()
        // manager.remove(recognizer)
        mainElement.classList.remove('inactive')
        sidebarElement.style.transform = 'translateX(0)'
    }, [mainElement, sidebarContext])

    // swipe event listener
    // useEffect(() => {
    //     bindSwipe()
    // }, [bindSwipe])

    // click event listener
    useEffect(() => {
        if (sidebarContext == null) return
        let startX = 0
        let startY = 0

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
            if (!sidebarContext.openState.isOpen) return
            if (sidebarElement == null) return
            if (sidebarElement.contains(event.target as Node)) return

            if (menuButtonElement == null) return
            if (menuButtonElement.contains(event.target as Node)) return

            if (isDebugEnabled) console.log('Sidebar: Clicked outside. Close sidebar.')
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

    if (isLoading) return <></>

    return (<>
        <nav ref={initializeSidebarReference} className="mobile-sidebar" tabIndex={-1} onKeyUp={handleKeyInput}>
            <hr />
            <a href="/image_examples">Image Examples</a><hr />
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