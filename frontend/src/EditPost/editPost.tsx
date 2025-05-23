import { useCallback, useEffect, useRef, useState } from "react";
import useFetchPost from './fetchingResources/fetchBlogPost.ts'
import {  useLocation, useNavigate } from "react-router-dom";
import EditContentImages from "../Components/contentSection/editContentImages.tsx";
import axios from "axios";
import { useAuthenContext, useBlogContext } from "../globalContext/globalContext.tsx";
import useFetchLocalData from "./fetchingResources/useFetchLocalData.ts";
import { VITE_API_URL } from "../config.ts";
import { FaSpinner } from "react-icons/fa";

interface PostData{
  _id:string,
  userId:string,
  title:string,
  titleImage:string,
  content:[{
    type:string,
    value:string
  }],
  contentImages:[{
    path:string,
    position:number,
    fileName:string,
    _id:string
  }],
  
}

interface LocalErrors {
  message:any
}
interface ErrorWithMsg{
  msg:string
}
interface ErrorCaught {
  response:{
    status?:number,
    data:{
      error?:string | ErrorWithMsg[],
      message?:string,
      name?:string,
      errors?:string | ErrorWithMsg
    }
    error?:string
  }
  request:any,
  message:string
}

interface ImagePositions {
  position:number,
  fileName:string
}
interface ContentImage{
  path?:string,
  position:number,
  fileName:string,
  preview?:string,
  _id:string,
  id:number,
  file?:File
}

interface EditPostData {
  title: string;
  titleImage: string | File; // Can be a string (URL) or a File object
  contentText: string;
  imagePreview: string;
}

interface SavedPic {
  path?:string,
  position:number,
  fileName:string
}
const EditPost = () => {
  
  const { loggedIn,loading,errorMessage, setErrorMessage } = useAuthenContext();
  const {allBlogsGlobally, filteredBlogs,setAllBlogsGlobally} = useBlogContext();
  const [cursorPosition, setCursorPosition] = useState(0);
  // const [newTitleImage, setNewTitleImage] = useState(false);
  const [editedSomething, setEditedSomething] = useState(false);
  const [contentImages, setContentImages] = useState<ContentImage[]>([]);
  const [repostedPost, setRepostedPost] = useState<boolean>(false);
  const moveTo = useNavigate();
  const isNavigatingBack = useRef(false);

  useEffect(() => {
    if (!loading && !loggedIn) {
      const moveToLogin = window.confirm(
        "token expired! please Login Again. Do you want to Login"
      );
      if (moveToLogin) {
        moveTo("/login");
      }
    }
  }, [loggedIn]);
  
  const [editPostData, setEditPostData] = useState<EditPostData>({
    title: "",
    titleImage: "",
    contentText: "",
    imagePreview: "",
  });

  const currentArea = useRef<HTMLTextAreaElement>(null);
  // const moveTo = useNavigate();
  const getState = useLocation();

  const postId = getState.state?.postId;
  const {post, errors} = useFetchPost(postId) as {post:PostData | null, errors:LocalErrors};

  const DEFAULT_POST: PostData = {
    _id: '',
    userId: '',
    title: '',
    titleImage: '',
    content:[{
      type:'',
      value:''
    }],
    contentImages:[{
      path:'',
      position:0,
      fileName:'',
      _id:''
    }],
  };

  const {postLoading, localPostData,receiveLocalImages} = useFetchLocalData(post || DEFAULT_POST);
  
  const selectCurrentSelection = () => {
    if(currentArea.current){
      setCursorPosition(currentArea.current.selectionStart);
    }
    
  };

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem("titleStorage");
    localStorage.removeItem("titleImagePreview");
    localStorage.removeItem("textContent");
    localStorage.removeItem("localContentImages");
  }, []);

  const confirmNavigation = useCallback(async () => {

    if (!editedSomething || isNavigatingBack.current) return true;

    const confirmed = window.confirm(
      "You have unsaved changes. Are you sure you want to leave?"
    );
    if (confirmed) {
      isNavigatingBack.current = true;
      clearLocalStorage();
      setEditedSomething(false);
    }

    return confirmed;
  }, [editedSomething, clearLocalStorage]);

  useEffect(() => {
    if(errorMessage || errors.message){
      window.scrollTo({
        top:0,
        behavior:'smooth'
      })
    }
  }, [errorMessage, errors.message])
  const handleNavigation = useCallback(
    async (link:string | number) => {
      console.log("runs handle Navigation");
      if (await confirmNavigation()) {
        if( typeof(link) === 'number'){
          moveTo(link);
        }
        if( typeof(link) === 'string'){
          moveTo(link);
        }
      }
    },
    [editedSomething, clearLocalStorage]
  );

  const windowLoads = useCallback(
    async (e:BeforeUnloadEvent) => {
      if (editedSomething) {
        clearLocalStorage();
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    },
    [editedSomething, clearLocalStorage]
  );

  useEffect(() => {
    window.addEventListener("beforeunload", windowLoads);
    return () => window.removeEventListener("beforeunload", windowLoads);
  }, [windowLoads]);

  // Convert and Store image as base 64
  
  useEffect(() => {
    // console.log("receiveLocalImages: ", receiveLocalImages, "localPostData: ", localPostData, 'EditPostData ', editPostData)
    if(receiveLocalImages?.length){
      setContentImages(receiveLocalImages);
    }
    if(localPostData?.title || localPostData.contentText){
      setEditPostData(prev => ({
        ...prev,
        title:localPostData.title || '',
        titleImage:localPostData.titleImage || '',
        contentText:localPostData.contentText || '',
        imagePreview: localPostData.imagePreview || '',
        })
      )
    }
  },[localPostData?.title, 
    localPostData?.titleImage, 
    localPostData?.contentText, 
    localPostData?.imagePreview])

  // localPostData, receivedLocalImages
  
  // store image as base64
  function storeAsBase64(file:File) {
    const Max_FileSize = 5 * 1024 * 1024;
    if(file.size > Max_FileSize){
      console.error("Image File is Too Large");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = function () {
      if(typeof reader.result === 'string')
      {
        localStorage.setItem("titleImagePreview", reader.result);
        setEditPostData((prev)=>{
          return {
            ...prev,
            imagePreview: reader.result as string,
          };
        });
      }else{
        console.error("failed to Read file as base64")
      }
    };
    reader.onerror = function () {
      console.error("Error reading file:", reader.error);
    };
    reader.readAsDataURL(file);
  }

  // Handle changes to the title input
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    localStorage.setItem("titleStorage", JSON.stringify(newTitle));
    // setNewTitleImage(true);
    setEditPostData((prev) => ({ ...prev, title: newTitle }));
    setEditedSomething(true);
  };

  // Handle changes to the title Image
  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (!image) return;
    localStorage.setItem("titleImage", JSON.stringify(image));
    setEditPostData((prev) => ({ ...prev, titleImage: image }));
    // setNewTitleImage(true);
    storeAsBase64(image);
    setEditedSomething(true);
  }

  // Managing text of the Post after Change

  const handleContentText = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const oldContentText = editPostData.contentText;
    let newContentText = e.target.value;

    // Check for accidental editing of placeholders
    const oldPlaceholders = oldContentText.match(/\[image-\d+\]/g) || [];
    const newPlaceholders = newContentText.match(/\[image-\d+\]/g) || [];

    // If any placeholder is removed, prevent it
    if (oldPlaceholders.length !== newPlaceholders.length) {
      alert("You cannot remove image placeholders directly!");
      setEditPostData((prev) => ({ ...prev, contentText: oldContentText }));
      return;
    }

    // Save valid content text
    setEditPostData((prev) => ({ ...prev, contentText: newContentText }));
    localStorage.setItem("textContent", JSON.stringify(newContentText));
    setEditedSomething(true);
  };

  // save content images using base64
  function saveContentImages(image:File, callback:(base64result:string) => void) {
    const reader = new FileReader();
    reader.onloadend = function () {
      if(typeof reader.result === 'string')
      callback(reader.result);
    };
    reader.readAsDataURL(image);
  }

  // handle changes to the content images
  const handleContentImages = (e:React.ChangeEvent<HTMLInputElement>) => {
    const newImage = e.target.files?.[0];

    if(!newImage) return ;
    const imageMark = `[image-${contentImages.length}]`;
    const beforeImage = editPostData.contentText.substring(0, cursorPosition);
    const afterImage = editPostData.contentText.substring(cursorPosition);
    const newContentText = beforeImage + imageMark + afterImage;
    setEditPostData((prev) => ({ ...prev, contentText: newContentText }));
    localStorage.setItem("textContent", JSON.stringify(newContentText));
    saveContentImages(newImage, (base64Result) => {
      const localImage = {
        _id:`tempId${Date.now()}`,
        id: contentImages?.length,
        fileName: newImage.name,
        file: newImage,
        preview: base64Result,
        position: cursorPosition,
      };
      const allImages = [...contentImages, localImage];

      localStorage.setItem("localContentImages", JSON.stringify(allImages));
      setContentImages(allImages);
      setEditedSomething(true);
    });
  };
  
  // removing the content Image
  const removeImage = (id:number, text:string) => {
    const newContentImages = contentImages.filter((image) => image.id !== id);
    let updatedText = text;
    if (!newContentImages.length) {
      updatedText = updatedText.split("[image-0]").join("");
      localStorage.setItem("textContent", JSON.stringify(updatedText));
      setEditPostData((prev) => ({ ...prev, contentText: updatedText }));
    }
    for (const [index, image] of newContentImages.entries()) {
      updatedText = updatedText
        .split(`[image-${image.id}]`)
        .join(`[image-${index}]`);
      localStorage.setItem("textContent", JSON.stringify(updatedText));
      setEditPostData((prev) => ({ ...prev, contentText: updatedText }));
    }
    const updateImages = newContentImages.map((image, index) => ({
      _id:`temp-id${Date.now()}`,
      id: index,
      preview: image.preview,
      fileName: image.fileName,
      position: image.position,
    }));
    setContentImages(updateImages);
    localStorage.setItem("localContentImages", JSON.stringify(updateImages));
    setEditedSomething(true);
  };

  // handle Reposting
  const handleReposting = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(!editedSomething){
      alert("You didn't Make any Change to Document");
      return;
    }
    const formData = new FormData();
    if (editPostData.titleImage instanceof File) {
      formData.append("titleImage", editPostData.titleImage);
    }
    formData.append("title", editPostData.title);
    if (editPostData.contentText) {
      const contentArray = [
        {
          type: "text",
          value: editPostData.contentText,
        },
      ];
      formData.append("newContent", JSON.stringify(contentArray));
    }
    let positions:ImagePositions[]=[];

    if (contentImages) {
      let savedPics:SavedPic[] = contentImages.filter((image) => !image.file)
      .map((pic) => ({
        path: pic.preview?.substring(22),
        position: pic.position,
        fileName: pic.fileName,
      }));
      formData.append("savedImages", JSON.stringify(savedPics));
      contentImages.forEach((image) => {

        if (image.file) {
          positions.push({
            position: image.position,
            fileName: image.fileName,
          });
          formData.append("contentImages", image.file);
        }
      });
    }
    formData.append("positions", JSON.stringify(positions));
    formData.append("titleImage", editPostData.titleImage);
    try {
      setRepostedPost(true)
      const response = await axios.put(
        `${VITE_API_URL}/weblog/updatedBlog/${post?._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/formD-data",
          },
        }
      );
      if (response?.data.success) {
        await axios.get(`${VITE_API_URL}/weblog/allBlogs`).
        then(response => setAllBlogsGlobally(response.data.blogs));;
        // console.log("respone of allBlogs EDITTT", totalPosts);
        setEditedSomething(false);
        localStorage.setItem(
          "titleImage",
          JSON.stringify(response.data.blog.titleImage)
        );
        localStorage.setItem(
          "titleStorage",
          JSON.stringify(response.data.blog.title)
        );
      }
      window.alert("Successfully Updated the Post");
      moveTo(-1)
      
      // setNewTitleImage(false);
    } catch (err:unknown) {
      if(isErrorCaught(err)){
        console.log("err received while updating: ", err);
        if(err.response?.status === 400){
          if(err.response?.data?.name === 'validationError'){
            if(Array.isArray(err.response?.data?.error)){
              const firstError = err.response.data.error[0];
              if(firstError && 'msg' in firstError){
                setErrorMessage(firstError.msg)
              }
            }
          }
          // Case 2: Single error message string
          if (typeof err.response?.data?.error === 'string') {
            setErrorMessage(err.response.data.error);
            return;
          }
          
          // Case 3: Error in data.message
          if (err.response?.data?.message) {
            setErrorMessage(err.response.data.message);
            return;
          }
          
          // Case 4: Generic error format
          if (err.response?.data?.errors) {
            const firstErrorKey = Object.keys(err.response.data.errors)[0];
            setErrorMessage(firstErrorKey);
            // setErrorMessage(err.response.data.errors[firstErrorKey].message);
            return;
          }
        }
        if (
          err.response?.data?.error === "jwt expired" ||
          err.response?.data?.message === "Unable to get Token Bearer"
        ) {
          const confirmMovingToLogin = window.confirm(
            "Your session has Expired! You are Logged Out"
          );
          if (confirmMovingToLogin) {
            moveTo("/login");
          }
        }
        
        if((err as ErrorCaught)?.request){
          setErrorMessage('Server error got while Reposting')
        }
        if((err as ErrorCaught)?.message){
          setErrorMessage((err as ErrorCaught).message)
        }
      }
      
    }finally{
      setRepostedPost(false);
    }
  };

  if (loading || postLoading) {
    return <h1>Loading the Post..</h1>;
  }
  function isErrorCaught(err:unknown): err is ErrorCaught {
    return (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      'request' in err &&
      'message' in err
    )
  }
  return (
    <div className="bg-gray-200 min-h-screen py-10">

    {(errors.message || errorMessage) && (
      <div className="max-w-5xl mx-auto mb-5">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{errorMessage || errors.message}</p>
        </div>
      </div>
    )}
    {repostedPost && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-5 flex items-center gap-3">
            <FaSpinner className="animate-spin text-purple-600" />
            <span className="text-lg font-medium text-gray-700">
              Reposting the Post, please wait...
            </span>
          </div>
        </div>
      }
      <div className="lg:max-w-5xl max-w-4xl bg-gray-800 rounded-lg shadow-lg mx-auto w-full p-5">
        <form method="post" className="space-y-2 flex my-5 flex-col">
          <label htmlFor="title" className="text-pink-600">
            Edit Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Edit the Title"
            className="border border-gray-500 w-100 m-0 p-0"
            onChange={(e) => handleChange(e)}
            value={editPostData.title}
          />

          <div>
            <label htmlFor="image" className="block text-pink-600">
              Change Title Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="titleImg"
              onChange={handleImageChange}
              className="w-[82px] my-2"
            />
            {editPostData.imagePreview && (
              <img
                src={editPostData.imagePreview}
                alt={editPostData.title}
                className="h-52 w-56"
              />
            )}
          </div>
          <label htmlFor="post Body" className="block text-pink-600">
            Post Body
          </label>
          <div className="relative">
            <textarea
              placeholder="start writing your Blog"
              ref={currentArea}
              name="value"
              className="border-gray-500 border w-full h-[350px] p-4 rounded:md"
              onChange={(e) => handleContentText(e)}
              onClick={selectCurrentSelection}
              onKeyUp={selectCurrentSelection}
              value={editPostData.contentText}
              required
            />
            <div className="absolute bottom-3 right-2 ">
              <label className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-full shadow-lg transition-all duration-300 cursor-pointer">
              <span className="text-sm"> Add Image</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleContentImages}
                className="hidden"
                id="contentImg"
              />
              </label>
            </div>
          </div>
          <div className="flex">
                        
              {contentImages &&              
              <EditContentImages contentImages={contentImages} removeImage={removeImage} contentText={editPostData?.contentText} />
              }
          </div>
        </form>

        <div className="">
          <button
            className="border p-2 bg-green-400 mb-4"
            onClick={(e) => handleReposting(e)}
          >
            {" "}
            RePost{" "}
          </button>

          <div>
            <button
              className="border p-2 bg-blue-400 mb-4 mr-4"
              onClick={() => handleNavigation(-1)}
            >
              {" "}
              Back{" "}
            </button>
            <button
              className="border p-2 bg-blue-400"
              onClick={() => handleNavigation("/")}
            >
              {" "}
              Back To HOME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;


