import React, { KeyboardEvent, ReactNode, useEffect } from 'react'
import { triggerFlashEffect } from '../../constants/events'
import { isDebugEnabled } from '../../constants/parameters'
import { NullableBoolean, DropdownMenuState, SidenavState } from '../../constants/types'
import { useDropdownMenuStoreArray, useGlobalStore, useSidenavStore } from '../../hooks/stores'

export default DropdownMenu
export { handleKeyDownInput as handleKeyDownInput_DropdownMenu }

//
// functions
//

function toggleContent(dropdownMenuState: DropdownMenuState, sidenavState: SidenavState): void {
    if (dropdownMenuState.contentElement == null) return
    if (dropdownMenuState.iconElement == null) return
    if (isDebugEnabled) console.log(`Dropdown: isOpen ${!dropdownMenuState.isOpen}`)

    if (dropdownMenuState.isOpen) {
        dropdownMenuState.setIsOpen(false)
        delete dropdownMenuState.contentElement.dataset.active
        console.log('deactivate')

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
    sidenavState.setLastActiveDropdownElement(dropdownMenuState.buttonElement)
}

function handleKeyDownInput(dropdownMenuState: DropdownMenuState, event: KeyboardEvent): NullableBoolean {
    if (dropdownMenuState.element == null) return null
    if (!dropdownMenuState.element?.contains(document.activeElement)) return null
    const sidenavState = useSidenavStore.getState()

    if (document.activeElement === dropdownMenuState.buttonElement) {
        //TODO
        // if (event.target === dropdownMenuState.buttonElement) {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()

            toggleContent(dropdownMenuState, sidenavState)
            triggerFlashEffect(event)
            return false
        }

        if (event.key === 'ArrowRight' && !dropdownMenuState.isOpen) {
            event.preventDefault()
            event.stopPropagation()

            toggleContent(dropdownMenuState, sidenavState)
            triggerFlashEffect(event)
            return false
        }

        if (event.key === 'ArrowLeft' && dropdownMenuState.isOpen) {
            triggerFlashEffect(event)
        }
    }

    if (event.key === 'ArrowLeft' && dropdownMenuState.isOpen) {
        console.log('hello3')
        event.preventDefault()
        event.stopPropagation()

        toggleContent(dropdownMenuState, sidenavState)
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
    // const iconRef = useRef<HTMLElement | null>(null)

    // const [dropdownMenuState.isOpen, dropdownMenuState.setIsOpen] = useState<boolean>(false)
    const queryString = 'a, button'

    //
    // effects
    //

    // close this one if another dropdown menu got opened;
    useEffect(() => {
        if (isDebugEnabled) console.log(`Dropdown: isOpen ${dropdownMenuState.isOpen}`)
        if (!dropdownMenuState.isOpen) return
        if (sidenavState.lastActiveDropdownElement == null) return

        if (dropdownMenuState.buttonElement == null) return
        if (dropdownMenuState.buttonElement === sidenavState.lastActiveDropdownElement) return

        //TODO; toggleContent() does not need everything in sidenavState; check if it is re-rendered too often;
        toggleContent(dropdownMenuState, sidenavState)
    }, [dropdownMenuState, sidenavState])

    // update tabindex;
    useEffect(() => {
        if (dropdownMenuState.buttonElement == null) return
        if (dropdownMenuState.contentElement == null) return
        if (dropdownMenuState.element == null) return

        if (!sidenavState.isOpen) {
            dropdownMenuState.element.querySelectorAll(queryString).forEach(element => {
                if (!(element instanceof HTMLElement)) return
                element.tabIndex = -1
            })
            return
        }

        dropdownMenuState.buttonElement.removeAttribute('tabIndex')
        if (dropdownMenuState.isOpen) {
            dropdownMenuState.contentElement.querySelectorAll(queryString).forEach(element => {
                element.removeAttribute('tabIndex')
            })
            return
        }

        dropdownMenuState.contentElement.querySelectorAll(queryString).forEach(element => {
            if (!(element instanceof HTMLElement)) return
            element.tabIndex = -1
        })
    }, [dropdownMenuState.buttonElement, dropdownMenuState.contentElement, dropdownMenuState.element, dropdownMenuState.isOpen, sidenavState.isOpen])

    //
    //
    //

    return (<>
        {/* the div block is for changing the background color; the anchor changed its bg-color based on hover; */}
        <div
            className={props.className}
            ref={dropdownMenuState.setElement}
        >
            <button
                className="block p-5 w-full text-left text-2xl"
                onPointerUp={() => toggleContent(dropdownMenuState, sidenavState)}
                ref={dropdownMenuState.setButtonElement}
            >
                <div className="grid grid-cols-2 items-center">
                    {props.text}
                    <i ref={dropdownMenuState.setIconElement} className="icon-medium material-icons justify-self-end motion-safe:transition-all ease-out duration-300">computer</i>
                </div>
            </button>
            <div
                // the height needs to be directly changed; otherwise, the transition will not 
                // work;
                className="bg-background transition-all duration-300 ease-out overflow-y-hidden"
                ref={dropdownMenuState.setContentElement}
                style={{ height: 0 }}
            >
                {props.children}
            </div>
        </div>
    </>)
}
