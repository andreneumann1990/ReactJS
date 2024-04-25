import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import algoliasearch from 'algoliasearch/lite'
import DOMPurify from 'dompurify'
import Link from 'next/link'
import { isDebugEnabled, maximumDelay, repeatDelay, topnavIndexGroup } from '../../constants/parameters'
import { useRouter } from 'next/navigation'
import { useGlobalStore } from '../../hooks/stores'
import { EntryData, NullableNumber, SearchData } from '../../constants/types'
import { scrollIntoView } from '../../constants/functions'

export default Search
export { handleKeyDown_Global as handleKeyDown_Search }

//
// parameters and variables
//

const algoliaIndex = algoliasearch('2QYN25VL0K', 'ba0b8a970db7843753c13218f38ae4e2').initIndex('example_3')

//
// functions
//

// navigate via arrow keys; escape to close;
function handleKeyDown_Global(event: React.KeyboardEvent): NullableNumber {
    const { searchState } = useGlobalStore.getState()
    if (searchState.inputElement == null) return null
    if (!searchState.inputElement.contains(document.activeElement)) return null

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        return null
    }

    if (Object.keys(searchState.resultsDataArray).length < 1) return null
    const [groupIndex, entryIndex] = searchState.resultsSelectedIndex

    if (event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopPropagation()
        const entryArray: EntryData[] | undefined = Object.values(searchState.resultsDataArray)[groupIndex]

        if (entryArray == null) {
            if (isDebugEnabled) {
                console.log('Search-Warning: Entry array could not be found.')
                console.log(`Search-Warning: dataArray ${Object.values(searchState.resultsDataArray)}`)
                console.log(`Search-Warning: groupIndex ${groupIndex}`)
            }
            return maximumDelay
        }

        if (entryIndex < entryArray.length - 1) {
            searchState.setResultsSelectedIndex([groupIndex, entryIndex + 1])
            scrollIntoView(searchState.resultsElement?.querySelector(`#search-results-${groupIndex}-${entryIndex + 1}`))
        } else if (groupIndex < Object.keys(searchState.resultsDataArray).length - 1) {
            searchState.setResultsSelectedIndex([groupIndex + 1, 0])
            scrollIntoView(searchState.resultsElement?.querySelector(`#search-results-${groupIndex + 1}-0`))
        }
        return repeatDelay
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopPropagation()

        if (entryIndex > 0) {
            searchState.setResultsSelectedIndex([groupIndex, entryIndex - 1])
            scrollIntoView(searchState.resultsElement?.querySelector(`#search-results-${groupIndex}-${entryIndex - 1}`))
        } else if (groupIndex > 0) {
            const entryArray: EntryData[] | undefined = Object.values(searchState.resultsDataArray)[groupIndex - 1]
            if (entryArray == null) {
                if (isDebugEnabled) {
                    console.log('Search-Warning: Entry array could not be found.')
                    console.log(`Search-Warning: dataArray ${Object.values(searchState.resultsDataArray)}`)
                    console.log(`Search-Warning: (groupIndex - 1) ${groupIndex - 1}`)
                }
                return maximumDelay
            }

            searchState.setResultsSelectedIndex([groupIndex - 1, entryArray.length - 1])
            scrollIntoView(searchState.resultsElement?.querySelector(`#search-results-${groupIndex - 1}-${entryArray.length - 1}`))
        }
        return repeatDelay
    }
    return null
}

//
// main
//

function Search() {
    //
    // variables and parameters
    //

    const router = useRouter()
    const { layoutState, searchState, sidenavState } = useGlobalStore()
    const { setIsOpen } = searchState
    const { setResultsDataArray, setResultsSelectedIndex } = searchState

    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [isHovering, setIsHovering] = useState<boolean>(false)
    const [lastSearchQuery, setLastSearchQuery] = useState<string>('')
    // const [previouslyFocusedElement, setPreviouslyFocusedElement] = useState<NullableHTMLElement>(null)

    // const [searchState.resultsDataArray, searchState.setResultsDataArray] = useState<SearchData>({})
    // const [searchState.resultsSelectedIndex, searchState.setResultsSelectedIndex] = useState<[number, number]>([0, 0])
    const [searchQuery, setSearchQuery] = useState('')

    const updateInputFieldTimeoutRef = useRef<NodeJS.Timeout>()

    //
    // functions
    //

    function handleChange(event: ChangeEvent): void {
        // debounce updateInputField();
        clearTimeout(updateInputFieldTimeoutRef.current)
        updateInputFieldTimeoutRef.current = setTimeout(() => updateInputField(event), 300)
    }

    function initializeInputElement(element: HTMLInputElement) {
        if (searchState.inputElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Search: Initialize search input element.')
        searchState.setInputElement(element)
    }

    function initializeResultsElement(element: HTMLDivElement) {
        if (searchState.resultsElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Search: Initialize search results element.')
        searchState.setResultsElement(element)
    }

    // navigate to the selected result by pressing 'enter';
    function handleSearch(event: FormEvent) {
        event.preventDefault()
        if (Object.keys(searchState.resultsDataArray).length < 1) return
        const [groupIndex, entryIndex] = searchState.resultsSelectedIndex
        const href = Object.values(searchState.resultsDataArray)[groupIndex][entryIndex].href
        if (typeof href != 'string') return

        router.push(href)
        if (searchState.inputElement == null) return
        searchState.inputElement.blur()
    }

    function updateInputField(event: ChangeEvent): void {
        const inputElement = event.target as HTMLInputElement | null
        if (inputElement == null) return
        if (inputElement.value === searchQuery) return
        if (isDebugEnabled) console.log(`Search: searchQuery ${inputElement.value}`)

        setLastSearchQuery(searchQuery)
        setSearchQuery(inputElement.value)
    }

    // set hover; don't close when hovering => update state;
    function handleMouseEnter(): void {
        setIsHovering(true)
    }

    function handleMouseLeave(): void {
        setIsHovering(false)
    }

    // set focus; don't close when focused => update state;
    function handleFocus(): void {
        setIsFocused(true)
    }

    function handleBlur(): void {
        setIsFocused(false)
    }

    //
    // effects
    //

    // update state;
    useEffect(() => {
        if (sidenavState.isOpen) {
            if (!searchState.isOpen) return
            if (isDebugEnabled) console.log('Search: isOpen false')
            setIsOpen(false)
            return
        }

        if (searchState.inputElement == null) return
        // if (document.activeElement === searchState.inputElement || isFocused) {
        if (document.activeElement === searchState.inputElement || isFocused || isHovering) {
            if (searchState.isOpen) return
            if (isDebugEnabled) console.log('Search: isOpen true')
            setIsOpen(true)
            return
        }

        if (!searchState.isOpen) return
        if (isDebugEnabled) console.log('Search: isOpen false')
        setIsOpen(false)
    }, [isFocused, isHovering, searchState.inputElement, searchState.isOpen, setIsOpen, sidenavState.isOpen])

    // show / hide resultsElement;
    useEffect(() => {
        if (searchState.resultsElement == null) return
        if (searchState.isOpen) {
            searchState.resultsElement.style.display = 'block'
            return
        }
        searchState.resultsElement.style.display = 'none'
    }, [searchState.isOpen, searchState.resultsElement])

    // search after query is updated, i.e. onChange();
    useEffect(() => {
        if (searchQuery === '') {
            if (Object.keys(searchState.resultsDataArray).length < 1) return
            setResultsDataArray({})
            return
        }

        if (searchQuery === lastSearchQuery) return
        setLastSearchQuery(searchQuery)
        if (isDebugEnabled) console.log(`Search: Search for ${searchQuery}`)

        algoliaIndex.search(searchQuery).then((response) => {
            let dataArray: SearchData = {}
            response.hits.forEach((hit: any, index) => {
                //
                // example of the structure:
                //   hit: { 
                //   "text": "Text:",
                //   "type": "label",
                //   "type_ranking": 1,
                //   "url": "https://andreneumann1990.github.io/reactjs/example_3/form_examples",
                //   "url_relative": "/form_examples",
                //   "objectID": "reactjs/example_3/data/60",
                //   "_highlightResult": {
                //     "text": {
                //       "value": "<em>Text</em>:",
                //       "matchLevel": "full",
                //       "fullyHighlighted": true,
                //       "matchedWords": [
                //         "test" 
                //       ]
                //     }
                //   }
                //
                // note that matchedWords can be different from what needs to be highlighted;
                //

                const innerHTML = hit._highlightResult.text.value
                const innerText = hit.text

                let matchedWordArray: string[] = []
                innerHTML.split('<em>').forEach((str: string) => {
                    if (str.indexOf('</em>') === -1) return
                    matchedWordArray.push(str.split('</em>')[0])
                })

                let searchParams = new URLSearchParams()
                searchParams.append('search', innerText)
                searchParams.append('select', matchedWordArray.join(','))

                const queryString = searchParams.toString()
                dataArray[hit.url_relative] ??= []

                dataArray[hit.url_relative].push({
                    href: `${hit.url_relative}?${queryString}`,
                    open: index === 0,
                    purifiedInnerHTML: DOMPurify.sanitize(innerHTML),
                })
            })
            setResultsDataArray(dataArray)
        })
    }, [lastSearchQuery, searchQuery, searchState.resultsDataArray, setResultsDataArray])

    // reset selectedHitIndex;
    useEffect(() => {
        if (Object.keys(searchState.resultsDataArray).length > 0) return
        setResultsSelectedIndex([0, 0])
    }, [searchState.resultsDataArray, setResultsSelectedIndex])

    //
    //
    //

    return (
        <form
            className="w-full relative grid grid-flow-col [grid-template-columns:var(--height-topnav)_auto] items-center"
            onSubmit={handleSearch}
        >
            <i className="p-1 icon-medium material-icons">search</i>
            <div className="relative pr-1">
                {/* search input; */}
                <input name="searchInput" className="w-full px-4 py-1 rounded-2xl peer"
                    type="text"
                    placeholder="Search here..."
                    ref={initializeInputElement}
                    onBlurCapture={handleBlur}
                    onChange={handleChange}
                    onFocusCapture={handleFocus}
                    tabIndex={layoutState.indexGroup === topnavIndexGroup ? undefined : -1}
                />

                {/* search results; */}
                <div
                    // making hover:block conditional to searchState.isOpen does not work in all cases;
                    // maybe a race condition?;
                    className={'absolute w-full lg:min-w-[600px] max-h-[calc(100vh-var(--height-topnav))] mt-1 bg-secondary shadow-md text-center overflow-y-scroll scrollbar-stable-both'}
                    ref={initializeResultsElement}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{ display: 'none' }}
                >
                    {Object.entries(searchState.resultsDataArray).map(([url_relative, entryArray], groupIndex) => {
                        return (
                            // a fragment would not work here unless they have an unique key as well;
                            <div
                                className="text-left p-2 pl-5 text-xl break-all"
                                key={`search-results-group-${groupIndex}`}
                            >
                                <header>{url_relative}</header>
                                {entryArray.map((entry, entryIndex) => {
                                    return (
                                        <Link
                                            className={'grid items-center my-3 text-left min-h-10 p-2 px-4 mt-2 border rounded-2xl' + (groupIndex === searchState.resultsSelectedIndex[0] && entryIndex === searchState.resultsSelectedIndex[1] ? ' bg-primary-active' : ' bg-primary')}
                                            href={entry.href}
                                            id={`search-results-${groupIndex}-${entryIndex}`}
                                            key={`search-results-entry-${entryIndex}`}
                                        >
                                            <div
                                                className="*:bg-yellow-700 text-base"
                                                dangerouslySetInnerHTML={{ __html: entry.purifiedInnerHTML }}
                                            ></div>
                                        </Link>
                                    )
                                })}
                            </div>
                        )
                    })}
                    {/* key input hints and Algolia logo; */}
                    <div className="flex flex-row flex-wrap justify-center lg:justify-end items-center mx-5">
                        <div className="flex lg:hidden flex-col sm:flex-row items-center">
                            <div className="inline-grid grid-flow-col justify-center px-2">
                                <i className="material-icons">arrow_upward</i>
                                <i className="material-icons">arrow_downward</i>
                                <span className="inline-block p-1 text-xs">to navigate</span>
                            </div>
                            <div className="inline-block px-2 text-center">
                                <img className="inline bg-white rounded-md p-1" src="./icons/enter-arrow-svgrepo-com.svg" alt="enter" height="24px" width="24px"></img>
                                <span className="inline-block p-1 text-xs">to select</span>
                            </div>
                            <div className="inline-block px-2">
                                <img className="inline bg-white rounded-md p-1" src="./icons/esc-a-svgrepo-com.svg" alt="escape" height="24px" width="24px"></img>
                                <span className="inline-block p-1 text-xs">to close</span>
                            </div>
                        </div>
                        <div className="my-2">
                            <p className="inline-block p-1 text-xs">
                                Search by
                            </p>
                            <img className="inline-block h-5 ml-1"
                                src="./icons/Algolia-logo-white.svg"
                                alt="Algolia logo"
                                height={20}
                                width="auto"
                            ></img>
                        </div>
                    </div>
                </div>
            </div >
            <div className="absolute right-5 text-slate-300">Ctrl + K</div>
        </form >
    )
}
