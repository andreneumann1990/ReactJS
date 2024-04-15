'use client'

import { useDrag } from '@use-gesture/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useSidenavStore } from '../../components/layout/Sidenav'
import { useClick } from '../../hooks/gesture_hooks'
import { useNavigateAndHighlightElement } from '../../hooks/navigation_hooks'

function Page() {
    useNavigateAndHighlightElement('ImageExamples')

    //
    // parameters and variables
    //

    const isSidenavOpen = useSidenavStore(state => state.isOpen)
    const [imageRowElement, setImageRowElement] = useState<HTMLDivElement | null>(null)
    const [overlayElement, setOverlayElement] = useState<HTMLDivElement | null>(null)

    //
    // functions
    //

    function closeOverlay(): void {
        if (overlayElement == null) return
        const overlayImageElement = overlayElement.querySelector('img')
        if (overlayImageElement == null) return

        overlayImageElement.src = '/icons/logo192.png'
        overlayImageElement.alt = ''
        overlayImageElement.width = 0
        overlayImageElement.height = 0
        overlayElement.removeAttribute('open')
    }

    function openOverlay(event: PointerEvent): void {
        if (overlayElement == null) return
        const imageElement = event.target as HTMLImageElement | null
        if (imageElement == null) return
        const overlayImageElement = overlayElement.querySelector('img')
        if (overlayImageElement == null) return

        overlayImageElement.src = imageElement.src
        overlayImageElement.alt = imageElement.alt
        overlayImageElement.width = imageElement.naturalWidth
        overlayImageElement.height = imageElement.naturalHeight
        overlayElement.setAttribute('open', '')
    }

    const onDrag = useDrag(({ delta: [dx,], event }) => {
        if (imageRowElement == null) return
        event.preventDefault()
        imageRowElement.scrollBy({ left: -dx })
    }, { eventOptions: { capture: true }, enabled: !isSidenavOpen })

    //
    //
    //

    return (<>
        {/* overlay; fullscreen picture view; */}
        <div className="fixed hidden open:block h-[calc(100vh-var(--height-topnav))] w-full p-10 top-[--height-topnav] left-0 overflow-y-auto z-10 bg-secondary motion-safe:animate-fade-in" ref={setOverlayElement}>
            <button className="absolute right-12 top-12 bg-primary" onClick={closeOverlay}>
                <i className="p-1 icon-medium material-icons">close</i>
            </button>
            <Image className="p-1 mx-auto" src="/icons/logo192.png" alt="" width={0} height={0}></Image>
        </div>

        {/* header; */}
        <h1 className="my-3 text-3xl font-bold">Image Examples</h1>
        <ul className="pl-5">
            <li>images are taken from
                <Link className="inline text-blue-300" href="https://pixabay.com/collections/example_2-21740818/"> https://pixabay.com/collections/example_2-21740818/</Link>
            </li>
        </ul>

        {/* single image; */}
        <h2 className="my-1 text-xl font-bold">single image:</h2>
        <ul className="pl-5">
            <li>click on image for full-scale image</li>
        </ul>
        <Image className="p-1 mx-auto text-center" src="/images/woman-3077180_1280.jpg" alt="placeholder" width={250} height={250} {...useClick(openOverlay)} priority={true}></Image >

        {/* image row; */}
        < h2 className="my-1 text-xl font-bold" > image row:</h2 >
        <ul className="pl-5">
            <li>click or drag</li>
        </ul>
        <div ref={setImageRowElement} className="flex w-full border items-center overflow-x-hidden touch-none" {...onDrag()}>
            <Image className="p-1 mx-auto text-center" src="/images/sunset-3008779_1280.jpg" alt="placeholder" width={250} height={250} {...useClick(openOverlay)}></Image>
            <Image className="p-1 mx-auto text-center" src="/images/forest-5855196_1280.jpg" alt="placeholder" width={250} height={250} {...useClick(openOverlay)}></Image>
            <Image className="p-1 mx-auto text-center" src="/images/cute-7270285.svg" alt="placeholder" width={250} height={250} {...useClick(openOverlay)}></Image>
            <Image className="p-1 mx-auto text-center touch-none" src="/images/floral-background-6622475_1280.png" alt="placeholder" width={250} height={250} {...useClick(openOverlay)} ></Image>
        </div>
    </>)
}

export default Page