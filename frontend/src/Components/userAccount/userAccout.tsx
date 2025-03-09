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

  
  const { setIsAuthenticated,setLoggedIn, imagePreview,currentUser} = useAuthenContext();
  const {openUserAccount, setOpenUserAccount, setEditProfile} = useUIContext();
  console.log("inside user Account: openUser ",openUserAccount);
    const [accountLoading, setAccountLoading] = useState(false); 
    const navigate = useNavigate();
    useEffect(() => {
      async function fetchingCurrentUser(){
        setAccountLoading(true);
        const userId = localStorage.getItem('userId');
        console.log("useEffect inside user Account Runs  CURRENT USER:", currentUser, "USERID: ", userId)
        if(userId){
          try{
            const response:Response = await axios.get(`${VITE_API_URL}/weblog/checkAuthen`);
           console.log('response inside userAccount', response);
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
        const response = await axios.post(`${VITE_API_URL}/weblog/logout`, {}, {withCredentials:true});
        console.log("logout Response inside user Account: ", response);
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
            {currentUser && currentUser.TopicsInterested.map((interest,ind) => 
              <h5 key={ind}> {interest} </h5>
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
      <button onClick={() => 
        {
          setOpenUserAccount(false)
          navigate(-1)
        }
      }
        className="p-2 border bg-green-400 mr-2 hover:bg-green-300 text-white text-bolder xs:mb-4 xs:text-sm sm:text-lg"
        >
      Back
      </button>
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
