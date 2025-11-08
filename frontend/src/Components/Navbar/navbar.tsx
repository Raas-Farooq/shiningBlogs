import { useEffect, useState } from 'react';
import {FaBars, FaTimes, FaRegUser} from 'react-icons/fa';
import { useAuthenContext, useBlogContext,useUIContext } from '../../globalContext/globalContext';
import WindowSize from '../../windowSize.ts';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { VITE_API_URL } from '../../config.ts';
import useLoginConfirm from '../../utils/useLoginConfirm.tsx';

export default function Navbar({showSearch=true}){

    const {inHomePage, setInHomePage, setOpenUserAccount, setShowMenu, showMenu} = useUIContext();
    const {searchValue, setSearching} = useBlogContext();
    const {loggedIn,currentUser} = useAuthenContext();
    const [userProfileImage, setUserProfileImage] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);
    const size = WindowSize();
    const moveTo = useNavigate();
    const loginConfirm = useLoginConfirm();
    

    useEffect(() => {
        // setSearching(false);
        // setSearchValue(''); 
        setInHomePage(showSearch);
        if(!showSearch){
            setShowMenu(false)
        }
    }, [showSearch]);

    useEffect(() => {
        const gettingProfileImage = async() => {
            if(currentUser?.profileImg){
                const userImage = (`${VITE_API_URL}/${currentUser.profileImg}`);

                setUserProfileImage(userImage);
            }else{
                setUserProfileImage('')
            }
        }
        gettingProfileImage();

    }, [loggedIn]);


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
   

    

    const handleWriteClick = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(!loggedIn){
            const confirmMessage = await loginConfirm();
            if(confirmMessage){
                setTimeout(() => {
                    moveTo('/login')
                },1200)
            }
            
        }else{
            moveTo('/write')
        }
    }
    const handleContentClick = async () => 
        {
            if(!loggedIn){
            const confirmMessage = await loginConfirm();
            if(confirmMessage){
                moveTo('/login')
            }
            
        } else{
                moveTo('/content')
            }
        }



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
        const linkStyles = 'text-lg font-semibold  text-gray-800 hover:text-blue-500 transition-colors duration-200 focus:outline-none focus:ring-0';
    return(
        <nav className={`flex items-center justify-between bg-white,
             backdrop-blur-sm bg-opacity-80 py-3 fixed top-0 z-20 w-full
              ${showMenu && 'flex-col items-center'}` }>
            
            {/* Mobile Menu Toggle */}
            <div className="flex justify-between items-center md:hidden w-full">
                <div className="text-2xl">
                    <button onClick={handleShowCancel} className="p-2 transition-transform duration-300 hover:scale-110">
                        {showMenu ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                <div className={clsx(loggedIn && 'hidden', 'text-sm')}>
                    <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                    <Link to="/registerUser" className="ml-4 bg-blue-500 rounded-lg px-2 py-2 text-white hover:text-gray-900">Register</Link>
                </div>
            </div>

            {/* Logo/Site Title (visible on all screen sizes) */}
            <div className="hidden md:block">
                <Link to={'/'} className='text-xl font-bold text-orange-500'>Dream Blog</Link>
            </div>

            {/* Desktop Navigation Links */}
            <ul className={clsx(
                'md:flex md:items-center md:space-x-6',
                !showMenu && 'hidden',
                showMenu && 'flex flex-col items-center space-y-4 md:space-y-0',
                'transition-all duration-300',
            )}>
                <li><Link to={'/'} onClick={handleHome} className={`${linkStyles}`}>Home</Link></li>
                <li><Link to={'/about'} className={`${linkStyles}`}>About</Link></li>
                <li><span onClick={handleWriteClick} className={`cursor-pointer ${linkStyles}`}>Write</span></li>
                <li><span onClick={handleContentClick} className={`cursor-pointer ${linkStyles}`}>My Posts</span></li>
            </ul>

            {/* User Account / Login / Register (Desktop) */}
            <ul className={clsx('transition-all duration-300', loggedIn ? 'hidden' : 'hidden md:flex md:items-center md:space-x-1 md:mr-2 lg:space-x-6')}>
                <li><Link to={"/login"} className='rounded-md px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100'>Login</Link></li>
                <li><Link to={"/registerUser"} className='rounded-md bg-blue-500 px-4 py-2 mr:4 text-white hover:text-white transition-colors duration-200 hover:bg-blue-600 '>Register</Link></li>
            </ul>

            {/* User Profile Image */}
            {loggedIn && (
                <div className="absolute right-6 top-4 md:relative md:top-0 md:right-4">
                    <button onClick={() => setOpenUserAccount(true)} className="rounded-full ring-2 ring-blue-500 transition-all duration-200 hover:ring-4">
                        <Link to={'/userAccount'}>
                            {userProfileImage ? (
                                <img src={userProfileImage} className='w-10 h-10 rounded-full object-cover' alt="User Profile" />
                            ) : (
                                <FaRegUser className="w-10 h-10 p-2 bg-gray-200 rounded-full text-gray-600" />
                            )}
                        </Link>
                    </button>
                </div>
            )}
        </nav>
    )
    
}

