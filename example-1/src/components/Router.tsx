import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageNotFoundComponent from "./PageNotFound";
import HomeComponent from "./Home";
import LayoutComponent from "./Layout";

function RouterComponent() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LayoutComponent />}>
                    <Route index element={<Navigate to="/home" />} />
                    <Route path="home" element={<HomeComponent />} />
                    {/* <Route path="react_exercise" element={<ReactExercise />} /> */}
                    {/* <Route path=":fileExtension/:fileName/" element={<FileContent />} /> */}
                    <Route path="*" element={<PageNotFoundComponent />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterComponent