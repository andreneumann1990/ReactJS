'use client'

function HomeComponent() {
    return (<>
        <h1 className="my-3 text-3xl font-bold">ReactJS Example 2</h1>

        <h2 className="my-2 text-2xl font-bold">Summary:</h2>
        <ul className="*:my-2 pl-5">
            <li>a basic front-end mock-up;</li>
            <li>based on the mobile version of the Steam website</li>
            <li>added some ideas / features from other sides; search placeholder; some basic html stuff like forms and images TODO;</li>
        </ul>

        <h2 className="my-2 text-2xl font-bold">Changelog / Features:</h2>
        <details className="group border rounded-md ml-1 open:bg-blend-darken">
            <summary className="group-open:border-b p-2">Example 1</summary>
            <ul className="*:my-2 pl-10">
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
                <li>deployed on github.io</li>
            </ul>
        </details>
        <ul className="*:my-2 pl-5">
            <li>switched to nextjs; no server-side-rendering (SSR); needs to be static at this point; no back-end yet;</li>
            <li>switched to tailwindcss in most cases;</li>
            <li>using <strong>Zustand</strong> for sharing data and states; less boilerplate than <strong>Redux</strong>?;</li>
            <li>added a search bar placeholder; there is no back-end yet; maybe you could work around that and handle search entries and stuff; let&apos;s not bother just yet;</li>
        </ul >

        <h2 className="my-2 text-2xl font-bold">TODO:</h2>
        <ul className="*:my-2 pl-5">
            <li>try Redux to share states using less(?) code;</li>
            <li>user login;</li>
            <li>search bar;</li>
            <li>use Node.js?; back-end?;</li>
            <li>light / dark theme switch;</li>
            <li>some more standard stuff; forms, maps, videos / iframes, lists maybe;</li>
        </ul>
    </>)
}

export default HomeComponent