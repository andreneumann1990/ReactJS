import { useContext, useEffect } from "react"
import MobileDropdown1Component from "./Dropdown1"
import { SidebarContext, TopbarContext } from "../Layout"
import MobileDropdown2Component from "./Dropdown2"
import Hammer, { DIRECTION_HORIZONTAL } from "hammerjs"

function MobileSidebarComponent() {
    const sidebarContext = useContext(SidebarContext)
    const topbarContext = useContext(TopbarContext)

    const applySidebarState = (sidebar: HTMLElement | undefined, isOpen: boolean) => {
        if (sidebar == null) return
        console.log("update sidebar state")
        // sidebar.style.transition = "transform 0.5s ease"
        sidebar.style.transition = "transform 0.5s ease-out 0s"

        if (isOpen) {
            console.log("open")
            // sidebar.classList.remove("hidden")
            sidebar.style.transform = 'translateX(' + sidebar.offsetWidth + 'px)'
            return
        }

        console.log("closed")
        sidebar.style.transform = "translateX(0)"
    }

    // apply current sidebar state;
    useEffect(() => {
        // "== null" checks for null and undefined;
        if (sidebarContext == null) return
        const sidebar = sidebarContext.sidebarState?.sidebar
        applySidebarState(sidebar, sidebarContext.openState.isOpen)
        // const classList = sidebarContext.sidebarState?.sidebar?.classList
        // if (classList == null) return


        // const width = -Math.min(500, visualViewport?.width ?? 500) - 50
        // sidebar.style.transform = 'translateX(' + width.toString() + 'px)'
        // sidebar.classList.add("hidden")
    }, [sidebarContext])

    // close side when clicking outside;
    useEffect(() => {
        if (sidebarContext == null) return
        if (topbarContext == null) return

        const handleClickOutside = (event: MouseEvent) => {
            if (!sidebarContext.openState.isOpen) return
            const sidebar = sidebarContext.sidebarState.sidebar
            if (sidebar == null) return
            // console.log(event.target)
            // console.log(sidebar.contains(event.target as Node))
            if (sidebar.contains(event.target as Node)) return

            // const topbar = topbarContext?.topbarState.topbar
            // if (topbar == null) return
            // if (topbar.contains(event.target as Node)) return

            const button = topbarContext?.buttonState.button
            if (button == null) return
            if (button.contains(event.target as Node)) return

            console.log("close sidebar because clicked outside")
            sidebarContext.openState.setIsOpen(false)
        }

        document.addEventListener('click', (event) => handleClickOutside(event))
        return () => {
            document.removeEventListener('click', (event) => handleClickOutside(event))
        }
    }, [sidebarContext, topbarContext])

    // close sidebar when swiping left;
    //     useEffect(() => {
    //         let touchStartX: number | null = null
    //         let touchEndX: number | null = null
    // 
    //         const handleTouchStart = (event: TouchEvent) => {
    //             console.log("1")
    //             touchStartX = event.touches[0].clientX
    //         }
    // 
    //         const handleTouchMove = (event: TouchEvent) => {
    //             touchEndX = event.touches[0].clientX
    //             // event.touches[0].
    //         }
    // 
    //         const handleTouchEnd = () => {
    //             if (touchStartX == null) {
    //                 touchEndX = null
    //                 return
    //             }
    // 
    //             if (touchEndX == null) {
    //                 touchStartX = null
    //                 return
    //             }
    // 
    //             const deltaX = touchEndX - touchStartX
    //             if (deltaX < -50) {
    //                 // swipe left to close the sidebar;
    //                 console.log("swipe left with deltaX " + deltaX)
    //                 sidebarContext?.openState.setIsOpen(false)
    //             }
    //         }
    // 
    //         document.addEventListener('touchstart', (event) => handleTouchStart(event))
    //         document.addEventListener('touchmove', (event) => handleTouchMove(event))
    //         document.addEventListener('touchend', () => handleTouchEnd())
    // 
    //         return () => {
    //             document.removeEventListener('touchstart', (event) => handleTouchStart(event))
    //             document.removeEventListener('touchmove', (event) => handleTouchMove(event))
    //             document.removeEventListener('touchend', () => handleTouchEnd())
    //         }
    //     }, [sidebarContext])

    //     close sidebar when swiping left
    //     useEffect(() => {
    //         // let body = document.querySelector('body')
    //         // if (body == null) return
    //         if (sidebarContext == null) return
    //         const sidebar = sidebarContext.sidebarState.sidebar
    //         if (sidebar == null) return
    // 
    //         let manager = new Hammer.Manager(sidebar)
    //         // let manager = new Hammer.Manager(body)
    //         let swipe = new Hammer.Swipe()
    //         manager.add(swipe)
    //         // let deltaX = 0
    // 
    //         const handleSwipeLeft = (event: HammerInput) => {
    //             // deltaX = deltaX + event.deltaX
    //             // let direction = event.offsetDirection
    // 
    //             // if (direction === DIRECTION_LEFT) {
    //             // console.log("deltaX" + deltaX) //TODO
    //             sidebarContext?.openState.setIsOpen(false)
    //             // }
    //         }
    // 
    //         manager.on('swipeleft', (event) => { handleSwipeLeft(event) })
    //         return () => { manager.destroy() }
    //     }, [sidebarContext])

    // move sidebar when panning left
    useEffect(() => {
        if (sidebarContext == null) return
        const sidebar = sidebarContext.sidebarState.sidebar
        console.log("aaa")
        if (sidebar == null) return
        console.log("bbb")
        var manager = new Hammer.Manager(sidebar)
        manager.add(new Hammer.Pan({ direction: DIRECTION_HORIZONTAL }))
        // const a: RecognizerOptions

        var startX = 0
        var currentX = 0

        manager.on('panstart', function (event) {
            // console.log("111")
            startX = 0
            currentX = 0
            // startX = event.
            // startX = sidebar.offsetLeft
        })

        manager.on('panmove', function (event) {
            // console.log("222")
            var deltaX = event.deltaX
            currentX = startX + deltaX
            if (currentX < 0) {
                sidebar.style.transition = "transform 0s ease"
                // console.log("offsetWidth " + sidebar.offsetWidth)
                // console.log("currentX " + currentX)
                const currentOffset = sidebar.offsetWidth + currentX
                // console.log("currentX " + currentOffset)
                sidebar.style.transform = 'translateX(' + currentOffset + 'px)'
            }
        })

        manager.on('panend', function (event) {
            // const width = -Math.min(500, visualViewport?.width ?? 500)
            // sidebar.style.transition = "transform 0.5s ease-out 0s;"
            // console.log("panend ")
            // console.log("width " + sidebar.clientWidth)
            // console.log("width " + sidebar.offsetWidth)
            // console.log("currentX " + currentX)
            // console.log("currentX " + (-0.5 * sidebar.offsetWidth))

            if (currentX < -0.5 * sidebar.offsetWidth) {
                // console.log("1")
                // sidebar.style.transform = 'translateX(' + width.toString() + 'px)'
                // the apply effects seems to run first and might leave these not reset the changes
                // made to transition;
                sidebarContext.openState.setIsOpen(false)
                applySidebarState(sidebar, false)
                // sidebar.style.transform = 'translateX(0)'

                // sidebar.style.transform = 'translateX(-200px)'
                // const temp = -Math.min(500, visualViewport?.width ?? 500) - 50
                return
            }

            // console.log("2")
            sidebarContext.openState.setIsOpen(true)
            applySidebarState(sidebar, true)
            // sidebar.style.transform = 'translateX(0)'
        })

        //TODO
        // manager.off("panstart")
        // manager.off("panmove")
        // manager.off("panend")
    }, [sidebarContext])

    //
    //
    //

    const initializeSidebar = (sidebar: HTMLElement | null) => {
        if (sidebar == null) return
        sidebarContext?.sidebarState.setSidebar(sidebar)
    }

    return (<nav ref={(element) => initializeSidebar(element)} className="mobile-sidebar">
        <a className="block" href="/home" target="_self">Link 1</a>
        <a className="block" href="/home">Link 2</a>
        <MobileDropdown1Component />
        <MobileDropdown2Component />
    </nav>)
}

export default MobileSidebarComponent