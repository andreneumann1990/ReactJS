import React, { KeyboardEvent, useEffect, useRef } from 'react'
import { useDrag } from '@use-gesture/react'
import { defaultIndexGroup, focusableElementSelectors, indexEntryTypesString, isDebugEnabled, mainIndexGroup, sidenavTransitionDuration } from '../../constants/parameters'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { useGlobalStore, useMainStore } from '../../hooks/stores'
import { NullableBoolean, NullableHTMLElement } from '../../constants/types'
import { useSearchParams } from 'next/navigation'
import { focusNextElement, focusPreviousElement } from '../../constants/functions'
import { useIndexGroupItem } from '../../hooks/indexGroup'

export default Main
export { handleKeyDown_Global as handleKeyDown_Main }

//TODO; focus child elements;
//TODO; change keys; up down is for scrolling;

//
// parameters and variables
//

const queryString = 'a:not([tabindex="-1"]), button:not([tabindex="-1"]), div[tabindex="0"], input:not([tabindex="-1"]), img[tabindex="0"], summary:not([tabindex="-1"])'

// what is the difference between useRef and a normal variable??; useRef can be 
// only used like other hooks and does not trigger a re-render; a normal variable 
// does not trigger a re-render either; they are local if inside a function component;
//
// in this case it is fine; but there are problems here; this is a global variable;
// this means that effectively the Main component should never be re-used; a more
// general pattern would be probably better; TODO;
let previousScrollTop: number = -1

//
// functions
//

function handleKeyDown_Global(event: KeyboardEvent): NullableBoolean {
    const { layoutState, mainState, topnavState } = useGlobalStore.getState()
    if (mainState.element == null) return null
    if (!mainState.element.contains(document.activeElement)) return null

    if (layoutState.indexGroup === defaultIndexGroup) {
        if (event.key === 'ArrowUp') {
            const scrollTop = mainState.element.scrollTop
            if (scrollTop > 0) {
                previousScrollTop = scrollTop
                return null
            }

            if (previousScrollTop > 0) {
                previousScrollTop = 0
                return false
            }

            event.preventDefault()
            event.stopPropagation()
            topnavState.element?.focus()
            return false
        }

        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            layoutState.setIndexGroup(mainIndexGroup)

            // wait for the indexGroup change to be applied;
            setTimeout(() => focusNextElement(mainState.element, queryString), 1)
            return false
        }

        // what is this?; is this unique?;
        if (event.key === ' ') {
            event.preventDefault()
            return null
        }
        return null
    }

    if (layoutState.indexGroup === mainIndexGroup) {
        //TODO; maybe put this directly on the elements;
        //         if (document.activeElement?.tagName === 'SUMMARY') {
        //             if (event.key === 'ArrowRight') {
        //                 event.preventDefault()
        //                 event.stopPropagation()
        //                 document.activeElement.parentElement?.setAttribute('open', '')
        //                 return false
        //             }
        // 
        //             if (event.key === 'ArrowLeft') {
        //                 event.preventDefault()
        //                 event.stopPropagation()
        //                 document.activeElement.parentElement?.removeAttribute('open')
        //                 return false
        //             }
        //         }

        if (event.key === 'Escape') {
            event.preventDefault()
            // layoutState.resetIndexGroup()
            mainState.element?.focus()
            return false
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            event.stopPropagation()
            focusNextElement(mainState.element, queryString)
            return true
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault()
            event.stopPropagation()
            focusPreviousElement(mainState.element, queryString)
            return true
        }
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
        // `offset` does not reset when panning ends; `movement` does;
        const sidenavElement = sidenavState.element
        if (sidenavElement == null) return
        if (dx > -10) return
        if (Math.abs(dy) > Math.abs(dx)) return

        // pan move;
        if (!last) {
            sidenavElement.style.transitionDuration = '0s'
            const currentOffset = sidenavElement.offsetWidth + dx
            sidenavElement.style.transform = `translateX(${currentOffset}px)`
            return
        }

        // pan end;
        if (isDebugEnabled) console.log('Sidenav: Pan gesture has ended.')
        if (dx < -0.5 * sidenavElement.offsetWidth) {
            // isOpen is not updated immediately;
            sidenavState.setIsOpen(false)
            return
        }

        sidenavElement.style.transitionDuration = sidenavTransitionDuration
        sidenavElement.style.transform = `translateX(${sidenavElement.offsetWidth}px)`
    }, { eventOptions: { capture: true }, enabled: sidenavState.isOpen })()

    //
    // functions
    //

    function initializeMainElement(element: NullableHTMLElement): void {
        if (mainState.element != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Main: Initialize main element.')
        mainState.setElement(element)
    }

    //
    // effects
    //

    // update state;
    useEffect(() => {
        if (mainState.element == null) return
        const isActive = !sidenavState.isOpen && !searchState.isOpen
        setIsActive(isActive)

        if (isActive) {
            delete mainState.element.dataset.inactive
            return
        }
        mainState.element.dataset.inactive = ''
    }, [mainState.element, searchState.isOpen, setIsActive, sidenavState.isOpen])

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

    return (
        <main
            // sets onKeyDownCapture and onKeyUpCapture;
            {...dragAttributes}
            onKeyDownCapture={undefined}
            onKeyUpCapture={undefined}

            {...useIndexGroupItem(defaultIndexGroup)}
            // {...useClick(() => layoutState.setIndexGroup(mainIndexGroup))}
            className="h-[calc(100vh-var(--height-topnav))] pl-16 pr-8 text-wrap break-words overflow-y-auto overscroll-contain scrollbar-stable-both transition-none motion-safe:transition-colors motion-safe:ease-out motion-safe:duration-300 data-inactive:opacity-20 data-inactive:overflow-y-hidden data-inactive:select-none data-inactive:touch-none"
            ref={initializeMainElement}
        >
            {children}
        </main >
    )
}