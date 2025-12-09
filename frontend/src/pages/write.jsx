import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ContentImages from "../Components/contentSection/editContentImages.tsx";
import { BlogContextProvider, useAuthenContext, useBlogContext } from "../globalContext/globalContext";
import { Upload } from "lucide-react";
import { VITE_API_URL } from "../config.ts";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import useLoginConfirm from "../utils/useLoginConfirm.tsx";

export default function Write() {
  const [blogTitle, setBlogTitle] = useState({
    title: "",
    titleImg: null,
    imgPreview: "",
    titleImagePublicId:""
  });
  const moveTo = useNavigate();
  const currentTextArea = useRef(null);
  const { loggedIn, setErrorMessage, errorMessage } = useAuthenContext();
  const {setAllBlogsGlobally} = useBlogContext();
  const [cursorPosition, setCursorPosition] = useState(0);
  // const [titleErr, setTitleErr] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [contentText, setContentText] = useState("");
  const [imagesShortNames, setImagesShortNames] = useState([]);
  const [contentImages, setContentImages] = useState([]);
  const loginConfirm = useLoginConfirm();
  function smallText(text) {
    const joined = text.split(" ");

    const short = joined.slice(0, 3).join(" ");
    return short;
  }


  useEffect(() => {
    async function fetchLocalStorage(){
      try{
         const localContentStored = localStorage.getItem('localContent') || "";
        if(localContentStored){
          const updatedForm = JSON.parse(localContentStored);
          setContentText(updatedForm)
        }
          const localImageStored = localStorage.getItem('localTitleImage') || "";
        if(localImageStored){
          setBlogTitle(data => ({
            ...data,
            titleImg:localImageStored,
            imgPreview:localImageStored
          }))
        }
        const localTitleStored = localStorage.getItem('localTitle') || "";
        if(localTitleStored){
          setBlogTitle(data => ({
            ...data,
            title:localTitleStored
          }))
        }
        const localContentImagesStored = localStorage.getItem('localContentImages') || null;
        if(localContentImagesStored){
          const accessImages = JSON.parse(localContentImagesStored);
          setContentImages(accessImages);
        }
      }catch(err){
        console.error("error while fetching local data", err);
      }
     
    }
fetchLocalStorage()

  },[])

  useEffect(() => {
      localStorage.setItem('localContentImages', JSON.stringify(contentImages));
  },[contentImages])


  useEffect(() => {
   const loginCheck = async () => {
            if (!loggedIn) {
                const confirm = await loginConfirm("Your Login time has Expired. Please Login Again to continue");
                if (confirm) {
                    moveTo('/login', {state:{page:"write"}});
                    return;
                } else {
                    return;
                }
            }
        }
        loginCheck();
  }, [loggedIn, moveTo]);

  const handleTitles = (e) => {
    // const errors = checkValidation();
    setBlogTitle((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors.titleError) {
      errors.titleError = "";

      setErrors(errors);
    }
    localStorage.setItem('localTitle', e.target.value);
  };
  function handleAreaSelect() {
    setCursorPosition(currentTextArea.current.selectionStart);
  }
  async function uploadTitleImage(image){
    setBlogTitle((prev) => ({
      ...prev,
      imgPreview: URL.createObjectURL(image)
    }));
    const formData = new FormData();
    formData.append('image', image);
    const toastId = toast.loading(' Uploading Image on Cloudinary ');
    try{
      const uploadOnCloudinary= await axios.post(`${VITE_API_URL}/weblog/uploadOnCloudinary`, formData,
      {
        withCredentials:true,
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });
      if(uploadOnCloudinary.data.success){
        const imageLink = uploadOnCloudinary.data.cloudinary_link;
        const publicId = uploadOnCloudinary.data.public_id;
          setBlogTitle((prev) => ({
          ...prev,
          titleImg: imageLink,
          imgPreview: imageLink,
          titleImagePublicId:publicId
        }));
      toast.success('Successfully uploaded', {id:toastId})
      localStorage.setItem("localTitleImage", imageLink);
      }
    }
    catch(err){
       toast.error('caught error while uploading on Cloudinary', {id:toastId})
    }
    if (errors.titleImageError) {
      errors.titleImageError = "";
      setErrors(errors);
    }
  }
  const handleTitleImage = async (e) => {
    const image = e.target.files[0];
    if(image){
      if(image instanceof File){
        uploadTitleImage(image)
      }
      
    }

  };
  const handleContent = (e) => {
    const originalPlaceholders = contentText.match(/\[image-\d\]/g) || [];
    const currentContent = e.target.value;
    const placeholders = currentContent.match(/\[image-\d+\]/g) || [];
    if (originalPlaceholders.length !== placeholders.length) {
      alert("you can't remove the image placeholders manualy");
      return;
    }
    if (errors.textContentError) {
      errors.textContentError = "";
      setErrors(errors);
    }
    setContentText(e.target.value);
    localStorage.setItem("localContent", JSON.stringify(e.target.value))
  };

  const handleContentImage = async (e) => {
    const image = e.target.files[0];
    const shortName = smallText(image.name);

    const imageName = `[image-${contentImages.length}]`;
    const beforeImage = contentText.substring(0, cursorPosition);
    const afterImage = contentText.substring(cursorPosition);
    const newContent = beforeImage + imageName + afterImage;

    const imageData = new FormData();
    imageData.append('image', image);
    let cloudinaryUrl;
    let image_public_id;
    const toastId = toast.loading(' Uploading Image on Cloudinary ');
    try{
        const uploadingOnCloudinary= await axios.post(`${VITE_API_URL}/weblog/uploadOnCloudinary`, imageData,{
        withCredentials:true,
        headers:{
          "Content-Type":"multipart/form-data"
        }
       })
      if(uploadingOnCloudinary.data.success){

        cloudinaryUrl = uploadingOnCloudinary.data.cloudinary_link;
        image_public_id = uploadingOnCloudinary.data.public_id;
        toast.success('Successfully uploaded', {id:toastId})
      }
    }catch(err){

      toast.error('caught error while uploading on Cloudinary', {id:toastId})
    }
    setContentImages([
      ...contentImages,
      {
        id: contentImages.length,
        type: "ContentImage",
        path: cloudinaryUrl,
        public_id:image_public_id,
        fileName: shortName,
        position: cursorPosition,
      },
    ]);
    setContentText(newContent);
    localStorage.setItem("localContent", JSON.stringify(newContent));

  };

  const removeContentImage = (id, newText) => {
    const images = contentImages.filter((image) => image.id !== id);
    const updateImages = images.map((images, index) => ({
      ...images,
      id: index,
    }));
    setContentImages(updateImages);
    setContentText(newText);
    let updatedText = newText;
    images.forEach((img, ind) => {
      const oldMark = `[image-${img.id}]`;
      const newMark = `[image-${ind}]`;
      updatedText = updatedText.split(oldMark).join(newMark);
    });
    setContentText(updatedText);
    localStorage.setItem('localContent', JSON.stringify(updatedText));
  };

  const checkValidation = () => {
    const validationErrors = {};
    if (!blogTitle.title) {
      validationErrors.titleError = "Title is Missing";
    }
    if (blogTitle.title.length > 60) {
      validationErrors.titleError = "Title length Must be under 60";
    }

    if (!blogTitle.titleImg) {
      validationErrors.titleImageError = "You should Insert Title Image";
    }

    if (!contentText) {
      validationErrors.textContentError = "Blog Must have some Text Content";
    }
    return validationErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedIn) {
      const confirm = await loginConfirm("Your Login time has Expired. Please Login Again to continue");
      if (confirm) {
          moveTo('/login', {state:{page:"write"}});
          return;
      } else {
          return;
      }
    }
    const seeErrors = checkValidation();
    if (Object.keys(seeErrors).length > 0) {
      setErrors(seeErrors);
      alert("Some Necessary Data is Missing");
      return;
    } else {
      setErrors({});
      let contentArray = [
        {
          type: "text",
          value: contentText,
        },
      ];
      const blogData = new FormData();
      blogData.append("title", blogTitle.title);
      blogData.append("titleImage", blogTitle.titleImg);
      blogData.append("content", JSON.stringify(contentArray));
      blogData.append("public_id", blogTitle.titleImagePublicId)

      if (contentImages) {
        const imagesWithPositions = contentImages.map((img, index) => ({
          position: img.position,
          path: img.path,
          public_id:img.public_id,
          fileName:img.fileName,
          id:img.id 
        }));
        blogData.append("contentImages", JSON.stringify(imagesWithPositions));  
      }
      const toastId = toast.loading('Creating Your Blog..')
      setLocalLoading(true);
      try {
        const response = await axios.post(
          `${VITE_API_URL}/weblog/addBlog`,
          blogData,

          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "Accept":"application/json"
            },
          }
        );
      
        if (response.data.success) {
          blogTitle.title = "";
          blogTitle.imgPreview = "";
          setBlogTitle((prev) => ({
            ...prev,
            title: "",
            titleImg: "",
            imgPreview: "",
          }));
          localStorage.removeItem('localContent');
          localStorage.removeItem('localTitle');
          localStorage.removeItem('localTitleImage');
          setContentImages([]);
          setContentText("");
          setImagesShortNames([]);
          
          setAllBlogsGlobally(earlierBlogs => 
          (
            [...earlierBlogs, response.data.newBlog]
          )
          )
          
          toast.success("Blog Created. Success!", { id: toastId });
          moveTo("/");
        }
      } catch (err) {
        
        if (
          err.response?.data?.error === "jwt expired" ||
          err.response?.data?.message === "Unable to get Token Bearer"
        ) {
          const confirmMovingLogin = await loginConfirm()
          setErrorMessage(err?.response?.data.error);
          if (confirmMovingLogin) {
            moveTo("/login", {state:{page:"write"}});
          }
        }
        if(err?.request){
          setErrorMessage("Server Error got while creating new Blog")
        }
        else if(err?.message){
          setErrorMessage(err.message)
        }
        else{
          setErrorMessage(err);
        }
         toast.error(errorMessage, { id: toastId });
      } finally {
        setLocalLoading(false);
      }
     
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen py-10 mt-10">
      <div className="bg-white shadow-md rounded:lg px-6 py-8 w-full mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold md:text-4xl text-center text-orange-600"> Your Shinning Post</h2>
        {/* {errorMessage && <h2 className="text-red-500"> *{errorMessage} </h2>}  */}
        <form method="post" className="space-y-3 flex flex-col">
          <label htmlFor="title" className="text-gray-600 font-medium">
            {" "}
            Enter your title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter the Title of Post "
            className="border border-gray-500 px-4 py-2 max-w-md rounded-md placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-800 transition-all"
            onChange={handleTitles}
            value={blogTitle.title}
            required
          />
          <span className="text-xs">
            {" "}
            *Title Length Must Not Exceed 60 characters
          </span>
          {errors.titleError && (
            <p className="text-red-600"> {errors.titleError}* </p>
          )}
          <label htmlFor="titleImage" className="cursor-pointer placeholder:text-gray-500 w-fit border border-gray-500 rounded-lg px-4 py-2 hover:bg-blue-100 hover:text-blue-700">
            Upload Image
          </label>
          <input
            type="file"
            name="titleImg"
            id="titleImage"
            accept="image/*"
            onChange={handleTitleImage}
            className="hidden"
          />
          {blogTitle && blogTitle.imgPreview ? (
            <img src={blogTitle.imgPreview} className="w-full max-w-xs max-h-60" />
          ) : (
            ""
          )}
          {errors.titleImageError && (
            <p className="text-red-600 font-larger">
              {" "}
              {errors.titleImageError}*{" "}
            </p>
          )}

          <label htmlFor="titleImage" className="text-gray-600 font-medium w-fit">
            Start Writing Your Post Content
          </label>
          <div className="relative">
          {errors.textContentError && (
            <p className="text-red-600 font-larger absolute top-2 right-2">
              {" "}
              {errors.textContentError}*{" "}
            </p>
          )}
            <textarea
              placeholder="start writing your Blog"
              ref={currentTextArea}
              name="value"
              className="border-gray-500 border w-full h-[350px] p-4 rounded-md placeholder:text-gray-500"
              onChange={handleContent}
              onClick={handleAreaSelect}
              onKeyUp={handleAreaSelect}
              value={contentText}
              required
            />
  
            <div
              className="absolute bottom-4 right-4 "
              >
              <label htmlFor="contentImg" className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 cursor-pointer">
                <span className="text-sm ">Add Image</span>
                <input   
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleContentImage}
                  id="contentImg"
                  className="hidden"
                />
              </label>
            </div>
            
          </div>
          {contentImages?.length > 0 && (
              <ContentImages
                contentImages={contentImages}
                removeImage={removeContentImage}
                contentText={contentText}
              />
            )}
          
          <button
            type="submit"
            disabled={localLoading}
            onClick={handleSubmit}
            className={`${localLoading? 'cursor-pointer-none bg-gray-400 w-fit p-2': 'border rounded-md border-blue-400 text-white bg-blue-500 transition-colors duration:400 hover:bg-blue-600 w-fit p-2' }`}
          >
            Publish Post
          </button>
        </form>
        <button className="mt-3">
          <Link to={"/"} className="text-gray-600 hover:text-gray-900">
            {" "}
            Back To Home
          </Link>
        </button>
      </div>

      
    </div>
  );
}




// {`${
//   blogTitle.imgPreview
//     ? "absolute top-[38%] lg:right-64 md:right-32 xs:right-20"
//     : "absolute top-[35%] xs:right-20 md:right-32 lg:right-64"
    
// } ${contentImages.length > 0 && 'absolute top-[30%]'}`}