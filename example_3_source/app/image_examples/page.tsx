'use client'

import { useDrag } from '@use-gesture/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { useClick } from '../../hooks/gestures'
import { focusableElementSelectors, initialDelay, mainIndexGroup, maximumDelay, repeatDelay } from '../../constants/parameters'
import { useGlobalStore } from '../../hooks/stores'
import { clearKeyDownTimeout, focusNextElement, focusPreviousElement, repeatKeyDownInput, stopKeyDownInput } from '../../constants/functions'
import { KeyboardEventState, NullableDivElement, NullableEventTarget, NullableHTMLElement, NullableImageElement } from '../../constants/types'
import { create } from 'zustand'
import { useIndexGroupContainer, useIndexGroupEffect, useIndexGroupItem } from '../../hooks/indexGroup'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'

//
//
//

const useKeyboardEventStore = create<KeyboardEventState>((set) => ({
    event: undefined,
    setEvent: (event) => set(() => ({ event })),
}))

//
// main
//

export default function Page() {
    //
    // parameters and variables
    //

    const { layoutState, sidenavState } = useGlobalStore()
    const keyboardEventState = useKeyboardEventStore()

    const [imageRowElement, setImageRowElement] = useState<HTMLDivElement | null>(null)
    const [overlayElement, setOverlayElement] = useState<HTMLDivElement | null>(null)

    const imageRowFirstImage = useRef<HTMLImageElement | null>(null)
    const overlayImageRef = useRef<NullableImageElement>(null)
    const [pageElement, setPageElement] = useState<NullableDivElement>(null)
    const previouslyFocusedElementRef = useRef<NullableHTMLElement>(null)

    const imageRowIndexGroup = 'main-imageRow'
    const overlayIndexGroup = 'main-overlay'
    const queryString = 'img[tabIndex="0"]'

    // it seems like moving information from inside to outside is possible but from 
    // outside to inside is not via useRef; in that case I need a store (to update 
    // the event for example);
    const keyDownTimeoutRef = useRef<NodeJS.Timeout>()

    const dragAttributes: ReactDOMAttributes = useDrag(({ delta: [dx,], event }) => {
        if (imageRowElement == null) return
        event.preventDefault()
        imageRowElement.scrollBy({ left: -dx })
    }, { eventOptions: { capture: true }, enabled: !sidenavState.isOpen })()

    //
    // functions
    //

    function closeOverlay(): void {
        if (overlayElement == null) return
        const overlayImageElement = overlayElement.querySelector('img')
        if (overlayImageElement == null) return

        overlayImageElement.src = './icons/logo192.png'
        overlayImageElement.alt = ''
        overlayImageElement.width = 0
        overlayImageElement.height = 0
        overlayElement.removeAttribute('open')
    }

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
        overlayElement.setAttribute('open', '')
        overlayImageRef.current?.focus()
    }

    function handleKeyDown_ImageRow(event: React.KeyboardEvent): void {
        if (keyDownTimeoutRef.current != null) {
            keyboardEventState.setEvent(event)
            event.preventDefault()
            event.stopPropagation()
            return
        }

        function handleInput(isFirstKeyDown?: boolean): void {
            const event = useKeyboardEventStore.getState().event
            if (event == null) return

            if (layoutState.indexGroup === mainIndexGroup) {
                if (event.key === 'Enter') {
                    event.preventDefault()
                    event.stopPropagation()
                    imageRowFirstImage.current?.focus()
                    keyDownTimeoutRef.current = stopKeyDownInput()
                    return
                }
                return
            }

            if (layoutState.indexGroup === imageRowIndexGroup) {
                if (event.key === 'Escape') {
                    event.preventDefault()
                    event.stopPropagation()
                    imageRowElement?.focus()
                    keyDownTimeoutRef.current = stopKeyDownInput()
                    return
                }

                if (event.key === 'ArrowRight') {
                    event.preventDefault()
                    event.stopPropagation()
                    focusNextElement(imageRowElement, queryString)
                    keyDownTimeoutRef.current = repeatKeyDownInput(handleInput, isFirstKeyDown ? initialDelay : repeatDelay)
                    return
                }

                if (event.key === 'ArrowLeft') {
                    event.preventDefault()
                    event.stopPropagation()
                    focusPreviousElement(imageRowElement, queryString)
                    keyDownTimeoutRef.current = repeatKeyDownInput(handleInput, isFirstKeyDown ? initialDelay : repeatDelay)
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

        keyboardEventState.setEvent(event)
        handleInput(true)
    }

    function handleKeyDown_Overlay(event: React.KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            closeOverlay();
            (event.currentTarget as NullableHTMLElement)?.blur()

            if (!(previouslyFocusedElementRef.current instanceof HTMLBodyElement)) {
                previouslyFocusedElementRef.current?.focus()
            }
            return
        }
    }

    function handleKeyDown_SingleImage(event: React.KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            openOverlay(event)
            return
        }
    }

    //
    // effects
    //

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
                    // onBlurCapture={() => layoutState.setIndexGroup(mainIndexGroup)}
                    // onFocusCapture={() => layoutState.setIndexGroup(overlayIndexGroup)}
                    onKeyDown={handleKeyDown_Overlay}
                    ref={overlayImageRef}
                    src="./icons/logo192.png"
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
                {...dragAttributes}
                onKeyDownCapture={undefined}
                onKeyUpCapture={undefined}

                {...useIndexGroupItem(mainIndexGroup)}
                onBlur={clearKeyDownTimeout(keyboardEventState, keyDownTimeoutRef)}
                onKeyDown={handleKeyDown_ImageRow}
                onKeyUp={clearKeyDownTimeout(keyboardEventState, keyDownTimeoutRef)}
                ref={setImageRowElement}
            >
                <div
                    // onFocusCapture() interferes with useIndexGroupItem();
                    {...useIndexGroupContainer(imageRowIndexGroup)}
                    className="flex w-full border items-center overflow-x-hidden touch-none"
                >
                    <Image
                        {...useClick(openOverlay)}
                        alt="placeholder"
                        className="p-1 mx-auto text-center"
                        height={250}
                        ref={imageRowFirstImage}
                        onKeyDown={handleKeyDown_SingleImage}
                        src="./images/sunset-3008779_1280.jpg"
                        // tabIndex={layoutState.indexGroup === imageRowIndexGroup ? 0 : -1}
                        width={250}
                    ></Image>
                    <Image
                        {...useClick(openOverlay)}
                        alt="placeholder"
                        className="p-1 mx-auto text-center"
                        height={250}
                        onKeyDown={handleKeyDown_SingleImage}
                        src="./images/forest-5855196_1280.jpg"
                        // tabIndex={layoutState.indexGroup === imageRowIndexGroup ? 0 : -1}
                        width={250}
                    ></Image>
                    <Image
                        {...useClick(openOverlay)}
                        alt="placeholder"
                        className="p-1 mx-auto text-center"
                        height={250}
                        onKeyDown={handleKeyDown_SingleImage}
                        src="./images/cute-7270285.svg"
                        // tabIndex={layoutState.indexGroup === imageRowIndexGroup ? 0 : -1}
                        width={250}
                    ></Image>
                    <Image
                        {...useClick(openOverlay)}
                        alt="placeholder"
                        className="p-1 mx-auto text-center touch-none"
                        height={250}
                        onKeyDown={handleKeyDown_SingleImage}
                        src="./images/floral-background-6622475_1280.png"
                        // tabIndex={layoutState.indexGroup === imageRowIndexGroup ? 0 : -1}
                        width={250}
                    ></Image>
                </div>
            </div>
        </div>
    )
}
