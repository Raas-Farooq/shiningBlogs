import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUIContext } from "../globalContext/globalContext";
import Title from '../Components/contentSection/Title.jsx';
import TextContent from "../Components/contentSection/textContent.jsx";
import TitleImage from '../Components/contentSection/titleImage.jsx'
import { FaSpinner } from "react-icons/fa";


export default function Content() {
    const {setInHomePage, setShowMenu} = useUIContext();
    const [loading, setLoading] = useState(true);
    let yourBlogs=[];
    const [yourContent, setYourContent] = useState([]);
    const user_id = localStorage.getItem('userId');
    console.log("usr Id: ", user_id);
    const moveTo= useNavigate();

    useEffect(() =>{   
        clearLocalStorage();
        setInHomePage(false);
        if(user_id){
            getYourPosts();
        }
    },[])

    // clear local storage
    const clearLocalStorage = () => {
        localStorage.removeItem('titleImage');
        localStorage.removeItem("titleStorage");
        localStorage.removeItem("titleImagePreview");
        localStorage.removeItem("textContent");
        localStorage.removeItem("localContentImages");
    }

    // all Blogs Access
    async function getYourPosts(){

        try{
            const response = await axios.get(`http://localhost:4100/weblog/getMyContent/${user_id}`,{
            withCredentials:true
            })

            setYourContent(response.data.yourBlogs);
            console.log("yourBlogs Assigned ", yourBlogs);
        }
        catch(err){
            console.error("error while accessing yourContent: ", err);
            setLoading(false)
        }
        finally{
            console.log('Finally Runs')
            setLoading(false)
        }
        
    }
        
    function handlePostClick(e,post){
        console.log("postId inside Content: ", post._id);
        moveTo(`/BlogPost/${post._id}`)
    }
    return(
        <div className="page-content bg-gradient-to-b from-gray-50 to-gray-100 px-6 py-8">
            <h1 className="text-purple-600 text-center border-b-4 inline-block border-red-500 my-3"> My POSTS </h1>
            <div className="BlogsContainer flex flex-wrap justify-center bg-white max-w-6xl mx-auto gap-6">
            {loading ? (
                <div>
                    <FaSpinner className="animate-spin font-bold text-lg inline" /> Please Wait..

                </div>)
                :
                  (
                    yourContent?.map((blog,index) => 
                    (
                        <div key={index} 
                            id={blog._id}
                            className="flex flex-col shadow-lg p-4 cursor-pointer text-center hover:shadow-3xl hover:scale-110 transition-all duration-300 " 
                            
                            onMouseDown={(e) => handlePostClick(e,blog)}
                            >
                                <h2 className="text-center xs:text-xs sm:text-sm font-medium"> <Title title={blog.title}  /></h2>
                                <TitleImage postImg={blog.titleImage} title={blog.title} />
                                <TextContent content={blog.content} />
                            </div>
                    )
                )
              )
            }
            </div>
            <div className="mt-6 flex justify-center space-x-4">
                <button className="text-gray-600 hover:text-gray-900 hover:font-bold" onClick={() => moveTo(-1)}> Back </button>
            <button onClick={() => moveTo('/')}  className='text-gray-600 hover:text-gray-900 hover:font-bold'> Back To Home</button>
            </div>
        </div>
    )
} 