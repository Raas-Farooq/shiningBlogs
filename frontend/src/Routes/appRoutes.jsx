// import BrowserRouter, {routes, Route} from 'react-router-dom';

import { BrowserRouter, Route,Routes } from "react-router-dom"
import App from "../App"
import About from "../pages/About"
import Write from "../pages/write"
import Content from "../pages/content"



const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/about" element={<About />} />
                <Route path="/write" element={<Write />} />
                <Route path="/content" element={<Content />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes