import React, { useContext,useState } from "react"
const AppContext = React.createContext();


export const GlobalState = ({children}) => {

    const [openUserAccount, setOpenUserAccount] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [loggedIn, setLoggedIn] = useState(true);


    return <AppContext.Provider value={{
        openUserAccount,
        setOpenUserAccount,
        setShowMenu,
        showMenu,
        editProfile,
        setEditProfile,
        loggedIn,
        setLoggedIn
    }}>
        {children}
    </AppContext.Provider>
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

