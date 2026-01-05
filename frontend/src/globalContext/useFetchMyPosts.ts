import axios from "axios";
import { useEffect, useState } from "react";
import { VITE_API_URL } from "../config";
import { Blog } from "../types/globalTypes";


function useFetchMyPosts(user_id: string | undefined) {

    const [fetchUserPostsLoading, setFetchUserPostsLoading] = useState<boolean>(true);
    const [yourContent, setYourContent] = useState<Blog[]>([]);
    const [fetchUserPostsErr, setFetchUserPostsErr] = useState<Error | any>(null);


    useEffect(() => {

        async function fetchPosts() {
            if (!user_id) {
                setFetchUserPostsLoading(false);
                return;
            }
            try {

                const response = await axios.get(`${VITE_API_URL}/weblog/getMyContent/${user_id}`, {
                    withCredentials: true
                })
                if (response.data.success) {
                    setYourContent(response.data.yourBlogs);
                }
                // else {
                //     setFetchUserPostsErr(new Error("Something went Wrong while accessing Posts"));
                // }

            }
            catch (err:string | any) {
                console.error("error while loading fetching user posts ", err);
                setFetchUserPostsErr(err);
                // toast.error("Error occurred while loading blogs ", { id: toastId })
            }
            finally {
                setFetchUserPostsLoading(false)
            }
        }

        fetchPosts();
    }, [user_id])

    // console.log("yourContent ", yourContent, " fetchUserPostsLoading ", fetchUserPostsLoading);
    return {fetchUserPostsLoading, yourContent, fetchUserPostsErr}
}

export default useFetchMyPosts