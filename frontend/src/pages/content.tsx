import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUIContext } from "../globalContext/globalContext.tsx";
import Title from '../Components/contentSection/Title.tsx';
import TextContent from "../Components/contentSection/textContent.tsx";
import TitleImage from '../Components/contentSection/titleImage.tsx'
import { FaSpinner } from "react-icons/fa";
import { VITE_API_URL } from "../config.ts";

interface PostContent { 
    _id:string,
    userId:string,
    title:string,
    titleImage:string,
    content:[],
    contentImages:[],
    createdAt:string,
    updatedAt:string
    
}

export default function Content() {
    const {setInHomePage} = useUIContext();
    const [loading, setLoading] = useState(true);
    const [yourContent, setYourContent] = useState<PostContent[]>([]);
    const user_id = localStorage.getItem('userId');
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
            const response = await axios.get(`${VITE_API_URL}/weblog/getMyContent/${user_id}`,{
            withCredentials:true
            })

            setYourContent(response.data.yourBlogs);
            
        }
        catch(err){
            console.error("error while accessing yourContent: ", err);
            setLoading(false)
        }
        finally{
            setLoading(false)
        }
        
    }

    const handlePostClick= (post:PostContent) => {
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
                            
                            onMouseDown={() => handlePostClick(blog)}
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