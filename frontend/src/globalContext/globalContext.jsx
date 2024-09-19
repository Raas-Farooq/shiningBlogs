import React, { useContext,useEffect,useState } from "react"
const AppContext = React.createContext();
import axios from 'axios';
// cani  
// cani@gmail.com
// chooseyourhard

// marriage
// marriage@gmail.com
// marriageishard

// token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6IjY2ZGQ3ZGFlZWIzM2YxMmQxODdhZGUzMCIsImVtYWlsIjoiY291cmFnZUBnbWFpbC5jb20ifSwiaWF0IjoxNzI1ODgxNDM3LCJleHAiOjE3MjU4ODUwMzd9.G9-sXyVjTXm-F74u03KbxHNq2YNZxN6uzkCHale2RM8

// username: 'courage',
// email: 'courage@gmail.com',
// courageous

//faster
// faster@gmail.com
// fasterwork

//natureOfAllah
//nature@gmail.com
//natureoflife


export const GlobalState = ({children}) => {

    const [openUserAccount, setOpenUserAccount] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading]  = useState(true);
    const [registerData, setRegisterData] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [imagePreview, setImagePreview] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        console.log("isAuthenticated: ", isAuthenticated);
        const userAuthentication = async () => {
            try{
                const isValidUser = await axios.get('http://localhost:4100/weblog/checkAuthen', {withCredentials:true});
                console.log("why isValidUser.data ", isValidUser);
                if(isValidUser.data.isAuthenticated){
                    setLoggedIn(true);
                    setLoading(false)
                }
                else{
                    setLoggedIn(false)
                }
            }
            catch (err) {
                console.error("Authentication error:", err);
                if (err.response) {
                  console.error("Error response:", err.response.data);
                  setIsAuthenticated(err.response.data.isAuthenticated);
                  console.error("Error status:", err.response.status);
                } else if (err.request) {
                  console.error("No response received:", err.request);
                } else {
                  console.error("Error setting up request:", err.message);
                }
                setLoggedIn(false);
              } finally {
                setLoading(false);
              }
            }
        userAuthentication();

        }
    ,[])
   
    return <AppContext.Provider value={{
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
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
        imagePreview,
        setImagePreview,
        email,
        setEmail

    }}>
        {children}
    </AppContext.Provider>
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

