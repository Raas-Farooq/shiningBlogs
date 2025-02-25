import { useEffect } from "react";
import { useAuthenContext } from "../../globalContext/globalContext";

const fetchingPost = (postId, setPost, setErrors) => {
    const {setErrorMessage, setLoading} = useAuthenContext();
    useEffect(() => {
        async function getPost() {
          if (!postId) {
            setLoading(false);
            return;
          }
          setLoading(true);
          try {
            const response = await axios.get(
              `http://localhost:4100/weblog/getBlogPost/${postId}`
            );
    
       
            setPost(response.data.blogPost);
          } catch (err) {
           
            if(err?.response?.data.message){
              setErrors({
                message:err.response.data.message
              })
            }
            else if(err?.response?.data){
         
                setErrors({
                  message:"Some Errors returned by the SErver "
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
                    message:
                        "Post is not Loading, you are either logged out or internet connection err. Plz check & Try Again!!",
                    });
            }
            
          }finally{
            setLoading(false);
          }
        }
        getPost();
      }, [postId]);

      // return post
}

export default fetchingPost