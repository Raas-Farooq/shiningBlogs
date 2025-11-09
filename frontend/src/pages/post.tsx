import { useEffect, useState } from "react";
import { useAuthenContext, useBlogContext, useUIContext } from "../globalContext/globalContext.tsx";
import Image from "../Components/contentSection/titleImage.tsx";
import { useNavigate, useParams } from "react-router-dom";
import TextContent from "../Components/contentSection/textContent.jsx";
import { FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import useFetchPost from "../Hooks/fetchPost.ts";
import Navbar from "../Components/Navbar/navbar.tsx";
import useUserPrivileges from "../Hooks/ownerPrivileges.tsx";
import makeApiCall from "./makeApiCall.ts";
import clsx from "clsx";
import { VITE_API_URL } from "../config.ts";
import axios from "axios";



interface ContentImage {
  fileName: string;
  id: number;
  path: string;
  position: number;
  public_id: string;
  _id: string;
}

interface Blog{
  _id:string,
  userId:string,
  title:string,
  titleImage:string,
  public_id:string,
  content:Array<{
    type: string;
    value: string;
    _id: string;
  }>,
  contentImages:ContentImage[],
  createdAt:string,
  updatedAt:string
}

interface EditHandle{
(e:React.MouseEvent<HTMLButtonElement>, post:Blog):void;
}
interface DeleteHandle{
(e:React.MouseEvent<HTMLButtonElement>, id:string):void;
}

interface ErrorResponse{
  response? :{
    data: {
      message:string,
      error?:string
    }
  },
  request?:any,
  message:string
}

interface RespReceived<T>{
  data:T,
  status:number
}

const BlogPost:React.FC = () => {
  const { setInHomePage } = useUIContext();
  const {setAllBlogsGlobally, allBlogsGlobally} = useBlogContext();
  const { currentUser, loggedIn,setErrorMessage,errorMessage, setLoading } = useAuthenContext();
  let { id } = useParams();
  const [isDeletingPost, setIsDeletingPost] = useState<boolean>(false);
  const { ownerLoading, blogOwner,setBlogOwner} = useUserPrivileges(id ?? '');
  const {post, postLoading} = useFetchPost(id ?? '');
  const moveTo = useNavigate();
  // const apiLink = import.meta.env.Vite_API_URL;

  


  useEffect(() => {
    setInHomePage(false);

    setErrorMessage('');
  }, []);

  const handleEdit:EditHandle = (e, post) => {
    e.preventDefault();
    const postId = post._id;
    moveTo(`/editPost`, { state: { postId } });
  };
  const handleDelete:DeleteHandle = async(e, id) => {
    
    e.preventDefault();
    console.log("post when delete clicks ", post);
    const confirm = window.confirm(
      "Are You sure to delete this Post. You won't be able to recover it!"
    );
    if(!confirm) return;

    const unblockNavigation = () => {
      window.onbeforeunload = null;
    }

    const oldBolgsCopy = allBlogsGlobally;
    const deletingPost = async () => {
      setAllBlogsGlobally(prevBlogs => prevBlogs.filter(blog => blog._id !== id));
      
      setBlogOwner(false);
      setIsDeletingPost(true);
      try{
          if(post && post.public_id){
          await axios.delete(`${VITE_API_URL}/weblog/removeCloudinaryImage`,
            {
              withCredentials:true,
              data:{
                public_id: post.public_id
              }
            }
          )
        }
         if(post?.contentImages && post.contentImages.length > 0){
          const images_public_id  = (post as Blog).contentImages.map(image => image.public_id);
              await axios.delete(`${VITE_API_URL}/weblog/removeCloudinaryImage`,{
              withCredentials:true,
              data:{images_public_id}
            })
          }
      }
      catch(err){
          console.error("got error while removing images from cloudinary ",err)
      }
      const url = `${VITE_API_URL}/weblog/deleteBlog/${id}`;
      const onSuccess=(response:RespReceived<{success:boolean}>)=> {
        if(response.data.success){
          alert("Successfully Deleted the Blog");
          unblockNavigation();
          setIsDeletingPost(false);

          setBlogOwner(true);
          moveTo(-1);
        }
      }

      function onError(err:ErrorResponse){
        unblockNavigation();
        setAllBlogsGlobally(oldBolgsCopy);
        if(err.response?.data?.error === 'jwt expired'){
          setErrorMessage('JWT Expired! Login Again');

        }
        else if(err.response?.data?.message){
          alert('else if runs');
          console.log("err.resopsne.data else if ", err.response?.data?.message);
          setErrorMessage(err.response.data.message);
        }
        else if(err.request){
          setErrorMessage("Not getting resposne from the server. Please Connect Again!")
        }
        else {
          setErrorMessage(err.message);
        }
      }

      makeApiCall(setLoading, url, {method:'DELETE'}, onSuccess, onError);
      setBlogOwner(true);
      
  
    };
    if(confirm){
      deletingPost();
    }
    
  }
  useEffect(() => {
    if(!postLoading && !post._id){
      moveTo('/notFound')
    }else{
      localStorage.setItem('localTitle', post?.title);
      localStorage.setItem('localTitleImage', post?.titleImage);
      localStorage.setItem('localContent', JSON.stringify(post?.content));
      localStorage.setItem("localContentImages", JSON.stringify(post?.contentImages))
      localStorage.setItem("localPublic_id", post?.public_id)
    }
  }, [postLoading, post, moveTo])
  
  return (
    <>
      {errorMessage && 
      <h2 className="text-center">
        {errorMessage}
        </h2>}
      <div
        data-component="post-container"
        className={`${
          loggedIn ? "flex xs:flex-col sm:flex-row" : "w-full bg-gray-50"
        }`}
      >
        
        {isDeletingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-5 flex items-center gap-3">
            <FaSpinner className="animate-spin text-purple-600" />
            <span className="text-lg font-medium text-gray-700">
              Deleting your post, please wait...
            </span>
          </div>
        </div>
      )}
      
        {(postLoading || ownerLoading) ? (
          <div className="text-center flex justify-center mt-20">
            <FaSpinner className="animate-spin text-center inline text-xl" /> Loading
            the Post..
          </div>
        ) : (
          
          <div className="w-full max-w-4xl mx-auto px-4 py-5 rounded:md shadow-lg bg-white mt-10">
            
            <div className="">
            
              <div key={post?._id} id={post?._id}>
               <div className="text-center flex justify-center">
                 <h2 className=" w-fit text-2xl text-gray-900 border-b-2 border-orange-400 font-bold mt-10 mb-4 mr-10">
                  {" "}
                  {post?.title}{" "}
                </h2>
                </div>
                {loggedIn && blogOwner && (
                  <div className="text-right flex justify-end gap-2 mb-2 w-[80%] text-black">
                    <button onClick={(e) => handleEdit(e, post)}>
                      <FaEdit size={20} />{" "}
                    </button>
                    <button onClick={(e) => handleDelete(e, post._id)}>
                      <FaTrash size={20} />{" "}
                    </button>
                  </div>
                )}
                {post?.titleImage && (
                  <Image
                    postImg={post?.titleImage}
                    title={post?.title}
                    isFullView={true}
                  />
                )}
                {post?.content && 
                <TextContent
                  content={post?.content}
                  isFullView={true}
                  contentImages={post?.contentImages && post.contentImages.length > 0 ? post.contentImages : []}
                />
              }
                
              </div>
            </div>
            <div className="flex justify-center my-3">
              <div
                className={`border-t-4 border-indigo-500 shadow-lg mb-4 ${
                  loggedIn ? "w-[350px]" : "w-[350px]"
                }`}
              ></div>
            </div>
            <div
              className={clsx(
                "text-center mb-4 ",
                loggedIn ? "w-full" : "w-4/5"
              )}
            >
              <button
                onClick={() => moveTo(-1)}
                disabled={isDeletingPost}
                className="bg-transparent text-gray-600 hover:text-blue-600 hover:underline mx-2"
              >
                {" "}
                Back{" "}
              </button>
              <button
                onClick={() => moveTo("/")}
                className="bg-transparent text-gray-700 hover:text-blue-600 hover:underline"
              >
              Back To Home{" "}
              </button>
            </div>
          </div>
        )}
        <div
          className={clsx(
            "px-2 py-32 flex justify-right ml-auto",
            loggedIn ? "hidden md:w-[30vw]" : "w-0",
            "bg-white text-gray-700 text-center relative hidden md:block",
            !loggedIn && "hidden"
          )}
        >
          {currentUser && currentUser._id &&  (
            <>
              <h2 className="font-extrabold text-gray-600 ">
                {" "}
                {currentUser.username && currentUser.username.length
                  ? `About ${currentUser.username.toUpperCase()}`
                  : "About"}
              </h2>
              <div className="flex justify-center text-gray-600">
                {currentUser.profileImg && (
                  <Image
                    postImg={currentUser.profileImg}
                    title={currentUser.username}
                  />
                )}
              </div>

              <h2 className="font-bold mt-4 text-gray-600"> Goal</h2>
              {currentUser.goal && currentUser.goal.length ? (
                <h3> {currentUser.goal} </h3>
              ) : (
                <h3>Goal is Empty</h3>
              )}

              <h3 className="text-bold text-lg font-bold mt-4 text-center border-t border-blue-400">
                {" "}
                Interest{" "}
              </h3>
              <span className="border-t bodrer-blue-400"></span>

              {currentUser.TopicsInterested &&
              currentUser.TopicsInterested.length ? (
                currentUser.TopicsInterested.map((interest, index) => (
                  <h5 key={index}>{interest} </h5>
                ))
              ) : (
                <h3> You should add Interests</h3>
              )}
            </>
          )}
        </div>

        {currentUser && (
          <div className="flex justify-center">
            <button
              onClick={() => moveTo("/userAccount")}
              className="xs:block sm:hidden text-gray-600 border-none text-center p-3 bg-transparent hover:text-gray-900"
            >
              About Me
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPost;
