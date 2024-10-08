import { useEffect, useState } from "react";
import { useGlobalContext } from "../../globalContext/globalContext";
import { Link, useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import updateProfile from "../../pages/updateProfile";
import UpdateProfile from "../../pages/updateProfile";
import axios from "axios";
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6IjY2ZGQ5YTZiMDllN2VjNzNjYjEzMThmOSIsImVtYWlsIjoiaG93bXVjaEBnbWFpbC5jb20ifSwiaWF0IjoxNzI1Nzk5MDE5LCJleHAiOjE3MjU4MDI2MTl9.30d-8wrkgIIbNR5iTJs-kpjV-6fhYYMoJtO68M_My-0
const UserAccount = () => {
  const { setIsAuthenticated, openUserAccount, setOpenUserAccount, setEditProfile,currentUser,setLoggedIn, imagePreview} = useGlobalContext();
  console.log("inside user Account: openUser ",openUserAccount);

    const [userImage, setUserImage] = useState('');
    // const [imagePreview, setImagePreview] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [accountLoading, setAccountLoading] = useState(false); 
    const navigate = useNavigate();
    const handleImageSubmit = (e) => {
        e.preventDefault();
        const new_file = e.target.files[0];
        console.log("new file: ", new_file);
        setUserImage(new_file);

        const preview = URL.createObjectURL(userImage);
        // setImagePreview(preview);
        console.log("image Preview: ", imagePreview.length)
    }

    useEffect(() => {
      console.log("useEffect inside user Account Runs")
      async function fetchingCurrentUser(){
        setAccountLoading(true);
        const userId = localStorage.getItem('userId');
        if(userId){
          try{
            const response = await axios.get('http://localhost:4100/weblog/checkAuthen');
           console.log('response inside userAccount', response);
          }catch(err){
            console.log("Caught the error while loading the user inside userAccount: ", err);
            setAccountLoading(false);
          }
          finally{
            setAccountLoading(false);
          }
        }
      }
      if(!currentUser){
        fetchingCurrentUser();
      }
      
    }, [currentUser])



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Preview after submit:", imagePreview);

        console.log("Image of The User: ", userImage);
        console.log("userName: ", username);
        console.log("Password after submission: ", password);


        // localStorage.setItem('thisUser', JSON.stringify(currentUser));
        //         const thisUser = JSON.parse(localStorage.getItem('thisUser'));
        //         console.log("this user inside login: ", thisUser);
        
    }
    
    

    const handleLogout = async(e) => {
      e.preventDefault();
      try{
        const response = await axios.post('http://localhost:4100/weblog/logout', {}, {withCredentials:true});
        console.log("logout Response inside user Account: ", response);
        localStorage.removeItem('userId');
        setLoggedIn(false)
        setIsAuthenticated(false)
      }catch(err){
        console.log("Error while logging out ")
      }
      navigate("/");
    }
    // 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

  if(accountLoading) return <h1> Please Wait.. </h1>
  
  return (
    <>
    {console.log("account Loading: ", accountLoading)}
    {accountLoading ? <h1> Please Wait.. </h1>
    :
    <div className="flex justify-center m-5 p-5 w-full">
      <div className="">
        <h2 className="font-extrabold "> About {currentUser && currentUser.username} </h2>
        {imagePreview && <img
          src={imagePreview}
          alt="greenry"
          className="w-auto md:h-h-[210px]"
          style={{ width: "240px", height: "250px" }}

        />
        }
        <div className="w-[200px] ">
          <h2 className="font-bold mt-4"> Goal</h2>
          <h3>
            {currentUser && currentUser.goal}
          </h3>
        </div>
        <div className="w-[300px] ">
          <h3 className="text-bold text-lg font-bold mt-4 text-center border-t border-blue-400">
            {" "}
            Interest{" "}
          </h3>
          <span className="border-t border-blue-400"></span>
          <div>
            {currentUser && currentUser.TopicsInterested.map(interest => 
              <h5> {interest} </h5>
            )
            }
          </div>
        </div>

        <div>
          <button className="border mt-3 border-blue bg-red-400 p-2 text-white hover:bg-red-200" 
          onClick={handleLogout}>
          LogOut
          
          </button>
        </div>
      </div>
      <div className="mt-5 xs:flex flex-col gap-5">
      <button onClick={() => setOpenUserAccount(false)}>
        <Link
          className="p-2 border bg-green-400 mr-2 hover:bg-green-300 text-white text-bolder xs:mb-4 xs:text-sm sm:text-lg"
          to="/"
        >
          Back To Home{" "}
        </Link>
      </button>
      <button
        onClick={() => {
          console.log("edit Profile clicked"), setOpenUserAccount(false);
          setEditProfile(true);
        }}
      >
          <Link className=" border bg-green-400 hover:bg-green-300 text-white text-bolder xs:mt-4 p-2"
          to={"/updateProfile"}>
            Edit Profile</Link>  
        </button>
      </div>
    
    </div>
    }
    
    </>
  );
};

export default UserAccount;
