import React, { useContext,useState } from "react"
const AppContext = React.createContext();


export const GlobalState = ({children}) => {

    const [openUserAccount, setOpenUserAccount] = useState(false);
    const [showMenu, setShowMenu] = useState(false);


    return <AppContext.Provider value={{
        openUserAccount,
        setOpenUserAccount,
        setShowMenu,
        showMenu
    }}>
        {children}
    </AppContext.Provider>
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

