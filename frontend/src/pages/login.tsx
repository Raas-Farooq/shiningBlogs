import { useState } from "react";
import { useAuthenContext } from "../globalContext/globalContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { VITE_API_URL } from "../config";
import toast from "react-hot-toast";

interface ErrorsProps {
    email: string,
    password: string,
    general?: string
}

interface ErrorHandle {
    response: {
        data: {
            message: string,
            error?: string
        }
    },
    request: any,
    message: string
}

const Login = () => {

    const { setIsAuthenticated, setCurrentUser, setLoggedIn, setImagePreview, scheduleAutoLogout} = useAuthenContext();
    const [email, setEmail] = useState<string>('');
    // const [message, setMessage] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<ErrorsProps>({ email: '', password: '' })
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const emailValid = (email_text: string) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email_text);
    }

    function handleValidation() {
        let newErrors: ErrorsProps = { email: '', password: '', general: '' };
        if (!email) {
            newErrors.email = "Email field is empty!"
        }

        else if (!emailValid(email)) {
            newErrors.email = "Email Should be Valid like example@gmail.com"
        }
        if (password.length === 0) {
            newErrors.password = "Enter Your Password! ";
        }
        else if (password.length < 8) {
            newErrors.password = "Password must contains minimum 8 characters"
        }
        return newErrors
    }

    const handleSubmit = async (e: (React.MouseEvent<HTMLButtonElement>)) => {
        e.preventDefault();
        const toastId = toast.loading('Logging In..')
        const validationErrors = handleValidation();
        if (Object.values(validationErrors).some(err => err.length > 0)) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            const loginData = {
                email,
                password
            }
            const login_response = await axios.post(`${VITE_API_URL}/weblog/userLogin`,
                loginData,
                {
                    withCredentials: true
                });

            if (login_response.data.success) {
                const token = login_response.data.token;
                const userId = login_response.data.user._id;
                localStorage.setItem('userId', userId);
                const user = login_response.data.user;
                let imgPreview = '';
                if (user.profileImg && user.profileImg.data) {
                    const base64String = btoa(
                        new Uint8Array(user.profileImg.data.data)
                            .reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );
                    imgPreview = `data:${user.profileImg.contentType};base64,${base64String}`;
                }
                toast.success("Logged In. Success!", { id: toastId });
                scheduleAutoLogout(token);
                setImagePreview(imgPreview);
                setCurrentUser(login_response.data.user);
                setIsAuthenticated(true);
                setEmail('');
                setPassword('');
                navigate('/')
                // setTimeout(() => {
                //     navigate('/');
                // },100)
                setLoggedIn(true);
            }
        }
        catch (err: unknown) {
            let errorMsg: string="";
            if (err && typeof (err) === 'object' && 'response' in err) {
                errorMsg =
                    (err as ErrorHandle).response?.data?.message || "An error occurred. Please try again.";
                setErrors({ ...errors, general: errorMsg });
            }
            else {
                setErrors({ ...errors, general: "An unexpected error occurred." });
            }
            toast.error(errorMsg , { id: toastId });
        }
    }


    // if(loading) return <h1> Please Wait..</h1>
    return (
        <div className="flex min-h-screen w-screen bg-gray-50">

            <section className="section-container w-full max-w-6xl flex flex-col justify-center items-center mx-auto">
                <h1 className="text-3xl text-orange-600 font-bold text-center mb-8"> Login Here</h1>
                <article className="w-full max-w-lg p-16 bg-white rounded-lg shadow-2xl">
                    {/* {loading && (
                        <div className="text-center mb-4">
                            <FaSpinner className="animate-spin inline mr-2" /> Please wait...
                        </div>
                    )} */}
                    <form className="flex justify-center items-center" method="post" >
                        <div className="flex flex-col gap-5 max-w-3xl">
                            <input type="email" id="email" placeholder="Enter Your Email"
                                className="border rounded-lg border-gray-300 px-4 py-2 focus-pink focus-ring-400 mb-2"
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setErrors({ email: '', password: '', general: '' })
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
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrors({ email: '', password: '', general: '' })
                                }}
                            />
                            {errors.password && <p className="text-sm text-red-500"> {errors.password}!</p>}
                            {errors.general && <p className="ml-5 text-red-500"> {errors.general}!</p>}
                            <button type="submit" onClick={handleSubmit}
                                aria-label="Submit"
                                className="border mt-7 transition-colors duration-300 bg-orange-500 text-white text-lg border-gray-300 px-4 py-2 hover:bg-orange-600 rounded-2xl">
                                Login
                            </button>
                            {/* {message && <p> {message} </p>} */}
                        </div>
                    </form>
                    <div className="text-center ">
                        <p className="mt-5 mb-3"> Do not have Account ?</p>
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

                </article>


            </section>
            {/* )} */}

        </div>
    )
}

export default Login

