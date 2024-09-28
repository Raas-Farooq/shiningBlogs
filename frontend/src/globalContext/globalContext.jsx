import React, { useContext, useEffect, useState } from "react"
import axios from 'axios';
import UserAccount from "../Components/userAccount/userAccout";
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

    const userAuthentication = async () => {
        try {
            const response = await axios.get('http://localhost:4100/weblog/checkAuthen', {withCredentials: true});
            console.log("response of auth inside globaL :", response)
            if (response.data.isAuthenticated) {
              console.log("is validUser globaL :", response.data);
                setLoggedIn(true);
                const user = response.data.user;
                setCurrentUser(user);
                let imgLink='';
                if(user.profileImg && user.profileImg.data){
                    const base64String = 
                   btoa( new Uint8Array(user.profileImg.data.data).
                   reduce((data, byte) => data+ String.fromCharCode(byte), ''))

                    imgLink = `data:${user.profileImg.contentType};base64,${base64String}`;
                }
                setImagePreview(imgLink)
                
                localStorage.setItem('userId', response.data.user._id);
            } else {
                setLoggedIn(false);
                setCurrentUser(false);
                localStorage.removeItem('userId');
            }
        } catch (err) {
            console.error("Authentication error:", err);
            setCurrentUser(null);
            setLoggedIn(false);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log("currentUser inside navbar: ", currentUser);

    }, [currentUser,loggedIn])
    useEffect(() => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        userAuthentication(); // Fetch full user data if we have a userId
      } else {
          setLoading(false);
      }
  }, []);
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
            userAuthentication
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useGlobalContext = () => {
    return useContext(AppContext);
}