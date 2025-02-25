// import BrowserRouter, {routes, Route} from 'react-router-dom';

import { BrowserRouter, Navigate, Route,Routes, useLocation } from "react-router-dom"
import App from "../App"
import About from "../pages/About.tsx"
import Write from "../pages/write"
import Content from "../pages/content.tsx"
import { CSSTransition, Transition, TransitionGroup } from "react-transition-group"
import UserAccount from "../Components/userAccount/userAccout"
import UpdateProfile from "../pages/updateProfile"
import Register from "../pages/register"
import Login from "../pages/login.tsx";
import { useRef } from "react";
import { useAuthenContext } from "../globalContext/globalContext";
import BlogPost from "../pages/post";
import EditPost from '../EditPost/editPost.jsx';
import NotFound from '../pages/notFound.tsx';

const PageTransition = () => {
    const location = useLocation();
    const nodeRef = useRef(null);

    return (

        <TransitionGroup className="page-container">
            <CSSTransition 
            nodeRef={nodeRef}
            // key={location.key}
            classNames="slide"
            timeout={500}
            >
            <div className="page-wrapper" ref={nodeRef}>
                <Routes location={location}>
                    <Route path="/" element={<App />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/write" element={<ProtecedRoute stayOnPage={true}><Write /></ProtecedRoute>} />
                    <Route path="/content" element={<Content />} />
                    <Route path="/userAccount" element={<UserAccount />} />
                    <Route path="/updateProfile" element={<UpdateProfile />} /> 
                    <Route path="/registerUser" element ={<Register />} />   
                    <Route path="/login" element ={<Login />} /> 
                    <Route path="/BlogPost/:id" element={<BlogPost />} />
                    <Route path="/editPost" element={<EditPost />} />
                    <Route path="/notFound" element={<NotFound />} />
                </Routes>
            </div>
            </CSSTransition>
        </TransitionGroup>
            
        
    )
}

const ProtecedRoute = ({children, stayOnPage=false }) => {
    const {loggedIn, loading} = useAuthenContext();

    if(loading){
        return <h1> Loading.. </h1>
    }

    if(!loggedIn && !stayOnPage){
        alert("You Should Login in order to Create Blog")
        return <Navigate to="/login" />
    }

    return children
}
const AppRoutes = () => {

    return (
        <BrowserRouter>
            <PageTransition />
        </BrowserRouter>
    )
}

export default AppRoutes