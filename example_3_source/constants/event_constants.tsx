import tinycolor from 'tinycolor2'

export { debounceEventFunction }
export { triggerFlashEffect }

//
//
//

function debounceEventFunction(eventFunction: (...args: any[]) => void, timeout_ms: number) {
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

    const getAnchorContainer = function (target: HTMLElement): HTMLAnchorElement | null {
        if (target instanceof HTMLAnchorElement) return target
        if (target.parentElement == null) return null
        return getAnchorContainer(target.parentElement)
    }

    const anchorElement = getAnchorContainer(element)
    if (anchorElement == null) return
    const backgroundColorString = anchorElement.style.backgroundColor
    const backgroundColor = tinycolor(anchorElement.style.backgroundColor)
    anchorElement.animate({ backgroundColor: [backgroundColorString, backgroundColor.brighten(50).toString(), backgroundColorString] }, 300)
}