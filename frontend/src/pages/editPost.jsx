import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate} from "react-router-dom"
import Image from "../Components/contentSection/titleImage";
import TextContent from "../Components/contentSection/textContent";
import ContentImages from "../Components/contentSection/ContentImage";


const EditPost = () =>  {
    const [cursorPosition, setCursorPosition] = useState(0);
    const [editedSomething, setEditedSomething] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const moveTo = useNavigate();
    const isNavigatingBack= useRef(false);

    const [editPostData, setEditPostData] = useState({
        title:'',
        titleImage: null,
        contentText:'',
        imagePreview:''
    });
    const isNavigatingRef = false;
    const navigatingAttemptCount = useRef(false);

    const [contentImages, setContentImages] = useState(
        []
    );
    const currentArea = useRef(null);
    // const moveTo = useNavigate(); 
    const getState = useLocation();

    const post = getState.state?.post;

   

    const selectCurrentSelection = () => {
        setCursorPosition(currentArea.current.selectionStart);
        
    }

    

     const clearLocalStorage = useCallback(() => {
        localStorage.removeItem('titleStorage');
        localStorage.removeItem('titleImagePreview');
        localStorage.removeItem('textContent');
        localStorage.removeItem('localContentImages');
     }, []);

     


     const confirmNavigation = useCallback(async() => {
        console.log("runs confirmNavigation")
        if(!editedSomething || isNavigatingBack.current) return true;

        const confirmed = window.confirm("You have unsaved changes. Are you sure you want to leave?");
        if(confirmed){
            isNavigatingBack.current = true;
            clearLocalStorage();
            setEditedSomething(false);
        }
        console.log("confirmed value inside confirmNavigation: ", confirmNavigation)
        return confirmed;
     }, [editedSomething, clearLocalStorage])


    const handleNavigation = useCallback(async(link) => {
        console.log("runs handle Navigation")
        if(await confirmNavigation()){
            moveTo(link)
        }

    }, [editedSomething, clearLocalStorage]);

   
      const windowLoads = useCallback(async(e) => {
        console.log("beforeUnload Running like Cheetah")
        // console.log("edited Something", editedSomething);
        if(editedSomething){
            clearLocalStorage();
            e.preventDefault();
            e.returnValue = '';
            return '';

        }
     },[editedSomething, clearLocalStorage])
    
    useEffect(() => {
         
         window.addEventListener('beforeunload', windowLoads);
         return () => window.removeEventListener('beforeunload', windowLoads)
    },[windowLoads]);
    


   

    // Convert and Store image as base 64
    const fetchImageAsBase64 = useCallback(async(image) => {
        try{
            const response = await fetch(`http://localhost:4100/${image}`)
            const blob = await response.blob();
            return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend=() => {
                localStorage.setItem('titleImagePreview', reader.result);
                resolve(reader.result)
            }
            reader.readAsDataURL(blob)
            })
        }
        catch(err){
            console.error("err while converting server image to buffer", err);
            return null
        }
    })

    useEffect(() => {
        console.log("post received at editPost: ", post);
        // Assign Title
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
                            preview:`http://localhost:4100/${image.path}`,
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
    function storeAsBase64(file){
        const reader = new FileReader();
        reader.onloadend = function(){
            localStorage.setItem('titleImagePreview', reader.result);
            setEditPostData(prev => {
                return {
                    ...prev,
                    imagePreview:reader.result
                }
            })
        }

        reader.readAsDataURL(file)
    }

    // Handle changes to the title input
    const handleChange = (e) => {
        const newTitle = e.target.value;
        localStorage.setItem('titleStorage', JSON.stringify(newTitle));
        setEditPostData(prev => ({...prev, title:newTitle}));
        setEditedSomething(true);    
    }

    
    
    // Handle changes to the title Image
    function handleImageChange(e){
        const image = e.target.files[0];
        if(!image) return;
        localStorage.setItem("titleImage", image);
        setEditPostData((prev) => ({...prev,titleImage:image}))
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
   function saveContentImages(image, callback){
    const reader = new FileReader();
        reader.onloadend = function (){
            callback(reader.result);
        } 
        reader.readAsDataURL(image);
    }

   // handle changes to the content images 
   const handleContentImages = (e) =>
    {
        const newImage= e.target.files[0];
        const imageMark = `[image-${contentImages.length}]`

        const beforeImage = editPostData.contentText.substring(0,cursorPosition);
        const afterImage = editPostData.contentText.substring(cursorPosition);
        const newContentText = beforeImage + imageMark + afterImage;
        
        setEditPostData((prev) => ({ ...prev,contentText:newContentText}))
        localStorage.setItem('textContent', JSON.stringify(newContentText));
        saveContentImages(newImage, (base64Result) => {
            const localImage = {
            id:contentImages.length,
            fileName: newImage.name,
            file:newImage,
            preview: base64Result,
            position:cursorPosition,
            }
            const allImages = [...contentImages, localImage];
            localStorage.setItem('localContentImages', JSON.stringify(allImages));
            setContentImages(allImages);
            setEditedSomething(true);
        }) 
    
    }
    // removing the content Image
    const removeImage =(id, text) => {
    const newContentImages = contentImages.filter(image => image.id != id);
    let updatedText = text;
    for (const [index, image] of newContentImages.entries()){
        updatedText = updatedText.split(`[image-${image.id}]`).join(`[image-${index}]`); 
        localStorage.setItem('textContent', JSON.stringify(updatedText));
        setEditPostData(prev => ({ ...prev,contentText:updatedText})) 
    }
    const updateImages = newContentImages.map((image,index) => ({
        id:index,
        preview:image.preview,
        fileName:image.fileName,
        position:image.position
    }))
    setContentImages(updateImages);
    localStorage.setItem('localContentImages', JSON.stringify(updateImages));
    setEditedSomething(true);
}

    // handle Reposting

    const handleReposting = (e) => {
        console.log("Reposting run");
        const formData = new FormData();
        formData.append('title', editPostData.title);
        formData.append('titleImage', editPostData.titleImage);
        if(editPostData.contentText){
            formData.append('content', JSON.stringify(editPostData.contentText));
        }
        if(contentImages){
            contentImages.forEach(image => {
                console.log("content image using forEach: ", image)
                formData.append('contentImages', image)
            })
        }
        formData.append('titleImage', editPostData.titleImage);

        console.log("formData: ", formData);
        console.log("editPost data DRWE REPOSTING: ", editPostData.titleImage );
        // console.log("contentImages after reposting: ", contentImages);
    }
    return (
        <>
      
            <form method="post" className="flex flex-col gap-4 my-4 mx-2">
                <input type="text" 
                name="title" 
                placeholder="Edit the Title" 
                className="border border-gray-500 w-2/5"
                onChange={handleChange}
                value={editPostData.title} />
                
                <div>
                    <label htmlFor="image" className="block">Change Title Image</label>
                    <input type="file" accept="image/*" name="titleImg" onChange={handleImageChange} className="w-[82px] mb-2"/>
                    {editPostData.imagePreview && 
                    <img src={editPostData.imagePreview} alt={editPostData.title} className="h-52 w-56" /> 
        
                }
                </div>
                
                <div>
                    {/* {console.log("editPostData: ", editPostData)} */}
                <textarea placeholder="start writing your Blog"
                    ref={currentArea}
                    name="value"
                    className="border-gray-500 border w-4/5 h-[350px] mt-4"
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
                    <div className="absolute top-[45%] right-[22%]">
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
                    <button className="border p-2 bg-red-400 mb-4" onClick={() => handleNavigation(-1)}> Back </button>
                    <button className="border p-2 bg-red-400" onClick={() => handleNavigation('/')}> Back To HOME</button>
                </div>   
            </div>
        </>
    )
}

export default EditPost