import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { indexEntryTypesString, isDebugEnabled } from '../constants/general_constants'

export { useNavigateAndHighlightElement }

//
//
//

function useNavigateAndHighlightElement(pageName?: string): void {
    pageName ??= 'Page'
    const searchParams = useSearchParams()

    // navigate to searched element;
    useEffect(() => {
        const innerText = searchParams.get('search')?.replaceAll(/[\n\r\t]/g, '')
        if (innerText == null) return

        const searchResultElementArray = Array.from(document.querySelectorAll(indexEntryTypesString)).reduce<HTMLElement[]>((accumulator, current) => {
            if (!(current instanceof HTMLElement)) return accumulator

            //TODO
            //             function compareStrings(str1: string, str2: string) {
            //                 let length = Math.max(str1.length, str2.length)
            //                 let differences = []
            // 
            //                 for (let i = 0; i < length; i++) {
            //                     let char1 = str1[i] || '' // Handle undefined if strings are of different lengths
            //                     let char2 = str2[i] || ''
            //                     if (char1 !== char2) {
            //                         differences.push(`Position ${i}: '${char1}' != '${char2}'`)
            //                     }
            //                 }
            // 
            //                 return differences.length > 0 ? differences : 'Strings are identical'
            //             }

            //TODO
            // console.log(innerText)
            // console.log(current.innerText)
            // console.log(current.innerHTML)
            // console.log(compareStrings(innerText, current.innerText.replaceAll(/[\n\r\t]/g, '')))

            // might not work in every case; in some cases the innerText is empty or null 
            // for some reason; innerHTML can only be used as a substitute if no html tags 
            // are used inside;
            //&& current.innerHTML.replaceAll(/[\n\r\t]/g, '') !== innerText //TODO
            if (current.innerText.replaceAll(/[\n\r\t]/g, '') !== innerText) return accumulator

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
                console.log(textElement.textContent.toLowerCase())
                console.log(word)
                if (startIndex == -1) return

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
    }, [pageName, searchParams])
}