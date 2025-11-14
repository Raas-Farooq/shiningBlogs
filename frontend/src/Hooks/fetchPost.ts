import {useState, useEffect} from 'react';
// import axios from 'axios';
import { useAuthenContext } from '../globalContext/globalContext';
import MakeApiCall from '../pages/makeApiCall';
import { VITE_API_URL } from '../config';

interface Post {
    _id:string,
    userId:string,
    title:string,
    titleImage:string,
    public_id:string,
    content:[{
    type: string;
    value: string;
    _id?: string;
        }],
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
        public_id:"",
        content: [{type:'text', value:""}],
        contentImages:[],
        createdAt: "",
        updatedAt: ""
      });
    const [postLoading, setPostLoading] = useState<Boolean>(true);
    const { setErrorMessage}:{setErrorMessage:(errorMessage:string) => void} = useAuthenContext();

    useEffect(() => {
        if(!id) return;
        const getPost = async() => {
       
            const url = `${VITE_API_URL}/weblog/getBlogPost/${id}`;

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


