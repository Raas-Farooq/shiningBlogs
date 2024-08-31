import { useEffect, useState } from 'react';
import {FaBars, FaTimes, FaFacebook, FaPinterest, FaSearch, FaTwitter, FaWhatsapp, FaUser, FaRegUser} from 'react-icons/fa';
import { FaTwitch } from 'react-icons/fa';
import {CiSearch} from 'react-icons/ci';
import WindowSize from './windowSize';


export default function Navbar(){
    const [showMenu, setShowMenu] = useState(false)
    const size = WindowSize();

    useEffect(() => {
        // console.log("window.innerWidth: ", window.innerWidth);
        if(size.width > 768){
            console.log("WindowSize.width :", size.width);
            setShowMenu(false);
        }
        // console.log("show Menu useEffect: ", showMenu)
    }, [size.width])
    return(
        <nav className={`flex bg-white-800 text-white p-4 justify-between ${showMenu ? 'flex-col ' : 'flex'}`}> 
            
            <div className={`pl-12 pb-4 md:hidden text-black text-xl `}>
                <button onClick={() => setShowMenu(!showMenu)} className="border border-red-200 p-2"> {showMenu ?  <FaTimes /> : <FaBars />}</button>
            </div> 
            <div className={` ${showMenu ? 'flex-grow ': 'hidden'}`}>
                <input type="search" 
                    id="search" 
                    placeholder='Search Dream Blog' 
                    className='text-black pb-1 bg-white border border-green-300 rounded'/>
            </div>
           
            <ul className={`md:flex mb-4 ml-10 w-1/3 ${showMenu ? 'flex flex-col items-start mt-2 ': 'hidden'}`}>
            <li className="px-2 ml-3 py-2 md:text-sm bg-green-300 md:w-auto w-24 mb-2"><a href="" className="text-gray-800 hover:text-green-600"> Home  </a></li>
                <li className="px-2 ml-3 py-2 bg-green-300 md:w-auto w-24 mb-2"><a href="" className="text-gray-800 hover:text-green-600"> About  </a></li>
                <li className="px-2 ml-3 py-2 bg-green-300 md:w-auto w-24 mb-2"><a href="" className="text-gray-800 hover:text-green-600"> Write  </a></li>
                <li className="px-2 ml-3 py-2 bg-green-300 md:w-auto w-24 mb-2"><a href="" className="text-gray-800 hover:text-green-600"> Content  </a></li>
            </ul>
            
            <ul className={`md:flex mb-4 ml-10 w-1/3 md:w-1/4 ${showMenu ? 'flex-col ': 'hidden'}`}>
                <li className="px-2 ml-3 py-2 " ><a href=""><FaFacebook /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaTwitter /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaPinterest /> </a></li>
                <li className="px-2 ml-3 py-2" ><a href=""><FaWhatsapp /> </a></li>
            </ul>

            <ul className={`md:flex mb-4 w-1/4 md:text-sm ${showMenu ? 'flex': 'hidden'}`}>
                <li className="px-2 py-2"><a href="" className='hover:text-gray-300'> Login </a></li>
                <li className="px-2 py-2"><a href="" className='hover:text-gray-300'> Register </a></li>

                <div className={`mt-2 ${showMenu ? 'hidden': 'block'}`}>
                    <button className='text-black'> <CiSearch /> </button>
                    <input type="search" 
                    id="search" 
                    placeholder='Search Blog' 
                    className='text-black w-28 pb-1 bg-white border border-green-300 rounded'/>
                </div>

                
            </ul>

            <div className={`mt-1 ${showMenu ? 'ml-12': 'none'}`}>
                <button className='p-2 border border-brown-400 rounded text-black'> <FaRegUser /> </button>
            </div>
        </nav>
    )
    
}
