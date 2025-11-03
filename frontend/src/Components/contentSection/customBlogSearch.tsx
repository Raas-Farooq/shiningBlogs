import { useAuthenContext, useBlogContext, useUIContext } from "../../globalContext/globalContext";
import clsx from 'clsx';

const BlogSearchComponent = () => {
    const {setFilteredBlogs, setSearchValue, searchValue, setSearching, allBlogsGlobally} = useBlogContext();
    const {showMenu} = useUIContext();
    
     const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
            const blogSearch = e.target.value;
            setSearchValue(blogSearch);
            setSearching(true);
            if(!blogSearch){
                setSearching(false);
            }
            const filtered = allBlogsGlobally?.filter(blog => {
                if(blog.title.toString().toLowerCase().includes(blogSearch?.toString().toLowerCase())){
                    return blog;
                }
            })
            setFilteredBlogs(filtered);
        } 


    return (
        <div className="flex justify-center items-center mt-16 mb-6">
            <div className={clsx('w-full max-w-md  transition-all duration-300', 'w-full')}>
                    <input
                        type="search"
                        id="search"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder='Search Any Blog By Its Name'
                        className='w-full rounded border border-gray-300 px-3 py-1 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:border-orage-500 focus:ring-orange-600'
                    />
                </div>
        </div>
    )
    
}

export default BlogSearchComponent