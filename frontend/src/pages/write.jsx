import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ContentImages from "../Components/contentSection/editContentImages.tsx";
import { BlogContextProvider, useAuthenContext, useBlogContext } from "../globalContext/globalContext";
import { Upload } from "lucide-react";
import { VITE_API_URL } from "../config.ts";
import { FaSpinner } from "react-icons/fa";

export default function Write() {
  const [blogTitle, setBlogTitle] = useState({
    title: "",
    titleImg: null,
    imgPreview: "",
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
  const [loadingCloudinaryUpload, setLoadingCloudinaryUpload] = useState(false);
  const [contentImages, setContentImages] = useState([]);

  function smallText(text) {
    const joined = text.split(" ");

    const short = joined.slice(0, 3).join(" ");
    return short;
  }


  useEffect(() => {
    if (!loggedIn) {
      const moveToLoginPage = window.confirm(
        "you are logged out. please Login Again and Write Your Post"
      );
      console.log("moveToLogIn result: ", moveToLoginPage);
      if (moveToLoginPage) {
        moveTo("/login");
      } else {
      }
    }
  }, [loggedIn, moveTo]);

  const handleTitles = (e) => {
    // const errors = checkValidation();
    setBlogTitle((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors.titleError) {
      errors.titleError = "";

      setErrors(errors);
    }
  };
  function handleAreaSelect() {
    setCursorPosition(currentTextArea.current.selectionStart);
  }
  const handleTitleImage = async (e) => {
    const image = e.target.files[0];
    // console.log("image when submitting: files[0]", image);
    setBlogTitle((prev) => ({
      ...prev,
      imgPreview: URL.createObjectURL(image)
    }));
    const formData = new FormData();
    formData.append('image', image);
    try{
      setLoadingCloudinaryUpload(true);
      const uploadOnCloudinary= await axios.post(`${VITE_API_URL}/weblog/uploadOnCloudinary`, formData,
      {
        withCredentials:true,
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });
      console.log("frontend response of uploadOnCloudinary: ", uploadOnCloudinary);
      const imageLink = uploadOnCloudinary.data.cloudinary_link;
      setBlogTitle((prev) => ({
      ...prev,
      titleImg: imageLink,
      imgPreview: imageLink
    }));
    }catch(err){
      console.log("frontend error while uploading on Cloudinary: ", err.message);
    }
    finally{
      setLoadingCloudinaryUpload(false);
    }
    
    if (errors.titleImageError) {
      errors.titleImageError = "";
      setErrors(errors);
    }
  };
  const handleContent = (e) => {
    const originalPlaceholders = contentText.match(/\[image-\d\]/g) || [];
    const currentContent = e.target.value;
    const placeholders = currentContent.match(/\[image-\d+\]/g) || [];
    if (originalPlaceholders.length !== placeholders.length) {
      alert("you can't remove the image placeholders manualy");
      // console.log("you deleted the placeholder");
      return;
    }
    if (errors.textContentError) {
      errors.textContentError = "";
      setErrors(errors);
    }
    setContentText(e.target.value);
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
    try{
        setLoadingCloudinaryUpload(true);
        const uploadingOnCloudinary= await axios.post(`${VITE_API_URL}/weblog/uploadOnCloudinary`, imageData,{
        withCredentials:true,
        headers:{
          "Content-Type":"multipart/form-data"
        }
       })
      if(uploadingOnCloudinary.data.success){
        cloudinaryUrl = uploadingOnCloudinary.data.cloudinary_link;
        image_public_id = uploadingOnCloudinary.data.public_id;
      }
    }catch(err){
      console.log("this is the err: ", err);
    }finally{
      setLoadingCloudinaryUpload(false);
    }
    setContentImages([
      ...contentImages,
      {
        id: contentImages.length,
        type: "ContentImage",
        path: cloudinaryUrl,
        public_id:image_public_id,
        fileName: shortName,
        preview: URL.createObjectURL(image),
        position: cursorPosition,
      },
    ]);
    setContentText(newContent);
    // console.log("content inside handle Image: ", contentImages.length);
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
      // console.log(`oldMark ${oldMark} & newMark ${newMark}`);
      updatedText = updatedText.split(oldMark).join(newMark);
    });

    // console.log("updateImages: ", updateImages);
    setContentText(updatedText);
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
    const seeErrors = checkValidation();
    if (Object.keys(seeErrors).length > 0) {
      // setLocalLoading(false);
      setErrors(seeErrors);
      alert("Some Necessary Data is Missing");
      return;
    } else {
      setLocalLoading(true);
      setErrors({});
      // setLoadingErr(true);
      let contentArray = [
        {
          type: "text",
          value: contentText,
        },
      ];
      const blogData = new FormData();
      console.log("blogTitle before appending: ", blogTitle.title.length, "type: ", typeof(blogTitle.title));
      blogData.append("title", blogTitle.title);
      blogData.append("titleImage", blogTitle.titleImg);
      blogData.append("content", JSON.stringify(contentArray));
// why not we Stringifying the titleImage whereas we are doing on others?
      if (contentImages) {
        const imagesWithPositions = contentImages.map((img, index) => ({
          position: img.position,
          path: img.path,
          public_id:img.public_id,
          fileName:img.fileName
        }));
        blogData.append("contentImages", JSON.stringify(imagesWithPositions));
        blogData.forEach(function(value,key){
          console.log("key ", key, " value; typeof", (value));
        })
        
      }

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
          // alert("response is successfull ");
          console.log("response.data.newBlog: ", response.data.newBlog);
          blogTitle.title = "";
          blogTitle.imgPreview = "";
          setBlogTitle((prev) => ({
            ...prev,
            title: "",
            titleImg: "",
            imgPreview: "",
          }));
          setContentImages([]);
          setContentText("");
          setImagesShortNames([]);
          
          setAllBlogsGlobally(earlierBlogs => 
          (
            [...earlierBlogs, response.data.newBlog]
          )
          )
          alert("Blog Created Successfully");
          moveTo("/");
        }
      } catch (err) {
        console.log("only Error: ", err)
        if (
          err.response?.data?.error === "jwt expired" ||
          err.response?.data?.message === "Unable to get Token Bearer"
        ) {
          const confirmMovingLogin = window.confirm(
            "you Are Logged Out! please login and Come Again."
          );
          setErrorMessage(err?.response?.data.error);
          if (confirmMovingLogin) {
            moveTo("/login");
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
      } finally {
        setLocalLoading(false);
      }
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="bg-white shadow-md rounded:lg px-6 py-8 w-full mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-purple-600"> Your Shinning Post</h2>
        {loadingCloudinaryUpload && 
          <div className="fixed inset-0 z-50 flex justify-center bg-black items-center bg-opacity-50">
            <div className="bg-white text-black shadow-lg flex items-center p-5 rounded-lg ">
              <FaSpinner className="animate-spin text-purple-600" />
              <span className="text-black font-lg">
                UPloading Image on Cloudinary
              </span>
              </div>
          </div>
          }
        {errorMessage && <h2> {errorMessage} </h2>} 
        {localLoading && 
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-5 flex items-center gap-3">
              <FaSpinner className="animate-spin text-purple-600" />
              <span className="text-lg font-medium text-gray-700">
                Creating the Post, please wait...
              </span>
            </div>
          </div>}

        <form method="post" className="space-y-3 flex flex-col">
          <label htmlFor="title" className="text-pink-600">
            {" "}
            Enter your title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter the Title of Post "
            className="border border-gray-500 w-100 rounded-md placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
          <label htmlFor="titleImage" className="text-pink-600">
            Upload Your Title Image
          </label>
          <input
            type="file"
            name="titleImg"
            accept="image/*"
            onChange={handleTitleImage}
            className="w-[103px] cursor-pointer rounded-md placeholder:text-gray-500"
          />
          {blogTitle && blogTitle.imgPreview ? (
            <img src={blogTitle.imgPreview} className="w-24 h-24 " />
          ) : (
            ""
          )}
          {errors.titleImageError && (
            <p className="text-red-600 font-larger">
              {" "}
              {errors.titleImageError}*{" "}
            </p>
          )}

          <label htmlFor="titleImage" className="text-pink-600 w-fit">
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
              <label htmlFor="contentImg" className="flex items-center bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full shadow-lg transition-all duration-300 cursor-pointer">
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
          {contentImages.length > 0 && (
              <ContentImages
                contentImages={contentImages}
                removeImage={removeContentImage}
                contentText={contentText}
              />
            )}
          
          <button
            type="submit"
            onClick={handleSubmit}
            className="border rounded-md border-blue-400 bg-blue-400 transition-colors duration:400 hover:bg-blue-600 w-fit p-2"
          >
            Publish Post
          </button>
        </form>
        <button>
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