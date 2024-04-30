'use client'

import { useDrag } from '@use-gesture/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useClick } from '../../hooks/gestures'
import { focusableElementSelectors, initialDelay, mainIndexGroup, maximumDelay, repeatDelay } from '../../constants/parameters'
import { useGlobalStore, useLayoutStore } from '../../hooks/stores'
import { focusNextElement, focusPreviousElement, scrollIntoView, } from '../../constants/functions'
import { NullableDivElement, NullableEventTarget, NullableHTMLElement, NullableImageElement } from '../../constants/types'
import { useIndexGroupContainer, useIndexGroupEffect, useIndexGroupItem } from '../../hooks/indexGroup'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'

//
// main
//

export default function Page() {
    //
    // parameters and variables
    //

    const { sidenavState } = useGlobalStore()
    const indexGroup = useLayoutStore(state => state.indexGroup)

    const [imageRowElement, setImageRowElement] = useState<HTMLDivElement | null>(null)
    const [overlayElement, setOverlayElement] = useState<HTMLDivElement | null>(null)

    const imageRowFirstImage = useRef<HTMLImageElement | null>(null)
    const overlayImageRef = useRef<NullableImageElement>(null)
    const [pageElement, setPageElement] = useState<NullableDivElement>(null)
    const previouslyFocusedElementRef = useRef<NullableHTMLElement>(null)

    const imageRowIndexGroup = 'main-imageRow'
    const overlayIndexGroup = 'main-overlay'
    const queryString = 'img[tabIndex="0"]'

    const dragAttributes: ReactDOMAttributes = useDrag(({ delta: [deltaX], event }) => {
        // don't use event.stopPropgation(); otherwise, it prevents click recognition as well;
        event.preventDefault()
        const currentElement = event.currentTarget as HTMLElement

        // the scrolling can feel weird when using the device toolbar in Chrome DevTools; 
        // adding devicePixelRatio makes it worse since it sets it to 2 for example even 
        // though it might be 1 for the physical screen; it doesn't work for my smartphone;
        // maybe ChatGPT is wrong about using devicePixelRatio?;
        // currentElement.scrollBy({ left: -deltaX / window.devicePixelRatio })
        currentElement.scrollBy({ left: -deltaX })
    }, { eventOptions: { capture: true }, enabled: !sidenavState.isOpen })()

    //
    // functions
    //

    const closeOverlay = useCallback(() => {
        if (overlayElement == null) return
        if (overlayElement.getAttribute('open') == null) return
        const overlayImageElement = overlayImageRef.current
        if (overlayImageElement == null) return

        overlayImageElement.src = './icons/logo192.png'
        overlayImageElement.alt = ''
        overlayImageElement.width = 0
        overlayImageElement.height = 0
        overlayElement.removeAttribute('open')

        if (!(previouslyFocusedElementRef.current instanceof HTMLBodyElement)) {
            previouslyFocusedElementRef.current?.focus()
        }
    }, [overlayElement])

    function openOverlay(event: { target: NullableEventTarget, currentTarget: NullableEventTarget }): void {
        if (overlayElement == null) return

        const sourceImageElement = event.target as NullableImageElement
        if (sourceImageElement == null) return
        const destinationImageElement = overlayImageRef.current
        if (destinationImageElement == null) return


        destinationImageElement.src = sourceImageElement.src
        destinationImageElement.alt = sourceImageElement.alt
        destinationImageElement.width = sourceImageElement.naturalWidth
        destinationImageElement.height = sourceImageElement.naturalHeight

        // focus() does not work when the attribute open is not set yet;
        previouslyFocusedElementRef.current = event.currentTarget as HTMLElement
        scrollIntoView(previouslyFocusedElementRef.current)
        overlayElement.setAttribute('open', '')
        overlayImageRef.current?.focus()
    }

    function handleKeyDown_ImageRow(event: React.KeyboardEvent): void {
        const layoutState = useLayoutStore.getState()
        if (layoutState.keyDownCooldown > 0) return

        if (layoutState.indexGroup === mainIndexGroup) {
            if (event.key === 'Enter') {
                event.preventDefault()
                event.stopPropagation()
                imageRowFirstImage.current?.focus()
                layoutState.setKeyDownCooldown(maximumDelay)
                return
            }
            return
        }

        if (layoutState.indexGroup === imageRowIndexGroup) {
            if (event.key === 'Escape') {
                event.preventDefault()
                event.stopPropagation()
                imageRowElement?.focus()
                layoutState.setKeyDownCooldown(maximumDelay)
                return
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault()
                event.stopPropagation()
                focusNextElement(imageRowElement, queryString)
                layoutState.setKeyDownCooldown(layoutState.isFirstKeyDown ? initialDelay : repeatDelay)
                return
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                event.stopPropagation()
                focusPreviousElement(imageRowElement, queryString)
                layoutState.setKeyDownCooldown(layoutState.isFirstKeyDown ? initialDelay : repeatDelay)
                return
            }

            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault()
                event.stopPropagation()
                return
            }
            return
        }
    }

    function handleKeyDown_Overlay(event: React.KeyboardEvent) {
        const layoutState = useLayoutStore.getState()
        if (layoutState.keyDownCooldown > 0) return

        if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation();

            (event.currentTarget as NullableHTMLElement)?.blur()
            closeOverlay()
            layoutState.setKeyDownCooldown(maximumDelay)
            return
        }
    }

    function handleKeyDown_SingleImage(event: React.KeyboardEvent): void {
        const layoutState = useLayoutStore.getState()
        if (layoutState.keyDownCooldown > 0) return

        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            openOverlay(event)
            layoutState.setKeyDownCooldown(maximumDelay)
            return
        }
    }

    //
    // effects
    //

    // close overlay when indexGroup changes back;
    useEffect(() => {
        if (indexGroup !== overlayIndexGroup) closeOverlay()
    }, [closeOverlay, indexGroup])

    useIndexGroupEffect(pageElement, focusableElementSelectors + ', img')

    //
    //
    //

    return (
        <div
            {...useIndexGroupContainer(mainIndexGroup)}
            ref={setPageElement}
        >
            {/* overlay; fullscreen picture view; */}
            <div
                // {...useClick(handleClick)}
                {...useIndexGroupContainer(overlayIndexGroup)}
                className="fixed hidden open:block h-[calc(100vh-var(--height-topnav))] w-full p-10 top-[--height-topnav] left-0 overflow-y-auto z-10 bg-secondary motion-safe:animate-fade-in"
                ref={setOverlayElement}
            >
                <button
                    className="absolute right-12 top-12 bg-primary"
                    data-no-tab-index-override
                    onClick={closeOverlay}
                    tabIndex={-1}
                >
                    <i className="p-1 icon-medium material-icons">close</i>
                </button>
                <Image
                    alt=""
                    className="p-1 mx-auto"
                    height={0}
                    onKeyDown={handleKeyDown_Overlay}
                    ref={(element) => { overlayImageRef.current = element }}
                    src="./icons/logo192.png"
                    width={0}

                // `undefined is not assignable to ...`; why this error??; it does not need to; 
                // the assignment is the other way around, no?;
                // ref={overlayImageRef} 
                ></Image>
            </div>

            {/* header; */}
            <h1 className="my-3 text-3xl font-bold">Image Examples</h1>
            <ul className="pl-5">
                <li>images are taken from&nbsp;
                    <Link
                        className="text-blue-300"
                        href="https://pixabay.com/collections/example_2-21740818/"
                    // onFocusCapture={() => layoutState.setIndexGroup(mainIndexGroup)}
                    // tabIndex={layoutState.indexGroup === mainIndexGroup ? undefined : -1}
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
                onKeyDown={handleKeyDown_SingleImage}
                src="./images/woman-3077180_1280.jpg"
                // tabIndex={layoutState.indexGroup === mainIndexGroup ? 0 : -1}
                width={250}
            ></Image >

            {/* image row; */}
            < h2 className="my-1 text-xl font-bold" > image row:</h2 >
            <ul className="pl-5">
                <li>click or drag</li>
            </ul>
            <div
                {...useIndexGroupItem(mainIndexGroup)}
                onKeyDown={handleKeyDown_ImageRow}
                ref={setImageRowElement}
            >
                <div
                    {...dragAttributes}
                    onKeyDownCapture={undefined}
                    onKeyUpCapture={undefined}

                    // onFocusCapture() interferes with useIndexGroupItem();
                    {...useIndexGroupContainer(imageRowIndexGroup)}
                    className="flex w-full border items-center overflow-x-hidden touch-pan-y"
                >
                    <Image
                        {...useClick(openOverlay)}
                        alt="placeholder"
                        className="p-1 mx-auto text-center"
                        height={250}
                        ref={imageRowFirstImage}
                        onKeyDown={handleKeyDown_SingleImage}
                        src="./images/sunset-3008779_1280.jpg"
                        width={250}
                    ></Image>
                    <Image
                        {...useClick(openOverlay)}
                        alt="placeholder"
                        className="p-1 mx-auto text-center"
                        height={250}
                        onKeyDown={handleKeyDown_SingleImage}
                        src="./images/forest-5855196_1280.jpg"
                        width={250}
                    ></Image>
                    <Image
                        {...useClick(openOverlay)}
                        alt="placeholder"
                        className="p-1 mx-auto text-center"
                        height={250}
                        onKeyDown={handleKeyDown_SingleImage}
                        src="./images/cute-7270285.svg"
                        width={250}
                    ></Image>
                    <Image
                        {...useClick(openOverlay)}
                        alt="placeholder"
                        className="p-1 mx-auto text-center touch-none"
                        height={250}
                        onKeyDown={handleKeyDown_SingleImage}
                        src="./images/floral-background-6622475_1280.png"
                        width={250}
                    ></Image>
                </div>
            </div>
        </div>
    )
}
