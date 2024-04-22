import tinycolor from 'tinycolor2'
import { isDebugEnabled, isMotionSafe, maximumDelay, repeatDelay } from './parameters'
import { KeyboardEventState, NullableBoolean, NullableElement, NullableNumber, TimeoutRef } from './types'
import { useLayoutStore } from '../hooks/stores'

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

export function clearKeyDownTimeout(keyboardEventState: KeyboardEventState, keyDownTimeoutRef: TimeoutRef): void {
    keyboardEventState.setEvent(undefined)
    clearTimeout(keyDownTimeoutRef.current)
    keyDownTimeoutRef.current = undefined
}

export function focusFirstChildElement(element: HTMLElement | null, query: string): void {
    if (element == null) return
    getFirstChildElement(element, query)?.focus()
}

export function focusNextElement(element: NullableElement, query: string): HTMLElement | null {
    if (element == null) return null
    const focusedElement = document.activeElement as HTMLElement | null
    if (focusedElement == null) return null
    const focusableElements = Array.from(element.querySelectorAll<HTMLElement>(query))

    const nextIndex = Math.min(focusableElements.indexOf(focusedElement) + 1, focusableElements.length - 1)
    const nextElement = focusableElements[nextIndex]
    nextElement?.focus()
    return nextElement
}

export function focusPreviousElement(element: NullableElement, query: string): HTMLElement | null {
    if (element == null) return null
    const focusedElement = document.activeElement as HTMLElement | null
    if (focusedElement == null) return null
    const focusableElements = Array.from(element.querySelectorAll<HTMLElement>(query))

    // previousIndex is -1 if the element is not found or null;
    const previousIndex = Math.max(focusableElements.indexOf(focusedElement) - 1, 0)
    const previousElement = focusableElements[previousIndex]
    previousElement?.focus()
    return previousElement
}

export function getFirstChildElement(element: NullableElement, query: string): NullableElement {
    if (element == null) return null
    return element.querySelector(query) as HTMLElement
}

export function handleFocusCapture(indexGroup: string): (event: FocusEvent) => void {
    return (event) => {
        scrollIntoView(event.target as HTMLElement)
        useLayoutStore.getState().setIndexGroup(indexGroup)
    }
}

//TODO; check other things like sidenav for isMotionSafe;
export function scrollIntoView(element: HTMLElement | null): void {
    element?.scrollIntoView({ behavior: isMotionSafe ? 'smooth' : 'instant', block: 'center', inline: 'center' })
}

export function repeatKeyDownInput(handleInput: () => void, delay: number): NodeJS.Timeout {
    return setTimeout(() => { handleInput() }, delay)
}

export function stopKeyDownInput(): NodeJS.Timeout {
    return setTimeout(() => { }, maximumDelay)
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
