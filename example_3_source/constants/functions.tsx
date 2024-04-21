import tinycolor from 'tinycolor2'
import { isDebugEnabled } from './parameters'
import { NullableElement } from './types'

//
// functions
//

const getFocusableContainer = function (target: HTMLElement): HTMLElement | null {
    if (target instanceof HTMLAnchorElement) return target
    if (target instanceof HTMLButtonElement) return target
    if (target.parentElement == null) return null
    return getFocusableContainer(target.parentElement)
}

//
// main
//

export function debounceEventFunction(eventFunction: (...args: any[]) => void, timeout_ms: number): (...args: any[]) => void {
    let timer: number
    return (...args: any[]) => {
        clearTimeout(timer)
        if (isDebugEnabled) console.log('EventConstants: Clear debounce timer.')
        timer = window.setTimeout(() => { eventFunction.apply(window, args) }, timeout_ms)
    }
}

export function focusNextElement(element: NullableElement, queryString: string): HTMLElement | null {
    if (element == null) return null
    const focusedElement = document.activeElement as HTMLElement | null
    if (focusedElement == null) return null
    const focusableElements = Array.from(element.querySelectorAll<HTMLElement>(queryString))

    const nextIndex = Math.min(focusableElements.indexOf(focusedElement) + 1, focusableElements.length - 1)
    const nextElement = focusableElements[nextIndex]
    nextElement?.focus()
    return nextElement
}

export function focusPreviousElement(element: NullableElement, queryString: string): HTMLElement | null {
    if (element == null) return null
    const focusedElement = document.activeElement as HTMLElement | null
    if (focusedElement == null) return null
    const focusableElements = Array.from(element.querySelectorAll<HTMLElement>(queryString))

    // previousIndex is -1 if the element is not found or null;
    const previousIndex = Math.max(focusableElements.indexOf(focusedElement) - 1, 0)
    const previousElement = focusableElements[previousIndex]
    previousElement?.focus()
    return previousElement
}

export function scrollIntoView(element: HTMLElement | null): void {
    //TODO; check again if other parameters are better;
    element?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
}

export function triggerFlashEffect(event: { target: EventTarget | null }): void {
    const element = event.target as HTMLElement | null
    if (element == null) return
    const containerElement = getFocusableContainer(element)
    if (containerElement == null) return

    const backgroundColorString = containerElement.style.backgroundColor
    const backgroundColor = tinycolor(containerElement.style.backgroundColor)
    containerElement.animate({ backgroundColor: [backgroundColorString, backgroundColor.brighten(50).toString(), backgroundColorString] }, 300)
}
