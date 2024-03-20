import { useRef, useState } from "react"

function MobileDropdown1Component() {
    const content = useRef<HTMLDivElement | null>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const toggleContent = () => {
        if (content.current === null) return
        const classList = content.current.classList

        if (isOpen) {
            classList.add("hidden")
            setIsOpen(false)
            return
        }

        classList.remove("hidden")
        setIsOpen(true)
    }

    return (<>
        <button className="mobile-dropdown" onPointerUp={toggleContent}>
            <div className="grid grid-row-80-20">
                Dropdown 1
                <i className="material-icons grid-row-fit-right">computer</i>
                <i className="material-icons grid-row-fit-right hidden">traffic</i>
            </div>
        </button>
        <div ref={content} className="mobile-dropdown-content hidden">
            <a href="/home">Link 3</a>
            <a href="/home">Link 4</a>
            <a href="/home">Link 5</a>
            <a href="/home">Link 6</a>
            <a href="/home">Link 7</a>
            <a href="/home">Link 8</a>
        </div>
    </>)
}

export default MobileDropdown1Component