export { backEndHRef }
export { indexEntryTypesString }
export { isDebugEnabled }

export { tabIndexGroupDefault }
export { tabIndexGroupMain }
export { tabIndexGroupTopnav }
export { tabIndexGroupSidenav }

export { initialDelay }
export { repeatDelay }
export { noRepeatDelay }

//
//
//

const indexEntryTypesString = 'h1, h2, h3, li, label'
const isDebugEnabled = true
const isProduction = process.env.NODE_ENV === 'production'
const backEndHRef = isProduction ? 'https://example-3-b52da596edfb.herokuapp.com' : 'http://localhost:8080'

// used to group focusable elements;
const tabIndexGroupDefault = 0
const tabIndexGroupMain = 10
const tabIndexGroupTopnav = 20
const tabIndexGroupSidenav = 30

const initialDelay = 400
const repeatDelay = 200
const noRepeatDelay = 2147483647
