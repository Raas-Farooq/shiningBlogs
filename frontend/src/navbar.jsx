import { useEffect, useState } from 'react';
import {FaBars, FaFacebook, FaPinterest, FaSearch, FaTwitter, FaWhatsapp} from 'react-icons/fa';
import { FaTwitch } from 'react-icons/fa';
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
    }, [window.innerWidth, showMenu])
    return(
        <nav className="flex bg-white-800 text-white p-4 justify-between"> 

            <div className="md:hidden text-black">
                <button onClick={() => setShowMenu(!showMenu)}> <FaBars /></button>
            </div> 
            <ul className={`md:flex space-x-4 mb-4 ml-15  w-1/3 ${showMenu ? 'flex-col min-h-screen': 'hidden'}`}>
                <li><a href=""><FaFacebook /> </a></li>
                <li><a href=""><FaTwitter /> </a></li>
                <li><a href=""><FaPinterest /> </a></li>
                <li><a href=""><FaWhatsapp /> </a></li>
            </ul>

            <ul className={`md:flex space-x-4 mb-4 ml-10 w-1/3  ${showMenu ? 'flex-col min-h-screen': 'hidden'}`}>
                <li><a href="" className='hover:text-gray-300'> Home  </a></li>
                <li><a href="" className='hover:text-gray-300'> About  </a></li>
                <li><a href="" className='hover:text-gray-300'> Write  </a></li>
                <li><a href="" className='hover:text-gray-300'> Content  </a></li>
            </ul>

            <ul className="flex space-x-4 mb-4 ml-10  w-2/5">
                <li><a href="" className='hover:text-gray-300'> Login </a></li>
                <li><a href="" className='hover:text-gray-300'> Register </a></li>

                <div className="m">
                    <input type="search" 
                    id="search" 
                    placeholder='Search Dream Blog' 
                    className='text-black pb-1 bg-white border border-green-300 rounded'/>
                </div>

                
            </ul>


        </nav>
    )
    
}
