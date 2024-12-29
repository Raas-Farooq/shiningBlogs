import { useEffect, useState } from 'react';
import {FaBars, FaTimes, FaFacebook, FaPinterest, FaSearch, FaTwitter, FaWhatsapp, FaUser, FaRegUser} from 'react-icons/fa';
import { useGlobalContext } from '../../globalContext/globalContext';
import { FaTwitch } from 'react-icons/fa';
import {CiSearch} from 'react-icons/ci';
import WindowSize from '../../windowSize';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

export default function Navbar({showSearch=true}){

    const {inHomePage,searchValue, setInHomePage, setSearchValue, filteredBlogs, searching, setSearching, setFilteredBlogs, allBlogsGlobally,setAllBlogsGlobally, setOpenUserAccount, openUserAccount, setShowMenu, showMenu, loggedIn, setLoggedIn} = useGlobalContext();
    
    // console.log("openUserAccount: ", openUserAccount);
    // console.log("showMenu: ", showMenu);
    const [searchClicked, setSearchClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const size = WindowSize();
    const moveTo = useNavigate();

    

    useEffect(() => {
        // setSearching(false);
        // setSearchValue(''); 
        setInHomePage(showSearch);
        if(!showSearch){
            setShowMenu(false)
        }
    }, [showSearch]);

    useEffect(() => {
        if(size.width > 768){
            console.log("logeed In inside navbar: ", loggedIn);
            setShowMenu(false);
            if(searchValue.length>0){
                setSearchClicked(true)
            }else{
                setSearchClicked(false)
            }
            
        }
    }, [size.width, loggedIn])

    const handleSearchFocus = (e) => {
        console.log("focus has been clicked: ");
        console.log("showmMenu: ", showMenu);
        setSearching(true);
        
    }
    function handleHome(){
        console.log("Home cliccked: ")
        setShowMenu(false)
    }
    const handleShowCancel = (e) => {
        e.stopPropagation();
        if(!inHomePage){
            setSearching(false)
        }
        setShowMenu(!showMenu);
        // setSearching(false);
        // setSearchValue('')
    }
    function handleSearchBlur(){
        
        setSearching(false);
    }
    function handleSearchSubmit(e){
        e.preventDefault();
        console.log("submit result: ",e.targetValue )
        const blogSearch = e.target.value;
        setSearchValue('');
        setSearching(true);
        
        const filtered = allBlogsGlobally?.filter(blog => {
            if(blog.title.toString().toLowerCase().includes(blogSearch?.toString().toLowerCase())){
                return blog;
            }
        })
        setFilteredBlogs(filtered);

    }
    const handleSearchChange = (e) => {
        console.log("handleSearch value: ", e.target.value);
        
        const blogSearch = e.target.value;
        setSearchValue(blogSearch);
        setSearching(true);
        
        const filtered = allBlogsGlobally?.filter(blog => {
            if(blog.title.toString().toLowerCase().includes(blogSearch?.toString().toLowerCase())){
                return blog;
            }
        })
        console.log("filtered blogs: ", filtered)
        setFilteredBlogs(filtered);
    } 

    

    const handleWriteClick = (e) => {
        e.preventDefault();
        console.log("you have entered the custody of new Post")
        console.log("you clicked the Write Button", loggedIn)
        if(!loggedIn){
            const confirmMessage= window.confirm("You are Not Logged In! Logged In and create a blog");
            if(confirmMessage){
                moveTo('/login')
            }
            
        }else{
            moveTo('/write')
        }
    }
    const handleContentClick = () => 
        {
            if(!loggedIn){
                const moveToLoggin = window.confirm("You Should Login If You want to see Your Content");
                if(moveToLoggin){
                    moveTo('/Login')
                }

            }else{
                moveTo('/content')
            }
        }

    if(loading){
        return <h1> Loading.. </h1>
    }
    return(
        <nav className={`flex bg-[#5D62FF]-300 shadow-lg text-white bg-[#FFFFFF] top-0 z-10 items-center fixed w-full justify-between ${showMenu ? 'flex-col pb-[8rem] ' : 'flex'} ${showMenu &&  openUserAccount ?'flex-col fixed': 'relative'} ${showMenu && searching && 'flex-col pb-[1rem]'}` }> 
            <div className={`pl-12 pb-4 md:hidden text-black text-xl`}>
                <button onMouseDown={(e) => handleShowCancel(e)} className="border border-red-200 p-2 mt-2 hover:bg-gray-200 transition-transform duration-300 hover:scale-110"> {showMenu ?  <FaTimes /> : <FaBars />}</button>
                    
            </div> 
            <div className={`transition-opacity duration-300 
            ${showMenu? 'opacity-100' : 'opacity-0 hidden'}`}>
                <div className={`${!inHomePage && 'xs:hidden'}`}>
                    <input type="search" 
                        id="search" 
                        value={searchValue}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                        placeholder='Search Dream Blog' 
                        className='text-black pb-1 bg-white border border-green-300 rounded'/>
                </div>
            </div>
            {/* flex flex-col items-start mt-2 */}
            <ul className={`md:flex md:translate-y-0 my-2 ml-10 w-1/3 ${showMenu ? 'opacity-100 translate-y-0': '-translate-y-20 hidden'} ${showMenu && searching && 'hidden'} transition-all duration-300`}>
                <li className=" flex">
                   <Link to={'/'} onClick={handleHome} className='px-2 py-2 ml-3 bg-green-300 hover:bg-green-200 xs:w-24 md:w-auto my-2 '>Home</Link>   
                </li>
                <li className=" flex">
                   <Link to={'/about'} className='px-2 py-2 ml-3 text-blue-600 bg-green-300 hover:bg-green-200 xs:w-24 md:w-auto my-2 '>About</Link>
                   </li>
                <li className="flex">
                   <span onClick={handleWriteClick} className='cursor-pointer px-2 py-2 ml-3 text-blue-600 bg-green-300 hover:bg-green-200 xs:w-24 md:w-auto my-2 '>Write</span>   
                </li>
                <li className=" flex">
                   <span onClick={handleContentClick} className='md:text-[13px] text-blue-600 sm:text-[12px] px-2 py-2 ml-3 bg-green-300 hover:bg-green-200 cursor-pointer my-2 xs:w-24 md:w-20'>My Posts</span>   
                </li>
            </ul>
            
            <ul className={`md:flex mb-2 ml-8 w-1/3 md:w-1/4 ${showMenu ? 'flex-col ': 'hidden'} ${showMenu && searching && 'hidden'}`}>
                <li className="px-2 ml-3 py-2 " ><a href=""><FaFacebook /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaTwitter /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaPinterest /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaWhatsapp /> </a></li>
            </ul>

            <ul className={`md:flex mb-2 w-1/3 md:text-sm ${showMenu ? 'flex': 'hidden'} ${!loggedIn && 'md:text-xl ml-12 xs:flex'}`}>
                <li className={`${searchClicked && !showMenu || loggedIn || searchValue && inHomePage? 'hidden': 'none'} ${!loggedIn && searchValue ? 'md:block' : 'none'} `}><Link to={"/login"} className='px-2 py-2 hover:text-gray-300'> Login </Link></li>
                <li className={` ${searchClicked && !showMenu || loggedIn || searchValue && inHomePage? 'hidden': 'none'} ${!loggedIn && searchValue ? 'md:block' : 'none'}`} ><Link to={"/registerUser"} className='px-2 py-2 hover:text-gray-300'> Register </Link></li>

                <div className={`mt-2 lg:block ${!searchValue && 'hidden'} ${searchClicked ? 'block' : 'none'} ${searchClicked || searchValue.length>0 || loggedIn && !showMenu ? 'xs:block' : 'xs:hidden'} ${showMenu || !inHomePage ? 'xs:hidden lg:hidden': 'block'} `}>
                    <input type="search" 
                    id="search" 
                    placeholder='Search Blog' 
                    onChange={handleSearchChange}
                    onSubmit={handleSearchSubmit}
                    value={searchValue}
                    className='text-black w-28 pb-1 bg-white border border-green-300 rounded'/>
                </div>
                <button 
                onClick={() => {
                    setSearchValue('');
                    setSearchClicked(!searchClicked)}
                }
                className={`lg:hidden text-black p-2 px-3 bg-none ${showMenu && 'hidden'} ${searchValue && !inHomePage && 'xs:hidden'} ${loggedIn || !inHomePage && 'hidden'}`}> <CiSearch /> </button>
                
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





