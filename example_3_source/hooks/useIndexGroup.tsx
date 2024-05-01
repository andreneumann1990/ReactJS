import { useEffect, useRef } from 'react'
import { NullableHTMLElement } from '../constants/types'
import { useLayoutStore } from './useStore'
import { handleFocusCapture } from '../constants/functions'

//
//
//

// sets the tabIndex property of all elements found using the selectors string;
// the value is either 0 or -1 based on the corresponding indexGroup string of the 
// closest containerElement vs the global activeIndexGroup in layoutState;
// containerElements are elements with a data-index-group attribute;
export function useIndexGroupEffect(rootContainerElement: NullableHTMLElement, selectors: string): void {
    //
    // parameters and variables
    //

    const layoutState = useLayoutStore()
    const containerElementArrayRef = useRef<{ containerElement: HTMLElement, indexGroup: string }[]>([])

    //
    // effects
    //

    useEffect(() => {
        // the if statement makes sure that the variables are initialized only once;
        if (rootContainerElement == null) return
        containerElementArrayRef.current = []

        let indexGroup = rootContainerElement.dataset.indexGroup
        if (indexGroup != null) {
            containerElementArrayRef.current.push({ containerElement: rootContainerElement, indexGroup })
        }

        rootContainerElement.querySelectorAll<HTMLElement>('[data-index-group]').forEach((containerElement) => {
            let indexGroup = containerElement.dataset.indexGroup
            if (indexGroup == null) return
            containerElementArrayRef.current.push({ containerElement, indexGroup })
        })
    }, [rootContainerElement, selectors])

    useEffect(() => {
        if (rootContainerElement == null) return
        containerElementArrayRef.current.forEach(({ containerElement, indexGroup }) => {
            containerElement.querySelectorAll<HTMLElement>(selectors).forEach((element) => {
                if (element.dataset.noTabIndexOverride) return
                element.tabIndex = layoutState.indexGroup === indexGroup ? 0 : -1
            })
        })
    }, [rootContainerElement, layoutState.indexGroup, selectors])
}

// keep useIndexGroupContainer and useIndexGroupItem(s) separate; the onFocusCapture
// interferes with tabIndex;
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