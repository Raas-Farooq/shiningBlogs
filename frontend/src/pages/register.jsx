import { useState } from "react";
import { useGlobalContext } from "../globalContext/globalContext";
import { Link } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import axios from "axios";

const Register = () => {
    const {openUserAccount,editProfile,setEditProfile, setOpenUserAccount} = useGlobalContext();
    // const [userImage, setUserImage] = useState('');
    // const [imagePreview, setImagePreview] = useState('');
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [confirmMessage, setConfirmMessage] = useState('');

    
    const validEmail = (email_text) => {
        const emailTest = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailTest.test(email_text);
    } 

    const validateRegistration = () => {
        let errors = {};
        if(!username){
            errors.username = "Username is required"
        }
        else if (username.length <= 3){
            errors.username = "username length should be atleast 3 digits"
        }
        if(!isNaN(username[0])){
            errors.username = "username first character must not be Number";
        }

        if(!email){
            errors.email=" Email is required";
        }
        else if(!validEmail(email)){
            errors.email = "Invalid Email"
        }

        if(password.length === 0){
            errors.password = "Password is Empty!";
        }
        else if(password.length < 8){
            errors.password = "Enter strong password Length must be atleast 8 characters"
        }

        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationResult = validateRegistration();
        console.log(Object.keys(validationResult).length === 0);

        if(Object.keys(validationResult).length === 0){
            alert("Success! You will find an Confirmation Email Soon")
            
            setEmail('');
            setUsername('');
            setPassword('');
            setErrors({});
            setConfirmMessage("Your Information Submitted Successfully");

            setTimeout(() => {
                setConfirmMessage("");
            }, 3000)
            
            const registrationData = {
                username,
                email,
                password
            }
            try{
                const registerResponse = await axios.post(`http://localhost:4100/weblog/registerUser`, registrationData);

                console.log("successfully got response during registration: ", registerResponse);

            }catch(err){
                console.log("the error while registering: ", err)
            }
            
        }else
        {
            setErrors(validationResult);
            console.log("actual Errors: ", errors)
        }

        
    }
    
    return (
        <div className="mt-16 flex justify-center">
            {/* {editProfile && ( */}
                <div>
                    <h1> Create New Account</h1>
                    <form className="flex flex-col p-5" method="post" >
                        
                        <input type="input" 
                        name="input" 
                        className={`border border-gray-300 w-[25vw] p-2 m-5 ${errors.username && 'border border-red-400'}`} 
                        placeholder="Enter New Username" 
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        />
                        
                        {errors.username && <p className="ml-5 text-red-500"> {errors.username}!</p>}

                        <input type="email" id="email" placeholder="Enter Your Email"
                        className={`border border-gray-300 w-[25vw] p-2 m-5 ${errors.email && 'border border-red-400'}`}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        />
                        {errors.email && <p className="ml-5 text-red-500"> {errors.email}!</p>}


                        <input type="password" 
                        name="password" 
                        className={`border border-gray-300 w-[25vw] p-2 m-5 ${errors.password && 'border border-red-400'}`}
                        placeholder="Enter New Password" 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        />
                        {errors.password && errors  ? <p className="ml-5 text-red-500"> {errors.password}!</p> : ''}
                        {console.log("erros length: ", errors)}
                        <button type="submit" onClick={handleSubmit} className="border border-gray-300 w-[15vw] p-2 m-5 bg-red-400 hover:bg-red-300 ">Create Account</button>
                        {confirmMessage && <p className="text-green-600 text-lg"> {confirmMessage}</p>}
                    </form>

                    <button><Link 
                    className="bg-green-400 border p-3 ml-8 hover:bg-green-300"
                    to="/">Go Back </Link></button>
                </div>
            {/* )} */}
            
        </div>
    )
}

export default Register