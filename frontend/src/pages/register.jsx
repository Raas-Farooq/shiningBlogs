import { useEffect, useState } from "react";
import { useAuthenContext } from "../globalContext/globalContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import axios from "axios";
import { VITE_API_URL } from "../config";

const Register = () => {
    const {setLoggedIn, setIsAuthenticated, setRegisterData, loggedIn, setCurrentUser} = useAuthenContext();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [confirmMessage, setConfirmMessage] = useState('');
    const moveTo = useNavigate();
    const navigateTo = useNavigate();
    
    const validEmail = (email_text) => {
        const emailTest = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailTest.test(email_text);
    } 
    useEffect(() => {
        if(loggedIn){
            navigateTo("/")
        };
        
    }, [loggedIn])
    const validateRegistration = () => {
        let errors = {};
        if(!username){
            errors.username = "Username is required"
        }
        else if (username.length < 3){
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
        if(Object.keys(validationResult).length === 0){
            setErrors({});
            const registrationData = {
                username,
                email,
                password
            }
            try{
                const registerResponse = await axios.post(`${VITE_API_URL}/weblog/registerUser`, 
                registrationData,
                {
                    withCredentials:true
                }
                )
                setRegisterData(registerResponse.data);
                alert("Success! You will find an Confirmation Email Soon");
                const registeredUser = registerResponse.data.newUser;
                setEmail('');
                setUsername('');
                setPassword('');
                localStorage.setItem('userId', registeredUser._id);
                setLoggedIn(true);
                setCurrentUser(registeredUser);
                setIsAuthenticated(true);
                setConfirmMessage("Your Information Submitted Successfully");
                moveTo('/');
                setTimeout(() => {
                    setConfirmMessage("");
                }, 3000)     
            }catch (err) {
     
                if (err.response) {

                    if (err.response.data && err.response.data.error) {
                        // If the server sent validation errors
                        const serverErrors = err.response.data.error.reduce((acc, curr) => {
                            acc[curr.param] = curr.msg;
                            return acc;
                        }, {});
                        setErrors(serverErrors);
                    } else if (err.response.data && err.response.data.message) {
                        // If the server sent a general error message
                        setErrors({ general: err.response.data.message });
                    } else {
                        setErrors({ general: "An error occurred. Please try again." });
                    }
                } else if (err.request) {
                    
                    // The request was made but no response was received
                    setErrors({ general: "No response from server. Please try again." });
                } else {
                    // Something happened in setting up the request that triggered an Error
                    setErrors({ general: "An error occurred. Please try again." });
                }
            }
            
        }else
        {
            setErrors(validationResult);
        }

        
    }
    
    return (
        <div className="flex justify-center items-center min-h-screen w-screen bg-gray-50">
                <section className="w-full mx-w-md px-6 py-12 bg-white">
                    <h1 className="text-pink-600 text-center"> Create New Account</h1>
                    <form className="flex flex-col p-5 justify-center items-center " method="post" >
                        
                        <input type="input" 
                        name="input" 
                        className={`border border-gray-300 placeholder-gray-500 p-2 m-5 rounded-md ${errors.username && 'border border-red-400'}`} 
                        placeholder="Enter New Username" 
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        />
                        
                        {errors.username && <p className="ml-5 text-red-500"> {errors.username}!</p>}

                        <input type="email" id="email" placeholder="Enter Your Email"
                        className={`border border-gray-300 p-2 m-5 rounded-lg ${errors.email && 'border border-red-400'}`}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        />
                        {errors.email && <p className="ml-5 text-red-500"> {errors.email}!</p>}
                        {errors.general && <p className="ml-5 text-red-500"> {errors.general}!</p> }

                        <input type="password" 
                        name="password" 
                        className={`border border-gray-300 p-2 m-5 rounded-lg ${errors.password && 'border border-red-400'}`}
                        placeholder="Enter New Password" 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        />
                        {errors.password && errors  ? <p className="ml-5 text-red-500"> {errors.password}!</p> : ''}
                      
                        <button type="submit" onClick={handleSubmit} className="border border-gray-300 p-2 m-5 bg-red-400 hover:bg-red-500 rounded-xl">Create Account</button>
                        {confirmMessage && <p className="text-green-600 text-lg"> {confirmMessage}</p>}
                    </form>

                    <button className="bg-white"><Link 
                    className="text-gray-400 p-3 ml-8 hover:text-gray-900 hover:underline"
                    to="/">Go Back </Link></button>
                </section>
            {/* )} */}
            
        </div>
    )
}

export default Register
