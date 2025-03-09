import React, { useContext, useEffect, useState, ReactNode } from "react"
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { VITE_API_URL } from "../config";

// import { BiLogoMailchimp } from "react-icons/bi";
// import UserAccount from "../Components/userAccount/userAccout";
// import { isButtonElement } from "react-router-dom/dist/dom";
// find src -name "*.jsx" -exec sh -c 'mv "$0" "${0%.jsx}.tsx"' {} \; renaming all files

interface User{
  _id:string,
  username:string,
  email:string,
  password:string,
  profileImg:string,
  TopicsInterested:[],
  goal:string,
  createdAt:string,
  updatedAt:string
}
interface RegisterNewUser {
    _id:string,
    username:string,
    email:string
}
interface decodedToken{
    exp?:number
}
interface AuthenContentProps {
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; // Add this line
    registerData: RegisterNewUser | null;
    setRegisterData: React.Dispatch<React.SetStateAction<RegisterNewUser | null>>; // Also add this
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
    imagePreview: string;
    setImagePreview: React.Dispatch<React.SetStateAction<string>>;
    errorMessage: string;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    userAuthentication: () => Promise<void>;
}


const AuthenContext = React.createContext<AuthenContentProps | undefined>(undefined);

export const AuthenContextProvider = ({children} : {children:ReactNode}) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [registerData, setRegisterData] = useState<RegisterNewUser | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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
    const decodeToken = (token:string): decodedToken | null => {
        try{
            return jwtDecode(token)
        }catch{
            return null
        }
    }
    const isTokenExpired = (token:string):boolean => {
        const decoded = decodeToken(token);
    
        if(!decoded || !decoded.exp) return true
    
        return Date.now() > decoded.exp * 1000
        
    }
    const userAuthentication = async () => {
        try {
            const response = await axios.get(`${VITE_API_URL}/weblog/checkAuthen`, {withCredentials: true});
            console.log("USer AUTHENTICATIION GLobal Context :", response);
            const token = response.data.token;
            if(isTokenExpired(token)){
                alert("Token expred.. logging OUt from userAuthentication fetch globalContext");
                setLoggedIn(false);
                setCurrentUser(null);
                localStorage.removeItem('userId');
                return;
            }
            if (response.data.isAuthenticated) {
    
                setLoggedIn(true);
                const user = response.data.user;
                setCurrentUser(user);
                let imgLink=`${VITE_API_URL}/${user.profileImg}`;
    
                setImagePreview(imgLink)
                
                localStorage.setItem('userId', response.data.user._id);
            } else {
                setLoggedIn(false);
                setCurrentUser(null);
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
            errorMessage,
            setErrorMessage
        }}>
            {children}
        </AuthenContext.Provider>
    )
} 

interface Blog{
    _id:string,
    userId:string,
    title:string,
    titleImage:string,
    content:[],
    contentImages:[],
    createdAt:string,
    updatedAt:string
}


interface BlogContextProps{
    allBlogsGlobally: Blog[],
    setAllBlogsGlobally: React.Dispatch<React.SetStateAction<Blog[]>>,
    filteredBlogs: Blog[],
    setFilteredBlogs: React.Dispatch<React.SetStateAction<Blog[]>>,
    searchValue:string,
    setSearchValue:React.Dispatch<React.SetStateAction<string>>,
    searching:boolean,
    setSearching:React.Dispatch<React.SetStateAction<boolean>>
}

const BlogContext = React.createContext<BlogContextProps | undefined>(undefined);
export const BlogContextProvider = ({children}:{children:ReactNode}) => {
    

    const [allBlogsGlobally, setAllBlogsGlobally] = useState<Blog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
    const [searchValue,setSearchValue] = useState<string>('');
    const [searching, setSearching] = useState<boolean>(false);

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

interface UIContextProps {
    openUserAccount: boolean;
    setOpenUserAccount: React.Dispatch<React.SetStateAction<boolean>>;
    editProfile: boolean;
    setEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
    showMenu: boolean;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
    inHomePage: boolean;
    setInHomePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const UIContext = React.createContext<UIContextProps | undefined>(undefined);

export const UIContextProvider = ({children}:{children:ReactNode}) => {
   
    const [openUserAccount, setOpenUserAccount] = useState<boolean>(false);
    const [editProfile, setEditProfile] = useState<boolean>(false);
    const [showMenu, setShowMenu] = useState<boolean>(false);  
    const [inHomePage, setInHomePage] = useState<boolean>(true);
    

    
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
    if(!context){
        throw new Error("UseBlogContext can only be used inside BlogContext Provider");
    }
    return context
} 

export const useAuthenContext = () => {
    const context = useContext(AuthenContext);
    if(!context){
        throw new Error('AuthenContext can only use within AuthenContext Provider')
    }
    return context;
}
export const useUIContext = () => {
    const context = useContext(UIContext);
    if(!context){
        throw new Error('useUIContext can only use within useUIContext Provider')
    }
    return context;
}

// i'm doing this 'context === null)' why doesnt' it work
// export const useUIContext = () => {
//     const context = useContext(UIContext);
//     if(context === null){
//         throw new Error('useUIContext can only use within useUIContext Provider')
//     }
//     return context;
// }


// allBlogsGlobally: Blog[],
// setAllBlogsGlobally: React.Dispatch<React.SetStateAction<Blog[]>>,does it mean it will always have either empty Array or Blogs
