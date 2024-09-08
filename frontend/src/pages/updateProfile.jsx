import { useState } from "react";
import { useGlobalContext } from "../globalContext/globalContext";
import { Link } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import axios from 'axios';

const UpdateProfile = () => {

    const {openUserAccount,editProfile,setEditProfile, setOpenUserAccount} = useGlobalContext();
    const [userImage, setUserImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    console.log("edit Profile: inside update Profile", editProfile);
    const handleImageSubmit = (e) => {
        e.preventDefault();
        console.log("handleImageSubmit: ", e.target.files[0]);
        setUserImage(e.target.files[0]);

        const preview = URL.createObjectURL(userImage);
        setImagePreview(preview);
        console.log("image Preview: ", imagePreview.length)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formInfo = new FormData();

        if(username) formInfo.append(('username'), username);
        if(userImage) formInfo.append('profileImg', userImage);
        if(password) formInfo.append('password',password)
        
        const id="this is the Id";
        try{
            const response = await axios.put(`http://localhost:3800/weblog/updateUserProfile${id}`, formInfo, {
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            })
            console.log("successfully sent Data: ", response.data);
        }catch(err){
            console.log("err: ", err);
        }
    }
    
    return (
        <div className="mt-16">
                <>
                    <h1> UPDATE Your Profile</h1>
                    <form className="flex flex-col p-5" method="post" >
                        
                        <input type="file" accept="image/*" onChange={handleImageSubmit}
                        />
                        {imagePreview && (
                            
                            <img src={imagePreview} alt="profile Image" className="w-[100px] h-[90px] p-2 m-5" />
        
                        )
                        // : 
                        // (   <div  className="p-2 m-5">
                        //         <label> Upload Profile Picture</label>
                        //         <div><FaImage /></div>
                        //     </div>
                          
                        //     )
                        }

                        <input type="input" 
                        name="input" 
                        className="border border-gray-300 w-[25vw] p-2 m-5" 
                        placeholder="Enter New Username" 
                        onChange={(e) => setUsername(e.target.value)} />

                        <input type="password" 
                        name="password" 
                        className="border border-gray-300 w-[25vw] p-2 m-5" 
                        placeholder="Enter New Password" 
                        onChange={(e) => setPassword(e.target.value)}
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