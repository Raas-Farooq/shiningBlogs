import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import Image from "../Components/contentSection/titleImage";
import TextContent from "../Components/contentSection/textContent";
import ContentImages from "../Components/contentSection/ContentImage";


const EditPost = () =>  {
    const [updateImages,setUpdateImages] = useState([]);
    const [cursorPosition, setCursorPosition] = useState(0);

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

    useEffect(() => {
        // console.log("editPost: ", editPostData);
    }, [editPostData]);

    const selectCurrentSelection = () => {
        setCursorPosition(currentArea.current.selectionStart);
        
    }

    useEffect(() => {
        console.log("useEffect Runs Post", post)
        if(post?.title){
            setEditPostData(prev => ({
                ...prev,
                title:post.title,
                content:post.content,
                imagePreview:post.titleImage
            })
        )

        }
        
        if(post?.content){
            // if(post.content[0].type === 'text'){
            //     console.log("post.content.value: ", post.content[0].value)
            // }
            post.content.forEach(cont => {
                if(cont.type=== 'text'){
                    
                    setEditPostData(prv => ({
                        ...prv, 
                        contentText:cont.value
                    }))
                }
               
            })
            
        }
        if(post?.contentImages){
            console.log("i founded the images: ", contentImages.find(image => image.preview));
            if (post?.contentImages && contentImages.length === 0){
                post.contentImages.forEach((image, index) => {
                    setContentImages((prev) => ([
                        ...prev,
                        {
                            id:index,
                            fileName: image.fileName,
                            preview: `http://localhost:4100/${image.path}`,
                        }
                    ]))
                    
                    
                })
            }
            
        }
        // console.log("contentIMages inside the EditPost: ", contentImages)
        
    },[])
    function storeContentText(){

    }
    const handleChange = (e) => {
        setEditPostData(prev => 
           (
            {
                ...prev, 
                title:e.target.value
            }
           )
        )
    }

    function handleImageChange(e){
        const image = e.target.files[0];

        setEditPostData(prev => (
           { 
            ...prev,
            titleImage: image,
            imagePreview:URL.createObjectURL(image)
            }
        )
    )

    }
   const handleContentText = (e) => {
        setEditPostData(prev => ({
            ...prev,
            contentText:e.target.value
        }))
   }
   const handleContentImages = (e) => {
        const newImage= e.target.files[0];
        const imageMark = `[image-${contentImages.length}]`
        const beforeImage = editPostData.contentText.substring(0,cursorPosition);
        const afterImage = editPostData.contentText.substring(cursorPosition);
        const newContentText = beforeImage + imageMark + afterImage;
        setEditPostData((prev) => ({
            ...prev,
            contentText:newContentText
        }))
        setContentImages((prev) => ([
            ...prev,
            {
                id:contentImages.length,
                fileName:newImage.name,
                preview:URL.createObjectURL(newImage),
            }]
        )  
    )


   }
   const removeImage =(id, text) => {
    // console.log("id of removed image: ", id);
    console.log("New TExt: ",text);

    // setEditPostData(prev => (
        
    //     {
    //         ...prev,
    //         contentText:text
    //     }
    // ))
    const newContentImages = contentImages.filter(image => image.id != id);
    console.log("NewContentIMages; ", newContentImages);
    
    // setContentImages(newContentImages);
    let updatedText = text;
    for (const [index, image] of newContentImages.entries()){
        console.log("index: ", index + " image: ", image.id);
        updatedText = updatedText.split(`[image-${image.id}]`).join(`[image-${index}]`); 
        console.log("updatedText")
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
                    {editPostData.imagePreview && !editPostData.titleImage ?  
                    
                    <Image postImg={editPostData.imagePreview} title={editPostData.title} />
                    :
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