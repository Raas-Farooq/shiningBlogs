import React, { useContext, useEffect, useState } from "react"
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import UserAccount from "../Components/userAccount/userAccout";
// import { isButtonElement } from "react-router-dom/dist/dom";
const AuthenContext = React.createContext();
const UIContext = React.createContext();
const BlogContext= React.createContext();




export const AuthenContextProvider = ({children}) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [registerData, setRegisterData] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
          userAuthentication(); // Fetch full user data if we have a userId
        } else {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            userAuthentication();
        }, 60000);
    
        return () => clearInterval(interval)
    },[])
    const decodeToken = (token) => {
        try{
            return jwtDecode(token)
        }catch{
            return null
        }
    }
    const isTokenExpired = (token) => {
        const decoded = decodeToken(token);
    
        if(!decoded || !decoded.exp) return true
    
        return Date.now() > decoded.exp * 1000
        
    }
    const userAuthentication = async () => {
        try {
            const response = await axios.get('http://localhost:4100/weblog/checkAuthen', {withCredentials: true});
            console.log("USer AUTHENTICATIION GLobal Context :", response);
            const token = response.data.token;
            if(isTokenExpired(token)){
                console.log("Token expred.. logging OUt");
                setLoggedIn(false);
                setCurrentUser(null);
                localStorage.removeItem('userId');
                return;
            }
            if (response.data.isAuthenticated) {
              console.log("is validUser globaL :", response.data);
                setLoggedIn(true);
                const user = response.data.user;
                setCurrentUser(user);
                let imgLink=`http://localhost:4100/${user.profileImg}`;
    
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
            localStorage.removeItem('userId');
    
        } finally {
            setLoading(false);
        }
    }


    return (
        <AuthenContext.Provider value={{
            loggedIn,
            setLoggedIn,
            registerData,
            setRegisterData,
            isAuthenticated,
            setIsAuthenticated,
            userAuthentication,
            loading, 
            setLoading,
            currentUser,
            setCurrentUser,
            imagePreview,
            setImagePreview,
        }}>
            {children}
        </AuthenContext.Provider>
    )
} 

export const BlogContextProvider = ({children}) => {
    const [allBlogsGlobally, setAllBlogsGlobally] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchValue,setSearchValue] = useState('');
    const [searching, setSearching] = useState(false);

    return(
        <BlogContext.Provider value={{
            allBlogsGlobally,
            setAllBlogsGlobally,
            filteredBlogs,
            setFilteredBlogs,
            searching,
            setSearching,
            searchValue,
            setSearchValue,
        }}>
        {children}
        </BlogContext.Provider>
    )

}


export const UIContextProvider = ({children}) => {
    const [openUserAccount, setOpenUserAccount] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [showMenu, setShowMenu] = useState(false);  
    const [inHomePage, setInHomePage] = useState(true);
    

    
    // useEffect(() => {
    //     console.log("Navbar runs: ")
    // }, [currentUser,loggedIn]);

    
    return (
        <UIContext.Provider value={{
            openUserAccount,
            setOpenUserAccount,
            setShowMenu,
            showMenu,
            editProfile,
            setEditProfile,
            inHomePage,
            setInHomePage
        }}>
            {children}
        </UIContext.Provider>
    );
}



export function useBlogContext(){
    const context = useContext(BlogContext);
    if(context === null){
        throw new Error("UseBlogContext can only be used inside BlogContext Provider");
    }
    return context
} 

export const useAuthenContext = () => {
    const context = useContext(AuthenContext);
    if(context === null){
        throw new Error('AuthenContext can only use within AuthenContext Provider')
    }
    return context;
}
export const useUIContext = () => {
    const context = useContext(UIContext);
    if(context === null){
        throw new Error('useUIContext can only use within useUIContext Provider')
    }
    return context;
}