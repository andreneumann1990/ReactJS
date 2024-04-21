import React, { KeyboardEvent, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'
import { indexEntryTypesString, isDebugEnabled, mainIndexGroup } from '../../constants/general_constants'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { useGlobalStore, useMainStore } from '../../hooks/stores'
import { NullableBoolean } from '../../constants/types'
import { useSearchParams } from 'next/navigation'

export default Main
export { handleKeyDownInput as handleKeyDownInput_Main }

//TODO; focus child elements;
//TODO; uparrow for focus topnav;
//TODO; change keys; up down is for scrolling;

//
// paramters and variables
//

const queryString = 'a:not([tabindex="-1"]), button:not([tabindex="-1"]), div[tabindex="0"], input:not([tabindex="-1"]), img[tabindex="0"], summary:not([tabindex="-1"])'

//
// functions
//

function focusNextElement() {
    const mainElement = useMainStore.getState().element
    if (mainElement == null) return
    const focusedElement = document.activeElement as HTMLAnchorElement | null
    if (focusedElement == null) return

    const focusableElements = Array.from(mainElement.querySelectorAll<HTMLAnchorElement>(queryString))
    //TODO
    console.log(focusableElements)
    const nextIndex = Math.min(focusableElements.indexOf(focusedElement) + 1, focusableElements.length - 1)
    focusableElements[nextIndex]?.focus()
}

function focusPreviousElement() {
    const mainElement = useMainStore.getState().element
    if (mainElement == null) return
    let focusedElement = document.activeElement as HTMLElement | null
    if (focusedElement == null) return

    // previousIndex is -1 if the element is not found or null;
    const focusableElements = Array.from(mainElement.querySelectorAll<HTMLElement>(queryString))
    const previousIndex = Math.max(focusableElements.indexOf(focusedElement) - 1, 0)
    focusableElements[previousIndex]?.focus()
}

function handleKeyDownInput(event: KeyboardEvent): NullableBoolean {
    const { layoutState, mainState } = useGlobalStore.getState()
    if (mainState.element == null) return null
    if (!mainState.element.contains(document.activeElement)) return null

    if (document.activeElement === mainState.element) {
        if (event.key === 'Enter') {
            event.preventDefault()
            layoutState.setIndexGroup(mainIndexGroup)
            // focusPreviousElement()
            setTimeout(() => focusNextElement(), 1)
            return false
        }
        return null
    }

    //TODO
    if (document.activeElement?.tagName === 'SUMMARY') {
        if (event.key === 'ArrowRight') {
            event.preventDefault()
            event.stopPropagation()
            document.activeElement.parentElement?.setAttribute('open', '')
            return false
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault()
            event.stopPropagation()
            document.activeElement.parentElement?.removeAttribute('open')
            return false
        }
    }

    if (event.key === 'Escape') {
        event.preventDefault()
        layoutState.setIndexGroup(0)
        mainState.element?.focus()
        return false
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopPropagation()
        focusNextElement()
        return true
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()
        focusPreviousElement()
        return true
    }
    return null
}

//
// main
//

function Main({ children }: React.PropsWithChildren) {
    //
    // parameters and variables
    //

    // const focusAnchor = useRef<HTMLDivElement | null>(null)
    const { layoutState, mainState, searchState, sidenavState } = useGlobalStore()
    const { setIsActive } = mainState
    const searchParams = useSearchParams()

    // close sidenav by swipe / panning gesture;
    const dragAttributes: ReactDOMAttributes = useDrag<PointerEvent>(({ movement: [dx, dy], last }) => {
        // check if motion safe is checked; TODO;

        // `offset` does not reset when panning ends; `movement` does;
        const sidenavElement = sidenavState.element
        if (sidenavElement == null) return
        if (dx > -10) return
        if (Math.abs(dy) > Math.abs(dx)) return

        // pan move;
        if (!last) {
            sidenavElement.style.transition = 'transform 0s ease'
            const currentOffset = sidenavElement.offsetWidth + dx
            sidenavElement.style.transform = `translateX(${currentOffset}px)`
            return
        }

        // pan end;
        if (isDebugEnabled) console.log('Sidenav: Pan gesture has ended.')
        if (dx < -0.5 * sidenavElement.offsetWidth) {
            // isOpen is not updated immediately;
            // this is enough since the isOpen state is changed; hence, applySidenavState()
            // is called automatically;
            sidenavState.setIsOpen(false)
            return
        }

        // not needed; the isOpen state is not changed;
        // sidenavContext.openState.setIsOpen(true)
        // cannot call applySidenavState() for this since it depends on this function, i.e. enableTouchEvents();
        sidenavElement.style.transition = 'transform 0.5s ease-out 0s'
        sidenavElement.style.transform = `translateX(${sidenavElement.offsetWidth}px)`
    }, { eventOptions: { capture: true }, enabled: sidenavState.isOpen })()

    //
    // functions
    //

    function initializeMainReference(element: HTMLElement | null): void {
        if (mainState.element != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Main: Initialize main reference.')
        mainState.setElement(element)
    }

    //
    // effects
    //

    // update state;
    useEffect(() => {
        // if (mainState.isActive === (!sidenavState.isOpen && !searchState.isOpen)) return
        // mainState.setIsActive(!mainState.isActive)
        setIsActive(!sidenavState.isOpen && !searchState.isOpen)
    }, [searchState.isOpen, setIsActive, sidenavState.isOpen])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // [mainState.setIsActive, searchState.isOpen, sidenavState.isOpen])

    // synchronize state and attributes;
    useEffect(() => {
        if (mainState.element == null) return
        if (mainState.isActive) {
            delete mainState.element.dataset.inactive
            return
        }
        mainState.element.dataset.inactive = ''
    }, [mainState.element, mainState.isActive])

    // navigate to searched element;
    useEffect(() => {
        const innerText = searchParams.get('search')?.replaceAll(/[\n\r\t]/g, '')
        if (innerText == null) return

        const searchResultElementArray = Array.from(document.querySelectorAll(indexEntryTypesString)).reduce<HTMLElement[]>((accumulator, current) => {
            if (!(current instanceof HTMLElement)) return accumulator

            // might not work in every case; in some cases the innerText is empty or null 
            // for some reason; this seems to be happening inside <details> elements; inner
            // HTML can only be used as a substitute if no html tags are used inside;
            if (current.innerText.replaceAll(/[\n\r\t]/g, '') !== innerText && current.innerHTML.replaceAll(/[\n\r\t]/g, '') !== innerText) return accumulator

            accumulator.push(current)
            return accumulator
        }, [])

        if (searchResultElementArray.length < 1) {
            // TODO: got this when searching for the back-end link url; lol, I have to deploy first for the url to match; todo check if it works when deployed;
            if (isDebugEnabled) console.log(`Main: No element found for search params "${innerText}".`)
            return
        }

        if (isDebugEnabled) console.log('Main: Found element from search params.')
        const firstSearchResultElement = searchResultElementArray[0]
        firstSearchResultElement.focus()

        const detailsElement = firstSearchResultElement.closest('details')
        if (detailsElement != null) detailsElement.setAttribute('open', '')
        const highlightWordArray = searchParams.get('select')?.split(',')
        const selection = window.getSelection()

        function getTextNode(element: ChildNode): ChildNode {
            if (element.firstChild == null) return element
            return getTextNode(element.firstChild)
        }

        if (highlightWordArray != null && selection != null) {
            selection.removeAllRanges()
            const textElement = getTextNode(firstSearchResultElement)

            highlightWordArray.forEach((word: string) => {
                if (textElement == null) return
                if (textElement.textContent == null) return
                const startIndex = textElement.textContent.toLowerCase().indexOf(word.toLowerCase())
                if (startIndex === -1) return

                const range = document.createRange()
                if (selection.rangeCount < 1) {
                    range.setStart(textElement, startIndex)
                    range.setEnd(textElement, startIndex + word.length)
                    selection.addRange(range)
                    return
                }

                range.setEnd(textElement, startIndex + word.length)
                selection.extend(textElement, range.endOffset)
            })
        }
    }, [searchParams])

    //
    //
    //

    return (<>
        <main
            {...dragAttributes}
            className="h-[calc(100vh-var(--height-topnav))] pl-16 pr-8 text-wrap break-words overflow-y-auto overscroll-contain scrollbar-stable-both transition-colors ease-out duration-300 data-inactive:opacity-20 data-inactive:overflow-y-hidden data-inactive:select-none data-inactive:touch-none"
            ref={initializeMainReference}
            tabIndex={(mainState.isActive && layoutState.indexGroup === 0 ? 0 : -1)}
        >
            {children}
        </main >
    </>)
}