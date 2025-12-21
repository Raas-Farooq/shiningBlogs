import React, { useContext, useEffect, useState, ReactNode, useMemo } from "react"
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { VITE_API_URL } from "../config";
import toast from "react-hot-toast";
import { Blog } from "../types/globalTypes";
import useFetchAllBlogs from "../Hooks/fetchAllBlogs";
import useFetchMyPosts from "./useFetchMyPosts";
import {User} from '../types/globalTypes';
// import { BiLogoMailchimp } from "react-icons/bi";
// import UserAccount from "../Components/userAccount/userAccout";
// import { isButtonElement } from "react-router-dom/dist/dom";
// find src -name "*.jsx" -exec sh -c 'mv "$0" "${0%.jsx}.tsx"' {} \; renaming all files


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
    scheduleAutoLogout:(token:string) => void;
    myPosts:Blog[] | [],
    setMyPosts:React.Dispatch<React.SetStateAction<Blog[] | []>>,
    myPostsFetchError: Error | any;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; 
    registerData: RegisterNewUser | null;
    setRegisterData: React.Dispatch<React.SetStateAction<RegisterNewUser | null>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    myPostsLoading: boolean | undefined;
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
    // const [myPostsLoading, setMyPostsLoading] = useState<boolean | undefined>(undefined);
    const [myPosts, setMyPosts] = useState<Blog[]>([]);
    // const [myPostsFetchError, setMyPostsFetchError] = useState<Error | null>(null);
    const { yourContent, fetchUserPostsLoading, fetchUserPostsErr } = useFetchMyPosts(currentUser? currentUser._id: undefined);
    
    useEffect(() => {
        console.log("loggedIn ",loggedIn)
        const userId = localStorage.getItem('userId');
        if (userId) {
            console.log("You are logged In")
          userAuthentication(); // Fetch full user data if we have a userId
        } else {
            setLoading(false);
        }
    }, []);
  
useEffect(() => {
        if(yourContent){
            setMyPosts(yourContent)
        }

    },[yourContent])

    useEffect(() => {
        console.log("myPosts ",myPosts)
    },[myPosts])
    useEffect(() => {
        console.log("GLobal context is running")
        userAuthentication();

        // if(currentUser){
        //     console.log("myPosts: ",yourContent);
        // }
    },[])

    const decodeToken = (token:string): decodedToken | null => {
        try{
            return jwtDecode(token)
        }catch{
            return null
        }
    }


    const logout = async ()=> {

        try{
            await axios.post(`${VITE_API_URL}/weblog/logout`); 
        }catch{
            console.error('error while logging out');
        }

      localStorage.removeItem('userId');
      setCurrentUser(null)
      setLoggedIn(false)
      setIsAuthenticated(false);
      setImagePreview('');
    }

    const scheduleAutoLogout = (token:string) => {
        const decoded = decodeToken(token);
        if(!decoded || !decoded.exp) return true
        const expiry = decoded.exp * 1000 - Date.now();
        if(expiry <= 0){
            logout();
        }else{
            setTimeout(() => {
             logout();
            }, expiry)

        }
        
    }

    const userAuthentication = async () => {
        try {
            const response = await axios.get(`${VITE_API_URL}/weblog/checkAuthen`, {withCredentials: true});
            const token = response.data.token;
            if(scheduleAutoLogout(token)){
                toast("Token expred.. logging OUt from userAuthentication fetch globalContext");
                setLoggedIn(false);
                setCurrentUser(null);
                localStorage.removeItem('userId');
                return;
            }
            if (response.data.isAuthenticated) {
                console.log("yes you are logged In inside userAuthenticatin ")
                setLoggedIn(true);
                const user = response.data.user;
                setCurrentUser(user);

                if(user.profileImg){
                    let imgLink=`${VITE_API_URL}/${user.profileImg}`;
                    setImagePreview(imgLink)
                }
                localStorage.setItem('userId', response.data.user._id);
            } else {
                 console.error("neither expired time nor inside isAuthenticated: ", response.data)
                setLoggedIn(false);
                setCurrentUser(null);
                localStorage.removeItem('userId');
            }
        } catch (err) {
            console.error("error while authenticating ", err);
            setCurrentUser(null);
            setLoggedIn(false);
            localStorage.removeItem('userId');
    
        } finally {
            setLoading(false);
        }
    }
    const authContextValues = useMemo(() => ({
        scheduleAutoLogout,
            loggedIn,
            myPosts,
            setMyPosts,
            myPostsFetchError: fetchUserPostsErr,
            myPostsLoading:fetchUserPostsLoading,
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
    }),[
        scheduleAutoLogout,
            loggedIn,
            myPosts,
            setMyPosts,
            fetchUserPostsErr,
            fetchUserPostsLoading,
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
    ])

    return (
        <AuthenContext.Provider value={
            authContextValues
        }>
            {children}
        </AuthenContext.Provider>
    )
} 



interface BlogContextProps{
    allBlogsGlobally: Blog[] | [],
    fetchBlogsError:string | any,
    fetchBlogsLoading: boolean,
    setAllBlogsGlobally: React.Dispatch<React.SetStateAction<Blog[]>>,
    filteredBlogs: Blog[] | [],
    setFilteredBlogs: React.Dispatch<React.SetStateAction<Blog[]>>,
    searchValue:string,
    setSearchValue:React.Dispatch<React.SetStateAction<string>>,
    searching:boolean,
    setSearching:React.Dispatch<React.SetStateAction<boolean>>
}

const BlogContext = React.createContext<BlogContextProps | undefined>(undefined);
export const BlogContextProvider = ({children}:{children:ReactNode}) => {
    

    // const [allBlogsGlobally, setAllBlogsGlobally] = useState<Blog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
    const [allBlogsGlobally, setAllBlogsGlobally] = useState<Blog[]>([]);
    const [searchValue,setSearchValue] = useState<string>('');
    const [searching, setSearching] = useState<boolean>(false);
    const {fetchBlogsLoading, fetchBlogsError, allBlogs} = useFetchAllBlogs();

    useEffect(() =>{
        if(!allBlogs?.length) return;
         console.log("allBlogs globally ", allBlogs);
        if(allBlogs.length > 0){
            setAllBlogsGlobally(allBlogs);
        }
       if(!fetchBlogsLoading && allBlogs.length === 0){
        setAllBlogsGlobally([]);
       }
    },[allBlogs])
    
    const BlogContextValues= useMemo(() => ({
        allBlogsGlobally,
            setAllBlogsGlobally,
            fetchBlogsError,
            fetchBlogsLoading,
            filteredBlogs,
            setFilteredBlogs,
            searching,
            setSearching,
            searchValue,
            setSearchValue,
    }),[
        allBlogsGlobally,
            setAllBlogsGlobally,
            fetchBlogsError,
            fetchBlogsLoading,
            filteredBlogs,
            setFilteredBlogs,
            searching,
            setSearching,
            searchValue,
            setSearchValue,
    ])
    return(
        <BlogContext.Provider value={BlogContextValues}>
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
    
    const UIContextValues = useMemo(() => {
        return {
             openUserAccount,
            setOpenUserAccount,
            setShowMenu,
            showMenu,
            editProfile,
            setEditProfile,
            inHomePage,
            setInHomePage
        }
    }, [
         openUserAccount,
            setOpenUserAccount,
            setShowMenu,
            showMenu,
            editProfile,
            setEditProfile,
            inHomePage,
            setInHomePage
    ])
    return (
        <UIContext.Provider value={UIContextValues}>
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
