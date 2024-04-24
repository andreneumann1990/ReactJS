import { useEffect, useRef } from 'react'
import { NullableHTMLElement } from '../constants/types'
import { useLayoutStore } from './stores'
import { handleFocusCapture } from '../constants/functions'

//
//
//

export function useIndexGroupEffect(rootContainerElement: NullableHTMLElement, indexGroup: string, selectors: string): void {
    //
    // parameters and variables
    //

    const layoutState = useLayoutStore()
    const elementArrayRef = useRef<HTMLElement[]>([])
    const indexGroupArrayRef = useRef<string[]>([])

    //
    // effects
    //

    useEffect(() => {
        // the if statement makes sure that the variables are initialized only once;
        if (rootContainerElement == null) return
        let excludedContainerArray: HTMLElement[] = []

        console.log('-----')
        indexGroupArrayRef.current = []
        // containerElement.querySelectorAll<HTMLElement>(`*:not([data-index-group="${indexGroup}"])`).forEach((element) => {
        rootContainerElement.querySelectorAll<HTMLElement>('[data-index-group]').forEach((element) => {
            console.log(element.dataset.indexGroup) //TODO
            let indexGroup = element.dataset.indexGroup
            if (indexGroup == null) return
            indexGroupArrayRef.current.push()
            if (element.dataset.indexGroup == null) return
            excludedContainerArray.push(element)
        })

        elementArrayRef.current = []
        rootContainerElement.querySelectorAll<HTMLElement>(selectors).forEach((element) => {
            let isExcluded = false
            excludedContainerArray.forEach((excludedContainerElement) => {
                if (!excludedContainerElement.contains(element)) return
                isExcluded = true
            })

            if (isExcluded) return
            elementArrayRef.current.push(element)
        })

        //TODO; it should be enough using onFocusCapture() on container elements;
        //         elementArrayRef.current.forEach((element) => {
        //             element.addEventListener('focus', handleFocusCapture(indexGroup), true)
        //         })
        // 
        //         return () => {
        //             elementArrayRef.current.forEach((element) => {
        //                 element.removeEventListener('focus', handleFocusCapture(indexGroup), true)
        //             })
        //         }
    }, [rootContainerElement, indexGroup, selectors])

    useEffect(() => {
        if (rootContainerElement == null) return
        elementArrayRef.current.forEach((element) => {
            element.tabIndex = layoutState.indexGroup === indexGroup ? 0 : -1
        })
    }, [rootContainerElement, indexGroup, layoutState.indexGroup, selectors])
}

export function useIndexGroupContainer(indexGroup: string) {
    return {
        'data-index-group': indexGroup,
        onFocusCapture: handleFocusCapture(indexGroup),
    }
}

export function useIndexGroupItem(indexGroup: string) {
    const layoutState = useLayoutStore()
    return {
        tabIndex: layoutState.indexGroup === indexGroup ? 0 : -1,
    }
}