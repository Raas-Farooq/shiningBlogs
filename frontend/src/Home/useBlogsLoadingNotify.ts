import { useEffect } from "react"
import { useBlogContext } from "../globalContext/globalContext";
import toast from "react-hot-toast";


const useBlogsLoadingNotify = () => {
    const {fetchBlogsError, fetchBlogsLoading} = useBlogContext();

      useEffect(() => {
        console.log("loading hook running ")
          let toastId:string | undefined;
          if(fetchBlogsLoading)
          {
            toastId = toast.loading('Loading All Blogs..');
          }
          return () => {
            if(toastId){
                toast.dismiss(toastId)
            }
          }
    
        },[fetchBlogsLoading])
    
        useEffect(() => {
          if(fetchBlogsError){
              toast.error('Error while fetching all Blogs');
            }
        },[fetchBlogsError])

   
}

export default useBlogsLoadingNotify