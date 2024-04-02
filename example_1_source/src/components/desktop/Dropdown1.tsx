import { Link } from 'react-router-dom'

function DesktopDropdown1Component() {
    return (<div className="desktop-dropdown">
        Dropdown 1
        <div className="desktop-dropdown-content">
            <Link to="#">Link 3</Link>
            <Link to="#">Link 4</Link>
        </div>
    </div>)
}

export default DesktopDropdown1Component