function HomeComponent() {
    return (<>
        <h1>ReactJS Example 1</h1>

        <h2>Summary:</h2>
        <ul>
            <li>a basic front-end mock-up;</li>
            <li>based on the mobile version of the Steam website</li>
        </ul>

        <h2>Features:</h2>
        <ul>
            <li>clicking highlights links</li>
            <li>sidebar animation</li>
            <li>darken main element when sidebar is open</li>
            <li>closing sidebar by panning (slowly) or swiping</li>
            <li>closing sidebar by clicking outside</li>
            <li>dropdown expansion animation</li>
            <li>only one dropdown menu open at a time</li>
            <li>passing data around using <strong>useContext()</strong></li>
            <li>exporting references of non-unmounting elements as globals instead (bad?)</li>
            <li>tabindex management & navigation via keyboard</li>
        </ul>

        <h2>TODO:</h2>
        <ul>
            <li>try Redux to share states using less(?) code;</li>
            <li>user login;</li>
            <li>search bar;</li>
            <li>use Node.js?; back-end?;</li>
            <li>light / dark theme switch;</li>
        </ul>
    </>)
}

export default HomeComponent