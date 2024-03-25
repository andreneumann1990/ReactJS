import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LayoutComponent from './Layout'
import HomeComponent from './Home'
import ImageExamplesComponent from './ImageExamples'

function RouterComponent() {
    return (<>
        <BrowserRouter>
            <Routes>
                <Route path="/reactjs/example_1/" element={<LayoutComponent />}>
                    <Route index element={<Navigate to="/reactjs/example_1/home" />} />
                    <Route path="/reactjs/example_1/home" element={<HomeComponent />} />
                    <Route path="/reactjs/example_1/image_examples" element={<ImageExamplesComponent />} />
                    <Route path="*" element={<Navigate to="/reactjs/example_1/home" />} />
                </Route>
                <Route path="*" element={<Navigate to="/reactjs/example_1/home" />} />
            </Routes>
        </BrowserRouter>
    </>)
}

export default RouterComponent