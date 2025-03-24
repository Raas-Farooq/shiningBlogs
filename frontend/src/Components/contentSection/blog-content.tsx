import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import PostImage from "./titleImage.tsx";
import TextContent from "./textContent.tsx";
import Title from "./Title.jsx";
import {useNavigate } from "react-router-dom";
import {FaSpinner } from "react-icons/fa";
// import { Sidebar, User } from "lucide-react";
// BlogContent
//
import {
    
    useAuthenContext,
    useBlogContext,
} from "../../globalContext/globalContext.jsx";
import { VITE_API_URL } from "../../config.ts";
import { clsx } from "clsx";
// import ContentImages from "./ContentImage.jsx";

interface PresentUser{
  _id:string,
  username:string,
  email:string,
  password:string,
  profileImg:string,
  TopicsInterested:[],
  goal:string,
  createdAt:string,
  updatedAt:string
}

interface userProfileProps {
  currentUser:PresentUser | null,
  profileImage:string
}


function UserProfile( {currentUser, profileImage}:userProfileProps) {

  useEffect(() => {
    console.log('currentUser blogCon ', currentUser);
  },[])
  
  return (
    <aside
      className={`py-8 p-4 w-[25vw] text-center bg-gray-50 shadow:sm rounded:lg text-gray-700`}
    >
      <h2 className="font-bold text:xl mb-6">
        {" "}
        {currentUser?.username && currentUser.username.length
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
          {currentUser?.goal && currentUser.goal.length ? (
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

          {currentUser?.TopicsInterested &&
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


interface Blog{
  _id:string,
  userId:string,
  title:string,
  titleImage:string,
  content:[],
  contentImages:[],
  createdAt:string,
  updatedAt:string
}

interface BlogCardProps{
  blog:Blog,
  handlePostClick:(e:React.MouseEvent<HTMLButtonElement>, post:Blog) => void,
  filtering:boolean
}
const BlogCard:React.FC<BlogCardProps> = ({ blog, handlePostClick }) => {
  // eslint-disable-next-line no-unused-vars
  const { allBlogsGlobally } = useBlogContext();
useEffect(() => {
  console.log("BlogsCount: ", allBlogsGlobally.length)
},[])
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
      <TextContent content={blog.content} isFullView={false} contentImages={blog?.contentImages} />
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

  interface PostClick{
    (e:React.MouseEvent<HTMLButtonElement>, post:Blog):void;
  }
  const {
    searchValue,
    setFilteredBlogs,
    setSearchValue,
    setSearching,
    filteredBlogs,
    allBlogsGlobally,
    setAllBlogsGlobally,
  } = useBlogContext();

  
  const { loggedIn, currentUser} = useAuthenContext();
  
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
    if(allBlogsGlobally.length === 0){
      setLoading(true);
      axios.get(
          `${VITE_API_URL}/weblog/allBlogs`
        ).then(response => {
          setAllBlogsGlobally(response.data.blogs);
        })
        .catch(err => {
          console.log("got errors while fetching all blogs: ", err);
        }).finally(() => {
          setLoading(false);
        })
    }
  }, [allBlogsGlobally?.length]);

  function handleRefresh(e:React.MouseEvent) {
    e.preventDefault();
    setAllBlogsGlobally([]);
    if(!loading){
      setSearching(false);
      setFilteredBlogs([]);
      setSearchValue("");
    }
  }
  const handlePostClick:PostClick = (e, post) => {
    e.stopPropagation();
    navigateTo(`/BlogPost/${post._id}`, { state: { post } });
  };

    const getBlogsToShow = () => {
      return searchValue || filteredBlogs.length ? filteredBlogs : allBlogsGlobally;
    };
    
    const BlogsToShow = getBlogsToShow();
  return (
    <div
      data-component="AllBlogsParent"
      className="flex justify-center xs:flex-col md:flex-row gap-2"
    >
      {!allBlogsGlobally?.length && loading && (
        <div className="text-center my-5">
          <FaSpinner className="animate-spin text-lg" /> Loading Blogs
        </div>
      )}
      <div className="blogsContainer xs:w-[95vw] w-[70vw] text-center m-10">
      
        <button
          onClick={handleRefresh}
          className="bg-transparent text-gray-600 hover:text-blue-600 hover:underline"
        >
          Refresh
        </button>
        {allBlogsGlobally?.length > 0 && 
        <div
        data-component="bottomBlogsContainer"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-center justify-center"
      >
        {BlogsToShow.map((blog, index) => 
          {
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
        {loggedIn && currentUser &&(
          <UserProfile currentUser={currentUser} profileImage={profileImage} />
        )}
      </div>

      <div
        className="flex justify-center"
        onClick={() => navigateTo("/userAccount")}
      >
        <button className={clsx('sm:hidden border bg-green-400 text-center p-3 hover:bg-green-200', !loggedIn ? 'xs:hidden' : 'block')}>
          About Me
        </button>
      </div>
    </div>
  );
}


// suppose i dont destrcture them and used it like this then why doesn't it work 'function UserProfile( currentUser:PresentUser, profileImage:string) {'


// img.onload = () => {
//   setImageLoading(false);
// };
// img.onerror = () => {
//   setImageLoading(false);
// };

// are onload and onerror builtIN methods