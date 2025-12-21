import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthenContext, useUIContext } from "../globalContext/globalContext.tsx";
import Title from '../Components/contentSection/Title.tsx';
import TextContent from "../Components/contentSection/textContent.tsx";
import TitleImage from '../Components/contentSection/titleImage.tsx'
import useLoginConfirm from "../utils/useLoginConfirm.tsx";
import { Blog } from "../types/globalTypes.ts";


export default function MyPosts() {
    const { setInHomePage } = useUIContext();
    const { loggedIn, myPosts, myPostsFetchError, myPostsLoading } = useAuthenContext();
    const moveTo = useNavigate();
    const loginConfirm = useLoginConfirm();

    useEffect(() => {
        clearLocalStorage();
        setInHomePage(false);
    }, [])

    useEffect(() => {
        const loginCheck = async () => {
            if (!loggedIn) {
                const confirm = await loginConfirm("Your Login time has Expired. Please Login Again to continue");
                if (confirm) {
                    moveTo('/login');
                    return;
                } else {
                    return;
                }
            }
        }
        loginCheck();
    }, [loggedIn])
    // clear local storage
    const clearLocalStorage = () => {
        localStorage.removeItem('titleImage');
        localStorage.removeItem("titleStorage");
        localStorage.removeItem("titleImagePreview");
        localStorage.removeItem("textContent");
        localStorage.removeItem("localContentImages");
    }

    const handlePostClick = (post: Blog) => {
        moveTo(`/BlogPost/${post._id}`, { state: { page: '/myPosts' } })
    }

    if (myPostsFetchError) {
        return <h2 className="text-2xl text-center"> Error while Fetching the Posts</h2>
    }
    if(myPostsLoading){
        return <h2 className="text-2xl text-center"> Loading the Posts</h2> 
    }
    return (
        <div className="page-content bg-gradient-to-b from-gray-50 to-gray-100 px-6 py-8 text-center mt-16">
            <h1 className="text-orange-600 text-4xl md:text-5xl font-bold text-center border-b-4 inline-block border-gray-500 my-3"> My Posts </h1>
            <div className="BlogsContainer flex flex-col items-center justify-center bg-white max-w-6xl mx-auto gap-6">

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* {console.log("myPosts DOM; ", myPosts)} */}
                    {myPosts && myPosts?.map((blog, index) => {
                        if (!blog || !blog.title || !blog.titleImage) {

                            console.warn(`Skipping render for invalid blog at index ${index}`, blog);
                            return null;
                        }
                        return (
                            <div key={blog._id || index}
                                id={blog._id}
                                className="flex flex-col shadow-lg p-6 cursor-pointer text-center hover:shadow-3xl hover:scale-110 transition-all duration-500 "

                                onMouseDown={() => handlePostClick(blog)}
                            >

                                <h2 className="text-center xs:text-xs sm:text-lg font-medium"> <Title title={blog.title} /></h2>
                                <TitleImage postImg={blog.titleImage} title={blog.title} />
                                <TextContent content={blog.content} />
                            </div>
                        )
                    }
                    )
                    }
                </div>
            </div>
            {(!myPostsLoading && myPosts?.length === 0) &&
                <div className="text-center">
                    <h2 className="text-xl mb-5"> Write Your First Blog Here</h2>
                    <button type="button"
                        onClick={() => moveTo('/write')}
                        className="border border-gray-600 px-4 py-2 rounded-md hover:text-orange-700 hover:border-orange-700"
                    > Create Blog </button>
                </div>
            }
            <div className="mt-16 flex justify-center space-x-4">
                <button className="text-gray-600 hover:text-gray-900 hover:font-bold" onClick={() => moveTo(-1)}> Back </button>
                <button onClick={() => moveTo('/')} className='text-gray-600 hover:text-gray-900 hover:font-bold'> Back To Home</button>
            </div>
        </div>
    )
} 