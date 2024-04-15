import tinycolor from 'tinycolor2'

export { triggerFlashEffect }

//
//
//

const triggerFlashEffect = function (event: { target: EventTarget | null }) {
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