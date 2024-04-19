import React, { KeyboardEvent, ReactNode, useEffect } from 'react'
import { useSidenavStore } from '../layout/Sidenav'
import { triggerFlashEffect } from '../../constants/event_constants'
import { initialDelay, maximumDelay, isDebugEnabled } from '../../constants/general_constants'
import { BooleanRef, DropdownMenu, DropdownMenuState, DropdownMenuStore, GlobalState, SidenavState, TimeoutRef } from '../../constants/types'
import { create } from 'zustand'
import { useGlobalStore } from '../../hooks/general'

export default DropdownMenu
export { useDropdownMenuStoreArray }
export { handleInput as handleInput_DropdownMenu }

//
// parameters and variables
//

const useDropdownMenuStoreArray: DropdownMenuStore[] = [...Array(2)].map(() => (create<DropdownMenuState>((set) => ({
    buttonElement: null,
    setButtonElement: (buttonElement) => set(() => ({ buttonElement })),
    contentElement: null,
    setContentElement: (contentElement) => set(() => ({ contentElement })),

    element: null,
    setElement: (element) => set(() => ({ element })),
    iconElement: null,
    setIconElement: (iconElement) => set(() => ({ iconElement })),

    isOpen: false,
    setIsOpen: (isOpen) => set(() => ({ isOpen })),
}))))

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

function handleInput(dropdownMenuState: DropdownMenuState, event: KeyboardEvent, isKeyInputRepeatingRef: BooleanRef, sidenavState: SidenavState): void {
    if (dropdownMenuState.element == null) return
    if (!dropdownMenuState.element?.contains(document.activeElement)) return

    if (document.activeElement === dropdownMenuState.buttonElement) {
        //TODO
        // if (event.target === dropdownMenuState.buttonElement) {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()

            toggleContent(dropdownMenuState, sidenavState)
            triggerFlashEffect(event)
            isKeyInputRepeatingRef.current = false
            return
        }

        if (event.key === 'ArrowRight' && !dropdownMenuState.isOpen) {
            event.preventDefault()
            event.stopPropagation()

            toggleContent(dropdownMenuState, sidenavState)
            triggerFlashEffect(event)
            isKeyInputRepeatingRef.current = false
            return
        }
    }

    if (event.key === 'ArrowLeft' && dropdownMenuState.isOpen) {
        console.log('hello3')
        event.preventDefault()
        event.stopPropagation()

        toggleContent(dropdownMenuState, sidenavState)
        dropdownMenuState.buttonElement?.focus()
        isKeyInputRepeatingRef.current = false
        return
    }
}

//
// main
//

function DropdownMenu(props: {
    id: number,
    children?: ReactNode,
    className?: string,
    text?: ReactNode,
}): DropdownMenu {
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
    }, [dropdownMenuState, sidenavState, sidenavState.lastActiveDropdownElement])

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
                    <i ref={dropdownMenuState.setIconElement} className="icon-medium material-icons justify-self-end transition-all ease-out duration-300">computer</i>
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
