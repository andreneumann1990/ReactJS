export { backEndHRef }
export { indexEntryTypesString }
export { isDebugEnabled }

const indexEntryTypesString = 'h1, h2, h3, li, label'
const isDebugEnabled = true
const isProduction = process.env.NODE_ENV === 'production'
const backEndHRef = isProduction ? 'https://example-3-b52da596edfb.herokuapp.com' : 'http://localhost:8080'
