import { useEffect, useRef } from 'react'
import { NullableHTMLElement } from '../constants/types'
import { useLayoutStore } from './stores'
import { handleFocusCapture } from '../constants/functions'

//
//
//

export function useIndexGroupEffect(containerElement: NullableHTMLElement, indexGroup: string, selectors: string): void {
    //
    // parameters and variables
    //

    const layoutState = useLayoutStore()
    const elementArrayRef = useRef<NodeListOf<Element>>()
    const isInitializedRef = useRef<boolean>()

    //
    // effects
    //

    useEffect(() => {
        if (containerElement == null) return
        elementArrayRef.current = containerElement.querySelectorAll(selectors)
    }, [containerElement, selectors])

    useEffect(() => {
        if (containerElement == null) return
        if (elementArrayRef.current == null) return

        elementArrayRef.current.forEach((element: Element) => {
            if (!(element instanceof HTMLElement)) return
            console.log(element.dataset.indexGroup) //TODO
            if (element.dataset.indexGroup != indexGroup) return
            element.dataset.indexGroup = indexGroup
            element.tabIndex = layoutState.indexGroup === indexGroup ? 0 : -1
        })
    }, [containerElement, indexGroup, layoutState.indexGroup, selectors])

    useEffect(() => {
        if (containerElement == null) return
        if (elementArrayRef.current == null) return
        if (isInitializedRef.current) return

        elementArrayRef.current.forEach((element: Element) => {
            if (!(element instanceof HTMLElement)) return
            if (element.dataset.indexGroup != indexGroup) return
            element.addEventListener('focusin', handleFocusCapture(indexGroup), true)
        })
        isInitializedRef.current = true

        return () => {
            if (elementArrayRef.current == null) return
            elementArrayRef.current.forEach((element: Element) => {
                if (!(element instanceof HTMLElement)) return
                if (element.dataset.indexGroup != indexGroup) return
                element.removeEventListener('focusin', handleFocusCapture(indexGroup), true)
            })
        }
    }, [containerElement, indexGroup, selectors])
}

export function useIndexGroup(indexGroup: string) {
    const layoutState = useLayoutStore()
    return {
        'data-index-group': indexGroup,
        onFocusCapture: () => { handleFocusCapture(indexGroup) },
        tabIndex: layoutState.indexGroup === indexGroup ? 0 : -1,
    }
}