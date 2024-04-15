import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { indexEntryTypesString, isDebugEnabled } from '../constants/general'

export { useNavigateAndHighlightElement }

//
//
//

function useNavigateAndHighlightElement(pageName?: string): void {
    pageName ??= 'Page'
    const searchParams = useSearchParams()

    // navigate to searched element;
    useEffect(() => {
        const innerText = searchParams.get('search')
        if (innerText == null) return

        const searchResultElementArray = Array.from(document.querySelectorAll(indexEntryTypesString)).reduce<HTMLElement[]>((accumulator, current) => {
            if (!(current instanceof HTMLElement)) return accumulator

            //TODO
            // console.log(current)

            // might not work in every case; in some cases the innerText is empty or null 
            // for some reason; innerHTML can only be used as a substitute if no html tags 
            // are used inside;
            if (current.innerText !== innerText && current.innerHTML !== innerText) return accumulator

            accumulator.push(current)
            return accumulator
        }, [])

        if (searchResultElementArray.length < 1) {
            // TODO: got this when searching for the back-end link url; lol, I have to deploy first for the url to match; todo check if it works when deployed;
            if (isDebugEnabled) console.log(pageName + ': No element found for search params "' + innerText + '".')
            return
        }

        if (isDebugEnabled) console.log('Home: Found element from search params.')
        const searchResultElement = searchResultElementArray[0]
        searchResultElement.focus()

        const detailsElement = searchResultElement.closest('details')
        if (detailsElement != null) detailsElement.setAttribute('open', '')
        const highlightWordArray = searchParams.get('select')?.split(',')
        const selection = window.getSelection()

        if (highlightWordArray != null && selection != null) {
            selection.removeAllRanges()
            const textElement = searchResultElement.firstChild

            highlightWordArray.forEach((word) => {
                if (textElement == null) return
                if (textElement.textContent == null) return
                const startIndex = textElement.textContent.toLowerCase().indexOf(word.toLowerCase())
                if (startIndex == -1) return

                const range = document.createRange()
                range.setEnd(textElement, startIndex + word.length)

                if (selection.rangeCount < 1) {
                    range.setStart(textElement, startIndex)
                    selection.addRange(range)
                    return
                }

                //TODO; got an error that this element does not have any ranges;
                selection.extend(textElement, range.endOffset)
            })
        }
    }, [pageName, searchParams])
}