import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../globalContext/globalContext";
import Title from '../Components/contentSection/Title.jsx';
import TextContent from "../Components/contentSection/textContent";
import TitleImage from '../Components/contentSection/titleImage.jsx'


export default function Content() {
    const {setInHomePage, setShowMenu} = useGlobalContext();
    const [loading, setLoading] = useState(true);
    let yourBlogs=[];
    const [yourContent, setYourContent] = useState([]);
    const user_id = localStorage.getItem('userId');
    console.log("usr Id: ", user_id);
    const moveTo= useNavigate();

    // all Blogs Access

    useEffect(() =>{
        const clearLocalStorage = () => {
            localStorage.removeItem('titleImage');
            localStorage.removeItem("titleStorage");
            localStorage.removeItem("titleImagePreview");
            localStorage.removeItem("textContent");
            localStorage.removeItem("localContentImages");
        }
        
        clearLocalStorage();
    },[])


    useEffect(() => {
        console.log("Content is on Its way");
        setInHomePage(false);
        if(user_id){
            getYourPosts();
        }
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
        

    }, [])

    function handleHome(){
        setShowMenu(false)
    }
    function handlePostClick(e,post){
        console.log("postId inside Content: ", post._id);
        moveTo(`/BlogPost/${post._id}`)
    }
    if(loading){
        return <h2> Loading Your Content..</h2>
    }
    return(
        <div className="page-content">
            <h1 className="text-pink-600"> My POSTS </h1>
            {!loading && yourContent.length > 0 ? console.log("Your Blogs loadded DOM: ", yourContent) : 'looking'}
            <div className="BlogsContainer flex flex-wrap justify-center">
                {yourContent?.map((blog,index) => 
                    <>
                        {
                            
                            <div key={index} 
                            id={blog._id}
                            className="flex flex-col shadow-lg p-4 cursor-pointer text-center" 
                            onMouseDown={(e) => handlePostClick(e,blog)}
                            >
                                <h2 className="text-center xs:text-xs sm:text-sm font-medium"> <Title title={blog.title}  /></h2>
                                <TitleImage postImg={blog.titleImage} title={blog.title} />
                                <TextContent content={blog.content} />
                            </div>
                            
                        }
                    </>
                    )}
            </div>
            <div>
                <button className="text-blue-500" onClick={() => moveTo(-1)}> Back </button>
            </div>
            <button><Link to={'/'} onClick={handleHome} className=''> Back To Home</Link></button>
        </div>
    )
} 