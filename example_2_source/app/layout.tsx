'use client'

import '../styles/globals.scss'
import React from 'react'
import Layout from '../components/Layout'

export default RootLayout

//
//
//

function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (<>
        <html lang="en">
            <head>
                {/* <meta charSet="utf-8" /> */}
                {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
                <meta name="theme-color" content="#000000" />
                <meta name="description" content="Web site created using create-react-app" />

                <title>React App</title>
                {/* does not work; can conflict with nextjs's basePath?; do not use!; */}
                {/* <base href="/reactjs/example_2" /> */}

                {/* manually prefix instead; I am confused; this time is added the prefix automatically too; TOOD; */}
                <link rel="icon" href="./icons/favicon.ico" />
                <link rel="apple-touch-icon" href="./icons/logo192.png" />

                {/* for app home screen shortcuts and bookmarks?; */}
                <link rel="manifest" href="./manifest.json" />
            </head>

            <body>
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <React.StrictMode>
                    <Layout>
                        {children}
                    </Layout>
                </React.StrictMode>
            </body>
        </html>
    </>)
}
