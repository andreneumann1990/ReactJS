'use client'

import '../styles/globals.scss'
import React, { KeyboardEvent, useRef } from 'react'
import Layout from '../components/layout/Layout'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { darkTheme, initialDelay, maximumDelay, repeatDelay } from '../constants/general_constants'
import { handleInput_Sidenav as handleKeyDownInput_Sidenav } from '../components/layout/Sidenav'
import { useRouter } from 'next/navigation'
import { useGlobalStore, useKeyboardStore } from '../hooks/stores'
import { NullableBooleanRef, GlobalState } from '../constants/types'
import { handleKeyInput_Topnav as handleKeyDownInput_Topnav } from '../components/layout/Topnav'
import { handleKeyDownInput_Main } from '../components/layout/Main'

export default RootLayout

//
// main
//

function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    //
    // parameters and variables
    //

    const globalState = useGlobalStore()
    // const { sidenavState } = globalState
    const router = useRouter()

    let keyDownTimeoutRef = useRef<NodeJS.Timeout | undefined>()
    let isKeyInputRepeatingRef: NullableBooleanRef = useRef(null)

    //
    // functions
    //

    function clearKeyDownTimeout(): void {
        // if (isDebugEnabled) console.log('Body: Clear key-down timeout.')
        globalState.keyboardState.setEvent(null)
        clearTimeout(keyDownTimeoutRef.current)
        keyDownTimeoutRef.current = undefined
    }

    function handleKeyDownInput(event: KeyboardEvent): void {
        if (keyDownTimeoutRef.current != null) {
            globalState.keyboardState.setEvent(event)
            return
        }

        function handleInput(initialDelay?: number): void {
            const globalState = useGlobalStore.getState()
            const event = globalState.keyboardState.event
            if (event == null) return
            let isKeyInputRepeating = null

            isKeyInputRepeating = handleKeyDownInput_Main(event)
            if (isKeyInputRepeating != null) {
                keyDownTimeoutRef.current = setTimeout(() => { handleInput() }, isKeyInputRepeating ? (initialDelay ?? repeatDelay) : maximumDelay)
                return
            }

            isKeyInputRepeating = handleKeyDownInput_Sidenav(event, globalState, router)
            if (isKeyInputRepeating != null) {
                keyDownTimeoutRef.current = setTimeout(() => { handleInput() }, isKeyInputRepeating ? (initialDelay ?? repeatDelay) : maximumDelay)
                return
            }

            isKeyInputRepeating = handleKeyDownInput_Topnav(event)
            if (isKeyInputRepeating != null) {
                keyDownTimeoutRef.current = setTimeout(() => { handleInput() }, isKeyInputRepeating ? (initialDelay ?? repeatDelay) : maximumDelay)
                return
            }
        }

        globalState.keyboardState.setEvent(event)
        handleInput(initialDelay)
    }

    //
    //
    //

    return (<>
        <html lang="en">
            <head>
                {/* <meta charSet="utf-8" /> */}
                {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
                <meta name="theme-color" content="#000000" />
                <meta name="description" content="Web site created using create-react-app" />

                <title>React App</title>
                {/* does not work; can conflict with nextjs's basePath?; do not use!; */}
                {/* <base href="/reactjs/example_3" /> */}

                {/* manually prefix instead; I am confused; this time is added the prefix automatically too; TOOD; */}
                <link rel="icon" href="./icons/favicon.ico" />
                <link rel="apple-touch-icon" href="./icons/logo192.png" />

                {/* for app home screen shortcuts and bookmarks?; */}
                <link rel="manifest" href="./manifest.json" />
            </head>

            {/* 
                `width: 100vw` is problematic; it seems that the scroll bar can add to the total 
                width otherwise;
                I read somewhere that `font-size: 100%` helps with some internet explorer problem;
                I forgot where;
                originally I copied `-webkit-font-smoothing: antialiased` from the pre-generated
                index.css file; but this is a non-standard property and it is recommended not to
                use it; see `https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth`;
            */}
            <body
                className="w-full bg-background [color:--color-text] [font-size:100%] [font-family:Helvetica,Arial,sans-serif]"
                onKeyDown={handleKeyDownInput}
                onKeyUp={clearKeyDownTimeout}
            >
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <React.StrictMode>
                    <ThemeProvider theme={darkTheme}>
                        <Layout>
                            {children}
                        </Layout>
                    </ThemeProvider>
                </React.StrictMode>
            </body>
        </html>
    </>)
}
