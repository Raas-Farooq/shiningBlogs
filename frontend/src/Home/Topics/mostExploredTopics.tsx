import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useAuthenContext, useBlogContext } from "../../globalContext/globalContext";
import useLoginConfirm from "../../../utils/useLoginConfirm";
import useBlogsLoadingNotify from "../useBlogsLoadingNotify";
import { Blog } from "../../types/globalTypes";
import BlogCard from "../../Components/contentSection/BlogCard";


const MostExploredTopic = () => {
    useBlogsLoadingNotify();
    const {allBlogsGlobally,fetchBlogsLoading} = useBlogContext();
    const [lifeBlogs, setLifeBlogs] = useState<Blog[] | []>([]);
    const {loggedIn} = useAuthenContext();
    const location = useLocation();
    const {title} = location?.state;
    const navigate = useNavigate();
    const confirmLogin = useLoginConfirm();

    useEffect(() => {
        if(!allBlogsGlobally?.length) return;
        if(allBlogsGlobally.length > 0){
            const filteredBlogs = allBlogsGlobally.filter(blog => blog.category === title)
            setLifeBlogs(filteredBlogs);
        }
        
    },[allBlogsGlobally])


    const handlePostClick = (e:React.MouseEvent<HTMLElement>, post:Blog) => {
        e.stopPropagation();
        navigate(`/BlogPost/${post._id}`, {state:{post, page:'mostExploredTopics'}})
    }
    async function handleCreateBlog(){

        if(loggedIn){
            navigate('/write');
        }
        else{
            const userResponse = await confirmLogin("please login to write the blog");
            if(userResponse){
                navigate('/login')
            }
        }
    }
    if(!fetchBlogsLoading && allBlogsGlobally?.length === 0){
        return <h2> NO Blog Found</h2>
       }

    return (
        <div className="mt-20 text-center">
            { (!fetchBlogsLoading && allBlogsGlobally?.length === 0) && 
                (<div className="w-full flex flex-col justify-center items-center gap-6">
                    <h1>Become the First To Create A Blog</h1>
                    <button 
                    onClick={() => handleCreateBlog()}
                    className="bg-orange-500 border px-4 py-2 text-white hover:bg-orange-600 rounded-xl shadow-md">
                        Create Blog Here
                    </button>
                </div>)
            }
            <div className="w-full flex justify-center text-center">
                 <h1 className="text-center text-3xl md:text-5xl text-orange-600 mb-8 border-b-4 w-fit border-orange-800"> {title} </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
                 {lifeBlogs.map((blog,index) => (
                <BlogCard
                key={index}
                blog={blog}
                handlePostClick={handlePostClick}
                filtering={false}
                />
            ))}
            </div>
           
        </div>
    )

}

export default MostExploredTopic


