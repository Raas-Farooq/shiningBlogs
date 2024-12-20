import { useEffect, useState } from "react";
import { useGlobalContext } from "../globalContext/globalContext"
import Image from "../Components/contentSection/titleImage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TextContent from '../Components/contentSection/textContent';
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Navbar from '../Components/Navbar/navbar';

const BlogPost = () => {

    const {setInHomePage,currentUser, loggedIn,setLoggedIn,setSearching} = useGlobalContext();
    console.log("loggeIn after useGlobal: ", loggedIn)
    const [blogOwner, setBlogOwner] = useState(false);
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    let {id} = useParams();
    id = id.startsWith(':') ? id.slice(1) : id;
    const moveTo = useNavigate();
    useEffect(() => {
        setInHomePage(false);

    },[])
    // const {post, myBlogs} = location.state || {};
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log("userId: ", userId);
        const getPost = async() => {
            console.log("Post id: ", id);
            
            try{
                if(id){
                    const response = await axios.get(`http://localhost:4100/weblog/getBlogPost/${id}`,
                    { withCredentials:true}
                );
                    setPost(response.data.blogPost);
                    console.log("response: ", response);
                }
            }
            catch(err){
                console.log("I'm here Err : while getting the Post ", err)
            }
        }
        getPost();

        async function userPrivileges(){
            
            try{
                if(id){
                    const response = await axios.get(`http://localhost:4100/weblog/canEditBlog/${id}`
                        ,{withCredentials:true}
                    );
                    console.log("response: ", response);
                    if(response.data.success){
                        setBlogOwner(true);
                    }
                }   
               
            }
            catch(err){
                console.log("error while ensuring the privileges of user: ", err);
                if(err.response.data.error === 'jwt expired'){
                    // console.log("Token Expired");
                    // alert("Your session has expired, You are logged Out");
                    setLoggedIn(false);
                }
                if(err.response.data.error === 'Not-Authorized'){
                    setBlogOwner(false);
                }
            }
        }

        userPrivileges();
        // console.log("POST inside Post: ", post);
    }, [id]);

    if(!Object.keys(post).length){

        return <h1> Loading.. </h1>
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
            <Navbar showSearch={false} />
            <div data-component="post-container" className={`${loggedIn ? 'flex xs:flex-col sm:flex-row' : 'w-full bg-gray-50'}`}>
                {console.log("posst: ", Object.keys(post).length)}
              {!Object.keys(post).length ? <h1> Loading the Blog..</h1> :
              (
                <div className="w-full max-w-4xl mx-auto px-4 py-5 rounded:md shadow-lg bg-white">
                    <div className="">  
                        <div key={post._id}
                        id={post._id}
                        >
                            
                            <h2 className="text-center w-4/5 text-2xl text-purple-600 font-medium mb-10 p-5"> {post.title} </h2>
                            {console.log("logged In: ", loggedIn)}
                            {loggedIn && blogOwner ? <div className="text-right flex justify-end gap-2 mb-2 w-[80%]">
                                <button onClick={(e) => handleEdit(e, post)} ><FaEdit size={20} /> </button>
                                <button onClick={(e) => handleDelete(e,post._id)} ><FaTrash size={20} /> </button>
                            </div>
                            :
                            null
                            }
                            {post.titleImage && <Image postImg={post.titleImage} title={post.title} isFullView={true} /> }
                            <TextContent content={post.content} isFullView={true} fromPost={true} contentImages={post.contentImages} />
                        </div>
                    </div>
                    <div className="flex justify-center my-3">
                        <div className={`border-t-4 border-indigo-500 shadow-lg mb-4 ${
                        loggedIn ? "w-[350px]" : "w-[350px]"
                    }`}>
                        </div>
                    </div>
                    <div className={`text-center mb-4 ${loggedIn ? 'w-full': 'w-4/5' } `}>
                        <button onClick={() => moveTo(-1)} className="bg-transparent text-gray-600 hover:text-gray-900 mx-2"> Back </button>
                        <button onClick={() => moveTo('/')} className="bg-transparent text-gray-700 hover:text-gray-900 "> Back To Home </button>
                    </div>
                    
                </div>
                )}
                <div className={`px-2 py-32 ${loggedIn ? 'w-[30vw]' : 'w-0'} bg-white text-center relative xs:hidden sm:block ${!loggedIn && 'xs: sm:hidden'} `}>
                    {currentUser ? (
                        <>
                            <h2 className="font-extrabold "> {currentUser.username && currentUser.username.length ? `About ${currentUser.username.toUpperCase()}` : 'About' }</h2>
                            <div className="flex justify-center">
                                {currentUser.profileImg && (<Image postImg={currentUser.profileImg} 
                                title={currentUser.username} />)}
                            </div>
                            
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
                        className="xs:block sm:hidden text-gray-600 border-none text-center p-3 bg-transparent hover:text-gray-900">
                            About Me</button>
                    </div>
                }
            </div>
            
        </>
    )
}

export default BlogPost