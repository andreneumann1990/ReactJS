import { useRef, useState } from "react"

function MobileDropdown2Component() {
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
        <button className="mobile-dropdown" onPointerUp={toggleContent}>Dropdown 2</button>
        <div ref={content} className="mobile-dropdown-content hidden">
            <a href="/home">Link 9</a>
            <a href="/home">Link 10</a>
        </div>
    </>)
}

export default MobileDropdown2Component