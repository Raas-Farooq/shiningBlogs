import { useEffect, useState } from 'react';
import {FaBars, FaTimes, FaFacebook, FaPinterest, FaSearch, FaTwitter, FaWhatsapp, FaUser, FaRegUser} from 'react-icons/fa';
import { useGlobalContext } from '../../globalContext/globalContext';
import { FaTwitch } from 'react-icons/fa';
import {CiSearch} from 'react-icons/ci';
import WindowSize from '../../windowSize';


export default function Navbar(){

    const {setOpenUserAccount, openUserAccount} = useGlobalContext();
    const [showMenu, setShowMenu] = useState(false);
    console.log("openUserAccount: ", openUserAccount);
    console.log("showMenu: ", showMenu);
    const [searchClicked, setSearchClicked] = useState(false);
    const size = WindowSize();

    useEffect(() => {
        // console.log("window.innerWidth: ", window.innerWidth);
        if(size.width > 768){
            console.log("WindowSize.width :", size.width);
            setShowMenu(false);
            setSearchClicked(false)
        }
        // console.log("show Menu useEffect: ", showMenu)
    }, [size.width])
    return(
        <nav className={`flex bg-gray-300 shadow-lg text-white bg-[#FFFFFF] top-0 z-10 items-center fixed w-full justify-between ${showMenu ? 'flex-col' : 'flex'} ${showMenu &&  openUserAccount ?'flex-col fixed': 'relative'}` }> 
            
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
            <li className="px-2 ml-3 py-2 md:text-sm bg-green-300 hover:bg-green-200 md:w-auto w-24 mb-2"><a href="" className="text-gray-800 hover:text-green-600"> Home  </a></li>
                <li className="px-2 ml-3 py-2 bg-green-300 hover:bg-green-200 md:w-auto w-24 mb-2"><a href="" className="text-gray-800 hover:text-green-600"> About  </a></li>
                <li className="px-2 ml-3 py-2 bg-green-300 hover:bg-green-200 md:w-auto w-24 mb-2"><a href="" className="text-gray-800 hover:text-green-600"> Write  </a></li>
                <li className="px-2 ml-3 py-2 bg-green-300 hover:bg-green-200 md:w-auto w-24 mb-2"><a href="" className="text-gray-800 hover:text-green-600"> Content  </a></li>
            </ul>
            
            <ul className={`md:flex mb-2 ml-5 w-1/3 md:w-1/4 ${showMenu ? 'flex-col ': 'hidden'}`}>
                <li className="px-2 ml-3 py-2 " ><a href=""><FaFacebook /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaTwitter /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaPinterest /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaWhatsapp /> </a></li>
            </ul>

            <ul className={`md:flex mb-2 w-1/3 md:text-sm ${showMenu ? 'flex': 'hidden'} `}>
                <li className={`px-2 py-2 ${searchClicked ? 'hidden': 'none'} `}><a href="" className='hover:text-gray-300'> Login </a></li>
                <li className={`px-2 py-2 ${searchClicked ? 'hidden': 'none'} `} ><a href="" className='hover:text-gray-300'> Register </a></li>

                <div className={`mt-2 lg:block ${showMenu ? 'hidden': 'block'} ${searchClicked ? 'block md:block' : 'md:hidden'}`}>
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
                className={`lg:hidden text-black p-2 px-3 bg-none ${showMenu && 'hidden'}`}> <CiSearch /> </button>
                
            </ul>

            <div className={`absolute right-4 top-3 ${showMenu && 'hidden'}  ${openUserAccount && 'hidden'}`}>
                <button onClick={() => setOpenUserAccount(true)} className='p-2 border border-brown-400 rounded text-black'> <FaRegUser /> </button>
            
            </div>
        </nav>
    )
    
}




