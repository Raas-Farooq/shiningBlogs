// import BrowserRouter, {routes, Route} from 'react-router-dom';

import { BrowserRouter, Route,Routes, useLocation } from "react-router-dom"
import App from "../App"
import About from "../pages/About"
import Write from "../pages/write"
import Content from "../pages/content"
import { CSSTransition, Transition, TransitionGroup } from "react-transition-group"



const PageTransition = () => {
    const location = useLocation();

    return (

        <TransitionGroup className="page-container">
            <CSSTransition 
            
            timeout={500}
            key={location.key}
            classNames="slide"
            >
            <div className="page-wrapper">
                <Routes location={location}>
                    <Route path="/" element={<App />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/write" element={<Write />} />
                    <Route path="/content" element={<Content />} />
                </Routes>
            </div>
            </CSSTransition>
        </TransitionGroup>
            
        
    )
}

const AppRoutes = () => {

    return (
        <BrowserRouter>
            <PageTransition />
        </BrowserRouter>
    )
}

export default AppRoutes