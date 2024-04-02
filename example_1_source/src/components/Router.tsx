import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LayoutComponent from './Layout'
import HomeComponent from './Home'
import ImageExamplesComponent from './ImageExamples'

function RouterComponent() {
    return (<>
        <BrowserRouter basename="/reactjs/example_1">
            <Routes>
                <Route path="/" element={<LayoutComponent />}>
                    <Route index element={<HomeComponent />} />
                    <Route path="/image_examples" element={<ImageExamplesComponent />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    </>)
}

export default RouterComponent