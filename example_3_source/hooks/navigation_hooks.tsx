// import { useSearchParams } from 'next/navigation'
// import { useEffect } from 'react'
// import { indexEntryTypesString, isDebugEnabled } from '../constants/general_constants'
// 
// export { useNavigateAndHighlightElement }
// 
// //
// // functions
// //
// 
// //
// // main
// //
// 
// function useNavigateAndHighlightElement(pageName?: string): void {
//     pageName ??= 'Page'
//     const searchParams = useSearchParams()
// 
//     // navigate to searched element;
//     useEffect(() => {
//         const innerText = searchParams.get('search')?.replaceAll(/[\n\r\t]/g, '')
//         if (innerText == null) return
// 
//         const searchResultElementArray = Array.from(document.querySelectorAll(indexEntryTypesString)).reduce<HTMLElement[]>((accumulator, current) => {
//             if (!(current instanceof HTMLElement)) return accumulator
// 
//             // might not work in every case; in some cases the innerText is empty or null 
//             // for some reason; this seems to be happening inside <details> elements; inner
//             // HTML can only be used as a substitute if no html tags are used inside;
//             if (current.innerText.replaceAll(/[\n\r\t]/g, '') !== innerText && current.innerHTML.replaceAll(/[\n\r\t]/g, '') !== innerText) return accumulator
// 
//             accumulator.push(current)
//             return accumulator
//         }, [])
// 
//         if (searchResultElementArray.length < 1) {
//             // TODO: got this when searching for the back-end link url; lol, I have to deploy first for the url to match; todo check if it works when deployed;
//             if (isDebugEnabled) console.log(`${pageName}: No element found for search params "${innerText}".`)
//             return
//         }
// 
//         if (isDebugEnabled) console.log(`${pageName}: Found element from search params.`)
//         const firstSearchResultElement = searchResultElementArray[0]
//         firstSearchResultElement.focus()
// 
//         const detailsElement = firstSearchResultElement.closest('details')
//         if (detailsElement != null) detailsElement.setAttribute('open', '')
//         const highlightWordArray = searchParams.get('select')?.split(',')
//         const selection = window.getSelection()
// 
//         if (highlightWordArray != null && selection != null) {
//             selection.removeAllRanges()
//             const textElement = getTextNode(firstSearchResultElement)
// 
//             highlightWordArray.forEach((word) => {
//                 if (textElement == null) return
//                 if (textElement.textContent == null) return
//                 const startIndex = textElement.textContent.toLowerCase().indexOf(word.toLowerCase())
//                 if (startIndex === -1) return
// 
//                 const range = document.createRange()
//                 if (selection.rangeCount < 1) {
//                     range.setStart(textElement, startIndex)
//                     range.setEnd(textElement, startIndex + word.length)
//                     selection.addRange(range)
//                     return
//                 }
// 
//                 range.setEnd(textElement, startIndex + word.length)
//                 selection.extend(textElement, range.endOffset)
//             })
//         }
//     }, [pageName, searchParams])
// }