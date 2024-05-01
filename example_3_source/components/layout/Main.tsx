import React, { KeyboardEvent, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'
import { defaultIndexGroup, indexEntryTypesString, isDebugEnabled, mainIndexGroup, maximumDelay, maximumPullLength, refreshThreshold, repeatDelay } from '../../constants/parameters'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { useGlobalStore } from '../../hooks/useStore'
import { NullableHTMLElement, NullableNumber } from '../../constants/types'
import { useSearchParams } from 'next/navigation'
import { focusNextElement, focusPreviousElement, normalizeString } from '../../constants/functions'
import { useIndexGroupItem } from '../../hooks/useIndexGroup'
import { useClick } from '../../hooks/useClick'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'

export default Main
export { handleKeyDown_Global as handleKeyDown_Main }

//
// parameters and variables
//

const queryString = 'a:not([tabindex="-1"]), button:not([tabindex="-1"]), div[tabindex="0"], input:not([tabindex="-1"]), img[tabindex="0"], summary:not([tabindex="-1"])'

// what is the difference between useRef and a normal variable??; useRef can be 
// only used like other hooks and does not trigger a re-render; a normal variable 
// does not trigger a re-render either; they are local if inside a function 
// component; local variables reset when the component re-renders;
//
// in this case it is fine; but there might be problems; this is a global variable;
// this means that effectively the Main component should never be re-used;
//
// I could add it to useMainStore(); in that case it might trigger re-render 
// when changed;
//
// leave it as is for now;
let previousScrollTop: number = -1

//
// functions
//

function handleKeyDown_Global(event: KeyboardEvent): NullableNumber {
    const { layoutState, mainState, topnavState } = useGlobalStore.getState()
    if (mainState.element == null) return null
    if (!mainState.element.contains(document.activeElement)) return

    if (layoutState.indexGroup === defaultIndexGroup) {
        if (event.key === 'ArrowUp') {
            const scrollTop = mainState.element.scrollTop
            if (scrollTop > 0) {
                previousScrollTop = scrollTop
                return null
            }

            if (previousScrollTop > 0) {
                previousScrollTop = 0
                return maximumDelay
            }

            event.preventDefault()
            event.stopPropagation()
            topnavState.element?.focus()
            return maximumDelay
        }

        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()

            layoutState.setIndexGroup(mainIndexGroup)
            setTimeout(() => focusNextElement(mainState.element, queryString), 1)
            return maximumDelay
        }

        // what is this?; is this unique?;
        if (event.key === ' ') {
            event.preventDefault()
            return null
        }
        return null
    }

    if (layoutState.indexGroup === mainIndexGroup) {
        if (event.key === 'Escape') {
            event.preventDefault()
            mainState.element?.focus()
            return maximumDelay
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            event.stopPropagation()
            console.log(focusNextElement(mainState.element, queryString))
            return repeatDelay
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault()
            event.stopPropagation()
            focusPreviousElement(mainState.element, queryString)
            return repeatDelay
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

    // useGlobalStore() is very convenient to write; but this means that this component
    // re-renders for every change made to globalState
    const { mainState, searchState, sidenavState } = useGlobalStore()
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
            sidenavState.setPanningOffset(dx)
            sidenavState.setIsPanning(true)
            return
        }

        // pan end;
        if (isDebugEnabled) console.log('Main: Pan gesture has ended.')
        if (dx < -0.5 * sidenavElement.offsetWidth) {
            // isOpen is not updated immediately;
            sidenavState.setIsOpen(false)
        }

        sidenavState.setPanningOffset(0)
        sidenavState.setIsPanning(false)
    }, { eventOptions: { capture: true }, enabled: sidenavState.isOpen })()

    //
    // functions
    //

    function handleClick(event: React.PointerEvent): void {
        if (mainState.element == null) return
        if (mainState.element.dataset.inactive == null) return
        event.preventDefault()
        event.stopPropagation()

        if (isDebugEnabled) console.log('Main: Clicked. Close search and sidenav.')
        searchState.setIsOpen(false)
        sidenavState.setIsOpen(false)
        mainState.element.focus()
    }

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
        let innerText = searchParams.get('search')
        if (innerText == null) return
        innerText = normalizeString(innerText)

        const searchResultElementArray = Array.from(document.querySelectorAll(indexEntryTypesString)).reduce<HTMLElement[]>((accumulator, current) => {
            if (!(current instanceof HTMLElement)) return accumulator

            // might not work in every case; in some cases the innerText is empty or null 
            // for some reason; this seems to be happening inside <details> elements; inner
            // HTML can only be used as a substitute if no html tags are used inside;
            if (normalizeString(current.innerText) !== innerText && normalizeString(current.innerHTML) !== innerText) {
                return accumulator
            }

            accumulator.push(current)
            return accumulator
        }, [])

        if (searchResultElementArray.length < 1) {
            if (isDebugEnabled) console.log(`Main: No element found for search params "${innerText}".`)
            return
        }

        if (isDebugEnabled) console.log('Main: Found element from search params.')
        const firstSearchResultElement = searchResultElementArray[0]
        firstSearchResultElement.focus()

        const detailsElement = firstSearchResultElement.closest('details')
        if (detailsElement != null) detailsElement.setAttribute('open', '')
        const highlightWordArray = searchParams.get('select')?.split(',')
        if (highlightWordArray == null) return

        const selection = window.getSelection()
        if (selection == null) return
        selection.removeAllRanges()
        const textNodeArray: Text[] = []

        function addTextNodesToArray(node: Node) {
            node.childNodes.forEach((childNode) => {
                addTextNodesToArray(childNode)
            })

            if (!(node instanceof Text)) return
            textNodeArray.push(node)
        }
        addTextNodesToArray(firstSearchResultElement)

        textNodeArray.forEach((textNode: Text) => {
            highlightWordArray.forEach((word: string) => {
                if (textNode.textContent == null) return
                const startIndex = normalizeString(textNode.textContent).toLowerCase().indexOf(normalizeString(word).toLowerCase())
                if (startIndex === -1) return
                const range = document.createRange()

                if (selection.rangeCount < 1) {
                    range.setStart(textNode, startIndex)
                    range.setEnd(textNode, startIndex + word.length)
                    selection.addRange(range)
                    return
                }

                range.setEnd(textNode, startIndex + word.length)
                selection.extend(textNode, range.endOffset)
            })
        })
    }, [searchParams])

    // pull down to refresh on mobile;
    // not sure if I like this structure; usePullToRefresh() executes code similar to 
    // useEffect(); it also returns values like variables; hmm...; TODO;
    const { isRefreshing, pullPosition } = usePullToRefresh({
        onRefresh: () => {
            if (mainState.element == null) return
            if (mainState.element.scrollTop > 0) return
            if (isDebugEnabled) console.log('Main: Refresh.')

            // refresh() only re-renders the components?;
            // router.refresh()
            window.location.reload()
        },
        maximumPullLength,
        refreshThreshold,
        isDisabled: () => !mainState.isActive || mainState.element == null || mainState.element.scrollTop > 0
    })

    //
    //
    //

    return (
        <main
            // sets onKeyDownCapture and onKeyUpCapture;
            //
            // does not work when you have child elements; for some reason dragging gets
            // interrupted when moving over them; TODO;
            {...dragAttributes}
            onKeyDownCapture={undefined}
            onKeyUpCapture={undefined}

            {...useClick(handleClick)}
            {...useIndexGroupItem(defaultIndexGroup)}
            className="h-[calc(100vh-var(--height-topnav))] px-5 sm:pl-16 sm:pr-8 text-wrap break-words overflow-y-auto overscroll-contain scrollbar-stable-both transition-none motion-safe:[transition-property:opacity] ease-linear duration-300 data-inactive:opacity-20 data-inactive:overflow-y-hidden data-inactive:select-none data-inactive:touch-none"
            ref={initializeMainElement}
        >
            {/* 
                pull down to refresh; the template is copied from:
                    https://github.com/Senbonzakura1234/use-pull-to-refresh
            */}
            <div
                className={'fixed inset-x-1/2 z-30 aspect-square w-fit -translate-x-1/2 rounded-full p-2 ease-linear duration-0 motion-safe:duration-300'}
                style={{
                    // only do a transition when the position resets, i.e. the user stops pulling;
                    // don't use `motion-safe:[transition-property:${pullPosition > 0 ? 'none' : 
                    // 'all'}]` in className; there seems to be a race condition otherwise; set it
                    // in style instead;
                    opacity: isRefreshing ? 1 : pullPosition / maximumPullLength,
                    top: (isRefreshing ? refreshThreshold : Math.min(pullPosition, refreshThreshold)) / 2,
                    transitionProperty: pullPosition > 0 ? 'none' : 'opacity, top',
                }}
            >
                <div
                    // the refresh is delayed by 500ms; match animation duration;
                    className={`grid content-center justify-center bg-primary rounded-full shadow aspect-square w-12 ${isRefreshing ? 'animate-spin' : ''} [animation-duration:500ms] ease-linear duration-0 motion-safe:duration-300`}
                    style={{
                        transform: !isRefreshing ? `rotate(${pullPosition / maximumPullLength * 360}deg)` : 'rotate(0)',
                        transitionProperty: pullPosition > 0 ? 'none' : 'transform',
                    }}
                >
                    <i className="material-icons icon-medium m-auto">refresh</i>
                </div>
            </div>
            {children}
            <div
                // on mobile you need some space for the home key and such;
                className="h-16"
            />
        </main >
    )
}