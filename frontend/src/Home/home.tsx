import clsx from "clsx"
import { Link } from "react-router-dom"

const footerLinks = [

    {
        name: 'About',
        fields: ['About Us', 'Articles', 'Blogs', 'Career', 'Website', 'other Products']
    },
    {
        name: 'Blogs',
        fields: ['Education', 'Science', 'Religion', 'Health', 'Sport', 'AI']
    },
    {
        name: "Support",
        fields: ['Support Center', 'Community', 'Developers', 'Contact']
    },
    {
        name: "Policy",
        fields: ['Terms And Conditions', 'Privacy', 'Copyrights']
    }
]

const famousTopics = [
    {
        title:'Life',
        src:'/life2.jpg',
        path:'#'
    },
    {
        title:'Spirituality',
        src:'/spiritual2.jpg',
        path:'#'
    },
    {
        title:'Technology',
        src:'tech1.jpg',
        path:'#'
    }
]
const Home = () => {


// bg-gradient-to-r from-purple-50 to-white 
    return (
        <main className="min-h-screen bg-gray-50">
            <div className="container mx-auto space-y-16 px-4 sm:px-6 lg:px-8">
                <section className="Hero relative py-16 md:py-24 rounded-lg shadow-lg">
                    <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-6 py-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-5"> Become Blogger Today</h1>
                        <div className="relative">
                              <img src="/blog5.jpg" className="w-full object-cover shadow-md rounded-lg" />
                              <button className="text-xs sm:text-base absolute border font-mono bottom-6 left-1/2 -translate-x-1/2 border-gray-500 px-6 py-3 bg-orange-500 hover:bg-orange-700 text-white rounded-lg transition-colors duration-300">Write Your First Blog</button>
                        </div>
                    </div>
                </section>
                <section className="ReadBlogs relative">
                    <div className="max-w-6xl flex flex-col md:flex-row justify-center gap-10 items-center text-center px-6 py-12">
                        <div className="">
                            <h1 className=""> Best Place To Become Reader</h1>
                            <p className="mb-8 mt-2"> Find Blogs from all areas of life.</p>
                            <button 
                                className="border font-mono border-gray-500 px-6 py-3 hover:text-orange-700 hover:border-orange-700 rounded-lg transition-colors duration-300"
                                >
                                Lets Dive In
                            </button>
                        </div>
                        <img src="/reading1.jpg" className="w-full max-w-lg object-cover shadow-md rounded-lg" />
                    </div>
                </section>
                <section className="TopBlogs relative">
                    <div className="max-w-4xl mx-auto flex flex-col items-center text-center px-6 py-12">
                        <h1 className="text-3xl md:text-5xl font-semibold"> Enjoy The Most Explored Topics </h1>
                        <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-5">
                            {
                                famousTopics.map((topic, ind) => (
                                    <div className="">
                                        <h2 key={ind} className="text-xl font-bold my-4">{topic.title}</h2>
                                        <div className="relative group">
                                             <img src={topic.src} className="w-full max-w-sm object-cover shadow-md rounded-lg" />
                                             <button className="absolute text-orange-600 px-4 py-2 rounded-lg left-1/2 -translate-x-1/2 bottom-10 group-hover:bg-blue-400 group-hover:text-white group-hover:scale-105 transform-transition duration-300 ">{topic.title}</button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <footer className="relative ">
                    <div className="max-w-full flex flex-col justify-center py-6">
                        <div className="ml-5 mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                            {footerLinks.map((links, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col"
                                >
                                    <h3 className="sm:text-center font-bold mb-2" style={{ color: '#70767c' }}>{links.name}</h3>
                                    {
                                        links.fields.map((field, ind) => (
                                            <Link
                                                key={ind}
                                                to={'#'}
                                                className={clsx('sm:text-center mt-3 text-sm text-gray-800 font-bold hover:text-blue-700 transition-all duration-300')}>

                                                {field}
                                            </Link>
                                        ))
                                    }
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col text-center my-5">
                            <p className="text-sm text-gray-600 mb-2">+92 301 2707036, 042 9375214, 042 5423214 | raasblogs@gmail.com</p>
                            <p className="text-sm text-gray-600">Lahore 42000 | &copy; 2025 RaasBlogs for Public, Medical Education and Research. All Rights Reserved</p>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    )
}

export default Home