import { useEffect, useState } from "react";
import { useGlobalContext } from "../../globalContext/globalContext";
import { Link } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import updateProfile from "../../pages/updateProfile";
import UpdateProfile from "../../pages/updateProfile";

const UserAccount = () => {
  const { openUserAccount, setOpenUserAccount, setEditProfile,editProfile } = useGlobalContext();
  console.log("inside user Account: openUser ",openUserAccount);

    const [userImage, setUserImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleImageSubmit = (e) => {
        e.preventDefault();
        const new_file = e.target.files[0];
        console.log("new file: ", new_file);
        setUserImage(new_file);

        const preview = URL.createObjectURL(userImage);
        setImagePreview(preview);
        console.log("image Preview: ", imagePreview.length)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Preview after submit:", imagePreview);

        console.log("Image of The User: ", userImage);
        console.log("userName: ", username);
        console.log("Password after submission: ", password);
        
    }
    

    // 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

  return (
    <>
      <div className="flex justify-center m-5 p-5 w-full">
        <div className="">
          <h2 className="font-extrabold "> About Raas </h2>
          <img
            src="https://wallpapers.com/images/hd/greenery-background-abj04ct0og086pp4.jpg"
            alt="greenry"
            className="w-auto md:h-h-[210px]"
            style={{ width: "240px", height: "250px" }}
          />
          <div className="w-[200px] ">
            <h2 className="font-bold mt-4"> Goal</h2>
            <h3>
              {" "}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime,
              nobis tempore! Ea odit officiis laborum mollitia in accusantium,
              magni veritatis, quae tenetur vero reprehenderit voluptas at non
              nemo dolor ducimus?
            </h3>
          </div>
          <div className="w-[300px] ">
            <h3 className="text-bold text-lg font-bold mt-4 text-center border-t border-blue-400">
              {" "}
              Interest{" "}
            </h3>
            <span className="border-t border-blue-400"></span>
            <div>
              <h5>Religions</h5>
              <h5>Islam</h5>
              <h5>International Politics</h5>
              <h5>Technology</h5>
              <h5>Innovation</h5>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <button onClick={() => setOpenUserAccount(false)}>
            <Link
              className="p-2 border bg-green-400 mr-2 hover:bg-green-300 text-white text-bolder xs:mb-4"
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
              <Link className=" border bg-green-400 hover:bg-green-300 text-white text-bolder p-2"
              to={"/updateProfile"}>
                Edit Profile</Link>  
            </button>
          </div>
        
      </div>
    </>
  );
};

export default UserAccount;
