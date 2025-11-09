import axios from "axios";
import { useEffect, useState } from "react"
import { Blog } from "../types/globalTypes";



const useFetchAllBlogs = () => {
    const [allBlogs, setAllBlogs] = useState<Blog[] | null>([]);
    const [fetchBlogsError, setFetchBlogsError] = useState('');
    const [fetchBlogsLoading, setFetchBlogsLoading] = useState(false);
    const VITE_API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {

        async function getAllBlogs(){
            setFetchBlogsLoading(true);
            let reversedBlogs:Blog[] = [];
            try{
                const res = await axios.get(`${VITE_API_URL}/weblog/allBlogs`);

                if(res.data.success){
                    console.log("fetchResponse ", res.data);
                    reversedBlogs = [...res.data.blogs].reverse();
                    setAllBlogs(reversedBlogs);
                }else{
                    setFetchBlogsError("Error while fetching all Blogs")
                }
            }
            catch(err:string | any){
                setFetchBlogsError(err);
            }
            finally{
                setFetchBlogsLoading(false);
            }
        } 
        getAllBlogs();

    },[])

    return {fetchBlogsLoading, fetchBlogsError, allBlogs}
}

export default useFetchAllBlogs