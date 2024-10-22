import { useEffect, useState } from "react";
import { useGlobalContext } from "../../globalContext/globalContext";
import axios from "axios";
import PostImage from './titleImage.jsx';
import TextContent from "./textContent.jsx";
import { Link, useNavigate } from "react-router-dom";


export default function BlogContent(){

    const {loggedIn, currentUser, setCurrentUser,imagePreview} = useGlobalContext()
    const listArr = [{name: 'Raas',goal: 'Be Positive', image:"https://images.unsplash.com/photo-1432298026442-0eabd0a98870?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z3JlZW4lMjBuYXR1cmV8ZW58MHx8MHx8fDA%3D"},
    {name: 'Faiq',goal: 'Be Polite', image:"https://images.unsplash.com/photo-1717647439287-f3e94e3fb924?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3JlZW4lMjBuYXR1cmV8ZW58MHx8MHx8fDA%3D"},
    {name: 'Raza',goal: 'Be strong', image:"https://images.unsplash.com/photo-1715731456084-2165629dfe4f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGdyZWVuJTIwbmF0dXJlfGVufDB8fDB8fHww"},
    {name: 'Bashir',goal: 'Shinning', image:"https://images.unsplash.com/photo-1700831359498-7e367ee09472?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGdyZWVuJTIwbmF0dXJlfGVufDB8fDB8fHww"},
    {name: 'Fatima',goal: 'Believer', image:"https://m.media-amazon.com/images/I/610+t0Qk54L._AC_UF1000,1000_QL80_.jpg"}
    ];
    const [loading, setLoading] = useState(true); 
    const [profileImage, setProfileImage] = useState('');
    const [myBlogs, setMyBlogs] = useState([]);
    const navigateTo = useNavigate();
    useEffect(() => {
        if(currentUser){
            const myImage = `http://localhost:4100/${currentUser.profileImg}`;
            setProfileImage(myImage);
        }
        
        console.log("current User in Blog Content: ", currentUser);
    }, [])

    useEffect(() => {
        const fetchBlogs = async() => {

            try{
                const response = await axios.get('http://localhost:4100/weblog/allBlogs');
                console.log("response of blogs : ", response.data);
                setMyBlogs(response.data.blogs)
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

    const handlePostClick = (post) => {
        navigateTo(`/BlogPost/:${post._id}`, {state:{post, myBlogs:myBlogs} })
    }
    if(loading) return <h2 className="text-2xl font-medium"> Loading Blogs...</h2>
    return (
        <div className="flex xs:flex-col sm:flex-row" >
            {console.log("Blogs inside DOM: ", myBlogs)}
            {!myBlogs ? <h1> Please Wait..</h1> :
            (
                <div className="blogsContainer xs:w-[95vw] w-[70vw] text-center m-10">
                    <div className="flex flex-wrap gap-5 text-center justify-center">
                    {myBlogs.map((blog,index) => {
                        return (
                            <div key={index} 
                            id={blog._id}
                            className="flex flex-col shadow-lg p-4 cursor-pointer text-center" 
                            onClick={(e) =>handlePostClick(blog)}
                            >
                                <h2 key={index} className="text-center xs:text-xs sm:text-sm font-medium"> {blog.title} </h2>
                                {console.log("title Image inside blog content: ", blog.titleImage)}
                                <PostImage postImg={blog.titleImage} title={blog.title} />
                                <TextContent content={blog.content} />
                            </div>
                        )
                        
                    })}
                    </div>
                </div>
            )}
            <div className={`mt-5 p-4 w-[30vw] text-center relative xs:hidden sm:block ${!loggedIn && 'xs: sm:hidden'} `}>
                    {currentUser ? (
                        <>
                            <h2 className="font-extrabold "> {currentUser.username && currentUser.username.length ? `About ${currentUser.username.toUpperCase()}` : 'About' }</h2>
                            {profileImage && (<img src={profileImage} 
                            alt="greenry"
                            className="w-auto md:h-h-[210px] mx-auto " />)}
                            
                            <h2 className="font-bold mt-4"> Goal</h2>
                            {currentUser.goal && currentUser.goal.length ? (<h3> {currentUser.goal} </h3>):
                            <h3>Goal is Empty</h3>}
                            
                            <h3 className="text-bold text-lg font-bold mt-4 text-center border-t border-blue-400"> Interest </h3>
                            <span className="border-t border-blue-400"></span>
                           
                            {currentUser.TopicsInterested && currentUser.TopicsInterested.length ? (
                                currentUser.TopicsInterested.map(interest => (
                                    <h5>{interest} </h5>
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