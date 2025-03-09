import { useEffect, useState } from "react";
import { useAuthenContext, useUIContext } from "../globalContext/globalContext.tsx";
import { Link, useNavigate, useNavigation} from "react-router-dom";
import { FaImage } from "react-icons/fa";
import axios from 'axios';
import { VITE_API_URL } from "../config.ts";


const UpdateProfile = () => {

    const {isAuthenticated,setImagePreview, imagePreview} = useAuthenContext();
    const {setEditProfile} = useUIContext();
    // const [userImage, setUserImage] = useState('');
    const [userReceived, setUserReceived] = useState({});
    const [message, setMessage] = useState('');
    const [addInterest, setAddInterest] = useState('');
    const moveTo = useNavigate();
    const [formData, setFormData] = useState({
        username:'',
        goal:'',
        interests:[],
        userImage:null,
        imgPreview:''
        
    }) 
    // const [password, setPassword] = useState('');
    
    const [localLoading, setLocalLoading] = useState(true)

    // useEffect(() => {
    //     console.log("isAuthenticated: ", isAuthenticated);
        
    //     if(!isAuthenticated){
    //         alert("you are Not Logged In. Sign In or Create new Account")
    //         // moveTo('/');
    //     }
    // }, [isAuthenticated])
    useEffect(() => {
        console.log("isAuthenticated inside updateProfile: ", isAuthenticated);
        
        const get_current_user = async () => {
            try{
                const response = await axios.get(`${VITE_API_URL}/weblog/getUser`, {withCredentials:true});
                const user =  response.data.user;
                setUserReceived(user);
                
                let realImage = '';
                console.log("response.image; ", response.data.user.profileImg);
                realImage = `${VITE_API_URL}/${response.data.user.profileImg}`;
                setImagePreview(realImage);
                let imgPreview = '';
                setFormData((prev) => ({
                    ...prev,
                    username:user.username || '',
                    goal:user.goal || '',
                    interests:user.TopicsInterested || [],
                    userImage:user.profileImg,
                    imgPreview:imgPreview
                   }))
                   setAddInterest(user.TopicsInterested ? user.TopicsInterested.join('\n'): '');
                //    console.log("formData inside axios: ", formData)
                setLocalLoading(false)
            }catch(err){
                console.log("got this error while working with getUser: ", err);
                setLocalLoading(false)
            }
        }

        get_current_user();
      
    },[])

    useEffect(() => {
        // console.log("formData.userImage inside update Profile",formData.imgPreview);
        // setImagePreview(formData.imgPreview);
        console.log("global image inside update profile: ", imagePreview)
    }, [imagePreview])
    // useEffect(() => {3
    //     console.log("UserReceived Inside Newly Created useEffect: ", userReceived)
    //     if(Object.keys(userReceived).length > 0 ){
            

               
    //             console.log("username UseEffect: ", formData.username);
    //         }
        
    
    // }, [userReceived])

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData(prev => ({
            ...prev,
            [name]:value
        }))
        console.log('e.target: ', formData);
        
    }

    const handleImageSubmit = (e) => {
        e.preventDefault();
        const imgFile =  e.target.files[0];
        // setUserImage(e.target.files[0]);
        // console.log("imgFile: ",imgFile);
        setImagePreview(URL.createObjectURL(imgFile));
        setFormData((prevState) => ({
            ...prevState,
            userImage:imgFile,
            imgPreview:URL.createObjectURL(imgFile)
        }))
        
        // const preview = URL.createObjectURL(userImage);
        // setImagePreview(preview);
        // console.log("image Preview: ", imagePreview.length)
    }
    const handleInterests = (e) => {
        setAddInterest(e.target.value);
        let newInterest = e.target.value
        .split(/[\n,]+/)
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);

        console.log("newInterests: ", newInterest);
        console.log("formData: ", formData);
        setFormData((prev) => ({
            ...prev,
            interests:newInterest
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handle Submit is running: ", formData);

        const formInfo = new FormData();
        if(formData.username) formInfo.append('username', formData.username);
        if(userReceived.email) formInfo.append('email', userReceived.email);
        if(userReceived.password) formInfo.append('password', userReceived.password);
        if(formData.userImage instanceof File){
            console.log(` formData.userImage ${formData.userImage} , name iamge ${formData.userImage.name}`)
            formInfo.append('profileImg', formData.userImage, formData.userImage.name )
        }
        // if(formData.userImage) formInfo.append('profileImg', formData.imgPreview);
        // if(password) formInfo.append('password',password)
        if(formData.goal) formInfo.append('goal', formData.goal);
        
        if(formData.interests && formData.interests.length > 0){
            console.log("interestes before parsing:", formData.interests);
            formInfo.append('interests', JSON.stringify(formData.interests));
        } 
        setLocalLoading(true);
        console.log("before submitting: form Info", formInfo);
        try{
            const response = await axios.put(
                `${VITE_API_URL}/weblog/updateUserProfile`,
                 formInfo,
                {
                headers:{
                    "Content-Type":"multipart/form-data"
                },
                withCredentials:true
            
            })
            if(response.data.success){
                setLocalLoading(false);
                window.alert("Updated Successfully! Plz Refresh the Page")
            }
        }catch(err){
            console.log("err: ", err);
        }
        
    }
    // {localLoading && userReceived ? <h1> Loading..</h1>:

    if(localLoading) return <h1> Loading...</h1>
    return (
        <div className="">
               
                <>
                    <h1> UPDATE Your Profile</h1>
                    {console.log("DOM image inside update profile: ", imagePreview)}
                    <form className="flex flex-col p-5" method="post" >
                        <label className="mb-3 text-blue-600"> Select the Profile Image</label>
                        <input type="file" accept="image/*" className="w-fit" onChange={handleImageSubmit}
                        />
                        {imagePreview && (
                            
                            <>
                               
                                <img src={imagePreview} alt="profile Image" className="w-[100px] h-[90px] p-2 m-5" />
                            </>
                            
        
                        )
                        // : 
                        // (   <div  className="p-2 m-5">
                        //         <label> Upload Profile Picture</label>
                        //         <div><FaImage /></div>
                        //     </div>
                        
                        //     )
                        }

                        <input type="input" 
                        name="username" 
                        className="border border-gray-300 w-[25vw] p-2 m-5" 
                        placeholder="Enter New Username" 
                        onChange={handleChange}
                        value={formData.username}
                        />

            
                        {/* <input type="password" 
                        name="password" 
                        className="border border-gray-300 w-[25vw] p-2 m-5" 
                        placeholder="Enter New Password" 
                        onChange={(e) => setPassword(e.target.value)}
                        /> */}

                        <label className="text-blue-600" > What is Your Goal </label>
                        <textarea id="goal"
                            name="goal"
                            placeholder="Write Your Objective here.."
                            onChange={handleChange}
                            className="border border-gray-400 p-12 h-44 w-72"
                            value={formData.goal}
                        />

                        <label className=" mt-5 text-blue-600"> Which topics are you Interested</label>
                        <textarea 
                        placeholder="Enter Your Interests (Separated by commas or new line)"
                        className="border w-60 h-32 mt-2 border-gray-500"
                        value={addInterest}
                        onChange={handleInterests}
                        />
                    
                        <button type="submit" onClick={handleSubmit} className="border border-gray-300 w-[15vw] p-2 m-5 bg-red-400 hover:bg-red-300 ">Update Account</button>

                    </form>

                    <button onClick={()=> setEditProfile(false)} ><Link 
                    className="bg-green-400 border p-3 ml-8"
                    to="/userAccount">Go Back </Link></button>
                </>
        </div>
    )
}

export default UpdateProfile