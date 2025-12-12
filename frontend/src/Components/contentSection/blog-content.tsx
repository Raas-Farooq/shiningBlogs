import { useEffect, useState } from "react";
import {toast} from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import {

  useAuthenContext,
  useBlogContext,
  useUIContext,
} from "../../globalContext/globalContext.jsx";
import { VITE_API_URL } from "../../config.ts";
import { clsx } from "clsx";
import UserProfile from "./userProfile.tsx";
import BlogCard from "./BlogCard.tsx";
import BlogSearchComponent from "./customBlogSearch.tsx";
import useLoginConfirm from "../../utils/useLoginConfirm.tsx";
import { Blog } from "../../types/globalTypes.ts";

export default function BlogContent() {

  interface PostClick {
    (e: React.MouseEvent<HTMLElement>, post: Blog): void;
  }
  const {
    searchValue,
    fetchBlogsError,
    fetchBlogsLoading,
    searching,
    filteredBlogs,
    allBlogsGlobally,
    // setAllBlogsGlobally,
  } = useBlogContext();

  const { showMenu } = useUIContext();
  const { loggedIn, currentUser } = useAuthenContext();
  const [profileImage, setProfileImage] = useState<string>("");
  const navigateTo = useNavigate();
  
  useEffect(() => {
    if (currentUser?.profileImg) {
      const myImage = `${VITE_API_URL}/${currentUser.profileImg}`;
      setProfileImage(myImage);

    }
  }, [currentUser?.profileImg, allBlogsGlobally]);

  

  
   async function handleCreateBlog(){
        const confirmLogin = useLoginConfirm();
        if(loggedIn){
            navigateTo('/write');
        }
        else{
            const userResponse = await confirmLogin("Please login to create a new Blog Post");
            if(userResponse){
                navigateTo('/login')
            }
        }
    }

    useEffect(() => {
      let toastId:string | undefined;
      if(fetchBlogsLoading)
      {
        toastId = toast.loading('Loading All Blogs..');
      }
      return () => {
        if(toastId) toast.dismiss(toastId);
      }
    },[])

    useEffect(() => {
      if(fetchBlogsError){
          toast.error('Error while fetching all Blogs');
        }
    },[fetchBlogsError])

  
  const handlePostClick: PostClick = (e, post) => {
    e.stopPropagation();
    navigateTo(`/BlogPost/${post._id}`, { state: { post } });
  };

  const getBlogsToShow = () => {
    return searchValue || filteredBlogs.length ? filteredBlogs : allBlogsGlobally;
  };

  const BlogsToShow = getBlogsToShow();
  return (
    <>
    <BlogSearchComponent />
      <div
        data-component="AllBlogsParent"
        className={clsx(
          "flex justify-center xs:flex-col md:flex-row gap-2",
          showMenu && searching && 'flex justify-end items-end pt-44'
        )}
      >

        {fetchBlogsLoading && (
          ( <div className="mt-11 absolute">
            <FaSpinner className="animate-spin text-lg" /> Loading Blogs
          </div> )
        )}
        
        <div className={`blogsContainer text-center m-4 ${!loggedIn  ? 'w-[100vw]' : 'xs:w-[95vw] w-[70vw]'}`}>
          { (!fetchBlogsLoading && allBlogsGlobally?.length === 0) && 
                (<div className="w-full flex flex-col justify-center items-center gap-6">
                    <h1>Become the First To Create A Blog</h1>
                    <button 
                    onClick={() => handleCreateBlog()}
                    className="bg-orange-500 border px-4 py-2 text-white hover:bg-orange-600 rounded-xl shadow-md">
                        Create Blog Here
                    </button>
                </div>)
          }
          {allBlogsGlobally && allBlogsGlobally?.length > 0 &&
            <div
              data-component="bottomBlogsContainer"
              className={`grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center ${!loggedIn && 'lg:grid-cols-3'}`}
              >
              {BlogsToShow?.map((blog, index) => {
                return (
                  <BlogCard
                    key={index}
                    blog={blog}
                    handlePostClick={handlePostClick}
                    filtering={false}
                  />
                )
              }
              )}
            </div>
            }

        </div>

        <div className={`hidden md:block`}>
          {loggedIn && currentUser && (
            <UserProfile currentUser={currentUser} profileImage={profileImage} />
          )}
        </div>
      </div>
  
    </>
  );
}