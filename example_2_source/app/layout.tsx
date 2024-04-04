'use client'

import '../styles/globals.scss'
import React from 'react'
import Layout from '../components/Layout'

export default RootLayout

//
//
//

function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (<>
        <html lang="en">
            <head>
                {/* <meta charSet="utf-8" /> */}
                {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
                <meta name="theme-color" content="#000000" />
                <meta name="description" content="Web site created using create-react-app" />

                <title>React App</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/logo192.png" />
                <link rel="manifest" href="/manifest.json" />
            </head>

            <body>
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <div id="root">
                    <React.StrictMode>
                        <Layout>
                            {children}
                        </Layout>
                    </React.StrictMode>
                </div>
            </body>
        </html>
    </>)
}
