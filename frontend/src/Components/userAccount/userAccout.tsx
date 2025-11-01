import { useEffect, useState } from "react";
import { useAuthenContext, useUIContext } from "../../globalContext/globalContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { VITE_API_URL } from "../../config";
import { FaEdit } from "react-icons/fa";

interface Response {
  isAuthenticated: boolean,
  user?: any,
  token: string
}

const UserAccount = () => {


  const { setIsAuthenticated, setLoggedIn, imagePreview, currentUser, setImagePreview } = useAuthenContext();
  const { setOpenUserAccount, setEditProfile } = useUIContext();

  const [accountLoading, setAccountLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {

    if (currentUser?.profileImg) {

      const myImage = `${VITE_API_URL}/${currentUser.profileImg}`;
      setImagePreview(myImage);
    }
    async function fetchingCurrentUser() {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }
      if (userId) {
        try {
          console.log("VITE_API_URL: ", VITE_API_URL, "currentUser: ", currentUser)
          const response: Response = await axios.get(`${VITE_API_URL}/weblog/checkAuthen`);
          if (response.isAuthenticated) {
            setAccountLoading(false)
          }
        } catch (err) {
          console.log("Caught the error while loading the user inside userAccount: ", err);
          setAccountLoading(false);
        }
        finally {
          setAccountLoading(false);
        }
      }
    }
    if (!currentUser) {
      fetchingCurrentUser();
    }

  }, [currentUser])
  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${VITE_API_URL}/weblog/logout`, {}, { withCredentials: true });
      localStorage.removeItem('userId');
      setLoggedIn(false)
      setIsAuthenticated(false)
    } catch (err) {
      console.log("Error while logging out ")
    }
    navigate("/");
  }


  if (accountLoading) return <h1> Please Wait.. </h1>

  return (
    <div className="w-full bg-gray-50 flex justify-center items-center">
      {accountLoading ? <h1> Please Wait.. </h1>
        :
        <section className="w-full flex justify-center items-center mx-auto max-w-lg p-12 mt-10 bg-white shadow-2xl rounded-lg space-y-8">
          <article className="">
            <div className="flex justify-between mb-5 w-full">
              <h2 className="font-extrabold underline text-gray-700 text-2xl"> About {currentUser && currentUser.username} </h2>
              <button
              className=""
                onClick={() => {
                  setEditProfile(true);
                  navigate('/updateProfile')
                }}
              >
                  <FaEdit className="text-orange-600 " size={22} />
              </button>

            </div>
            <div className="w-full flex justify-center max-auto">
              {imagePreview && <img
              src={imagePreview}
              alt="greenry"
              className="w-auto rounded-full max-w-md hover:scale-105 transition-transform duration-300"
              style={{ width: "240px", height: "250px" }}

            />
            }
            </div>
            <div className="bg-orange-100 m-4 p-4 flex flex-col">
              <h2 className="font-bold mt-4 rounded-lg border-t border-blue-400 text-center text-orange-600"> Goal</h2>
              <p className="italic text-center text-sm pt-4">
                {currentUser && currentUser.goal ? currentUser.goal : 'No Goal is defined Yet'}
              </p>
            </div>
            <div className="m-4 p-4 bg-blue-100 rounded-lg">
              <h3 className="font-bold mt-4 rounded-lg border-t border-blue-400 text-center text-blue-600">
                {" "}
                Interest{" "}
              </h3>
              <div className="text-center">
                {currentUser && currentUser.TopicsInterested?.length > 0 ? currentUser?.TopicsInterested.map((interest, ind) =>
                  <p key={ind} className="text-sm italic"> {interest} </p>
                ):
                <p className="italic text-sm"> Edit Profile to Write Your Interests</p>
                }
              </div>
            </div>

            <div className="">
              <button className="w-full text-center border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 px-3 py-1 rounded-md"
                onClick={handleLogout}>
                Log Out

              </button>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={() => {
                setOpenUserAccount(false)
                navigate(-1)
              }
              }
                className="text-gray-600 hover:text-blue-700 transition-colors duration-200 px-3 py-1 rounded-md"
                // style={{ lineHeight: '1.2' }}
              >
                Back
              </button>
              <button onClick={() => setOpenUserAccount(false)}>
                <Link
                  className="text-gray-600 hover:text-blue-700 transition-colors duration-200 px-3 py-1 rounded-md"

                  to="/"
                >
                  Back To Home{" "}
                </Link>
              </button>
            </div>
          </article>
        </section>
      }

    </div>
  );
};

export default UserAccount;

// 'conscious + sabarSpirit' accounts