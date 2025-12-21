import { useState,useEffect } from "react";
import axios from 'axios'; 
import { VITE_API_URL } from "../../config";



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

    // const {setLoading} = useAuthenContext();
    const [fetchPostLoading, setFetchPostLoading] = useState(true);
    const [errors, setErrors]=useState<LocalErrors>({message:''});
    const [post, setPost]=useState<MyPost | null>(null)
    useEffect(() => {
        async function getPost() {
          if (!postId) {
            // setLoading(false);
            return;
          }

          // try {
            await axios.get(
              `${VITE_API_URL}/weblog/getBlogPost/${postId}`
            ).then(res => {
              setPost(res.data.blogPost)
            })
            .catch(err => setErrors(err))
            .finally(() => setFetchPostLoading(false));
        }
        getPost();
      }, [postId]);

      return {post, errors, fetchPostLoading}
}

export default useFetchingPost



        