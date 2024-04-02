import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import RouterComponent from './components/Router'
import './scss/styles.scss'

// there are routing issues since when reloading the page; chatgpt says that
// there is a workaround using gh-pages and a custom 404 page that automatically
// redirects; not sure if this works with subfolders; too much effort for now;
// only a small issue; this part is needed in addition(?) to the 404 page;
// if (window.location.pathname !== '/') {
//     sessionStorage.redirect = window.location.href
// }

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <RouterComponent />
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
