import { useState,useEffect } from "react";
import { useAuthenContext } from "../../globalContext/globalContext";
import axios from 'axios'; 
import { VITE_API_URL } from "../../config";

interface ErrorInterface {
  response : {
    data : {

      message:string,
      error?:string
    }
  },
  request?:any,
  message?:string
}

interface LocalErrors {
  message:any
}

interface MyPost{
  _id:string,
  userId:string,
  title:string,
  titleImage:string,
  content:[{
    type:string,
    value:string
  }],
  contentImages:[{
    path:string,
    position:number,
    fileName:string,
    _id:string
  }],
  
}


const useFetchingPost = (postId:string) => {

    const {setLoading} = useAuthenContext();
    const [errors, setErrors]=useState<LocalErrors>({message:''});
    const [post, setPost]=useState<MyPost | null>(null)
    useEffect(() => {
      // console.log("postId: TechBlog ", postId);
        async function getPost() {
          if (!postId) {
            setLoading(false);
            return;
          }
          setLoading(true);
          try {
            const response = await axios.get(
              `${VITE_API_URL}/weblog/getBlogPost/${postId}`
            );
            setPost(response.data.blogPost);
          } catch (err:unknown) {
            if(err && typeof(err) === 'object'){
              if('response' in err && (err as ErrorInterface).response?.data.message){
                setErrors({
                  message:(err as ErrorInterface).response.data.message
                })
              }
              
              else if('request' in err){
                setErrors({
                  message:
                    "Not connected to the server. Plz check & Try Again!!",
                });
              }
              else if('message' in err && typeof(err.message) === 'string') {
                setErrors({
                  message:err.message
                });
              }
            }
          }
          finally{
            setLoading(false);
          }
        }
        getPost();
      }, [postId]);

      return {post, errors}
}

export default useFetchingPost



        