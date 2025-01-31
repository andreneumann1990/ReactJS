import React, { ReactNode, useEffect } from 'react'
import { triggerFlashEffect } from '../../constants/functions'
import { isDebugEnabled, maximumDelay, repeatDelay, sidenavIndexGroup } from '../../constants/parameters'
import { DropdownMenuState, NullableNumber } from '../../constants/types'
import { useDropdownMenuStoreArray, useLayoutStore, useSidenavStore } from '../../hooks/useStore'

export default DropdownMenu
export { handleKeyDown_Global as handleKeyDown_DropdownMenu }

//
// functions
//

function toggleContent(id: number): void {
    const dropdownMenuState: DropdownMenuState | undefined = useDropdownMenuStoreArray[id].getState()
    if (dropdownMenuState == null) return
    if (dropdownMenuState.contentElement == null) return
    if (dropdownMenuState.iconElement == null) return
    if (isDebugEnabled) console.log('DropdownMenu: Toggle menu.')

    if (dropdownMenuState.isOpen) {
        dropdownMenuState.setIsOpen(false)
        delete dropdownMenuState.contentElement.dataset.active
        dropdownMenuState.contentElement.style.height = '0'
        return
    }

    dropdownMenuState.setIsOpen(true)
    dropdownMenuState.contentElement.dataset.active = ''
    useSidenavStore.getState().setLastActiveDropdownMenuElement(dropdownMenuState.buttonElement)

    // there a trick using max-height; but that can mess with the timing of the transition;
    // it waits until max-height is the exact value even when the element is already fully
    // visible;
    let contentHeight = 0
    dropdownMenuState.contentElement.querySelectorAll<HTMLAnchorElement>('a').forEach((element) => {
        contentHeight += element.offsetHeight
    })
    dropdownMenuState.contentElement.style.height = `${contentHeight}px`
}

function handleKeyDown_Global(id: number, event: React.KeyboardEvent): NullableNumber {
    const dropdownMenuState: DropdownMenuState | undefined = useDropdownMenuStoreArray[id].getState()
    if (dropdownMenuState == null) return null
    if (dropdownMenuState.element == null) return null
    if (!dropdownMenuState.element?.contains(document.activeElement)) return null

    if (document.activeElement === dropdownMenuState.buttonElement) {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()

            toggleContent(id)
            triggerFlashEffect(event)
            return maximumDelay
        }

        if (event.key === 'ArrowRight' && !dropdownMenuState.isOpen) {
            event.preventDefault()
            event.stopPropagation()

            toggleContent(id)
            triggerFlashEffect(event)
            return maximumDelay
        }

        if (event.key === 'ArrowLeft' && dropdownMenuState.isOpen) {
            triggerFlashEffect(event)
        }
    }

    if (event.key === 'ArrowLeft' && dropdownMenuState.isOpen) {
        event.preventDefault()
        event.stopPropagation()

        toggleContent(id)
        dropdownMenuState.buttonElement?.focus()
        return repeatDelay
    }
    return null
}

//
// main
//

function DropdownMenu(props: {
    id: number,
    children?: ReactNode,
    className?: string,
    text?: ReactNode,
}): React.JSX.Element {
    //
    // parameters and variables
    //

    const queryString = 'a, button'

    let useDropdownMenuStore = useDropdownMenuStoreArray[props.id]
    if (useDropdownMenuStore == null) {
        console.log(`DropdownMenu-Warning: No store found for id ${props.id}. Use id = 0 instead.`)
        useDropdownMenuStore = useDropdownMenuStoreArray[0]
    }

    const activeIndexGroup = useLayoutStore(state => state.indexGroup)
    const buttonElement = useDropdownMenuStore(state => state.buttonElement)
    const contentElement = useDropdownMenuStore(state => state.contentElement)

    const isDropdownMenuOpen = useDropdownMenuStore(state => state.isOpen)
    const lastActiveDropdownElement = useSidenavStore(state => state.lastActiveDropdownMenuElement)

    const setButtonElement = useDropdownMenuStore(state => state.setButtonElement)
    const setContentElement = useDropdownMenuStore(state => state.setContentElement)
    const setDropdownMenuElement = useDropdownMenuStore(state => state.setElement)
    const setIconElement = useDropdownMenuStore(state => state.setIconElement)

    //
    // effects
    //

    // close this one if another dropdown menu got opened;
    useEffect(() => {
        if (!isDropdownMenuOpen) return
        if (lastActiveDropdownElement == null) return

        if (buttonElement == null) return
        if (buttonElement === lastActiveDropdownElement) return
        toggleContent(props.id)
    }, [buttonElement, isDropdownMenuOpen, props.id, lastActiveDropdownElement])

    // update tabIndex; in contrast to useTabIndexEffect() this changes the tabIndex
    // based on a state (i.e. isOpen) rather than layoutState.activeIndexGroup;
    useEffect(() => {
        // the activeIndexGroup dependency and setTimeout() are necessary; otherwise,
        // the changes will get overriden by useIndexGroupEffect();
        setTimeout(() => {
            if (activeIndexGroup !== sidenavIndexGroup) return
            if (contentElement == null) return

            if (isDropdownMenuOpen) {
                contentElement.querySelectorAll<HTMLElement>(queryString).forEach(element => {
                    element.tabIndex = 0
                })
                return
            }

            contentElement.querySelectorAll<HTMLElement>(queryString).forEach(element => {
                element.tabIndex = -1
            })
        }, 1)
    }, [contentElement, isDropdownMenuOpen, activeIndexGroup])

    //
    //
    //

    return (
        <div
            className={props.className}
            ref={setDropdownMenuElement}
        >
            <button
                className="block p-5 w-full text-left text-2xl"
                onPointerUp={() => toggleContent(props.id)}
                ref={setButtonElement}
            >
                <div className="grid [grid-template-columns:1fr_32px] items-center">
                    {props.text}
                    <i
                        className="icon-medium material-icons justify-self-end transition-none motion-safe:[transition-property:transform] ease-linear duration-300"
                        ref={setIconElement}
                        style={{
                            transform: isDropdownMenuOpen ? 'rotate(-180deg)' : 'rotate(0)',
                        }}
                    >computer</i>
                </div>
            </button>
            <div
                // the height needs to be directly changed; otherwise, the transition will not 
                // work;
                className="bg-background transition-none motion-safe:[transition-property:height] ease-linear duration-300 overflow-y-hidden"
                ref={setContentElement}
                style={{ height: 0 }}
            >
                {props.children}
            </div>
        </div>
    )
}
