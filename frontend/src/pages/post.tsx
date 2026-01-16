import { useEffect, useState } from "react";
import { useAuthenContext, useBlogContext, useUIContext } from "../globalContext/globalContext.tsx";
import Image from "../Components/contentSection/titleImage.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TextContent from "../Components/contentSection/textContent.jsx";
import { FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import useFetchPost from "../Hooks/fetchPost.ts";
import useUserPrivileges from "../Hooks/ownerPrivileges.jsx";
import makeApiCall from "./makeApiCall.ts";
import clsx from "clsx";
import { VITE_API_URL } from "../config.ts";
import useConfirmDelete from "../../utils/useConfirmDelete.tsx";
import toast from "react-hot-toast";
import Comments from "./comment.tsx";

interface EditHandle {
  (e: React.MouseEvent<HTMLButtonElement>, postId: string): void;
}
interface DeleteHandle {
  (e: React.MouseEvent<HTMLButtonElement>, id: string): void;
}

interface ErrorResponse {
  response?: {
    data: {
      message: string,
      error?: string
    }
  },
  request?: any,
  message: string
}

interface RespReceived<T> {
  data: T,
  status: number
}

const BlogPost: React.FC = () => {
  const location = useLocation()
  const [deletedPost, setDeletedPost] = useState(false);
  const { setAllBlogsGlobally } = useBlogContext();
  const { setInHomePage } = useUIContext();
  const { currentUser, loggedIn, setErrorMessage, errorMessage, setLoading, setMyPosts, myPosts } = useAuthenContext();
  let { id } = useParams();
  const { ownerLoading, blogOwner, setBlogOwner } = useUserPrivileges(id);
  const page = location.state?.page;
  const { post, postLoading } = useFetchPost(id ?? '');
  const moveTo = useNavigate();
  useEffect(() => {
    setInHomePage(false);
    setErrorMessage("");
  }, []);




  const handleEdit: EditHandle = (e, postId) => {
    e.preventDefault();
    moveTo(`/editPost`, { state: { postId } });
  };
  const handleDelete: DeleteHandle = async (e, id) => {
    e.preventDefault();
    const confirmDeleteFun = useConfirmDelete();
    const confirm = await confirmDeleteFun("Are You sure to delete this Post. You won't be able to recover it!");
    // setLoading(true);
    const toastId = toast.loading("Deleting the post")
    const deletingPost = async () => {
      setBlogOwner(false);
      const url = `${VITE_API_URL}/weblog/deleteBlog/${id}`;
      const onSuccess = (response: RespReceived<{ success: boolean }>) => {
        if (response.data.success) {
          setDeletedPost(true);
          toast.success("Successfully Deleted the Blog", { id: toastId, duration: 3000 });
          const updatePosts = myPosts?.filter(post => post._id !== id) || [];
          setAllBlogsGlobally(updatePosts);
          setMyPosts(updatePosts)

          setBlogOwner(true);


          if (page) {
            moveTo(-1);
          } else {
            moveTo('/', { replace: true });
          }

        }
      }

      function onError(err: ErrorResponse) {
        if (err.response?.data?.error === 'jwt expired') {
          setErrorMessage('JWT Expired! Login Again');

        }
        else if (err.response?.data?.message) {
          setErrorMessage(err.response.data.message);
        }
        else if (err.request) {
          setErrorMessage("Not getting resposne from the server. Please Connect Again!")
        }
        else {
          setErrorMessage(err.message);
        }
        toast.error("error while Deleting the Blog", { id: toastId, duration: 3000 });
      }

      makeApiCall(setLoading, url, { method: 'DELETE' }, onSuccess, onError);
      setBlogOwner(true);
    };
    if (confirm) {
      deletingPost();
    }

  }
  useEffect(() => {
    if (!deletedPost) {
      if (!postLoading && !post._id) {
        moveTo('/notFound')
      }
    }

  }, [post, deletedPost])

  return (
    <>
      <div
        data-component="post-container"
        className={`w-full ${loggedIn ? "flex xs:flex-col sm:flex-row" : "w-full flex justify-center bg-gray-50"
          }`}
      >
        {errorMessage && <h2 className="mt-20">
          {errorMessage}
        </h2>
        }

        <div className="flex flex-col w-screen mt-20">
          {(postLoading || ownerLoading) ? (
            <div className="text-center">
              <FaSpinner className="animate-spin text-center inline text-xl font-bold" /> Loading
              the Post..
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto px-4 py-5 rounded:md shadow-lg bg-white mt-14">
              <div className="">
                <div key={post?._id} id={post?._id} className="r">
                  <h2 className="text-center w-4/5 text-2xl text-purple-600 font-medium p-5">
                    {" "}
                    {post?.title}{" "}
                  </h2>
                  {loggedIn && blogOwner && (
                    <div className="text-right flex justify-end gap-2 mb-2 w-[80%]">
                      <button onClick={(e) => handleEdit(e, post._id)} title="Edit" >
                        <FaEdit size={20} color="blue" className="hover:scale-105 transform-transition duration-200" />{" "}
                      </button>
                      <button title="Delete" onClick={(e) => handleDelete(e, post._id)}>
                        <FaTrash size={20} className="hover:scale-105 text-red-600 transform-transition duration-200" />{" "}
                      </button>
                    </div>
                  )}
                  <div className="flex justify-center ">
                    {post?.titleImage && (
                      <Image
                        postImg={post?.titleImage}
                        title={post?.title}
                        isFullView={true}
                      />
                    )}
                  </div>
                  <div className="flex md:justify-center">
                    {post._id &&
                      (
                        <TextContent
                          content={post?.content}
                          isFullView={true}
                          contentImages={post?.contentImages && post.contentImages.length > 0 ? post.contentImages : []}
                        />
                      )}
                  </div>
                  {post._id && (
                    <div className="w-full max-w-4xl mx-auto mb-8">
                      <Comments postId={post._id} />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center my-3">
                <div
                  className={`border-t-4 border-indigo-500 shadow-lg mb-4 ${loggedIn ? "w-[350px]" : "w-[350px]"
                    }`}
                ></div>
              </div>
              <div
                className={clsx(
                  "text-center mb-4 ",
                  loggedIn ? "w-full" : "w-4/5"
                )}
              >
                <button
                  onClick={() => moveTo(-1)}
                  className="bg-transparent text-gray-600 hover:text-blue-600 hover:underline mx-2"
                >
                  {" "}
                  Back{" "}
                </button>
                <button
                  onClick={() => moveTo("/")}
                  className="bg-transparent text-gray-700 hover:text-blue-600 hover:underline"
                >
                  Back To Home{" "}
                </button>
              </div>
            </div>
          )}
        </div>
        <div
          className={clsx("px-2 py-32 flex justify-right ml-auto", loggedIn ? "hidden md:w-[30vw] md:mt-16" : "w-0",
            "bg-white text-center relative hidden md:block",
            !loggedIn && "sm:hidden"
          )}
        >
          {currentUser ? (
            <>
              <h2 className="font-extrabold ">
                {" "}
                {currentUser.username && currentUser.username.length
                  ? `About ${currentUser.username.toUpperCase()}`
                  : "About"}
              </h2>
              <div className="flex justify-center">
                {currentUser.profileImg && (
                  <Image
                    postImg={currentUser.profileImg}
                    title={currentUser.username}
                  />
                )}
              </div>

              <h2 className="font-bold mt-4"> Goal</h2>
              {currentUser.goal && currentUser.goal.length ? (
                <h3> {currentUser.goal} </h3>
              ) : (
                <h3>Goal is Empty</h3>
              )}

              <h3 className="text-bold text-lg font-bold mt-4 text-center border-t border-blue-400">
                {" "}
                Interest{" "}
              </h3>
              <span className="border-t bodrer-blue-400"></span>

              {currentUser.TopicsInterested &&
                currentUser.TopicsInterested.length ? (
                currentUser.TopicsInterested.map((interest, index) => (
                  <h5 key={index}>{interest} </h5>
                ))
              ) : (
                <h3> interests are not Added</h3>
              )}
            </>
          ) : (
            <h2 className={`${!loggedIn ? 'hidden' : 'block'} `}> Loading..</h2>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPost;
