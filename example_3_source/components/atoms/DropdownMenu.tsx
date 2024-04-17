import { KeyboardEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useSidenavStore } from '../layout/Sidenav'
import { triggerFlashEffect } from '../../constants/event_constants'
import { isDebugEnabled } from '../../constants/general_constants'

export default DropdownMenu

//
//
//

function DropdownMenu({ children, className, text }: {
    children?: ReactNode
    className?: string
    text?: ReactNode
}) {
    //
    // parameters and variables
    //

    const sidenavStore = useSidenavStore()

    const menuReference = useRef<HTMLDivElement | null>(null)
    const iconReference = useRef<HTMLElement | null>(null)

    const [contentReference, setContentReference] = useState<HTMLElement | null>(null)
    // const [contentHeight, setContentHeight] = useState<number>(0)
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

    //
    // functions
    //

    function handleArrowLeft(event: KeyboardEvent): void {
        if (menuReference.current == null) return
        if (event.key === 'ArrowLeft' && isDropdownOpen) {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()

            const menuButton = menuReference.current.querySelector('a')
            if (menuButton != null) menuButton.focus()
            return
        }
    }

    function toggleContentKeyInput(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()
            triggerFlashEffect(event)
            return
        }

        if (event.key === 'ArrowRight' && !isDropdownOpen) {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()
            triggerFlashEffect(event)
            return
        }

        if (event.key === 'ArrowLeft' && isDropdownOpen) {
            event.preventDefault()
            event.stopPropagation()
            toggleContent()
            return
        }
    }

    const toggleContent = useCallback(() => {
        if (menuReference.current === null) return
        if (contentReference === null) return

        if (iconReference.current === null) return
        if (isDebugEnabled) console.log(`Dropdown: isOpen ${!isDropdownOpen}`)

        if (isDropdownOpen) {
            setIsDropdownOpen(false)
            delete menuReference.current.dataset.active
            delete contentReference.dataset.active
            console.log('deactivate')

            // menuReference.current.classList.remove('active') //TODO
            // contentReference.current.classList.add('hidden')
            // contentReference.current.classList.remove('active')

            contentReference.style.height = '0' //TODO
            iconReference.current.style.transform = 'rotate(0deg)'
            return
        }

        setIsDropdownOpen(true)
        menuReference.current.dataset.active = ''
        console.log('activate')
        contentReference.dataset.active = ''

        let contentHeight = 0
        contentReference.childNodes.forEach((element: Node) => {
            if (!(element instanceof HTMLAnchorElement)) return
            contentHeight += element.offsetHeight
        })
        console.log('content height ' + contentHeight) //TODO

        // contentReference.current.classList.remove('hidden')
        // contentReference.current.classList.add('active')
        contentReference.style.height = `${contentHeight}px`

        iconReference.current.style.transform = 'rotate(-180deg)'
        sidenavStore.setLastActiveDropdownElement(menuReference.current)
    },
        [contentReference, isDropdownOpen, sidenavStore])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // [isDropdownOpen, sidenavStore.setLastActiveDropdownElement])

    //
    // effects
    //

    useEffect(() => {
        if (contentReference == null) return
        // let contentHeight = 0
        // contentReference.childNodes.forEach((element: Node) => {
        //     if (!(element instanceof HTMLAnchorElement)) return
        //     contentHeight += element.offsetHeight
        // })
        // console.log(contentReference.childNodes)
        // if (children == null) return
        // console.log(typeof children.valueOf())
        // React.Children.forEach(children, (element) => {
        //     console.log(element)
        //     if (!(element instanceof HTMLAnchorElement)) return
        //     // contentHeight += element.offsetHeight
        // })
        // const contentHeight = Object.values(children.valueOf()).reduce((accumulator, current) => {
        //     console.log(current)
        //     if (!(current instanceof HTMLAnchorElement)) return accumulator
        //     accumulator += current.offsetHeight
        // }, 0)
        // console.log(Object.values(children.valueOf()))
        // if (!(children implements Iterable<ReactNode>)) return
        // children.forEach((element: Node) => {
        //     if (!(element instanceof HTMLAnchorElement)) return
        //     contentHeight += element.offsetHeight
        // })
        // console.log('contentHeight ' + contentHeight)
        // setContentHeight(contentHeight)
    }, [children, contentReference])

    // close this one if another dropdown menu got opened;
    useEffect(() => {
        if (isDebugEnabled) console.log(`Dropdown: isOpen ${isDropdownOpen}`)
        if (!isDropdownOpen) return
        if (sidenavStore.lastActiveDropdownElement == null) return

        if (menuReference.current == null) return
        if (menuReference.current === sidenavStore.lastActiveDropdownElement) return
        toggleContent()
    }, [isDropdownOpen, sidenavStore.lastActiveDropdownElement, toggleContent])

    //TODO
    // update tabindex;
    useEffect(() => {
        if (contentReference == null) return
        if (menuReference.current == null) return

        if (!sidenavStore.isOpen) {
            menuReference.current.querySelectorAll('a').forEach(element => {
                element.tabIndex = -1
            })
            return
        }

        const menuButton = menuReference.current.querySelector('a')
        if (menuButton != null) menuButton.removeAttribute('tabIndex')

        if (isDropdownOpen) {
            contentReference.querySelectorAll('a').forEach(element => {
                element.removeAttribute('tabIndex')
            })
            return
        }

        contentReference.querySelectorAll('a').forEach(element => {
            element.tabIndex = -1
        })
    }, [contentReference, isDropdownOpen, sidenavStore.isOpen])

    //
    //
    //

    return (<>
        {/* the div block is for changing the background color; the anchor changed its bg-color based on hover; */}
        <div
            ref={menuReference}
            className={(className == null ? '' : className)}
        >
            {/* TODO; change to buttons for semantics; */}
            <button
                className="block p-5 w-full text-left text-2xl"
                onKeyUp={toggleContentKeyInput}
                onPointerUp={toggleContent}
            >
                <div className="grid grid-cols-2 items-center">
                    {text}
                    <i ref={iconReference} className="icon-medium material-icons justify-self-end transition-all ease-out duration-300">computer</i>
                </div>
            </button>
            <div
                ref={setContentReference}
                // the height needs to be directly changed; otherwise, the transition will not 
                // work;
                className="bg-background transition-all duration-300 ease-out overflow-y-hidden"
                style={{ height: 0 }}
                onKeyUp={handleArrowLeft}
            >
                {children}
            </div>
        </div>
    </>)
}
