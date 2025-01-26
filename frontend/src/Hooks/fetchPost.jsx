import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useAuthenContext } from '../globalContext/globalContext';

const useFetchPost = (id) => {
    const [post, setPost] = useState({});

    const [postLoading, setPostLoading] = useState(true);
    const {isAuthenticated,setIsAuthenticated, errorMessage, setErrorMessage} = useAuthenContext();

    useEffect(() => {
        const getPost = async() => {
            console.log("Post id: insidse UseFetchPost", id);
            
            try{
                if(id){
                    const response = await axios.get(`http://localhost:4100/weblog/getBlogPost/${id}`,
                    { withCredentials:true}
                );
                    setPost(response.data.blogPost);
                    console.log("response: insidse UseFetchPost", response);
                }
            }
            catch(err){
                console.log("I'm here Err : while getting the Post ", err);
                if(err.response.data.message){
                    setErrorMessage(err.response.data.message);
                }else if(err.request){
                    setErrorMessage('Failed to Connect to the server. Please Try Again Later!')
                }else{
                    setErrorMessage(err.message);
                }
                
            }
            finally{
                setPostLoading(false);
            }
    
            
        }
        getPost();
    },[id])
    return {post, postLoading, isAuthenticated}
}

export default useFetchPost;

