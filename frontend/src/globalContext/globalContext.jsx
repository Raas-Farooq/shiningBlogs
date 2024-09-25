import React, { useContext, useEffect, useState } from "react"
import axios from 'axios';
// import { isButtonElement } from "react-router-dom/dist/dom";

const AppContext = React.createContext();

export const GlobalState = ({children}) => {
    const [openUserAccount, setOpenUserAccount] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [registerData, setRegisterData] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [globalEmail, setGlobalEmail] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    
      useEffect(() => {
        console.log("current User global Context : ",currentUser);
        console.log("is user logged in alhamdulila: ", loggedIn)
      }, [loggedIn, currentUser])
    return (
        <AppContext.Provider value={{
            openUserAccount,
            setOpenUserAccount,
            setShowMenu,
            showMenu,
            editProfile,
            setEditProfile,
            loggedIn,
            setLoggedIn,
            registerData,
            setRegisterData,
            loading, 
            setLoading,
            isAuthenticated,
            setIsAuthenticated,
            currentUser,
            setCurrentUser,
            imagePreview,
            setImagePreview,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useGlobalContext = () => {
    return useContext(AppContext);
}