import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Image from "../Components/contentSection/titleImage";
import TextContent from "../Components/contentSection/textContent";
import ContentImages from "../Components/contentSection/ContentImage";
import axios from "axios";
import { debounce } from "lodash";
import { useGlobalContext } from "../globalContext/globalContext";

const EditPost = () => {
  const {loggedIn,setLoggedIn} = useGlobalContext();
  const [cursorPosition, setCursorPosition] = useState(0);
  const [newTitleImage, setNewTitleImage] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);
  const [errors, setErrors] = useState({})
  const [editedSomething, setEditedSomething] = useState(false);
  const [fetchedPost, setFetchedPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const moveTo = useNavigate();
  const isNavigatingBack = useRef(false);

  useEffect(() => {
    if(!loggedIn){
     const moveToLogin = window.confirm('token expired! please Login Again. Do you want to Login');
      if(moveToLogin){
        moveTo('/login')
      }
    }
  },[loggedIn])
  const [editPostData, setEditPostData] = useState({
    title: "",
    titleImage: null,
    contentText: "",
    imagePreview: "",
  });
  const isNavigatingRef = false;
  const navigatingAttemptCount = useRef(false);

  const [contentImages, setContentImages] = useState([]);
  const currentArea = useRef(null);
  // const moveTo = useNavigate();
  const getState = useLocation();

  const postId = getState.state?.postId;

  const selectCurrentSelection = () => {
    setCursorPosition(currentArea.current.selectionStart);
  };

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem("titleStorage");
    localStorage.removeItem("titleImagePreview");
    localStorage.removeItem("textContent");
    localStorage.removeItem("localContentImages");
  }, []);

  const confirmNavigation = useCallback(async () => {
    console.log("runs confirmNavigation");
    if (!editedSomething || isNavigatingBack.current) return true;

    const confirmed = window.confirm(
      "You have unsaved changes. Are you sure you want to leave?"
    );
    if (confirmed) {
      isNavigatingBack.current = true;
      clearLocalStorage();
      setEditedSomething(false);
    }
    console.log(
      "confirmed value inside confirmNavigation: ",
      confirmNavigation
    );
    return confirmed;
  }, [editedSomething, clearLocalStorage]);

  const handleNavigation = useCallback(
    async (link) => {
      console.log("runs handle Navigation");
      if (await confirmNavigation()) {
        moveTo(link);
      }
    },
    [editedSomething, clearLocalStorage]
  );

  const windowLoads = useCallback(
    async (e) => {
      console.log("beforeUnload Running like Cheetah");
      // console.log("edited Something", editedSomething);
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
  const fetchImageAsBase64 = useCallback(async (image) => {
    try {
      const response = await fetch(`http://localhost:4100/${image}`);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          localStorage.setItem("titleImagePreview", reader.result);
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("err while converting server image to buffer", err);
      return null;
    }
  });

  useEffect(() => {
    console.log("post Id EditPost newly UseEffect: ", postId);
    async function getPost() {
      
     if(!postId){
        setLoading(false);
        return;
     }
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:4100/weblog/getBlogPost/${postId}`
        );

        console.log("Response: while getting Post", response);
        setPost(response.data.blogPost);
      } catch (err) {
        console.error("error while getting the post ", err);
        setErrors({
            message:"Post is not Loading, you are either logged out or internet connection err. Plz check & Try Again!!"
        })
        setLoading(false);
      } 
    }
    getPost();
  }, [postId]);


    useEffect(() => {
        console.log("post Id received at editPost: ", post);
        // async function getPost(){
        //     const response = await axios.get(`http://localhost:4100/weblog/`)
        // }
        // Assign Title
        console.log("Post of the year ", post);
        async function loadInitialData(){
            if(!post){
                setLoading(true);
                return
            }
            try{
                const titleStored = JSON.parse(localStorage.getItem('titleStorage'));
                // console.log('post title: initialLoad: ', post.title);
                // console.log('titleStred:initialLoad ', titleStored);
                const newTitle = post?.title && !titleStored ? post.title : titleStored; 
                
                // console.log('newTitle assigned: initialLoad', newTitle);
                // Uploading Title Image
                const titleImage = localStorage.getItem('titleImagePreview');
                let newImagePreview = titleImage;
                if(post?.titleImage && !titleImage){ 
                    newImagePreview = await fetchImageAsBase64(post.titleImage)
                }

                localStorage.setItem('titleImage', post?.titleImage);
                // console.log("new title image on initial load: ", newImagePreview);

                // load Save content Text (Text Data of Post)
                const localContentText = JSON.parse(localStorage.getItem('textContent'));
                // console.log('localContentText:initialLoad ',localContentText);
                const newContentText = post?.content && !localContentText ? post.content.find((content) => content.type === 'text')?.value || '' : localContentText;
                // console.log('New Content Text initial load: ', newContentText);
                setEditPostData((prev) => ({
                    ...prev,
                    title:newTitle || '',
                    titleImage:post.titleImage || '',
                    imagePreview:newImagePreview || '',
                    contentText:newContentText || ''
                }))

              // load content Images
               if(post?.contentImages){
                    let localContentImages = JSON.parse(localStorage.getItem('localContentImages')) || [];
                    // console.log("localContentImages on initial load: ", localContentImages, " post.contentImages: ", post.contentImages);
                    if (post?.contentImages && localContentImages.length === 0){
                        // console.log("contentImages: if local is empty", post.contentImages);
                        const newImages = post.contentImages.map((image, index) => ({
                            id:index,
                            fileName:image.fileName,
                            preview:image.path.startsWith('http://') ? image.path : `http://localhost:4100/${image.path}`,
                            position:image.position
                        }))
                        setContentImages(newImages);
                        localStorage.setItem("localContentImages", JSON.stringify(newImages))
                    }
                    else{
                        setContentImages(localContentImages);
                    }
                    
                }
            }
            catch(err){
                console.error("Error while receiving post", err)
            }
            finally{
                setLoading(false)
            }
        } 
        
        loadInitialData();
  },[post])
  // store image as base64
  function storeAsBase64(file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      localStorage.setItem("titleImagePreview", reader.result);
      setEditPostData((prev) => {
        return {
          ...prev,
          imagePreview: reader.result,
        };
      });
    };

    reader.readAsDataURL(file);
  }

  // Handle changes to the title input
  const handleChange = ((e) => {
    const newTitle = e.target.value;
    console.log("new Title: ", e.target.value);
    localStorage.setItem("titleStorage", JSON.stringify(newTitle));
    setNewTitleImage(true);
    setEditPostData((prev) => ({ ...prev, title: newTitle }));
    setEditedSomething(true);
  });

  // Handle changes to the title Image
  function handleImageChange(e) {
    const image = e.target.files[0];
    if (!image) return;
    localStorage.setItem("titleImage", JSON.stringify(image));
    setEditPostData((prev) => ({ ...prev, titleImage: image }));
    setNewTitleImage(true);
    storeAsBase64(image);
    setEditedSomething(true);
  }

  // Managing text of the Post after Change

  const handleContentText = (e) => {
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
  function saveContentImages(image, callback) {
    const reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(image);
  }

  // handle changes to the content images
  const handleContentImages = (e) => {
    const newImage = e.target.files[0];
    const imageMark = `[image-${contentImages.length}]`;
    console.log("newIMage: ", newImage.path);
    const beforeImage = editPostData.contentText.substring(0, cursorPosition);
    const afterImage = editPostData.contentText.substring(cursorPosition);
    const newContentText = beforeImage + imageMark + afterImage;

    setEditPostData((prev) => ({ ...prev, contentText: newContentText }));
    localStorage.setItem("textContent", JSON.stringify(newContentText));
    saveContentImages(newImage, (base64Result) => {
      const localImage = {
        id: contentImages.length,
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
  const removeImage = (id, text) => {
    console.log("id received inside removeImage: ",id);
    const newContentImages = contentImages.filter((image) => image.id != id);
    console.log("newContentImages after filter inside removeImage: ", newContentImages);
    console.log("newContentImages enteries: ", newContentImages.entries());
    let updatedText = text;
    if(!newContentImages.length){
      updatedText = updatedText.split('[image-0]').join('');
      console.log("updated Text if no contentImages: ", updatedText);
      localStorage.setItem("textContent", JSON.stringify(updatedText));
      setEditPostData((prev) => ({ ...prev, contentText: updatedText }));
    }
    for (const [index, image] of newContentImages.entries()) {
      console.log("did i run: ")
      console.log("entery index: ", index);
      console.log("entry image: ", image);
      updatedText = updatedText
        .split(`[image-${image.id}]`)
        .join(`[image-${index}]`);
      localStorage.setItem("textContent", JSON.stringify(updatedText));
      setEditPostData((prev) => ({ ...prev, contentText: updatedText }));
    }
    const updateImages = newContentImages.map((image, index) => ({
      id: index,
      preview: image.preview,
      fileName: image.fileName,
      position: image.position,
    }));
    console.log("contenet Images: ", contentImages);
    setContentImages(updateImages);
    localStorage.setItem("localContentImages", JSON.stringify(updateImages));
    setEditedSomething(true);
  };

  // handle Reposting
  const handleReposting = async (e) => {
    console.log("Reposting run ", post);
    const formData = new FormData();
    console.log("newTitleImage true or false ", newTitleImage);
    console.log("titleimage checking: ", editPostData.titleImage);
    if (editPostData.titleImage instanceof File) {
      formData.append("titleImage", editPostData.titleImage);
    }
    formData.append("title", editPostData.title);
    if (editPostData.contentText) {
      console.log("before submitting contentText: ",editPostData.contentText);
      const contentArray = [
        {
          type: "text",
          value: editPostData.contentText,
        },
      ];
      formData.append("newContent", JSON.stringify(contentArray));
    }
    let positions = [];
    if (contentImages) {
      console.log("contentImages before accessing savedPics: " ,contentImages);
      let savedPics = contentImages.filter(image => !image.file);
      savedPics = savedPics.map(pic => ({
        path:pic.preview.substring(22),
        position:pic.position,
        fileName:pic.fileName
      }));
      console.log("savedPics before appending to the form: ", savedPics)
      formData.append("savedImages", JSON.stringify(savedPics))
      contentImages.forEach((image) => {
        
        
        // console.log("positions inside true: ", positions);
        if (image.file) {
          positions.push({
            position: image.position,
            fileName: image.fileName,
          });
          formData.append("contentImages", image.file);
        } 
      });
    }
    // console.log(" combined positions: ", positions);
    formData.append("positions", JSON.stringify(positions));
    formData.append("titleImage", editPostData.titleImage);

    console.log("formData: ", formData);
    try {
      const response = await axios.put(
        `http://localhost:4100/weblog/updatedBlog/${post._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/formD-data",
          },
        }
      );
      console.log("repsonse from put request :", response);
      if (response?.data.success) {
        console.log("new blog data after success message", response.data.blog);
        console.log("new Title", response.data.blog.title);
        console.log("new titleImage ", response.data.blog.titleImage);
        localStorage.setItem(
          "titleImage",
          JSON.stringify(response.data.blog.titleImage)
        );
        localStorage.setItem(
          "titleStorage",
          JSON.stringify(response.data.blog.title)
        );
      }
      setNewTitleImage(false);
    } catch (err) {
      console.log("You can deal with errors: ", err);
      if(err.response.data.error === 'jwt expired' || err.response.data.message === 'Unable to get Token Bearer'){
        const confirmMovingToLogin = window.confirm("Your session has Expired! You are Logged Out");
        if(confirmMovingToLogin){
          moveTo('/login')
        }
      }
    }
    console.log("editPost data DRWE REPOSTING: ", editPostData.titleImage);
    // console.log("contentImages after reposting: ", contentImages);
  };

  if(loading) {
    return (<h1>Loading the Post..</h1>)
  } 
  if(errors.message){
    return <h2>{errors.message}</h2>
  }
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="lg:max-w-5xl max-w-4xl bg-white rounded-lg shadow-lg mx-auto w-full p-5">
          <form method="post" className="space-y-2 flex my-5 flex-col">
            <label htmlFor="title" className="text-pink-600">Edit Title</label>
                <input type="text" 
                name="title" 
                placeholder="Edit the Title" 
                className="border border-gray-500 w-100 m-0 p-0"
                onChange={handleChange}
                value={editPostData.title} />
                
                <div>
                    <label htmlFor="image" className="block text-pink-600">Change Title Image</label>
                    <input type="file" accept="image/*" name="titleImg" onChange={handleImageChange} className="w-[82px] my-2"/>
                    {editPostData.imagePreview && 
                    <img src={editPostData.imagePreview} alt={editPostData.title} className="h-52 w-56" /> 
        
                }
                </div>
                
                <div>
                    {/* {console.log("editPostData: ", editPostData)} */}

                    {/* <ProtectedContentEditor
                        value={editPostData.contentText}
                        onChange={handleContentText}
                        onCursorPosition={setCursorPosition}
                    /> */}
                  <label htmlFor="post Body" className="block text-pink-600">Post Body</label>
                  <textarea placeholder="start writing your Blog"
                    ref={currentArea}
                    name="value"
                    className="border-gray-500 border w-full h-[350px] my-2 px-5 rounded:md"
                    onChange={handleContentText}
                    onClick={selectCurrentSelection}
                    onKeyUp={selectCurrentSelection}
                    value={editPostData.contentText}
                    required
                    />
            
                    <div className="flex">
                        
                        {contentImages &&              
                        <ContentImages contentImages={contentImages} removeImage={removeImage} contentText={editPostData?.contentText} />
                        }
                    </div>
                        
                    <div className="absolute top-[38%] lg:right-[28%] xs:right-[10%] md:right-[23%] ">
                            <input type="file" 
                            name="image"
                            accept="image/*" 
                            onChange={handleContentImages} 
                            className="w-[88px] cursor-pointer"
                            id="contentImg" />
                        
                    </div>
                </div>
            </form>

            
            <div className=""> 
                <button className="border p-2 bg-green-400 mb-4" onClick={(e) => handleReposting(e)}> RePost </button>

                <div>
                    <button className="border p-2 bg-blue-400 mb-4 mr-4" onClick={() => handleNavigation(-1)}> Back </button>
                    <button className="border p-2 bg-blue-400" onClick={() => handleNavigation('/')}> Back To HOME</button>
                </div>
            </div>
          
        </div>
    </div>
  );
}

export default EditPost



