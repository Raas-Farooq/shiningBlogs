import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import PostImage from "./titleImage.jsx";
import TextContent from "./textContent.jsx";
import Title from "./Title.jsx";
import { Link, useNavigate } from "react-router-dom";
import { FaRedo, FaSpider, FaSpinner, FaSync } from "react-icons/fa";
import { Sidebar, User } from "lucide-react";
// BlogContent
//
import {
    
    useAuthenContext,
    useBlogContext,
    useUIContext,
} from "../../globalContext/globalContext";

function UserProfile({ currentUser, profileImage }) {

  return (
    <aside
      className={`py-8 p-4 w-[30vw] text-center bg-gray-50 shadow:sm rounded:lg`}
    >
      <h2 className="font-bold text:xl mb-6">
        {" "}
        {currentUser.username && currentUser.username.length
          ? `About ${currentUser.username.toUpperCase()}`
          : "About"}
      </h2>
      {profileImage && (
        <img
          src={profileImage}
          alt="greenry"
          className="w-auto h-52 mx-auto rounded-lg shadow-md mb-6 "
        />
      )}
      <div className="space-y-6">
        <section>
          <h2 className="font-bold mt-4"> Goal</h2>
          {currentUser.goal && currentUser.goal.length ? (
            <h3> {currentUser.goal} </h3>
          ) : (
            <h3>Goal is Empty</h3>
          )}
        </section>
        <section>
          <h3 className="text-bold text-lg font-bold mt-4 text-center border-t border-blue-400">
            {" "}
            Interest{" "}
          </h3>
          <span className="border-t border-blue-400"></span>

          {currentUser.TopicsInterested &&
          currentUser.TopicsInterested.length ? (
            currentUser.TopicsInterested.map((interest, index) => (
              <h5 key={index}>{interest} </h5>
            ))
          ) : (
            <h3> interests are not Added</h3>
          )}
        </section>
      </div>
    </aside>
  );
}
const BlogCard = ({ blog, handlePostClick, filtering = false }) => {
  console.log("filtering ", filtering);
  return (
    <article
      className="flex flex-col items-center p-4 rounded-lg transition-all duration-300 hover:scale-105
                     shadow-md hover:shadow-xl bg-white
                     max-w-sm w-full"
    >
      <h2 className="text-center text-base sm:text-lg font-medium mb-4">
        <Title title={blog.title} />
      </h2>
      <PostImage postImg={blog.titleImage} title={blog.title} />
      <TextContent content={blog.content} />
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg 
                       hover:bg-blue-600 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={(e) => handlePostClick(e, blog)}
      >
        Read More
      </button>
    </article>
  );
};

export default function BlogContent() {
  const {
    searchValue,
    setFilteredBlogs,
    setSearchValue,
    setSearching,
    filteredBlogs,
    allBlogsGlobally,
    setAllBlogsGlobally,
  } = useBlogContext();

  const { loggedIn, currentUser } = useAuthenContext();
  const {showMenu,} = useUIContext();
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const navigateTo = useNavigate();
  useEffect(() => {
    if (currentUser?.profileImg) {
      const myImage = `http://localhost:4100/${currentUser.profileImg}`;
      setProfileImage(myImage);
    }
    if (!allBlogsGlobally) {
      setLoading(true);
    }
  }, []);

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
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4100/weblog/allBlogs"
        );
        setAllBlogsGlobally(response.data.blogs);
      } catch (err) {
        console.log("got errors while fetching all blogs: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  function handleRefresh(e) {
    e.preventDefault();
    setSearching(false);
    setFilteredBlogs([]);
    setSearchValue("");
  }
  const handlePostClick = (e, post) => {
    e.stopPropagation();
    navigateTo(`/BlogPost/:${post._id}`, { state: { post } });
  };
  const BlogsToShow =
    searchValue || filteredBlogs.length ? filteredBlogs : allBlogsGlobally;
  return (
    <div
      data-component="AllBlogsParent"
      className=" flex xs:flex-col sm:flex-row"
    >
      {!allBlogsGlobally.length && loading && (
        <div className="text-center my-5">
          <FaSpinner className="animate-spin text-lg" /> Loading Blogs
        </div>
      )}
      <div className="blogsContainer xs:w-[95vw] w-[70vw] text-center m-10">
        {console.log(
          "filteredBlogs inside bllogcontent DOM: ",
          filteredBlogs,
          "search VAlue: ",
          searchValue + "AllblogsGlobally: ",
          "showMenu: ", showMenu
        )}
        <button
          onClick={handleRefresh}
          className="bg-transparent text-gray-600 hover:text-blue-600 hover:underline"
        >
          Refresh
        </button>
        <div
          data-component="bottomBlogsContainer"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-center justify-center"
        >
          {BlogsToShow.map((blog, index) => (
            <BlogCard
              key={index}
              blog={blog}
              handlePostClick={handlePostClick}
            />
          ))}
        </div>
      </div>

      <div className={`hidden md:block`}>
        {loggedIn && (
          <UserProfile currentUser={currentUser} profileImage={profileImage} />
        )}
        {/* {currentUser ? (
                        
                    ):
                    <h2> Loading..</h2>
                    } */}
      </div>

      <div
        className="flex justify-center"
        onClick={() => navigateTo("/userAccount")}
      >
        <button className="xs:block sm:hidden border bg-green-400 text-center p-3 hover:bg-green-200">
          About Me
        </button>
      </div>
    </div>
  );
}

// why did you use grid instead of flex for cards
//why using aside as Parent container for UserProfile
// what are the main difference of styles from my file and why
// why using useCallback with small functions like clearLocalStorage
