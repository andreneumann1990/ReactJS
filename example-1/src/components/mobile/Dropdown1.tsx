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
        <button className="mobile-dropdown block" onPointerUp={toggleContent}>Dropdown 1</button>
        <div ref={content} className="mobile-dropdown-content block hidden">
            <a className="block" href="/home">Link 3</a>
            <a className="block" href="/home">Link 4</a>
            <a className="block" href="/home">Link 5</a>
            <a className="block" href="/home">Link 6</a>
            <a className="block" href="/home">Link 7</a>
            <a className="block" href="/home">Link 8</a>
        </div>
    </>)
}

export default MobileDropdown1Component