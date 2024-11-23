import { useEffect, useState } from "react";
import { useGlobalContext } from "../globalContext/globalContext"
import Image from "../Components/contentSection/titleImage";
import { useLocation, useNavigate } from "react-router-dom";
import TextContent from '../Components/contentSection/textContent';
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Navbar from '../Components/Navbar/navbar';

const BlogPost = () => {

    const {currentUser, loggedIn} = useGlobalContext();
    const [currentBlog, setCurrentBlog] = useState([]);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const moveTo = useNavigate();

    const {post, myBlogs} = location.state || {};
    useEffect(() => {
        
        console.log("POST inside Post: ", post);
    }, [currentUser,allBlogs, post]);

    if(!post){
        return <div> Loading.. </div>
    }
    const handleEdit = (e,post) => {
        e.preventDefault();
        console.log("postId: ", post._id);
        const postId = post._id;
        moveTo(`/editPost`, {state:{postId}});
    }
    function handleDelete(e,id) {
        e.preventDefault();
        const confirm = window.confirm("Are You sure to delete this Post. You won't be able to recover it!");
        // if()
        const deletingPost = async() => {
            try{
                if(confirm){
                    const response = await axios.delete(`http://localhost:4100/weblog/deleteBlog/${id}`, {withCredentials:true});
                    if(response.data.success){
                    alert("Successfully Remove the Post")
                    moveTo('/');
                    }
                }
            }
            catch(error){
                console.log("experiencing Error while deleting ", error);
                if(error.response.data.error === "jwt expired"){
                    alert("JWT Expired! Please Try again Later!")
                }
            }
            
        }

        deletingPost();
    }
    // Always have a conscious self to recognize the small thing which made You to Procrastinate. think about the Kite flying ? how you were planned to do even the intense heat and no air but you were committed
    return (
        <>
            <Navbar />
            <div data-component="post-container" className={`${loggedIn ? 'flex xs:flex-col sm:flex-row' : 'w-full'}`}>
              {loading && !myBlogs ? <h1> Loading the Blogs..</h1> :
              (
                <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-5">
                    <div className="">  
                        <div key={post._id}
                        id={post._id}
                        >
                            
                            <h2 className="text-center w-4/5 text-2xl text-purple-600 font-medium mb-10 shadow-inner 300 p-5 shadow-2xl"> {post.title} </h2>
                            {loggedIn && <div className="text-right flex justify-end gap-2 mb-2 w-[80%]">
                                <button onClick={(e) => handleEdit(e, post)} ><FaEdit size={20} /> </button>
                                <button onClick={(e) => handleDelete(e,post._id)} ><FaTrash size={20} /> </button>
                            </div>
                            }
                            {post.titleImage && <Image postImg={post.titleImage} title={post.title} isFullView={true} /> }
                            <TextContent content={post.content} isFullView={true} fromPost={true} contentImages={post.contentImages} />
                        </div>
                    </div>
                    <div className={`text-center mb-4 ${loggedIn ? 'w-full': 'w-4/5' } `}>
                        <button onClick={() => moveTo('/')} className="bg-red-400 p-2"> Back To Home </button>
                    </div>
                </div>
                )}
                <div className={`mt-5 p-4 ${loggedIn ? 'w-[30vw]' : 'w-0'} text-center relative xs:hidden sm:block ${!loggedIn && 'xs: sm:hidden'} `}>
                    {currentUser ? (
                        <>
                            <h2 className="font-extrabold "> {currentUser.username && currentUser.username.length ? `About ${currentUser.username.toUpperCase()}` : 'About' }</h2>
                            {currentUser.profileImg && (<Image postImg={currentUser.profileImg} 
                             title={currentUser.username} />)}
                            
                            <h2 className="font-bold mt-4"> Goal</h2>
                            {currentUser.goal && currentUser.goal.length ? (<h3> {currentUser.goal} </h3>):
                            <h3>Goal is Empty</h3>}
                            
                            <h3 className="text-bold text-lg font-bold mt-4 text-center border-t border-blue-400"> Interest </h3>
                            <span className="border-t bodrer-blue-400"></span>
                           
                            {currentUser.TopicsInterested && currentUser.TopicsInterested.length ? (
                                currentUser.TopicsInterested.map((interest,index) => (
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

                {currentUser && 
                    <div className="flex justify-center">
                        <button 
                        onClick={() => moveTo('/userAccount')}
                        className="xs:block sm:hidden border bg-green-400 text-center p-3 hover:bg-green-200">
                            About Me</button>
                    </div>
                }
            </div>
            
        </>
    )
}

export default BlogPost