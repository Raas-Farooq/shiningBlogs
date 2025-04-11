import { useEffect, useState } from 'react';
import {FaBars, FaTimes, FaFacebook, FaPinterest, FaTwitter, FaWhatsapp, FaRegUser} from 'react-icons/fa';
import { useAuthenContext, useBlogContext,useUIContext } from '../../globalContext/globalContext';
import WindowSize from '../../windowSize.ts';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { VITE_API_URL } from '../../config.ts';

export default function Navbar({showSearch=true}){

    const {inHomePage, setInHomePage, setOpenUserAccount, openUserAccount, setShowMenu, showMenu} = useUIContext();
    const {searchValue,setSearchValue, searching, setSearching, setFilteredBlogs, allBlogsGlobally} = useBlogContext();
    const {loggedIn,currentUser} = useAuthenContext();
    const [userProfileImage, setUserProfileImage] = useState('');
    // console.log("openUserAccount: ", openUserAccount);
    // console.log("showMenu: ", showMenu);
    const [searchClicked, setSearchClicked] = useState(false);
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
        console.log("currentUser in Navbar: ", currentUser);
        const gettingProfileImage = async() => {
            if(currentUser?.profileImg){
                const userImage = (`${VITE_API_URL}/${currentUser.profileImg}`);
                setUserProfileImage(userImage);
            }
        }
        gettingProfileImage();
    }, []);


    useEffect(() => {
        if(size.width > 768){
            setShowMenu(false);
            if(searchValue.length>0){
                setSearchClicked(true)
            }else{
                setSearchClicked(false)
            }
            
        }
    }, [size.width, loggedIn])

    
    function handleHome(){
        console.log("Home cliccked: ")
        setShowMenu(false)
    }
    const handleShowCancel = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if(!inHomePage){
            setSearching(false)
        }
        setShowMenu(!showMenu);
        // setSearching(false);
        // setSearchValue('')
    }
    const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const blogSearch = e.target.value;
        setSearchValue(blogSearch);
        setSearching(true);
        if(!blogSearch){
            setSearching(false);
        }
        const filtered = allBlogsGlobally?.filter(blog => {
            if(blog.title.toString().toLowerCase().includes(blogSearch?.toString().toLowerCase())){
                return blog;
            }
        })
        setFilteredBlogs(filtered);
    } 

    

    const handleWriteClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
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

        const getLogClass = () => clsx({
            hidden: loggedIn || (searchValue && 
            !inHomePage),
            'md:block':!loggedIn && searchValue,
        })

        // md:absolute lg:relative lg:mt-0 
       const searchBarClass = () => clsx({
        'mt-7 md:block md:absolute lg:relative lg:mt-0': true,
        'hidden': !searchValue,
        'block': searchClicked || searchValue.length>0 || loggedIn && !showMenu,
        'xs:block': searchClicked || searchValue.length > 0 || (loggedIn && !showMenu),
        'xs:hidden': !(searchClicked || searchValue.length > 0 || (loggedIn && !showMenu)),
        'xs:hidden lg:hidden': showMenu || !inHomePage,
        'md:block md:mt-0': loggedIn,
        })

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
                        onFocus={() => setSearching(true)} 
                        // onBlur={() => setSearching(false)} 
                        placeholder='Search Dream Blog' 
                        className='text-black pb-1 bg-white border border-green-300 rounded'/>
                </div>
            </div>
            {/* flex flex-col items-start mt-2 */}
            <ul className={`md:flex md:translate-y-0 my-2 ml-10 w-1/3 ${showMenu ? 'opacity-100 translate-y-0': '-translate-y-20 hidden'} ${showMenu && searching && 'hidden'} transition-all duration-300`}>
                <li className="flex">
                   <Link to={'/'} onClick={handleHome} className='px-2 py-2 ml-3 bg-green-300 hover:bg-green-200 xs:w-24 md:w-auto my-2 '>Home</Link>   
                </li>
                <li className=" flex">
                   <Link to={'/about'} className='px-2 py-2 ml-3 text-blue-600 bg-green-300 hover:bg-green-200 xs:w-24 md:w-auto my-2 '>About</Link>
                   </li>
                <li className="flex">
                   <span onClick={handleWriteClick} className='cursor-pointer px-2 py-2 ml-3 text-blue-600 bg-green-300 hover:bg-green-200 xs:w-24 md:w-auto my-2 '>Write</span>   
                </li>
                <li className="flex">
                   <span onClick={handleContentClick} className='md:text-[13px] text-blue-600 sm:text-[12px] px-2 py-2 ml-3 bg-green-300 hover:bg-green-200 cursor-pointer my-2 xs:w-24 md:w-20'>My Posts</span>   
                </li>
            </ul>
            
            <ul className={`md:flex mb-2 ml-8 w-1/3 md:w-1/4 ${showMenu ? 'flex-col ': 'hidden'} ${showMenu && searching && 'hidden'}`}>
                <li className="px-2 ml-3 py-2 " ><a href=""><FaFacebook /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaTwitter /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaPinterest /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaWhatsapp /> </a></li>
            </ul>

            <ul className={`md:flex mb-4 w-1/3 md:text-sm relative ${showMenu ? 'flex': 'hidden'} ${!loggedIn ? 'md:text-xl ml-12 xs:flex' : 'lg:mt-4'}`}>
                <div className="flex mb-2 lg:mb-0">
                    <li className={getLogClass()}><Link to={"/login"} className='px-2 py-2 hover:text-gray-300'> Login </Link></li>
                    <li className={getLogClass()} ><Link to={"/registerUser"} className='px-2 py-2 hover:text-gray-300'> Register </Link></li>

                </div>

                <div className={searchBarClass()}>
                    <input type="search" 
                    id="search" 
                    placeholder='Search Blog' 
                    onChange={handleSearchChange}
                    // onSubmit={handleSearchSubmit}
                    value={searchValue}
                    className='text-black w-28 pb-1 bg-white border border-green-300 rounded placeholder:text-sm'/>
                </div>
                
            </ul>

            <div className={`${showMenu  || !loggedIn ? 'xs:hidden' : 'xs:block'} `}>
                <button 
                onClick={() => {
                    console.log("userAccount clicked")
                    setOpenUserAccount(true)
                }
                }>
                    <Link className={clsx(`block text-center p-2 bg-green-300`, userProfileImage && 'bg-white' )}
                    to={'/userAccount'}
                        >
                            {userProfileImage 
                            ? 
                            <img src={userProfileImage} className='w-14'></img> 
                            : 
                            <FaRegUser /> 
                            }
                        
                    </Link>
                </button>
            
            </div>
        </nav>
    )
    
}