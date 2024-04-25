'use client'

import '../styles/globals.scss'
import React, { useEffect, useRef } from 'react'
import Layout, { handleKeyDown_Layout } from '../components/layout/Layout'
import { ThemeProvider } from '@mui/material/styles'
import { darkTheme, initialDelay, defaultIndexGroup } from '../constants/parameters'
import { handleInput_Sidenav as handleKeyDown_Sidenav } from '../components/layout/Sidenav'
import { useRouter } from 'next/navigation'
import { useLayoutStore } from '../hooks/stores'
import { handleKeyInput_Topnav as handleKeyDown_Topnav } from '../components/layout/Topnav'
import { handleKeyDown_Main } from '../components/layout/Main'
import { NullableNumber } from '../constants/types'
import { clearKeyDownTimeout } from '../constants/functions'
import { useIndexGroupContainer } from '../hooks/indexGroup'

export default RootLayout

//
// main
//

function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    //
    // parameters and variables
    //

    const router = useRouter()
    const previousDateRef = useRef<Date>(new Date())
    const keyDownCooldown = useLayoutStore(state => state.keyDownCooldown)
    const setIsFirstKeyDown = useLayoutStore(state => state.setIsFirstKeyDown)

    //
    // functions
    //

    // onKeyDown makes sure that onKeyDown or onKeyDownCapture events of child nodes 
    // are called first;
    // stopPropagation() during child events makes sure that later onKeyDown events don't 
    // override the cooldown before the update is applied;
    function handleKeyDown(event: React.KeyboardEvent): void {
        const layoutState = useLayoutStore.getState()
        layoutState.setKeyDownCooldown(layoutState.keyDownCooldown - (new Date().getTime() - previousDateRef.current.getTime()))
        previousDateRef.current = new Date()

        if (layoutState.keyDownCooldown > 0) {
            event.preventDefault()
            event.stopPropagation()
            return
        }

        let newCooldown: NullableNumber = handleKeyDown_Layout(event)
        if (newCooldown == null) newCooldown = handleKeyDown_Main(event)
        if (newCooldown == null) newCooldown = handleKeyDown_Sidenav(event, router)
        if (newCooldown == null) newCooldown = handleKeyDown_Topnav(event)

        if (newCooldown == null) return
        layoutState.setKeyDownCooldown(Math.max(newCooldown ?? 0, layoutState.isFirstKeyDown ? initialDelay : 0))
    }

    //
    // effects
    //

    // update isFirstKeyDown based on the cooldown;
    useEffect(() => {
        if (keyDownCooldown <= 0) return
        setIsFirstKeyDown(false)
    }, [keyDownCooldown, setIsFirstKeyDown])

    //
    //
    //

    return (
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
                {...useIndexGroupContainer(defaultIndexGroup)}
                className="w-full bg-background [color:--color-text] [font-size:100%] [font-family:Helvetica,Arial,sans-serif] overflow-y-hidden"
                onKeyDown={handleKeyDown}
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
    )
}
