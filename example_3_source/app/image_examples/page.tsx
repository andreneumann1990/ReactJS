'use client'

import { useDrag } from '@use-gesture/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { useClick } from '../../hooks/gesture_hooks'
import { mainIndexGroup } from '../../constants/general_constants'
import { useGlobalStore } from '../../hooks/stores'

function Page() {
    //
    // parameters and variables
    //

    const { layoutState, sidenavState } = useGlobalStore()
    const [imageRowElement, setImageRowElement] = useState<HTMLDivElement | null>(null)
    const [overlayElement, setOverlayElement] = useState<HTMLDivElement | null>(null)
    const imageRowFirstImage = useRef<HTMLImageElement | null>(null)
    const overlayImageRef = useRef<HTMLImageElement | null>(null)
    const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)

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

    function openOverlay({ target }: { target: EventTarget | null }): void {
        if (overlayElement == null) return
        const imageElement = target as HTMLImageElement | null
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
    }, { eventOptions: { capture: true }, enabled: !sidenavState.isOpen })

    function handleKeyDownInput_ImageRow(event: React.KeyboardEvent) {
        if (layoutState.indexGroup !== mainIndexGroup) return

        //TODO
        console.log('hello')
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            layoutState.setIndexGroup('main-imageRow')
            imageRowFirstImage.current?.focus()
            return
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault()
            event.stopPropagation()
            //TODO
        }
    }

    function handleKeyDownInput_Overlay(event: React.KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            closeOverlay()
            const currentTarget = event.currentTarget as HTMLElement | null
            currentTarget?.blur()
            previouslyFocusedElementRef.current?.focus()
            return
        }
    }

    function handleKeyDownInput_SingleImage(event: React.KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            openOverlay(event)
            //TODO; check if it works;
            previouslyFocusedElementRef.current = event.currentTarget as HTMLElement
            overlayImageRef.current?.focus()
            return
        }
    }

    //
    //
    //

    return (<>
        {/* overlay; fullscreen picture view; */}
        <div
            className="fixed hidden open:block h-[calc(100vh-var(--height-topnav))] w-full p-10 top-[--height-topnav] left-0 overflow-y-auto z-10 bg-secondary motion-safe:animate-fade-in"
            onBlur={() => layoutState.restorePreviousIndexGroup()}
            onFocus={() => layoutState.setIndexGroup('main-overlay')}
            onKeyDown={handleKeyDownInput_Overlay}
            ref={setOverlayElement}
        >
            <button
                className="absolute right-12 top-12 bg-primary"
                onClick={closeOverlay}
                //TODO
                tabIndex={-1}
            // tabIndex={layoutState.activeTabIndexGroup === tabIndexGroupMain ? undefined : -1}
            >
                <i className="p-1 icon-medium material-icons">close</i>
            </button>
            <Image
                alt=""
                className="p-1 mx-auto"
                height={0}
                ref={overlayImageRef}
                src="/icons/logo192.png"
                tabIndex={-1}
                width={0}
            ></Image>
        </div>

        {/* header; */}
        <h1 className="my-3 text-3xl font-bold">Image Examples</h1>
        <ul className="pl-5">
            <li>images are taken from&nbsp;
                <Link
                    className="text-blue-300"
                    href="https://pixabay.com/collections/example_2-21740818/"
                    onFocusCapture={() => layoutState.setIndexGroup(mainIndexGroup)}
                    tabIndex={layoutState.indexGroup === mainIndexGroup ? undefined : -1}
                >https://pixabay.com/collections/example_2-21740818/</Link>
            </li>
        </ul >

        {/* single image; */}
        <h2 className="my-1 text-xl font-bold" > single image:</h2>
        <ul className="pl-5">
            <li>click on image for full-scale image</li>
        </ul>
        <Image
            {...useClick(openOverlay)}
            alt="placeholder"
            className="p-1 mx-auto text-center"
            priority={true}
            height={250}
            onKeyDown={handleKeyDownInput_SingleImage}
            src="/images/woman-3077180_1280.jpg"
            tabIndex={layoutState.indexGroup === mainIndexGroup ? 0 : -1}
            width={250}
        ></Image >

        {/* image row; */}
        < h2 className="my-1 text-xl font-bold" > image row:</h2 >
        <ul className="pl-5">
            <li>click or drag</li>
        </ul>
        <div
            {...onDrag()}
            className="flex w-full border items-center overflow-x-hidden touch-none"
            onKeyDown={handleKeyDownInput_ImageRow}
            ref={setImageRowElement}
            tabIndex={layoutState.indexGroup === mainIndexGroup ? 0 : -1}
        >
            <Image
                {...useClick(openOverlay)}
                alt="placeholder"
                className="p-1 mx-auto text-center"
                height={250}
                ref={imageRowFirstImage}
                src="/images/sunset-3008779_1280.jpg"
                tabIndex={layoutState.indexGroup === 'main-imageRow' ? 0 : -1}
                width={250}
            ></Image>
            <Image
                {...useClick(openOverlay)}
                alt="placeholder"
                className="p-1 mx-auto text-center"
                height={250}
                src="/images/forest-5855196_1280.jpg"
                tabIndex={layoutState.indexGroup === 'main-imageRow' ? 0 : -1}
                width={250}
            ></Image>
            <Image
                {...useClick(openOverlay)}
                alt="placeholder"
                className="p-1 mx-auto text-center"
                height={250}
                src="/images/cute-7270285.svg"
                tabIndex={layoutState.indexGroup === 'main-imageRow' ? 0 : -1}
                width={250}
            ></Image>
            <Image
                {...useClick(openOverlay)}
                alt="placeholder"
                className="p-1 mx-auto text-center touch-none"
                height={250}
                src="/images/floral-background-6622475_1280.png"
                tabIndex={layoutState.indexGroup === 'main-imageRow' ? 0 : -1}
                width={250}
            ></Image>
        </div>
    </>)
}

export default Page