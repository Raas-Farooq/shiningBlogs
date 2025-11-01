import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
// import { Sidebar, User } from "lucide-react";
// BlogContent
//
import {

  useAuthenContext,
  useBlogContext,
  useUIContext,
} from "../../globalContext/globalContext.jsx";
import { VITE_API_URL } from "../../config.ts";
import { clsx } from "clsx";
import UserProfile from "./userProfile.tsx";
import BlogCard from "./BlogCard.tsx";
// import ContentImages from "./ContentImage.jsx";








interface Blog {
  _id: string,
  userId: string,
  title: string,
  titleImage: string,
  public_id: string,
  content: [],
  contentImages: [],
  createdAt: string,
  updatedAt: string
}


export default function BlogContent() {

  interface PostClick {
    (e: React.MouseEvent<HTMLElement>, post: Blog): void;
  }
  const {
    searchValue,
    setFilteredBlogs,
    setSearchValue,
    searching,
    setSearching,
    filteredBlogs,
    allBlogsGlobally,
    setAllBlogsGlobally,
  } = useBlogContext();

  const { showMenu } = useUIContext();
  const { loggedIn, currentUser, setErrorMessage } = useAuthenContext();

  const [loading, setLoading] = useState<boolean>(true);
  const [profileImage, setProfileImage] = useState<string>("");
  const navigateTo = useNavigate();
  useEffect(() => {
    if (currentUser?.profileImg) {
      const myImage = `${VITE_API_URL}/${currentUser.profileImg}`;
      setProfileImage(myImage);

    }
    if (!allBlogsGlobally.length) {
      setLoading(true);
    }
  }, [currentUser?.profileImg, allBlogsGlobally]);

  const clearLocalStorage = useCallback(() => {
    const keys = [
      "titleStorage",
      "titleImagePreview",
      "textContent",
      "localContentImages",
    ];
    keys.forEach((key) => localStorage.removeItem(key));
  }, []);

  useEffect(() => {
    clearLocalStorage();
    if (allBlogsGlobally.length === 0) {
      setLoading(true);
      axios.get(
        `${VITE_API_URL}/weblog/allBlogs`
      ).then(response => {
        setAllBlogsGlobally(response.data.blogs);
      })
        .catch(err => {
          console.error("got errors while fetching all blogs: ", err);
          setErrorMessage(err);
        }).finally(() => {
          setLoading(false);
        })
    }
  }, [allBlogsGlobally?.length]);

  function handleRefresh(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setAllBlogsGlobally([]);
    if (!loading) {
      setSearching(false);
      setFilteredBlogs([]);
      setSearchValue("");
    }
  }
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
      <div
        data-component="AllBlogsParent"
        className={clsx(
          "flex justify-center xs:flex-col md:flex-row gap-2",
          showMenu && searching && 'flex justify-end items-end pt-44'
        )}
      >
        {!allBlogsGlobally.length && loading && (
          <div className="mt-11 absolute">
            <FaSpinner className="animate-spin text-lg" /> Loading Blogs
          </div>
        )}
        <div className="blogsContainer xs:w-[95vw] w-[70vw] text-center m-4 min-h-[30rem]">

          <button
            type="button"
            onClick={handleRefresh}
            className={`bg-transparent text-gray-600 hover:text-blue-600 hover:underline w-full ${loading && 'mt-6'}`}
          >
            Refresh
          </button>
          {allBlogsGlobally?.length > 0 &&
            <div
              data-component="bottomBlogsContainer"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center"
            >
              {BlogsToShow.map((blog, index) => {
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
            </div>}

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