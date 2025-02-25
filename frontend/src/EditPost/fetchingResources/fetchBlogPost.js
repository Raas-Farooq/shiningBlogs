import { useState,useEffect } from "react";
import { useAuthenContext } from "../../globalContext/globalContext";
import axios from 'axios'; 

const useFetchingPost = (postId) => {
    const {setLoading} = useAuthenContext();
    const [errors, setErrors]=useState('');
    const [post, setPost]=useState([])
    useEffect(() => {
      // console.log("postId: TechBlog ", postId);
        async function getPost() {
          if (!postId) {
            setLoading(false);
            return;
          }
          setLoading(true);
          try {
            // console.log("GEL POST RUNNNSSS Id", postId);
            const response = await axios.get(
              `http://localhost:4100/weblog/getBlogPost/${postId}`
            );
    
            // console.log("response; GElPOst ", response);
            // console.log("response .blogPost ", response.data.blogPost);
            setPost(response.data.blogPost);
          } catch (err) {
           console.log("err: Message ", err.message);
            if(err?.response?.data.message){
              setErrors({
                message:err.response.data.message
              })
            }
            else if(err?.response?.data){
         
                setErrors({
                  message:err.response.data
                })
    
            }
            else if(err?.request){
              setErrors({
                message:
                  "Not connected to the server. Plz check & Try Again!!",
              });
            }
            else {
              setErrors({
                message:err.message
              });
            }
            
          }finally{
            setLoading(false);
          }
        }
        getPost();
      }, [postId]);

      return {post, errors}
}

export default useFetchingPost