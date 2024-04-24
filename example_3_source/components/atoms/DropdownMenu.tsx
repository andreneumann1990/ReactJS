import React, { ReactNode, useEffect } from 'react'
import { triggerFlashEffect } from '../../constants/functions'
import { isDebugEnabled, sidenavIndexGroup } from '../../constants/parameters'
import { NullableBoolean, DropdownMenuState, SidenavState } from '../../constants/types'
import { useDropdownMenuStoreArray, useGlobalStore, useLayoutStore, useSidenavStore } from '../../hooks/stores'

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
    // if (isDebugEnabled) console.log(`DropdownMenu: isOpen ${!dropdownMenuState.isOpen}`)

    if (dropdownMenuState.isOpen) {
        dropdownMenuState.setIsOpen(false)
        delete dropdownMenuState.contentElement.dataset.active

        dropdownMenuState.contentElement.style.height = '0'
        dropdownMenuState.iconElement.style.transform = 'rotate(0deg)'
        return
    }

    dropdownMenuState.setIsOpen(true)
    dropdownMenuState.contentElement.dataset.active = ''

    let contentHeight = 0
    dropdownMenuState.contentElement.childNodes.forEach((element: Node) => {
        if (!(element instanceof HTMLAnchorElement)) return
        contentHeight += element.offsetHeight
    })

    dropdownMenuState.contentElement.style.height = `${contentHeight}px`
    dropdownMenuState.iconElement.style.transform = 'rotate(-180deg)'
    useSidenavStore.getState().setLastActiveDropdownElement(dropdownMenuState.buttonElement)
}

function handleKeyDown_Global(id: number, event: React.KeyboardEvent): NullableBoolean {
    const dropdownMenuState: DropdownMenuState | undefined = useDropdownMenuStoreArray[id].getState()
    if (dropdownMenuState == null) return null
    if (dropdownMenuState.element == null) return null
    if (!dropdownMenuState.element?.contains(document.activeElement)) return null

    if (document.activeElement === dropdownMenuState.buttonElement) {
        //TODO
        // if (event.target === dropdownMenuState.buttonElement) {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()

            toggleContent(id)
            triggerFlashEffect(event)
            return false
        }

        if (event.key === 'ArrowRight' && !dropdownMenuState.isOpen) {
            event.preventDefault()
            event.stopPropagation()

            toggleContent(id)
            triggerFlashEffect(event)
            return false
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
        return true
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

    const globalState = useGlobalStore()
    const { sidenavState } = globalState
    const dropdownMenuState = useDropdownMenuStoreArray[props.id]()
    // const dropdownMenuState = props.dropdownMenuState

    // const sidenavState = useSidenavStore()

    // const buttonRef = useRef<HTMLButtonElement | null>(null)
    // const contentRef = useRef<HTMLDivElement | null>(null)
    // const dropdownRef = useRef<HTMLDivElement | null>(null)
    // const iconRef = useRef<NullableHTMLElement>(null)

    // const [dropdownMenuState.isOpen, dropdownMenuState.setIsOpen] = useState<boolean>(false)
    const queryString = 'a, button'

    //
    // effects
    //

    // close this one if another dropdown menu got opened;
    useEffect(() => {
        if (!dropdownMenuState.isOpen) return
        if (sidenavState.lastActiveDropdownElement == null) return

        if (dropdownMenuState.buttonElement == null) return
        if (dropdownMenuState.buttonElement === sidenavState.lastActiveDropdownElement) return
        toggleContent(props.id)
    }, [dropdownMenuState.buttonElement, dropdownMenuState.isOpen, props.id, sidenavState.lastActiveDropdownElement])

    const layoutState = useLayoutStore()

    // update tabIndex; in contrast to useTabIndexEffect() this changes the tabIndex
    // based on a state (i.e. isOpen) rather than layoutState.activeIndexGroup;
    useEffect(() => {
        // the layoutState.indexGroup dependency and setTimeout() are necessary; otherwise,
        // the changes will get overriden by useIndexGroupEffect();
        setTimeout(() => {
            if (layoutState.indexGroup !== sidenavIndexGroup) return
            const contentElement = dropdownMenuState.contentElement
            if (contentElement == null) return

            if (dropdownMenuState.isOpen) {
                contentElement.querySelectorAll<HTMLElement>(queryString).forEach(element => {
                    element.tabIndex = 0
                })
                return
            }

            contentElement.querySelectorAll<HTMLElement>(queryString).forEach(element => {
                element.tabIndex = -1
            })
        }, 1)
    }, [dropdownMenuState.contentElement, dropdownMenuState.isOpen, layoutState.indexGroup])

    //
    //
    //

    return (
        <div
            className={props.className}
            ref={dropdownMenuState.setElement}
        >
            <button
                className="block p-5 w-full text-left text-2xl"
                onPointerUp={() => toggleContent(props.id)}
                ref={dropdownMenuState.setButtonElement}
            >
                <div className="grid grid-cols-2 items-center">
                    {props.text}
                    <i ref={dropdownMenuState.setIconElement} className="icon-medium material-icons justify-self-end motion-safe:transition-transform motion-safe:ease-out motion-safe:duration-300">computer</i>
                </div>
            </button>
            <div
                // the height needs to be directly changed; otherwise, the transition will not 
                // work;
                className="bg-background transition-none motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out overflow-y-hidden"
                ref={dropdownMenuState.setContentElement}
                style={{ height: 0 }}
            >
                {props.children}
            </div>
        </div>
    )
}
