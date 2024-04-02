import { KeyboardEvent, useCallback, useContext, useEffect } from 'react'
import { SidebarContext, isDebugEnabled, mainElement, triggerFlashEffect } from '../Layout'
import { sidebarElement } from './Sidebar'
import { Link } from 'react-router-dom'
// import SearchComponent from '../SearchComponent'

let menuButtonElement: HTMLAnchorElement | null = null
let topbarElement: HTMLElement | null = null

function MobileTopbarComponent() {
    const sidebarContext = useContext(SidebarContext)

    // switch image for the sidebar toggle button;
    useEffect(() => {
        // useEffect in combination with ref.current is probably bad; .current does not
        // trigger a re-render and cannot be a dependency therefore;
        // => use topbarState instead;
        if (sidebarContext == null) return
        if (menuButtonElement == null) return
        if (menuButtonElement.children.length < 2) return

        // this depends on the order; careful, if I want to leave it as simple as this;
        // const menuIconClassList = menuButtonElement.children[0].classList
        // const closeIconClassList = menuButtonElement.children[1].classList

        const menuIcon = menuButtonElement.children[0] as HTMLElement
        const closeIcon = menuButtonElement.children[1] as HTMLElement
        // const menuIconAnimation = new Animation(new KeyframeEffect(menuIcon, [
        //     { rotate: '0deg', scale: 1 },
        //     { rotate: '45deg', scale: 1 },
        //     { rotate: '45deg', scale: '0.5 0.5' },
        //     { rotate: '45deg', scale: '0.5 0' }
        // ], { duration: 500, easing: 'ease-out', fill: 'both' }), document.timeline)
        // const duration = 300
        // const menuIconAnimation = new Animation(new KeyframeEffect(menuIcon, [
        //     { opacity: 1 },
        //     { opacity: 0 },
        // ], { duration, easing: 'ease-out', fill: 'both' }), document.timeline)
        // const menuIconAnimation = new Animation(new KeyframeEffect(menuIcon, [
        //     { scale: '1' },
        //     { scale: '1 0' }
        // ], { duration: 150, endDelay: 150, easing: 'ease-out', fill: 'both' }), document.timeline)
        // const closeIconAnimation = new Animation(new KeyframeEffect(closeIcon, [
        //     { rotate: '-45deg', scale: '0 1' },
        //     { rotate: '-45deg', scale: '1 1' }
        // ], { delay: 250, duration: 250, easing: 'ease-out', fill: 'both' }), document.timeline)
        // const closeIconAnimation = new Animation(new KeyframeEffect(closeIcon, [
        //     { opacity: 0 },
        //     { opacity: 1 },
        // ], { duration, easing: 'ease-out', fill: 'both' }), document.timeline)
        // const closeIconAnimation = new Animation(new KeyframeEffect(closeIcon, [
        //     { scale: '1 0' },
        //     { scale: '1' },
        //     { rotate: '0deg' },
        //     { rotate: '45deg', scale: '1' }
        // ], { delay: 150, duration: 150, easing: 'ease-out', fill: 'both' }), document.timeline)

        if (sidebarContext.openState.isOpen) {
            // menuIconAnimation.play()
            // closeIconAnimation.play()
            menuIcon.classList.add('hidden')
            closeIcon.classList.remove('hidden')
            return
        }

        // menuIconAnimation.reverse()
        // closeIconAnimation.reverse()
        menuIcon.classList.remove('hidden')
        closeIcon.classList.add('hidden')
    }, [sidebarContext])

    //
    //
    //

    const initializeMenuButtonReference = (element: HTMLAnchorElement | null) => {
        if (menuButtonElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Topbar: Initialize menu reference.')
        menuButtonElement = element
    }

    const initializeTopbarReference = (element: HTMLElement | null) => {
        if (topbarElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Topbar: Initialize topbar reference.')
        topbarElement = element
    }

    const toggleSidebar = useCallback(() => {
        if (sidebarContext == null) return
        if (isDebugEnabled) console.log('Topbar: Toggle sidebar.')

        // not updated immediately;
        sidebarContext.openState.setIsOpen(!sidebarContext.openState.isOpen)
    }, [sidebarContext])

    function focusNextElement() {
        if (menuButtonElement == null) return
        if (topbarElement == null) return
        const focusedElement = document.activeElement as HTMLAnchorElement | null
        if (focusedElement == null) return

        const focusableElements = [menuButtonElement, ...Array.from(topbarElement.querySelectorAll<HTMLAnchorElement>('a[tabindex="1000"]'))]
        const currentIndex = focusableElements.indexOf(focusedElement)
        const nextIndex = (currentIndex + 1) % focusableElements.length
        const nextElement = focusableElements[nextIndex]

        if (nextElement == null) return
        if (nextElement === menuButtonElement) return
        nextElement.focus()
    }

    function focusPreviousElement() {
        if (menuButtonElement == null) return
        if (topbarElement == null) return
        const focusedElement = document.activeElement as HTMLElement | null
        if (focusedElement == null) return

        if (focusedElement === menuButtonElement) return
        const focusableElements = [menuButtonElement, ...Array.from(topbarElement.querySelectorAll<HTMLElement>('a[tabindex="1000"]'))]
        const currentIndex = focusableElements.indexOf(focusedElement)
        const previousIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length

        const previousElement = focusableElements[previousIndex]
        if (previousElement == null) return
        previousElement.focus()
    }

    const handleKeyInputs = useCallback((event: KeyboardEvent) => {
        if (sidebarContext == null) return
        if (mainElement == null) return
        if (menuButtonElement == null) return
        if (sidebarElement == null) return

        //TODO; up + down for switching between main and topbar;

        // doesn't even work; but it's not that great anyway; you can tab forward; so
        // you should be able to tab backwards;
        // if (event.shiftKey && event.key === 'Tab') {
        //     event.preventDefault()
        //     event.stopPropagation()
        //     mainElement.focus()
        //     return
        // }

        if (document.activeElement === menuButtonElement) {
            if (event.key === 'Enter') {
                event.preventDefault()
                event.stopPropagation()
                toggleSidebar()
                triggerFlashEffect(event)
                return
            }

            // ignore ArrowRight because other icons are displayed to the right;
            // but for consistency it would be nice; hmmm...;
            if (event.key === 'ArrowDown') {
                if (sidebarContext.openState.isOpen) {
                    event.preventDefault()
                    event.stopPropagation()
                    const firstElement = sidebarElement.querySelector<HTMLAnchorElement>('a')
                    if (firstElement == null) return
                    firstElement.focus()
                    return
                }

                event.preventDefault()
                event.stopPropagation()
                toggleSidebar()
                triggerFlashEffect(event)
                return
            }

            if ((event.key === 'ArrowLeft' || event.key === 'ArrowUp') && sidebarContext.openState.isOpen) {
                event.preventDefault()
                event.stopPropagation()
                toggleSidebar()
                triggerFlashEffect(event)
                return
            }
        }

        // if (event.key === 'ArrowUp' && sidebarContext.openState.isOpen) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault()
            event.stopPropagation()
            focusPreviousElement()
            return
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault()
            event.stopPropagation()
            focusNextElement()
            return
        }
    }, [sidebarContext, toggleSidebar])

    //
    //
    //

    return (<>
        <nav ref={initializeTopbarReference} className="mobile-topbar">
            <div className="grid grid-topbar fg-items-center-main fg-space-between" onKeyUp={handleKeyInputs}>
                <div>
                    <Link className="menu-button inline" ref={initializeMenuButtonReference} onPointerUp={toggleSidebar} to="#" tabIndex={2}>
                        <i className="icon-medium material-icons">menu</i>
                        <i className="icon-medium material-icons hidden">close</i>
                    </Link>
                    <Link className="inline" to="/" tabIndex={1000}>
                        <i className="material-icons icon-medium">home</i>
                    </Link>
                </div>
            </div>
        </nav>
    </>)
}

export default MobileTopbarComponent
export { menuButtonElement }
export { topbarElement }