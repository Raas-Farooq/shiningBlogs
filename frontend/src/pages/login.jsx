import { useEffect, useState } from "react";
import { useGlobalContext } from "../globalContext/globalContext";
import { Link, useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import { set } from "mongoose";
import axios from "axios";

const Login = () => {

    const {userAuthentication, currentUser,setCurrentUser, setLoggedIn, imagePreview, setImagePreview} = useGlobalContext();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] =useState({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     if(currentUser){
    //         const user =  login_response.data.user;
    //             localStorage.setItem('thisUser', JSON.stringify(user));
    //             const thisUser = JSON.parse(localStorage.getItem('thisUser'));
    //             console.log("this user inside login: ", thisUser);
    //     }
    // }, [currentUser])
    
    const emailValid = (email_text) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email_text);
    }

    // console.log("handle Validation outside; ", handleValidation());
    function handleValidation(){
        let newErrors = {};
        if(!email){
            newErrors.email="Email field is empty!"
        }
        
        else if(!emailValid(email)){
            newErrors.email = "Email Should be Valid like example@gmail.com"
        }
        if(password.length === 0){
            newErrors.password = "Enter Your Password! ";
        }
        else if(password.length < 8){
            newErrors.password = "Password must contains minimum 8 characters"
        }
        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const validationErrors = handleValidation();

        console.log("new Way: ", validationErrors);
        if(Object.keys(validationErrors).length > 0){
            console.log("you have validation errors ")
            setErrors(validationErrors);
            return; 
        }
        else{
            setErrors({});
            const loginData = {
                email,
                password
            }
            
            try{
                const login_response = await axios.post(`http://localhost:4100/weblog/userLogin`,
                loginData,
                {
                    withCredentials:true
                });
                  if(login_response){
                    console.log("if condition runs true");
                    setLoading(false);
                  }
                console.log("login response: ", login_response);
                setCurrentUser(login_response.data.user);
                const userId = login_response.data.user._id;
                localStorage.setItem('userId', userId);
                const user = login_response.data.user;
                let imgPreview= '';
                if (user.profileImg && user.profileImg.data) {
                    const base64String = btoa(
                        new Uint8Array(user.profileImg.data.data)
                            .reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );
                    imgPreview = `data:${user.profileImg.contentType};base64,${base64String}`;
                }
                setImagePreview(imgPreview);

                console.log("img Preview inside login: ", imagePreview);
                
            
                setEmail('');
                setPassword('');
                navigate('/');
                setLoggedIn(true);
               
            }
            catch(err){
                // console.log("err while Login: ", err.response.data.message);
                if(err.response){
                    if(err.response.data && err.response.data.error){
                       const serverErr = err.response.data.errors.reduce((acc, curr) => {
                            acc[curr.param ] = curr.msg;
                            return acc;
                        }, {});
                        setErrors(serverErr)
                    }
                    else if(err.response.data && err.response.data.message){
                        setErrors({general:err.response.data.message})
                    }else {
                        
                        setErrors({ general: "An error occurred. Please try again." });
                    }
                    
                }
                else if(err.request){
                    setErrors({general:"No response from the server. Try Again later!"})
                }
                else{
                    console.log("err inside else: ", err);
                    setErrors({general:"An Error occurred. Try anytime Soon!"})
                }
            }   
            
        }
 
        // one how to check the object is it empty or contains
        // second you can also setErrors first then check from the errors lengt
    }
    
    if(loading) return <h1> Please Wait..</h1>
    return (


        <div className="mt-16 flex justify-center">
           
                <div>
                    <h1> Login Here</h1>
                    <form className="flex flex-col p-5" method="post" >
                        
                        <input type="email" id="email" placeholder="Enter Your Email"
                        className="border border-gray-300 w-[25vw] p-2 m-5"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}

                        />
                        {errors.email && <p className="ml-5 text-red-500"> {errors.email}!</p>}
                        <input type="password" 
                        name="password" 
                        className="border border-gray-300 w-[25vw] p-2 m-5" 
                        placeholder="Enter New Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                            {errors.password && <p className="ml-5 text-red-500"> {errors.password}!</p>}
                            {errors.general && <p className="ml-5 text-red-500"> {errors.general}!</p>}
                        <button type="submit" onClick={handleSubmit} className="border border-gray-300 w-[15vw] p-2 m-5 bg-red-400 hover:bg-red-300 ">Login</button>
                        {message && <p> {message} </p>}
                        
                    </form>
                    <h3 className="mb-5"> Do not have Account ?</h3>
                    <button ><Link 
                    className="bg-green-400 border p-3 ml-8"
                    to="/registerUser">Register Here </Link></button>


                    <button ><Link 
                    className="bg-green-400 border p-3 ml-8"
                    to="/">Go Back </Link></button>
                </div>
            {/* )} */}
            
        </div>
    )
}

export default Login

