import { useEffect, useState } from "react";
import { useAuthenContext, useUIContext } from "../../globalContext/globalContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { VITE_API_URL } from "../../config";

interface Response{
  isAuthenticated:boolean,
  user?:any,
  token:string
}

const UserAccount = () => {

  
  const { setIsAuthenticated,setLoggedIn, imagePreview,currentUser,setImagePreview} = useAuthenContext();
  const {setOpenUserAccount, setEditProfile} = useUIContext();

    const [accountLoading, setAccountLoading] = useState(false); 
    const navigate = useNavigate();
    useEffect(() => {

      if(currentUser?.profileImg){
        
        const myImage = `${VITE_API_URL}/${currentUser.profileImg}`;
        setImagePreview(myImage);
      }
      async function fetchingCurrentUser(){
        const userId = localStorage.getItem('userId');
        if(!userId){
          navigate('/login');
          return;
        }
        if(userId){
          try{
            console.log("VITE_API_URL: ",VITE_API_URL, "currentUser: ", currentUser)
            const response:Response = await axios.get(`${VITE_API_URL}/weblog/checkAuthen`);
           if(response.isAuthenticated){
            setAccountLoading(false)
           }
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
    const handleLogout= async(e:React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try{
        await axios.post(`${VITE_API_URL}/weblog/logout`, {}, {withCredentials:true});
        localStorage.removeItem('userId');
        setLoggedIn(false)
        setIsAuthenticated(false)
      }catch(err){
        console.log("Error while logging out ")
      }
      navigate("/");
    }
    

  if(accountLoading) return <h1> Please Wait.. </h1>
  
  return (
    <>
    {accountLoading ? <h1> Please Wait.. </h1>
    :
    <div className="flex justify-center m-5 p-5 w-full">
      <div className="">
        <h2 className="font-extrabold underline mb-6 text-gray-700 text-2xl"> About {currentUser && currentUser.username} </h2>
        {imagePreview && <img
          src={imagePreview}
          alt="greenry"
          className="w-auto max-w-md rounded-lg hover:scale-105 transition-transform duration-300"
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
            {currentUser && currentUser.TopicsInterested?.length > 0 && currentUser?.TopicsInterested.map((interest,ind) => 
              <h5 key={ind}> {interest} </h5>
            )
            }
          </div>
        </div>

        <div>
          <button className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 px-3 py-1 rounded-md" 
          onClick={handleLogout}>
          LogOut
          
          </button>
        </div>
        <div className="mt-4">
          <button onClick={() => 
            {
              setOpenUserAccount(false)
              navigate(-1)
            }
            }
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-1 rounded-md"
            style={{lineHeight:'1.2'}}
            >
            Back
          </button>
          <button onClick={() => setOpenUserAccount(false)}>
            <Link
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-1 rounded-md"
              
              to="/"
            >
              Back To Home{" "}
            </Link>
          </button>
        </div>
      </div>
      <div className="mt-2 xs:flex flex-col gap-5">
      
      <button
        onClick={() => {
          setEditProfile(true);
        }}
      >
          <Link className="border border-gray-400 text-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 px-3 py-1 rounded-md xs:mt-4 p-2"
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

// 'conscious + sabarSpirit' accounts