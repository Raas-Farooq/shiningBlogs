import clsx from "clsx"
import { Link, useNavigate } from "react-router-dom"
import { useAuthenContext, useBlogContext } from "../globalContext/globalContext";
import useLoginConfirm from "../utils/useLoginConfirm";

import { useCallback, useEffect } from "react";
import useImageCached from "../utils/useImageCached";
import { famousTopics, footerLinks, topBloggers } from "./footerLinks";
// import toast from 'react-hot-toast';


const Home = () => {
    const { loggedIn } = useAuthenContext();
    const { setSearchValue, setSearching, setFilteredBlogs } = useBlogContext()
    const confirmLogin = useLoginConfirm();
    const heroImage = useImageCached('/blog5.jpg')
    const readingImage = useImageCached('/reading1.jpg')

    const navigate = useNavigate();

    const clearLocalStorage = useCallback(() => {
        const keys = [
            "titleStorage",
            "titleImagePreview",
            "textContent",
            "localContentImages",
            "localTitle",
            "localPublic_id",
            "localTitleImage",
            "localContent"
        ];
        keys.forEach((key) => localStorage.removeItem(key));
    }, []);

    useEffect(() => {
        clearLocalStorage();
        setSearchValue('');
        setSearching(false);
        setFilteredBlogs([])
    }, [])

    const handleWriteBlog = async () => {
        if (!loggedIn) {
            const loginResult = await confirmLogin("");
            if (loginResult) {
                navigate('/login');
            }
        } else {
            navigate('/write')
        }

    }

    const handleTopics = (title: string) => {
        navigate('/mostExploredTopic', { state: { title } });
    }
    // {heroImage.imageStatus === 'loading' && (
    //                             // Display the placeholder only when loading
    //                             <div className={`${commonClasses} bg-gray-200 aspect-[6/3] animate-pulse z-10`}>
    //                             </div>
    //                         )}

    //                         {heroImage.imageStatus === 'loaded' && (
    //                             // Display the actual image only when loaded
    //                             <img
    //                                 src={'/blog5.jpg'}
    //                                 alt="Hero"
    //                                 className={`${commonClasses} aspect-[6/3]`}
    //                             />
    //                         )}

    //                         {heroImage.imageStatus === 'failed' && (
    //                             <div className={`${commonClasses} bg-red-400 flex items-center justify-center`}>
    //                                 <p className="text-white">Image Failed to Load</p>
    //                             </div>
    //                         )}
    const commonClasses = "w-full max-w-4xl shadow-md rounded-lg object-cover";
    return (
        <main className="min-h-screen bg-gray-50">
            <div className="container mx-auto space-y-16 px-4 sm:px-6 lg:px-8">
                <section className="relative py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 opacity-70"></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-block mb-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                                Join Top Writers Today
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                                Share Knowledge. Inspire Minds.
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                A modern blogging platform for readers, writers, and professionals to share ideas that matter.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                <button className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    Start Writing Free
                                </button>
                                <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200">
                                    Explore Blogs
                                </button>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
                                <img src="/api/placeholder/1200/600" alt="Platform preview" className="w-full" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ReadBlogs relative">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-center gap-10 items-center text-center px-6 py-12">
                        <div className="md:w-1/2 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold"> Best Place To Become Reader</h1>
                            <p className="mb-8 mt-2"> Find Blogs from all areas of life.</p>
                            <button
                                onClick={() => {
                                    navigate('/allBlogs')
                                }}
                                className="border font-mono border-gray-500 px-6 py-3 hover:text-orange-700 hover:border-orange-700 rounded-lg transition-colors duration-300"
                            >
                                Lets Dive In
                            </button>
                        </div>
                        <div className="flex w-full md:w-1/2 justify-center ">
                            {readingImage.imageStatus === 'loading' &&
                                <>
                                    <div className="w-full aspect-[4/3] max-w-lg bg-gray-200 animate-pulse shadow-md rounded-lg"> </div>

                                </>

                            }

                            {readingImage.imageStatus === 'loaded' &&
                                <img src="/reading1.jpg" className="w-full aspect-[4/3] max-w-lg object-cover shadow-md rounded-lg" />
                            }
                        </div>
                    </div>
                </section>
                <section className="TopBlogs relative">
                    <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-6 py-8">
                        <h1 className="text-3xl md:text-4xl font-semibold mb-10"> Enjoy The Most Explored Topics </h1>
                        <div className="flex flex-wrap justify-center gap-16">
                            {
                                famousTopics.map((topic, ind) => (
                                    <div className="" key={ind}>
                                        <h2 className="text-xl font-bold my-4">{topic.title}</h2>
                                        <div className="relative group hover:scale-110 transition-transform duration-500">
                                            <img src={topic.src} className="w-full max-w-md object-cover shadow-md rounded-2xl" />
                                            <button className="absolute text-orange-600 px-4 py-2 bg-white/90 backdrop/blur rounded-lg left-1/2 
                                             -translate-x-1/2 bottom-3 group-hover:bg-orange-600 group-hover:text-white group-hover:scale-105 transition"
                                                onClick={() => handleTopics(topic.title)}
                                            >{topic.title}</button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <section className="TopBloggers">
                    <div className="w-full max-w-6xl py-16 px-12 flex justify-center items-center flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold mb-10">Top Bloggers</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topBloggers.map((blogger, index) => {
                                return <div className="text-center" key={index}
                                    onClick={() => navigate('/bloggerProfile')}>
                                    <h2 className="font-bold mb-4">{blogger.name}</h2>
                                    <img src={blogger.src}
                                        className="w-full max-w-md object-cover rounded-lg hover:scale-105 cursor-pointer transition-transform duration-300"
                                    />
                                </div>
                            })}
                        </div>
                    </div>
                </section>
            </div>
            <footer className="relative ">
                <div className="min-w-screen bg-blue-900 h-36"></div>
                <div className="max-w-full flex flex-col justify-center py-6">
                    <div className="container mx-auto px-4 sm:px-6 md:px-8">
                        <div className="ml-5 mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                            {footerLinks.map((links, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col"
                                >
                                    <h3 className="sm:text-center font-bold mb-2" style={{ color: '#70767c' }}>{links.name}</h3>
                                    <div className="flex flex-col justify-center sm:items-center">
                                        {
                                            links.fields.map((field, ind) => (
                                                <Link
                                                    key={ind}
                                                    to={'#'}
                                                    className={clsx('sm:text-center mt-3 text-sm text-gray-800 font-bold hover:text-blue-700 transition-all duration-300 w-fit ')}>

                                                    {field}
                                                </Link>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col text-center my-5">
                            <p className="text-sm text-gray-600 mb-2">+92 301 2707036, 042 9375214, 042 5423214 | raasblogs@gmail.com</p>
                            <p className="text-sm text-gray-600">Lahore 42000 | &copy; 2025 RaasBlogs for Public, Medical Education and Research. All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    )
}

export default Home


// return direct function  
// sabar@gmail.com - sabarSpirit