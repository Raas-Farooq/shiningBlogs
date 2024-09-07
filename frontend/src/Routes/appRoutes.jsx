// import BrowserRouter, {routes, Route} from 'react-router-dom';

import { BrowserRouter, Route,Routes, useLocation } from "react-router-dom"
import App from "../App"
import About from "../pages/About"
import Write from "../pages/write"
import Content from "../pages/content"
import { CSSTransition, Transition, TransitionGroup } from "react-transition-group"
import UserAccount from "../Components/userAccount/userAccout"
import UpdateProfile from "../pages/updateProfile"
import Register from "../pages/register"
import Login from "../pages/login"



const PageTransition = () => {
    const location = useLocation();

    return (

        <TransitionGroup className="page-container">
            <CSSTransition 
            key={location.key}
            classNames="slide"
            timeout={500}
            >
            <div className="page-wrapper">
                <Routes location={location}>
                    <Route path="/" element={<App />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/write" element={<Write />} />
                    <Route path="/content" element={<Content />} />
                    <Route path="/userAccount" element={<UserAccount />} />
                    <Route path="/updateProfile" element={<UpdateProfile />} /> 
                    <Route path="/registerUser" element ={<Register />} />   
                    <Route path="/login" element ={<Login />} /> 
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