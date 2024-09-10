import React, { useContext,useEffect,useState } from "react"
const AppContext = React.createContext();

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

export const GlobalState = ({children}) => {

    const [openUserAccount, setOpenUserAccount] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [myToken , setMyToken] = useState(false);
    const [registerData, setRegisterData] = useState({});
    
    useEffect(() => {
        console.log("Logged In value Context: ", loggedIn);
    }, [])
   
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
        setRegisterData
    }}>
        {children}
    </AppContext.Provider>
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

