import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { create } from 'zustand'
import { isDebugEnabled } from './Layout'

export default SearchBox
export { useSearchStore }

//
//
//

interface SearchState {
    inputElement: HTMLInputElement | null
    setInputElement: (element: HTMLInputElement | null) => void
}

const useSearchStore = create<SearchState>((set) => ({
    inputElement: null,
    setInputElement: (element) => set(() => ({ inputElement: element })),
}))

//
//
//

interface Props {
    onSearch: (query: string) => void,
}

function SearchBox({ onSearch }: Props) {
    //
    // variables and parameters
    //

    const searchInputElement = useSearchStore(state => state.inputElement)
    const setSearchInputElement = useSearchStore(state => state.setInputElement)

    const [loadingDotsElement, setLoadingDotsElement] = useState<HTMLSpanElement | null>(null)
    const [query, setQuery] = useState('')

    //
    // functions
    //

    function initializeSearchReference(element: HTMLInputElement) {
        if (searchInputElement != null) return
        if (element == null) return
        if (isDebugEnabled) console.log('SearchBox: Initialize search reference.')
        setSearchInputElement(element)
    }

    function handleSearch(event: FormEvent) {
        event.preventDefault()
        onSearch(query)
    }

    function updateInputField(event: ChangeEvent): void {
        const inputElement = event.target as HTMLInputElement | null
        if (inputElement == null) return
        setQuery(inputElement.value)
    }

    //
    // effects
    //

    useEffect(() => {
        const bodyElement = document.querySelector('body')
        if (bodyElement == null) return
        let previousElement: HTMLElement | null = null

        function handleKeyInputs(event: KeyboardEvent) {
            if (searchInputElement == null) return
            if (event.ctrlKey && event.key == 'k') {
                event.preventDefault()
                if (document.activeElement == searchInputElement) {
                    previousElement?.focus()
                    return
                }

                previousElement = document.activeElement as HTMLElement | null
                searchInputElement.focus()
            }
        }

        bodyElement.addEventListener('keydown', handleKeyInputs)
        return (() => {
            bodyElement.removeEventListener('keydown', handleKeyInputs)
        })
    }, [searchInputElement])

    useEffect(() => {
        let numberOfDots = 1
        setInterval(() => {
            if (loadingDotsElement == null) return
            if (searchInputElement == null) return
            if (document.activeElement != searchInputElement) return
            if (searchInputElement.value.length < 1) return

            if (isDebugEnabled) console.log('SearchBox: searching...')
            numberOfDots = numberOfDots % 3 + 1
            loadingDotsElement.innerHTML = '.'.repeat(numberOfDots)
        }, 1000)
    }, [loadingDotsElement, searchInputElement])

    //
    //
    //

    return (
        <form className="relative grid grid-flow-col [grid-template-columns:var(--height-topnav)_auto] items-center" onSubmit={handleSearch}>
            <button type="submit"><i className="p-1 icon-medium material-icons">search</i></button>
            <div className="relative pr-1">
                <input name="searchInput" className="w-full px-2 py-1 rounded-md bg-tomato-700 peer"
                    type="text"
                    placeholder="Search here..."
                    value={query}
                    ref={initializeSearchReference}
                    onChange={updateInputField}
                />
                <div className="absolute h-[200px] w-full p-1 mt-1 bg-[--color-light-1] text-center hidden peer-focus:block">
                    <pre className="pl-1 mb-1 text-left">Pretending to search for<span ref={setLoadingDotsElement}>.</span></pre>
                    <pre className="inline text-wrap break-words">{query}</pre>
                </div>
            </div>
            <div className="absolute right-4 text-slate-300">Ctrl + K</div>
        </form>
    )
}