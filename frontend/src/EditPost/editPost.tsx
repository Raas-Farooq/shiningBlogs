import { useCallback, useEffect, useRef, useState } from "react";
import useFetchPost from './fetchingResources/fetchBlogPost.ts'
import {  useLocation, useNavigate } from "react-router-dom";
import EditContentImages from "../Components/contentSection/editContentImages.tsx";
import axios from "axios";
import { useAuthenContext, useBlogContext } from "../globalContext/globalContext.tsx";
import useFetchLocalData from "./fetchingResources/useFetchLocalData.ts";
import { VITE_API_URL } from "../config.ts";
import { FaSpinner } from "react-icons/fa";
import {ObjectId} from 'bson';


interface PostData{
  _id:string,
  userId:string,
  title:string,
  titleImage:string,
  public_id:string,                               
  content:[{
    type:string,
    value:string
  }],
  contentImages:[{
    id:number,
    public_id?:string,
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
  path:string,
  public_id?:string,
  position:number,
  fileName:string,
  _id:string,
  id:number,
  file?:File
}

interface EditPostData {
  title: string;
  titleImage: string; // Can be a string (URL) or a File object
  public_id:string,
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
  const {setAllBlogsGlobally} = useBlogContext();
  const [uploadingOnCloudinary, setUploadingOnCloudinary] = useState(false);
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
    public_id:'',
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
    public_id:'',
    content:[{
      type:'',
      value:''
    }],
    contentImages:[{
      path:'',
      position:0,
      fileName:'',
      _id:'',
      id:0
    }],
  };

  const {postLoading, localPostData,receiveLocalImages} = useFetchLocalData(post || DEFAULT_POST);
  
  const selectCurrentSelection = () => {
    if(currentArea.current){
      setCursorPosition(currentArea.current.selectionStart);
    }
    
  };

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem("localTitle");
    localStorage.removeItem('localPublic_id');
    localStorage.removeItem("localTitleImage");
    localStorage.removeItem("localContent");
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
    if(receiveLocalImages?.length){
      setContentImages(receiveLocalImages);
    }else{
      if(post?.contentImages){
         setContentImages(post?.contentImages);
      }
     
    }
    if(localPostData?.title || localPostData.contentText){
      setEditPostData(prev => ({
        ...prev,
        title:localPostData.title || '',
        titleImage:localPostData.titleImage || '',
        contentText:localPostData.contentText || '',
        imagePreview: localPostData.imagePreview || '',
        public_id:localPostData.public_id || ''
        })
      )
    }
  },[localPostData?.title, 
    localPostData?.titleImage, 
    localPostData?.contentText, 
    localPostData?.imagePreview,
  post,
  localPostData?.public_id])


  // Handle changes to the title input
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    localStorage.setItem("localTitle", (newTitle));
    // setNewTitleImage(true);
    setEditPostData((prev) => ({ ...prev, title: newTitle }));
    setEditedSomething(true);
  };

  // Handle changes to the title Image
  const handleImageChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
    let image = e.target.files?.[0];
    if(!image) 
      {
        console.warn("no file seleted");
        return;
      }    

      try{
          const previewImageLink = URL.createObjectURL(image);
          setEditPostData((prev) => (
          { 
            ...prev,
            titleImage:'',
            imagePreview:previewImageLink
          }
        ))
      }
      catch(err){
        console.warn('got error while creating ObjectURL ', err);
      }
      setUploadingOnCloudinary(true);
      
    try{
      if(editPostData?.public_id){
        try{
          await axios.delete(`${VITE_API_URL}/weblog/removeCloudinaryImage`, {
            withCredentials:true,
              data: {public_id:editPostData.public_id}
          })
        }
        catch(err){
          console.log("error while removing data",err)
        }
      }
      const formData = new FormData();
      formData.append("image", image);
      const response = await axios.post(`${VITE_API_URL}/weblog/uploadOnCloudinary`, formData, {
        withCredentials:true,
        headers:{
          "Content-Type":"multipart/form-data"
        }
      })
      if(response?.data.success){
          
          setEditPostData((prev) => (
            { ...prev, 
              titleImage: response.data.cloudinary_link,
              public_id:response.data.public_id 
            }));
            
          // setNewTitleImage(true);
        }
    }
    catch(err){
      console.error("cloudinary upload error: ", err);
    }finally{
      setUploadingOnCloudinary(false);
    }

      
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
    localStorage.setItem("localContent", JSON.stringify(newContentText));
    setEditedSomething(true);
  };

 

  // handle changes to the content images
  const handleContentImages = async (e:React.ChangeEvent<HTMLInputElement>) => {
    const newImage = e.target.files?.[0];
    if(!newImage) return ;
    const imageMark = `[image-${contentImages.length}]`;
    const beforeImage = editPostData.contentText.substring(0, cursorPosition);
    const afterImage = editPostData.contentText.substring(cursorPosition);
    const newContentText = beforeImage + imageMark + afterImage;
    setEditPostData((prev) => ({ ...prev, contentText: newContentText }));
    localStorage.setItem("localContent", JSON.stringify(newContentText));
    const formImage = new FormData();
    formImage.append('image', newImage);
     try{
      setUploadingOnCloudinary(true);
       const response = await axios.post(`${VITE_API_URL}/weblog/uploadOnCloudinary`, formImage,
        {
          withCredentials:true,
          headers:{
            'Content-Type':"multipart/form-data"
          }
        }
       )
        const imageLink = response.data.cloudinary_link;
        const publicId = response.data.public_id;
         const localImage = {
        _id:new ObjectId().toHexString(),
        id: contentImages?.length,
        fileName: newImage.name,
        public_id: publicId,
        path:imageLink,
        file: newImage,
        position: cursorPosition,
      };
      const allImages = [...contentImages, localImage];

      localStorage.setItem("localContentImages", JSON.stringify(allImages));
      setContentImages(allImages);
      setEditedSomething(true);
     }catch(err){
      console.log("error while uploading on Cloudinary: ", err);
     }
     finally{
      setUploadingOnCloudinary(false)
     }
    
  };
  
  // removing the content Image
  const removeImage = async(id:number, text:string) => {
    const newContentImages = contentImages.filter((image) => image.id !== id);
    setContentImages(newContentImages);
    let public_id;
    for (let image of contentImages){
      if(image.id === id){
        public_id = image.public_id;
      }
    }
    if(public_id){
      try{
        const deleteImage = await axios.delete(`${VITE_API_URL}/weblog/removeCloudinaryImage`, {
          withCredentials:true,
            data: {public_id:public_id}
        })
        console.log("Image Deletion ", deleteImage)
        }
        catch(err){
          console.log("error while removing data",err)
        }
    }
    
    let updatedText = text;
    if (!newContentImages.length) {
      updatedText = updatedText.split("[image-0]").join("");
      localStorage.setItem("localContent", JSON.stringify(updatedText));
      setEditPostData((prev) => ({ ...prev, contentText: updatedText }));
    }
    for (const [index, image] of newContentImages.entries()) {
      updatedText = updatedText
        .split(`[image-${image.id}]`)
        .join(`[image-${index}]`);
      localStorage.setItem("localContent", JSON.stringify(updatedText));
      setEditPostData((prev) => ({ ...prev, contentText: updatedText }));
    }
    const updateImages = newContentImages.map((image, index) => ({
      _id:new ObjectId().toHexString(),
      id: index,
      path: image.path,
      fileName: image.fileName,
      position: image.position,
      public_id:image.public_id,

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
    // if (editPostData.titleImage instanceof File) {
    //   formData.append("titleImage", editPostData.titleImage);
    // }
    // formData.append('titleImage', editPostData.titleImage);
    formData.append("title", editPostData.title);
    formData.append('public_id', editPostData.public_id);
    if (editPostData.contentText) {
      const contentArray = [
        {
          type: "text",
          value: editPostData.contentText
        },
      ];
      formData.append("newContent", JSON.stringify(contentArray));
    }

    if (contentImages) {
        formData.append("contentImages", JSON.stringify(contentImages));
    }
    formData.append("titleImage", editPostData.titleImage);
    try {
      setRepostedPost(true)
      const response = await axios.put(
        `${VITE_API_URL}/weblog/updatedBlog/${post?._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data.success) {
        await axios.get(`${VITE_API_URL}/weblog/allBlogs`).
        then(response => setAllBlogsGlobally(response.data.blogs));;
        setEditedSomething(false);
        localStorage.setItem(
          "localTitleImage",
          JSON.stringify(response.data.blog.titleImage)
        );
        localStorage.setItem(
          "localTitle",
          JSON.stringify(response.data.blog.title)
        );
      }
      window.alert("Successfully Updated the Post");
      moveTo(-1)
      
      // setNewTitleImage(false);
    } catch (err:unknown) {
      if(isErrorCaught(err)){
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
    {uploadingOnCloudinary && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-5 flex items-center gap-3">
            <FaSpinner className="animate-spin text-purple-600" />
            <span className="text-lg font-medium text-gray-700">
              Uploading on Cloudinary, please wait...
            </span>
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
            className="border border-gray-500 w-full max-w-md px-3 py-2 "
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
            {editPostData.titleImage ? (
              <img
                src={editPostData.titleImage}
                alt={editPostData.title}
                className="w-full max-w-md object-fit rounded-lg h-full max-h-sm"
              />
            ): (
              <img
                src={editPostData.imagePreview}
                alt={editPostData.title}
                className="w-full max-w-md object-fit rounded-lg h-full max-h-sm"
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
              <label className="px-4 py-2 bg-pink-500 text-gray-700 hover:bg-pink-400 rounded-full shadow-lg transition-all duration-300 cursor-pointer">
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
              {contentImages.length > 0 &&    
              <>
              <EditContentImages contentImages={contentImages} removeImage={removeImage} contentText={editPostData?.contentText} />
              </>          
              
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


