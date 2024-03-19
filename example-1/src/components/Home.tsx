function HomeComponent() {
    return (<>
        <h1>ReactJS Example 1</h1>

        <h2>Summary:</h2>
        <ul>
            <li>a basic front-end mock-up;</li>
        </ul>

        <h2>TODO:</h2>
        <ul>
            <li>try Redux to share states using less(?) code;</li>
            <li>animations;</li>
            <li>user login;</li>
            <li>search bar;</li>
        </ul>

        <h2>Content:</h2>
        <ul>
            <li>passing data and references around with <strong>useContext()</strong>;</li>
            <li>(desktop) having a static top navbar;</li>
            <li>(desktop) dropdown menues react on hover;</li>
            <li>(mobile) having a sidebar for mobile;</li>
            <li>(mobile) dropdown menues expand on click;</li>
            <li>(mobile) sidebar closes when clicking outside or swiping left or clicking the button again;</li>
        </ul>

        <h2>Context:</h2>
        <ul>
            <li>somewhat inspired by the Steam website;</li>
            <li>it has a static desktop page (header) with dropdown menues;</li>
            <li>it has a mobile version where that stuff is in a sidebar;</li>
            <li>you can close the sidebar by swiping or panning outside;</li>
            <li>it can be slowly panned or quickly;</li>
        </ul>
    </>)
}

export default HomeComponent