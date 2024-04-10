import React from 'react'
export default InstantSearch

//
//
//

function InstantSearch({ children }: Readonly<{ children: React.ReactNode }>) {
    return (<>
        <div className="w-full">{children}</div>
    </>)
}