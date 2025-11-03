import { useEffect, useState } from "react";
import { useAuthenContext, useUIContext } from "../globalContext/globalContext.tsx";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import axios from 'axios';
import { VITE_API_URL } from "../config.ts";
import toast from "react-hot-toast";


const UpdateProfile = () => {

    const { isAuthenticated, setImagePreview, imagePreview, currentUser, setCurrentUser } = useAuthenContext();
    const { setEditProfile } = useUIContext();
    // const [userImage, setUserImage] = useState('');
    const [userReceived, setUserReceived] = useState({});
    const [message, setMessage] = useState('');
    const [addInterest, setAddInterest] = useState('');
    const moveTo = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        goal: '',
        interests: [],
        userImage: null,
        imgPreview: ''

    })
    // const [password, setPassword] = useState('');

    const [localLoading, setLocalLoading] = useState(true)
    useEffect(() => {

        const get_current_user = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/weblog/getUser`, { withCredentials: true });
                const user = response.data.user;
                setUserReceived(user);

                let realImage = '';
                if (user.profileImg) {
                    realImage = `${VITE_API_URL}/${user.profileImg}`;
                    setImagePreview(realImage);
                }

                let imgPreview = '';
                setFormData((prev) => ({
                    ...prev,
                    username: user.username || '',
                    goal: user.goal || '',
                    interests: user.TopicsInterested || [],
                    userImage: user.profileImg,
                    imgPreview: imgPreview
                }))
                setAddInterest(user.TopicsInterested ? user.TopicsInterested.join('\n') : '');
                setLocalLoading(false)
            }
            catch (err) {
                setLocalLoading(false)
            }
        }

        get_current_user();

    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageSubmit = (e) => {
        e.preventDefault();
        const imgFile = e.target.files[0];
        setImagePreview(URL.createObjectURL(imgFile));
        setFormData((prevState) => ({
            ...prevState,
            userImage: imgFile,
            imgPreview: URL.createObjectURL(imgFile)
        }))
    }
    const handleInterests = (e) => {
        setAddInterest(e.target.value);
        let newInterest = e.target.value
            .split(/[\n,]+/)
            .map(interest => interest.trim())
            .filter(interest => interest.length > 0);
        setFormData((prev) => ({
            ...prev,
            interests: newInterest
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formInfo = new FormData();
        if (formData.username) formInfo.append('username', formData.username);
        if (userReceived.email) formInfo.append('email', userReceived.email);
        if (userReceived.password) formInfo.append('password', userReceived.password);
        if (formData.userImage instanceof File) {
            formInfo.append('profileImg', formData.userImage, formData.userImage.name)
        }
        if (formData.goal) formInfo.append('goal', formData.goal);

        if (formData.interests && formData.interests.length > 0) {
            formInfo.append('interests', JSON.stringify(formData.interests));
        }
        const toastId = toast.loading('Updating Profile..')
        setLocalLoading(true);
        try {
            const response = await axios.put(
                `${VITE_API_URL}/weblog/updateUserProfile`,
                formInfo,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true

                })
            if (response.data.success) {
                setLocalLoading(false);
                // console.log("response.data: ", response.data);
                setCurrentUser(response.data.new_Profile);
                toast.success("Updated Profile Successfully", { id: toastId });
            }
        } catch (err) {
            console.log("err: ", err);
             toast.error('Got Error while updating profile', { id: toastId });
        }
        finally {
            setLocalLoading(false);
        }

    }
    // {localLoading && userReceived ? <h1> Loading..</h1>:

    if (localLoading) return <h1> Loading...</h1>
    return (
        <div className="min-h-screen relative bg-gray-50 flex justify-center items-center flex-col">

            <div className="w-full max-w-lg flex flex-col justify-center items-center shadow-2xl ">
                <h1 className="text-3xl m-5 font-extrabold"> Update Your Profile</h1>
                <form className="space-y-8 rounded-lg p-8 flex flex-col" method="post" >
                    <div className="flex flex-col text-center">
                        <label htmlFor="image" className="mb-4 border border-gray-500 rounded-lg hover:border-orange-700 cursor-pointer hover:text-orange-600 px-3 py-2"> Select Image</label>
                        <input type="file" id="image" accept="image/*" className="hidden" onChange={handleImageSubmit}
                        />
                        {imagePreview && (
                            <>
                                <img src={imagePreview}
                                 alt="profile Image"
                                  className="max-w-xs w-56 h-56 object-cover shadow-md rounded-full mx-auto" />
                            </>
                        )}

                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-2"> Username</label>
                        <input type="input"
                            name="username"
                            className="border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                            placeholder="Enter New Username"
                            onChange={handleChange}
                            value={formData.username}
                        />

                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-2" > What is Your Goal </label>
                        <textarea id="goal"
                            name="goal"
                            placeholder="Write Your Objective here.."
                            onChange={handleChange}
                            className="border border-gray-300 p-3 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                            value={formData.goal}
                        />

                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-2"> Which topics are you Interested</label>
                        <textarea
                            placeholder="Enter Your Interests (Separated by commas or new line)"
                            className="border border-gray-300 p-3 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                            value={addInterest}
                            onChange={handleInterests}
                        />
                    </div>

                    <button type="submit" onClick={handleSubmit} className="w-full px-4 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">Update Account</button>

                </form>
            </div>
            <div className="w-full text-center m-5 shadow-none px-3 py-2 rounded-lg">
                <button onClick={() => setEditProfile(false)} ><Link
                    className="text-gray-600 hover:text-blue-600 "
                    to="/userAccount">Go Back </Link></button>
            </div>
        </div>
    )
}

export default UpdateProfile