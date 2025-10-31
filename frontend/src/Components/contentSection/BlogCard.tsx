

import PostImage from "./titleImage.tsx";
import TextContent from "./textContent.tsx";
import Title from "./Title.jsx";
import { useBlogContext } from "../../globalContext/globalContext";
import { useEffect } from "react";

interface Blog{
  _id:string,
  userId:string,
  title:string,
  titleImage:string,
  public_id:string,
  content:[],
  contentImages:[],
  createdAt:string,
  updatedAt:string
}


interface BlogCardProps{
  blog:Blog,
  handlePostClick:(e:React.MouseEvent<HTMLElement>, post:Blog) => void,
  filtering:boolean
}
const BlogCard:React.FC<BlogCardProps> = ({ blog, handlePostClick }) => {
  // eslint-disable-next-line no-unused-vars
  const { allBlogsGlobally, searching } = useBlogContext();

  useEffect(() => {
      console.log("BlogsCount: ", allBlogsGlobally)
    }
  ,[])


  return (
    <article
      onClick={(e) => {
          handlePostClick(e, blog)  
      }}
      className="flex flex-col items-center cursor-pointer p-4 rounded-lg transition-all duration-300 hover:scale-105
      shadow-md hover:shadow-xl bg-white
      max-w-sm w-full"
    >
      <h2 className="text-center text-base sm:text-lg font-medium mb-4">
        <Title title={blog.title} />
      </h2>
      <PostImage postImg={blog.titleImage} title={blog.title} />
      <TextContent content={blog.content} isFullView={false} contentImages={blog?.contentImages} />
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg 
        hover:bg-blue-600 transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={(e) => handlePostClick(e, blog)}
      >
        Read More
      </button>
    </article>
  );
};


export default BlogCard