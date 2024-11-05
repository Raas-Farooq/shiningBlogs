import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import Image from "../Components/contentSection/titleImage";
import TextContent from "../Components/contentSection/textContent";
import ContentImages from "../Components/contentSection/ContentImage";


const EditPost = () =>  {
    const [updateImages,setUpdateImages] = useState([]);
    const [readerFile, setReaderFile] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [editPostData, setEditPostData] = useState({
        title:'',
        titleImage: null,
        contentText:'',
        imagePreview:''

    });
    const [contentImages, setContentImages] = useState(
        []
    );
    const currentArea = useRef(null);
    const moveTo = useNavigate(); 
    const getState = useLocation();

    const post = getState.state?.post;

   

    const selectCurrentSelection = () => {
        setCursorPosition(currentArea.current.selectionStart);
        
    }

    useEffect(() => {
        if(readerFile){
            console.log("ReaderFile is Loaded")
        }

    }, [readerFile])


    useEffect(() => {
        console.log("useEffect Runs Post", post);
        const titleStored = JSON.parse(localStorage.getItem('titleStorage'));
        if(post?.title && !titleStored){
            
            setEditPostData(prev => ({
                ...prev,
                title:post.title,
                content:post.content,
                
            })
        )
        localStorage.setItem('titleStorage', JSON.stringify(post.title));
        }
        else
        {
            // alert("you already have the data")
            setEditPostData(prev => {
                return {
                    ...prev,
                    title:titleStored
                }
            })
        }
        const titleImage = localStorage.getItem('titleImagePreview');
        if(post?.titleImage && !titleImage){
            fetchImageAsBase64(post.titleImage)
        }
        else{
            const imageName = JSON.parse(localStorage.getItem('imageName'));
            setEditPostData(prev => (
                {
                    ...prev,
                    imagePreview: titleImage
                }
            ))
        }
        const localContentText = JSON.parse(localStorage.getItem('textContent'));
        if(post?.content && !localContentText){
            post.content.forEach(cont => {
                if(cont.type=== 'text'){
                    
                    setEditPostData(prv => ({
                        ...prv, 
                        contentText:cont.value
                    }))
                    localStorage.setItem("textContent", JSON.stringify(cont.value));
                }
               
            })
            
        }else{
            setEditPostData(prev => {
                return {
                    ...prev,
                    contentText:localContentText
                }
            })
        }


        if(post?.contentImages){
            let localContentImages = JSON.parse(localStorage.getItem('localContentImages')) || [];
            console.log("localContentImages: before check inside useEffect",localContentImages)
            if (post?.contentImages && localContentImages.length === 0){
                post.contentImages.forEach((image, index) => {
                    
                    const images = {
                        id:index,
                        fileName:image.fileName,
                        preview:`http://localhost:4100/${image.path}`
                    }
                    localContentImages.push(images);
                    setContentImages(localContentImages)
                
                    
                })
                console.log("localContentImages: after assigning",localContentImages)
                localStorage.setItem("localContentImages", JSON.stringify(localContentImages))
                console.log("first time contentImages inside useEfefect:", contentImages)
            }
            else{
                console.log("ALERT ContentImages stored Locally: ", localContentImages);
                setContentImages(localContentImages);

            }
            
        }
        setLoaded(true)
        // console.log("contentIMages inside the EditPost: ", contentImages)
        
    },[])


    function storeTitle(){
        
        // console.log("titleStorer inside storeTitle: ", titleStorer);
        console.log("title from post inside storeTitle: ", editPostData.title)
        // localStorage.setItem('titleStorage', JSON.stringify(e.target.value));
        // const titleStored = JSON.parse(localStorage.getItem('titleStorage')) || '';
        return titleStored
    }
    const handleChange = (e) => {
        localStorage.setItem('titleStorage', JSON.stringify(e.target.value));
        const titleStored = JSON.parse(localStorage.getItem('titleStorage')) || '';
        console.log("titleStored: change: ", titleStored)
        setEditPostData(prev => 
           (
            {
                ...prev, 
                title:titleStored
            }
           )
        )
    }

    const fetchImageAsBase64 = (image) => {
        fetch(`http://localhost:4100/${image}`)
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();

            reader.onloadend=() => {
                localStorage.setItem('titleImagePreview', reader.result);
                setEditPostData(prev => {
                    return {
                        ...prev,
                        imagePreview:reader.result
                    }
                })
            }
            reader.readAsDataURL(blob)
        })
        .catch(err => {
            console.log("err while converting server image to buffer", err)
        })
    }
    function storeAsBase64(file,fromContent=false){
        const reader = new FileReader();
        console.log("fromContent: ", fromContent)
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

    

    function handleImageChange(e){
        const image = e.target.files[0];
        if(!image) return;

        storeAsBase64(image);
      
    }

   const handleContentText = (e) => {
        localStorage.setItem('textContent', JSON.stringify(e.target.value));
        const storedTextContent = JSON.parse(localStorage.getItem('textContent'));
        setEditPostData(prev => ({
            ...prev,
            contentText:storedTextContent
        }))
   }
   function saveContentImages(image, callback){
    const reader = new FileReader();
        let result;
        reader.onloadend = function (){
            // setReaderFile(reader.result);
            callback(reader.result);
        } 
        reader.readAsDataURL(image);
    }

   const handleContentImages = (e) =>
    {
        const newImage= e.target.files[0];
        console.log("newImage: ", newImage);
        console.log("cursor Position: ", cursorPosition);
        const imageMark = `[image-${contentImages.length}]`
        const beforeImage = editPostData.contentText.substring(0,cursorPosition);
        const afterImage = editPostData.contentText.substring(cursorPosition);
        const newContentText = beforeImage + imageMark + afterImage;
        localStorage.setItem('textContent', JSON.stringify(newContentText));

        setEditPostData((prev) => ({
            ...prev,
            contentText:newContentText
        }))
        
        saveContentImages(newImage, (base64Result) => {
            const localImage = {
            id:contentImages.length,
            fileName: newImage.name,
            preview: base64Result,
            position:cursorPosition,
            }
            const allImages = [...contentImages, localImage];
            localStorage.setItem('localContentImages', JSON.stringify(allImages));
            setContentImages(allImages)  
        })
        
        
        
        console.log("newContentIMages after updating handle Content Images; ", contentImages)
    }
   const removeImage =(id, text) => {
    const newContentImages = contentImages.filter(image => image.id != id);
    console.log("NewContentIMages; ", newContentImages);
    
    // setContentImages(newContentImages);
    let updatedText = text;
    for (const [index, image] of newContentImages.entries()){
        console.log("index: ", index + " image: ", image.id);
        updatedText = updatedText.split(`[image-${image.id}]`).join(`[image-${index}]`); 
        localStorage.setItem('textContent', JSON.stringify(updatedText));
        setEditPostData(prev => ({
            ...prev,
            contentText:updatedText
        })) 
    }
    const updateImages = newContentImages.map((image,index) => ({
        id:index,
        preview:image.preview,
        fileName:image.fileName
    }))
    setContentImages(updateImages);
    console.log("updated Text ", updatedText)
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
                    {/* {console.log("editPostData.imagPreview DOM: ", editPostData.titleImage)}
                    {console.log("editPostData.imagPreview DOM: ", editPostData.imagePreview)} */}
                    {editPostData.imagePreview && 
                    // !editPostData.titleImage ?  
                    
                    // <Image postImg={editPostData.imagePreview} title={editPostData.title} />
                    // :(
                        
                    <img src={editPostData.imagePreview} alt={editPostData.title} className="h-52 w-56" /> 
         
                }
                </div>
                
                <div>

                    {/* {post.content && <TextContent content={post.content} isFullView={true} contentImages={post.contentImages} />} */}
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
                    {console.log("contentIMages EditPost DOM : ",contentImages)}
                    <div className="flex">
                        
                        {contentImages &&              
                        <ContentImages contentImages={contentImages} removeImage={removeImage} contentText={editPostData?.contentText} />
                        }
                    </div>
                    <div className="absolute top-[45%] right-[22%]">
                            {/* <label htmlFor="imageUpload" className="text-bold p-2 mr-4"> upload Your Image</label> */}
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
                <div>
                <button className="border p-2 bg-red-400 mb-4" onClick={() => moveTo(-1)}> Back </button>
                </div>
                
                <button className="border p-2 bg-red-500" onClick={() => moveTo('/')}> Back To HOME</button>
            </div>
        </>
    )
}

export default EditPost