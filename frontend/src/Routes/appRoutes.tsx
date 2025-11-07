import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import App from "../App.tsx";
import About from "../pages/About.tsx";
import Write from "../pages/write.jsx";
import Content from "../pages/content.tsx";
import UserAccount from "../Components/userAccount/userAccout.tsx";
import UpdateProfile from "../pages/updateProfile.jsx";
import Register from "../pages/register.jsx";
import Login from "../pages/login.tsx";
import { ReactNode, useEffect, useState } from "react";
import { useAuthenContext } from "../globalContext/globalContext.tsx";
import BlogPost from "../pages/post.tsx";
import EditPost from '../EditPost/editPost.tsx';
import NotFound from '../pages/notFound.tsx';
import ErrorBoundary from "./errorBoundary.jsx";
import ScrollToTop from "../utils/scrollToTop.tsx";
import BlogContent from "../Components/contentSection/blog-content.tsx";
import Home from "../Home/home.tsx";

interface ProtectedRouteProps {
    children: ReactNode;
    stayOnPage?: boolean;
}

const PageTransition = () => {
    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState("fadeIn");

    useEffect(() => {
        // If the location changes, start the transition
        if (location !== displayLocation) {
            setTransitionStage("fadeOut");
        }
    }, [location, displayLocation]);

    useEffect(() => {
        // When the transition is complete, update the displayed location
        if (transitionStage === "fadeOut") {
            const timer = setTimeout(() => {
                setDisplayLocation(location);
                setTransitionStage("fadeIn");
            }, 300); // Match the duration of the transition (300ms)

            return () => clearTimeout(timer); // Cleanup the timer
        }
    }, [transitionStage, location]);

    return (
        <div
            className={`page-wrapper transition-opacity ease-in-out duration-500 ${
                transitionStage === "fadeOut" ? "opacity-0" : "opacity-100"
            }`}
        >
            <ErrorBoundary>
                <Routes location={displayLocation}>
                    <Route path="/" element={<App />} >
                        <Route index element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/write" element={<ProtecedRoute stayOnPage={true}><Write /></ProtecedRoute>} />
                        <Route path="/content" element={<Content />} />
                        <Route path="/allBlogs" element={<BlogContent />} />
                        <Route path="/userAccount" element={<UserAccount />} />
                        <Route path="/updateProfile" element={<UpdateProfile />} /> 
                        <Route path="/registerUser" element={<Register />} />   
                        <Route path="/login" element={<Login />} /> 
                        <Route path="/BlogPost/:id" element={<BlogPost />} />
                        <Route path="/editPost" element={<EditPost />} />
                        
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </ErrorBoundary>
        </div>
    );
};

const ProtecedRoute = ({ children, stayOnPage = false }: ProtectedRouteProps) => {
    const { loggedIn, loading } = useAuthenContext();

    if (loading) {
        return <h1> Loading.. </h1>;
    }

    if (!loggedIn && !stayOnPage) {
        alert("You Should Login in order to Create Blog");
        return <Navigate to="/login" />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} >
            <ScrollToTop />
            <PageTransition />
        </BrowserRouter>
    );
};

export default AppRoutes;