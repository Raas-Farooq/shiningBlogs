import { useState } from "react";
import { useGlobalContext } from "../globalContext/globalContext";
import { Link } from "react-router-dom";
import { FaImage } from "react-icons/fa";

const Login = () => {

    const {openUserAccount,editProfile,setEditProfile, setOpenUserAccount} = useGlobalContext();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email after submission: ", email);
        console.log("Password after submission: ", password);
        
        setEmail('');
        setPassword('');
    }
    
    return (
        <div className="mt-16 flex justify-center">
            {/* {editProfile && ( */}
                <div>
                    <h1> Login Here</h1>
                    <form className="flex flex-col p-5" method="post" >
                        
                        <input type="email" id="email" placeholder="Enter Your Email"
                        className="border border-gray-300 w-[25vw] p-2 m-5"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}

                        />

                        <input type="password" 
                        name="password" 
                        className="border border-gray-300 w-[25vw] p-2 m-5" 
                        placeholder="Enter New Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type="submit" onClick={handleSubmit} className="border border-gray-300 w-[15vw] p-2 m-5 bg-red-400 hover:bg-red-300 ">Login</button>

                    </form>

                    <button ><Link 
                    className="bg-green-400 border p-3 ml-8"
                    to="/">Go Back </Link></button>
                </div>
            {/* )} */}
            
        </div>
    )
}

export default Login

