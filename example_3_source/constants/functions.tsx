import tinycolor from 'tinycolor2'
import { isDebugEnabled, isMotionSafe, maximumDelay, repeatDelay } from './parameters'
import { KeyboardEventState, NullableBoolean, NullableHTMLElement, NullableNumber, TimeoutRef } from './types'
import { useLayoutStore } from '../hooks/stores'

//
// functions
//

const getFocusableContainer = function (target: HTMLElement): NullableHTMLElement {
    if (target instanceof HTMLAnchorElement) return target
    if (target instanceof HTMLButtonElement) return target
    if (target.parentElement == null) return null
    return getFocusableContainer(target.parentElement)
}

//
// main
//

export function clearKeyDownTimeout(keyboardEventState: KeyboardEventState, keyDownTimeoutRef: TimeoutRef): () => void {
    return () => {
        keyboardEventState.setEvent(undefined)
        clearTimeout(keyDownTimeoutRef.current)
        keyDownTimeoutRef.current = undefined
    }
}

export function focusFirstChildElement(element: NullableHTMLElement, query: string): void {
    if (element == null) return
    getFirstChildElement(element, query)?.focus()
}

export function focusNextElement(element: NullableHTMLElement, query: string): NullableHTMLElement {
    if (element == null) return null
    const focusedElement = document.activeElement as NullableHTMLElement
    if (focusedElement == null) return null
    const focusableElements = Array.from(element.querySelectorAll<HTMLElement>(query))

    const nextIndex = Math.min(focusableElements.indexOf(focusedElement) + 1, focusableElements.length - 1)
    const nextElement = focusableElements[nextIndex]
    nextElement?.focus()
    return nextElement
}

export function focusPreviousElement(element: NullableHTMLElement, query: string): NullableHTMLElement {
    if (element == null) return null
    const focusedElement = document.activeElement as NullableHTMLElement
    if (focusedElement == null) return null
    const focusableElements = Array.from(element.querySelectorAll<HTMLElement>(query))

    // previousIndex is -1 if the element is not found or null;
    const previousIndex = Math.max(focusableElements.indexOf(focusedElement) - 1, 0)
    const previousElement = focusableElements[previousIndex]
    previousElement?.focus()
    return previousElement
}

export function getFirstChildElement(element: NullableHTMLElement, query: string): NullableHTMLElement {
    if (element == null) return null
    return element.querySelector(query) as HTMLElement
}

export function handleFocusCapture(indexGroup: string): (event: React.FocusEvent) => void {
    return (event) => {
        scrollIntoView(event.target as HTMLElement)
        useLayoutStore.getState().setIndexGroup(indexGroup)
    }
}

export function scrollIntoView(element?: NullableHTMLElement): void {
    element?.scrollIntoView({ behavior: isMotionSafe ? 'smooth' : 'instant', block: 'center', inline: 'center' })
}

export function repeatKeyDownInput(handleInput: () => void, delay: number): NodeJS.Timeout {
    return setTimeout(() => { handleInput() }, delay)
}

export function stopKeyDownInput(): NodeJS.Timeout {
    return setTimeout(() => { }, maximumDelay)
}

export function triggerFlashEffect(event: { target: EventTarget | null }): void {
    const element = event.target as NullableHTMLElement
    if (element == null) return
    const containerElement = getFocusableContainer(element)
    if (containerElement == null) return

    const backgroundColorString = containerElement.style.backgroundColor
    const backgroundColor = tinycolor(containerElement.style.backgroundColor)
    containerElement.animate({ backgroundColor: [backgroundColorString, backgroundColor.brighten(50).toString(), backgroundColorString] }, 300)
}
