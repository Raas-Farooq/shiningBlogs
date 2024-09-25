import { useEffect, useState } from 'react';
import {FaBars, FaTimes, FaFacebook, FaPinterest, FaSearch, FaTwitter, FaWhatsapp, FaUser, FaRegUser} from 'react-icons/fa';
import { useGlobalContext } from '../../globalContext/globalContext';
import { FaTwitch } from 'react-icons/fa';
import {CiSearch} from 'react-icons/ci';
import WindowSize from '../../windowSize';
import { Link } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

export default function Navbar(){

    const {setCurrentUser, currentUser, setOpenUserAccount, openUserAccount, setShowMenu, showMenu, loggedIn, loading, setLoading, setLoggedIn} = useGlobalContext();
    
    // console.log("openUserAccount: ", openUserAccount);
    // console.log("showMenu: ", showMenu);
    const [searchClicked, setSearchClicked] = useState(false);
    const size = WindowSize();
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
        console.log("is Login: ", loggedIn);
        const thisUser = JSON.parse(localStorage.getItem('thisUser'));
        // console.log("this User inside navbar: ", thisUser);
    }, [])
    useEffect(() => {
        if(size.width > 768){
            console.log("logeed In inside navbar: ", loggedIn);
            setShowMenu(false);
            setSearchClicked(false)
        }
    }, [size.width, loggedIn])
    if(loading){
        return <h1> Loading.. </h1>
    }
    return(
        <nav className={`flex bg-[#5D62FF]-300 shadow-lg text-white bg-[#FFFFFF] top-0 z-10 items-center fixed w-full justify-between ${showMenu ? 'flex-col pb-[8rem] ' : 'flex'} ${showMenu &&  openUserAccount ?'flex-col fixed': 'relative'}` }> 
            
            <div className={`pl-12 pb-4 md:hidden text-black text-xl `}>
                <button onClick={() => setShowMenu(!showMenu)} className="border border-red-200 p-2 mt-2"> {showMenu ?  <FaTimes /> : <FaBars />}</button>
                    
            </div> 
            <div className={` ${showMenu ? 'flex-grow ': 'hidden'}`}>
                <input type="search" 
                    id="search" 
                    placeholder='Search Dream Blog' 
                    className='text-black pb-1 bg-white border border-green-300 rounded'/>
            </div>
           
            <ul className={`md:flex mb-2 ml-10 mt-2 w-1/3 ${showMenu ? 'flex flex-col items-start mt-2 ': 'hidden'}`}>
                <li className=" flex">
                   <Link to={'/'} className='px-2 ml-3 pointer py-2 bg-green-300 hover:bg-green-200 md:w-auto w-24 mb-2'>Home</Link>   
                </li>
                <li className=" flex">
                   <Link to={'/about'} className='px-2 ml-3 pointer py-2 bg-green-300 hover:bg-green-200 md:w-auto w-24 mb-2'>About</Link>   
                </li>
                <li className=" flex">
                   <Link to={'/write'} className='px-2 ml-3 pointer py-2 bg-green-300 hover:bg-green-200 md:w-auto w-24 mb-2'>Write</Link>   
                </li>
                <li className=" flex">
                   <Link to={'/content'} className='px-2 ml-3 pointer py-2 bg-green-300 hover:bg-green-200 md:w-auto w-24 mb-2'>Content</Link>   
                </li>
            </ul>
            
            <ul className={`md:flex mb-2 ml-5 w-1/3 md:w-1/4 ${showMenu ? 'flex-col ': 'hidden'}`}>
                <li className="px-2 ml-3 py-2 " ><a href=""><FaFacebook /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaTwitter /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaPinterest /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaWhatsapp /> </a></li>
            </ul>

            <ul className={`md:flex mb-2 w-1/3 md:text-sm ${showMenu ? 'flex': 'hidden'} ${!loggedIn && 'md:text-xl ml-12 xs:flex'}`}>
                <li className={`${searchClicked || loggedIn ? 'hidden': 'none'} `}><Link to={"/login"} className='px-2 py-2 hover:text-gray-300'> Login </Link></li>
                <li className={` ${searchClicked || loggedIn ? 'hidden': 'none'} `} ><Link to={"/registerUser"} className='px-2 py-2 hover:text-gray-300'> Register </Link></li>

                <div className={`mt-2 lg:block ${showMenu ? 'hidden': 'block'} ${searchClicked || loggedIn && !showMenu ? 'xs:block' : 'xs:hidden'}`}>
                    <input type="search" 
                    id="search" 
                    placeholder='Search Blog' 
                    className='text-black w-28 pb-1 bg-white border border-green-300 rounded'/>
                </div>
                <button 
                onClick={() => {
                    console.log("Search is Growing ", searchClicked)
                    setSearchClicked(!searchClicked)}
                }
                className={`lg:hidden text-black p-2 px-3 bg-none ${showMenu && 'hidden'} ${loggedIn && 'xs:hidden'}`}> <CiSearch /> </button>
                
            </ul>

            <div className={`${showMenu  || !loggedIn ? 'xs:hidden' : 'xs:block'} `}>
                <button 
                onClick={() => {
                    console.log("userAccount clicked")
                    setOpenUserAccount(true)
                }
                }>
                    <Link className='block text-center p-2 bg-green-300'
                    to={'/userAccount'}
                        >
                        <FaRegUser /> 
                    </Link>
                </button>
            
            </div>
        </nav>
    )
    
}





