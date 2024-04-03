'use client'

import Image from 'next/image'

function Page() {
    return (<>
        <Image className="p-10" src="https://fakeimg.pl/250x100/" alt="placeholder" width={250} height={100}></Image>
    </>)
}

export default Page