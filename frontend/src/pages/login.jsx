import { useEffect, useState } from "react";
import { useAuthenContext } from "../globalContext/globalContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
const Login = () => {

    const {setIsAuthenticated,setCurrentUser, setLoggedIn, imagePreview, setImagePreview} = useAuthenContext();
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
        
        const validationErrors = handleValidation();
        if(Object.keys(validationErrors).length > 0){
            console.log("Got validation errors ")
            setErrors(validationErrors);
            return; 
        }
        setLoading(true);
        try{
            const loginData = {
                email,
                password
            }
            const login_response = await axios.post(`http://localhost:4100/weblog/userLogin`,
            loginData,
            {
                withCredentials:true
            });

            
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
            setCurrentUser(login_response.data.user);
            console.log("img Preview inside login: ", imagePreview);
            
            setIsAuthenticated(true);
            setEmail('');
            setPassword('');
            navigate('/');
            setLoggedIn(true);
            
        }
        catch(err){
            const errorMsg =
            err.response?.data?.message || "An error occurred. Please try again.";
            setErrors({ general: errorMsg });
            } 
            finally{
                setLoading(false)
            }  
        // one how to check the object is it empty or contains
        // second you can also setErrors first then check from the errors lengt
    }
    [4, 10]
    const findBreaker = (numList) => {
        let greater=0;
        const breaker = numList.find((num,ind) => ind < numList.length - 1 && num > numList[ind+1])
        console.log('breaker: ', breaker)
        
    }
    findBreaker([0,-4])

    // if(loading) return <h1> Please Wait..</h1>
    return (
        <div className="flex items-center justify-center min-h-screen w-screen bg-gray-50">
           
                <section className="w-full mx-w-md p-6 bg-white rounded-lg shadow-lg">
                    {/* <button className="p-4 rounded-full text-center text-white shadow-lg bg-blue-600" onClick={handleMagicButton()}>Magic Button</button> */}
                    <h1 className="text-3xl text-pink-600 font-bold text-center mb-8"> Login Here</h1>
                    {loading && (
                    <div className="text-center mb-4">
                        <FaSpinner className="animate-spin inline mr-2" /> Please wait...
                    </div>
                    )}
                    <form className="space-y-6 flex justify-center items-center" method="post" >
                        <div className="flex flex-col gap-5 max-w-3xl">
                            <input type="email" id="email" placeholder="Enter Your Email"
                            className="border rounded-lg border-gray-300 px-4 py-2 focus-pink focus-ring-400"
                            onChange={(e) => {setEmail(e.target.value)
                                setErrors('')
                            }}
                            aria-label="Email"
                            value={email}

                            />
                            {errors.email && <p className="font-serif text-lg ml-5 text-red-500"> {errors.email}!</p>}
                            <input type="password" 
                            name="password" 
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400" 
                            placeholder="Enter New Password"
                            aria-label="Password" 
                            value={password}
                            onChange={(e) => {setPassword(e.target.value)
                                setErrors('')
                            }}
                            />
                                {errors.password && <p className="text-sm text-red-500"> {errors.password}!</p>}
                                {errors.general && <p className="ml-5 text-red-500"> {errors.general}!</p>}
                            <button type="submit" onClick={handleSubmit} 
                            aria-label="Submit" 
                            className="border transition-colors duration-300 text-lg border-gray-300 p-4 m-5 bg-red-400 rounded-2xl">
                                Login
                            </button>
                            {message && <p> {message} </p>}
                        </div>
                    </form>
                    <div className="text-center ">
                        <p className="mb-5"> Do not have Account ?</p>
                        <Link 
                        className="border p-3 hover:underline rounded-xl"
                        to="/registerUser">Register Here </Link>
                        <div className="flex justify-center space-x-4 mt-4">
                            <button
                            onClick={() => navigate(-1)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                            >
                            Back
                            </button>
                            <Link
                            to="/"
                            className="text-sm text-gray-700 hover:text-gray-900"
                            >
                            Back to Home
                            </Link>
                        </div>
                    </div>
                    
                </section>
            {/* )} */}
            
        </div>
    )
}

export default Login

