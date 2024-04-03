import React from 'react'
// import algoliasearch from 'algoliasearch/lite'
import {
    // InstantSearch,
    // SearchBox,
    // Hits,
    // Highlight,
} from 'react-instantsearch'

// Algolia client setup
// const searchClient = algoliasearch(
//     '2QYN25VL0K',
//     'ba0b8a970db7843753c13218f38ae4e2'
// )

// interface HitData {
//     hit: any
// }

// const Hit = ({ hit }: HitData) => (
//     <div>
//         <Highlight attribute="title" hit={hit} />
//         <p><Highlight attribute="description" hit={hit} /></p>
//     </div>
// )

function SearchComponent() {
    return (<>
        {/* <div className="inline"> */}
        <div>
            {/* <InstantSearch searchClient={searchClient} indexName="YourIndexName">
                <SearchBox />
                <Hits hitComponent={Hit} />
            </InstantSearch> */}
        </div>
        {/* </div> */}
    </>)
}

export default SearchComponent