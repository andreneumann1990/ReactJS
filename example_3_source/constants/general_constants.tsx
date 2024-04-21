import { createTheme } from '@mui/material'

//
//
//

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
})

export const indexEntryTypesString = 'h1, h2, h3, li, label'
export const isDebugEnabled = true
export const isProduction = process.env.NODE_ENV === 'production'
export const backEndHRef = isProduction ? 'https://example-3-b52da596edfb.herokuapp.com' : 'http://localhost:8080'

// used to group focusable elements;
export const defaultIndexGroup = 'default'
export const mainIndexGroup = 'main'
export const topnavIndexGroup = 'topnav'
export const sidenavIndexGroup = 'sidenav'

export const initialDelay = 400
export const maximumDelay = 2147483647
export const repeatDelay = 100
