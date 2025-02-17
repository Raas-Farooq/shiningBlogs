import {useState, useEffect} from 'react';
// import axios from 'axios';
import { useAuthenContext } from '../globalContext/globalContext';
import MakeApiCall from '../pages/makeApiCall';

interface Post {
    _id:string,
    userId:string,
    title:string,
    titleImage:string,
    content:[],
    contentImages: [],
    createdAt:string,
    updatedAt:string
}

interface ApiResponse {
    data:{
        blogPost:Post
    }
    
}

interface ApiError {
    response?:{
        data:{
            message:string
        }
    }
    request?:any,
    message:string

}


const useFetchPost = (id:string | undefined) => {
    
    const [post, setPost] = useState<Post>({ 
        _id: "", 
        userId: "",
        title: "",
        titleImage: "",
        content: [],
        contentImages:[],
        createdAt: "",
        updatedAt: ""
      });
    const [postLoading, setPostLoading] = useState<Boolean>(true);
    const { setErrorMessage}:{setErrorMessage:(errorMessage:string) => void} = useAuthenContext();

    useEffect(() => {
        if(!id) return;
        const getPost = async() => {
       
            const url = `http://localhost:4100/weblog/getBlogPost/${id}`;

            const onSuccess = (response:ApiResponse) => {
                setPost(response.data.blogPost)
            }


            const onError = (error:ApiError) => {
                if(error?.response?.data.message) {
                    setErrorMessage(error.response.data.message)
                }
                else if(error.request){
                    setErrorMessage("Failed to Get the server response. Try Again Later!")
                }
                else {
                    setErrorMessage(error.message);
                }
            }
            MakeApiCall(setPostLoading, url, {method:"GET"}, onSuccess, onError);   
        }
        getPost();
    },[id])

    return {post, postLoading}

}

export default useFetchPost;


