import tinycolor from 'tinycolor2'

export { debounceEventFunction }
export { triggerFlashEffect }

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

function debounceEventFunction(eventFunction: (...args: any[]) => void, timeout_ms: number): (...args: any[]) => void {
    let timer: number
    return (...args: any[]) => {
        clearTimeout(timer)
        console.log('clear timer')
        timer = window.setTimeout(() => {
            eventFunction.apply(window, args)
        }, timeout_ms)
    }
}

function triggerFlashEffect(event: { target: EventTarget | null }): void {
    const element = event.target as HTMLElement | null
    if (element == null) return
    const containerElement = getFocusableContainer(element)
    if (containerElement == null) return

    const backgroundColorString = containerElement.style.backgroundColor
    const backgroundColor = tinycolor(containerElement.style.backgroundColor)
    containerElement.animate({ backgroundColor: [backgroundColorString, backgroundColor.brighten(50).toString(), backgroundColorString] }, 300)
}
