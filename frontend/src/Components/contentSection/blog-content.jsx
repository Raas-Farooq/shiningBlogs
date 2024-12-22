import {useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "../../globalContext/globalContext";
import axios from "axios";
import PostImage from './titleImage.jsx';
import TextContent from "./textContent.jsx";
import Title from './Title.jsx';
import { Link, useNavigate } from "react-router-dom";
import { FaRedo, FaSync } from "react-icons/fa";


export default function BlogContent(){

    const {inHomePage, searchValue, setFilteredBlogs, setSearchValue,filteredBlogs,searching, setSearching,loggedIn, currentUser,allBlogsGlobally,setAllBlogsGlobally, setCurrentUser,imagePreview} = useGlobalContext()
    const [loading, setLoading] = useState(true); 
    let   [slicedTitle, setSlicedTitle] = useState({});
    const [profileImage, setProfileImage] = useState('');
    const [myBlogs, setMyBlogs] = useState([]);
    const navigateTo = useNavigate();
    let showBlogsResult;
    useEffect(() => {
        
        if(currentUser?.profileImg){
            console.log("What exactly the current User: ", currentUser);
            const myImage = `http://localhost:4100/${currentUser.profileImg}`;
            console.log("myImage received in blogContent: ", myImage);
            setProfileImage(myImage);
        }
        if(!allBlogsGlobally){
            setLoading(true)
        }

    }, [])
    
    const clearLocalStorage = useCallback(() => {
        localStorage.removeItem('titleStorage');
        localStorage.removeItem('titleImagePreview');
        localStorage.removeItem('textContent');
        localStorage.removeItem('localContentImages');
     }, []);

    useEffect(() => {

        console.log("searching blogContent: ",searching );
        // setSlicedTitle(titleReceived);
        clearLocalStorage();
        const fetchBlogs = async() => {

            try{
                const response = await axios.get('http://localhost:4100/weblog/allBlogs');
                setAllBlogsGlobally(response.data.blogs)
                if(response.data){
                    
                    setLoading(false);
                }
            }catch(err){
                setLoading(false);
                console.log("got errors while fetching all blogs: ", err);
            }
        }
        fetchBlogs();
    }, []);



    function handleRefresh(e){
        e.preventDefault();
        setSearching(false);
        setFilteredBlogs([])
        setSearchValue('');
    }
    const handlePostClick = (e,post) => {
        e.stopPropagation();
       navigateTo(`/BlogPost/:${post._id}`, {state:{post, myBlogs:myBlogs} })
    }
  
    if(loading) return <h2 className="text-2xl font-medium"> Loading Blogs...</h2>
    return (
        <div data-component="AllBlogsParent" className=" flex xs:flex-col sm:flex-row" >
            {!allBlogsGlobally ? <h1> Please Wait..</h1> :
            (
                <div className="blogsContainer xs:w-[95vw] w-[70vw] text-center m-10">
                    {console.log("filteredBlogs inside bllogcontent DOM: ", filteredBlogs, "search VAlue: ", searchValue + "AllblogsGlobally: ")}
                    <button onClick={handleRefresh} className="bg-transparent text-gray-600 hover:text-blue-600 hover:underline">Refresh</button>
                    <div data-component="bottomBlogsContainer" className="flex flex-wrap gap-6 text-center justify-center">
                    {!searchValue && !filteredBlogs.length ? allBlogsGlobally?.map((blog,index) => 
                        {
                            return (
                                <div key={index} 
                                id={blog._id}
                                className="flex flex-col shadow-lg rounded-lg p-4 cursor-pointer text-center hover:scale-110 hover:shadow-2xl transition-all duration-400" 
                                
                                >
                                    <h2 className="text-center xs:text-xs sm:text-sm font-medium"> <Title title={blog.title}  /></h2>
                                    <PostImage postImg={blog.titleImage} title={blog.title} />
                                    <TextContent content={blog.content} />
                                    <button 
                                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                                        onMouseDown={(e) => handlePostClick(e, blog)}
                                    >
                                        Read More
                                    </button>
                                </div>
                            )
                        })
                        :
                        filteredBlogs?.map((blog, index) => {
                            return (
                                <div key={index} 
                                id={blog._id}
                                className="flex flex-col shadow-lg p-4 cursor-pointer text-center" s
                                onMouseDown={(e) =>handlePostClick(e, blog)}
                                >
                                    <h2 className="text-center xs:text-xs sm:text-sm font-medium"> <Title title={blog.title}  /></h2>
                                    <PostImage postImg={blog.titleImage} title={blog.title} />
                                    <TextContent content={blog.content} />
                                    <button 
                                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                                        onMouseDown={(e) => handlePostClick(e, blog)}
                                    >
                                        Read More
                                    </button>
                                </div>
                            )
                        })
                    }
                   
                    
                    </div>
                </div>
            )}
            <div className={`py-32 p-4 w-[30vw] text-center relative xs:hidden sm:block ${!loggedIn && 'xs: sm:hidden'} `}>
                    {currentUser ? (
                        <>
                            <h2 className="font-extrabold " > {currentUser.username && currentUser.username.length ? `About ${currentUser.username.toUpperCase()}` : 'About' }</h2>
                            {profileImage && (<img src={profileImage} 
                            alt="greenry"
                            className="w-auto md:h-[210px] mx-auto " />)}
                            
                            <h2 className="font-bold mt-4"> Goal</h2>
                            {currentUser.goal && currentUser.goal.length ? (<h3> {currentUser.goal} </h3>):
                            <h3>Goal is Empty</h3>}
                            
                            <h3 className="text-bold text-lg font-bold mt-4 text-center border-t border-blue-400"> Interest </h3>
                            <span className="border-t border-blue-400"></span>
                           
                            {currentUser.TopicsInterested && currentUser.TopicsInterested.length ? (
                                currentUser.TopicsInterested.map((interest, index) => (
                                    <h5 key={index}>{interest} </h5>
                                ))
                            ):
                            <h3> interests are not Added</h3>
                            }
                        </>
                    ):
                    <h2> Loading..</h2>
                    }
                
            </div>

            <div className="flex justify-center" onClick={() => navigateTo('/userAccount')}>
                <button className="xs:block sm:hidden border bg-green-400 text-center p-3 hover:bg-green-200">About Me</button>
            </div>
        </div>
    )

}