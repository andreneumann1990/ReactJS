import { Link } from 'react-router-dom'
import DesktopDropdown1Component from './Dropdown1'

function DesktopTopbarComponent() {
    return (<nav className="desktop-navbar">
        {/* <p>very important text</p> */}
        <Link to="#">Link 1</Link>
        <Link to="#">Link 2</Link>
        <DesktopDropdown1Component />
    </nav>)
}

export default DesktopTopbarComponent