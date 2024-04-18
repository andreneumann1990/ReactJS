import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { create } from 'zustand'
import algoliasearch from 'algoliasearch/lite'
import DOMPurify from 'dompurify'
import Link from 'next/link'
import { isDebugEnabled, tabIndexGroupTopnav } from '../../constants/general_constants'
import { useRouter } from 'next/navigation'
import { debounceEventFunction } from '../../constants/event_constants'
import { useLayoutStore } from '../layout/Layout'
import { useSidenavStore } from '../layout/Sidenav'

export default Search
export { useSearchStore }

//
//
//

interface EntryData {
    href: string,
    open: boolean,
    purifiedInnerHTML: string,
}

interface SearchData {
    [url_relative: string]: EntryData[]
}

const searchClient = algoliasearch('2QYN25VL0K', 'ba0b8a970db7843753c13218f38ae4e2')
const index = searchClient.initIndex('example_3')

const useSearchStore = create<{
    inputElement: HTMLInputElement | null
    setInputElement: (element: HTMLInputElement | null) => void
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    resultsElement: HTMLDivElement | null
    setResultsElement: (element: HTMLDivElement | null) => void
}>((set) => ({
    inputElement: null,
    setInputElement: (element) => set(() => ({ inputElement: element })),
    isOpen: false,
    setIsOpen: (isOpen) => set(() => ({ isOpen })),
    resultsElement: null,
    setResultsElement: (element) => set(() => ({ resultsElement: element })),
}))

//
//
//

function Search() {
    //
    // variables and parameters
    //

    const router = useRouter()

    const layoutStore = useLayoutStore()
    const searchStore = useSearchStore()
    const sidenavStore = useSidenavStore()

    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [isHovering, setIsHovering] = useState<boolean>(false)
    const [lastSearchQuery, setLastSearchQuery] = useState<string>('')
    const [previouslyFocusedElement, setPreviouslyFocusedElement] = useState<HTMLElement | null>(null)

    const [searchResultDataArray, setSearchResultDataArray] = useState<SearchData>({})
    const [searchResultSelectedIndex, setSearchResultSelectedIndex] = useState<[number, number]>([0, 0])
    const [searchQuery, setSearchQuery] = useState('')


    //
    // functions
    //

    function initializeSearchInputReference(element: HTMLInputElement) {
        if (searchStore.inputElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Search: Initialize search input reference.')
        searchStore.setInputElement(element)
    }

    function initializeSearchResultsReference(element: HTMLDivElement) {
        if (searchStore.resultsElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('Search: Initialize search results reference.')
        searchStore.setResultsElement(element)
    }

    // navigate via arrow keys; escape to close;
    function handleKeyDown(event: React.KeyboardEvent) {
        if (searchStore.inputElement == null) return
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            return
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            previouslyFocusedElement?.focus()
            searchStore.inputElement.blur()
            return
        }

        if (Object.keys(searchResultDataArray).length < 1) return
        const [keyIndex, entryIndex] = searchResultSelectedIndex

        if (event.key === 'ArrowDown') {
            const entryArray: EntryData[] | undefined = Object.values(searchResultDataArray)[keyIndex]
            if (entryArray == null) {
                if (isDebugEnabled) {
                    console.log('Search-Warning: Entry array could not be found.')
                    console.log(`Search-Warning: dataArray ${Object.values(searchResultDataArray)}`)
                    console.log(`Search-Warning: keyIndex ${keyIndex}`)
                }
                return
            }

            if (entryIndex < entryArray.length - 1) {
                event.preventDefault()
                setSearchResultSelectedIndex([keyIndex, entryIndex + 1])
            } else if (keyIndex < Object.keys(searchResultDataArray).length - 1) {
                event.preventDefault()
                setSearchResultSelectedIndex([keyIndex + 1, 0])
            }
            return
        }

        if (event.key === 'ArrowUp') {
            if (entryIndex > 0) {
                event.preventDefault()
                setSearchResultSelectedIndex([keyIndex, entryIndex - 1])
            } else if (keyIndex > 0) {
                const entryArray: EntryData[] | undefined = Object.values(searchResultDataArray)[keyIndex - 1]
                if (entryArray == null) {
                    if (isDebugEnabled) {
                        console.log('Search-Warning: Entry array could not be found.')
                        console.log(`Search-Warning: dataArray ${Object.values(searchResultDataArray)}`)
                        console.log(`Search-Warning: (keyIndex - 1) ${keyIndex - 1}`)
                    }
                    return
                }

                event.preventDefault()
                setSearchResultSelectedIndex([keyIndex - 1, entryArray.length - 1])
            }
            return
        }
    }

    // navigate to the selected result by pressing 'enter';
    function handleSearch(event: FormEvent) {
        event.preventDefault()
        if (Object.keys(searchResultDataArray).length < 1) return
        const [keyIndex, entryIndex] = searchResultSelectedIndex
        const href = Object.values(searchResultDataArray)[keyIndex][entryIndex].href
        if (typeof href != 'string') return

        router.push(href)
        if (searchStore.inputElement == null) return
        searchStore.inputElement.blur()
    }

    function updateInputField(event: ChangeEvent): void {
        const inputElement = event.target as HTMLInputElement | null
        if (inputElement == null) return
        if (inputElement.value === searchQuery) return
        if (isDebugEnabled) console.log('Search: Update search query.')
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
        layoutStore.setActiveTabIndexGroup(tabIndexGroupTopnav)
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
        if (searchStore.inputElement == null) return
        if (isDebugEnabled) console.log('Search: Update state.')

        if (document.activeElement === searchStore.inputElement) {
            if (searchStore.isOpen) return
            searchStore.setIsOpen(true)
            return
        }

        if (sidenavStore.isOpen) {
            if (!searchStore.isOpen) return
            searchStore.setIsOpen(false)
            return
        }

        if (isHovering) {
            if (searchStore.isOpen) return
            searchStore.setIsOpen(true)
            return
        }

        if (isFocused) {
            if (searchStore.isOpen) return
            searchStore.setIsOpen(true)
            return
        }

        if (!searchStore.isOpen) return
        searchStore.setIsOpen(false)
    }, [isFocused, isHovering, searchStore, sidenavStore.isOpen])

    // select search input field by ctrl+k;
    useEffect(() => {
        function handleKeyDownInput(event: KeyboardEvent): void {
            if (event.ctrlKey && event.key === 'k') {
                event.preventDefault()
            }
        }

        function handleKeyUpInput(event: KeyboardEvent): void {
            if (searchStore.inputElement == null) return
            if (event.ctrlKey && event.key === 'k') {
                event.preventDefault()
                if (document.activeElement === searchStore.inputElement) {
                    previouslyFocusedElement?.focus()
                    searchStore.inputElement.blur()
                    return
                }

                setPreviouslyFocusedElement(document.activeElement as HTMLElement | null)
                searchStore.inputElement.focus()
            }
        }

        // for some reason `keypress` does not trigger??;
        document.addEventListener('keydown', handleKeyDownInput)
        document.addEventListener('keyup', handleKeyUpInput)

        return (() => {
            document.removeEventListener('keydown', handleKeyDownInput)
            document.removeEventListener('keyup', handleKeyUpInput)
        })
    }, [previouslyFocusedElement, searchStore.inputElement])

    // search after query is updated, i.e. onChange();
    useEffect(() => {
        if (searchQuery === '') {
            if (Object.keys(searchResultDataArray).length < 1) return
            setSearchResultDataArray({})
            return
        }

        if (searchQuery === lastSearchQuery) return
        setLastSearchQuery(searchQuery)
        if (isDebugEnabled) console.log(`Search: Search for ${searchQuery}`)

        index.search(searchQuery).then((response) => {
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
                    if (str === '') return
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
            setSearchResultDataArray(dataArray)
        })
    }, [lastSearchQuery, searchQuery, searchResultDataArray])

    // reset selectedHitIndex;
    useEffect(() => {
        if (Object.keys(searchResultDataArray).length > 0) return
        setSearchResultSelectedIndex([0, 0])
    }, [searchResultDataArray])

    //
    //
    //

    return (
        <form
            className="w-full relative grid grid-flow-col [grid-template-columns:var(--height-topnav)_auto] items-center"
            onSubmit={handleSearch}
        >
            <button
                type="submit"
                tabIndex={layoutStore.activeTabIndexGroup === tabIndexGroupTopnav ? tabIndexGroupTopnav : -1}
            >
                <i className="p-1 icon-medium material-icons">search</i>
            </button>
            <div className="relative pr-1">
                {/* search input; */}
                <input name="searchInput" className="w-full px-4 py-1 rounded-2xl peer"
                    type="text"
                    placeholder="Search here..."
                    ref={initializeSearchInputReference}
                    onBlurCapture={handleBlur}
                    onChange={debounceEventFunction(updateInputField, 300)}
                    onFocusCapture={handleFocus}
                    onKeyDown={handleKeyDown}
                    tabIndex={layoutStore.activeTabIndexGroup === tabIndexGroupTopnav ? tabIndexGroupTopnav : -1}
                />

                {/* search results; */}
                <div
                    className={`absolute w-full mt-1 bg-secondary shadow-md text-center hidden peer-focus:block hover:${searchStore.isOpen}`}
                    ref={initializeSearchResultsReference}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {Object.entries(searchResultDataArray).map(([url_relative, entryArray], keyIndex) => {
                        return (<div key={`d-${keyIndex}`}
                            className="text-left p-2 pl-5 text-xl"
                        >
                            <header>{url_relative}</header>
                            {entryArray.map((entry, entryIndex) => {
                                return (<Link key={`l-${entryIndex}`}
                                    className={'grid items-center my-3 text-left min-h-10 p-2 px-4 mt-2 border rounded-2xl' + (keyIndex === searchResultSelectedIndex[0] && entryIndex === searchResultSelectedIndex[1] ? ' bg-primary-active' : ' bg-primary')}
                                    href={entry.href}
                                >
                                    <div
                                        className="*:bg-yellow-700 text-base"
                                        dangerouslySetInnerHTML={{ __html: entry.purifiedInnerHTML }}
                                    ></div>
                                </Link>)
                            })}
                        </div>)
                    })}
                    <div className="text-right flex justify-between items-center my-2 mx-5">
                        <div className="grid grid-flow-col justify-center">
                            <i className="material-icons">arrow_upward</i>
                            <i className="material-icons">arrow_downward</i>
                            <span className="inline-block p-1 text-xs">to navigate</span>
                        </div>
                        <div className="text-center">
                            <img className="inline bg-white rounded-md p-1" src="./icons/enter-arrow-svgrepo-com.svg" alt="enter" height="24px" width="24px"></img>
                            <span className="inline-block p-1 text-xs">to select</span>
                        </div>
                        <div>
                            <img className="inline bg-white rounded-md p-1" src="./icons/esc-a-svgrepo-com.svg" alt="escape" height="24px" width="24px"></img>
                            <span className="inline-block p-1 text-xs">to close</span>
                        </div>
                        <div>
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
