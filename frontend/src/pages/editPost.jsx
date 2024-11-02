import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import Image from "../Components/contentSection/titleImage";
import TextContent from "../Components/contentSection/textContent";
import ContentImages from "../Components/contentSection/ContentImage";


const EditPost = () =>  {
    const [editPostData, setEditPostData] = useState({
        title:'',
        titleImage: null,
        contentText:'',
        imagePreview:''

    });
    const [contentImages, setContentImages] = useState(
        []
    );
    const moveTo = useNavigate(); 
    const getState = useLocation();

    const post = getState.state?.post;

    useEffect(() => {
        // console.log("editPost: ", editPostData);
    }, [editPostData]);


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
                            fileName: image.fileName,
                            preview: `http://localhost:4100/${image.path}`,
                        }
                    ]))
                    
                    
                })
            }
            
        }
        // console.log("contentIMages inside the EditPost: ", contentImages)
        
    },[])

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
        // console.log("text inside content change: ", e.target.value);

        setEditPostData(prev => ({
            ...prev,
            contentText:e.target.value
        }))
   }
   const handleContentImages = (e) => {
        const newImage= e.target.files[0];
        // console.log("newImage: ", newImage);
        setContentImages((prev,ind) => ({
            ...prev,
            contentImages:[newImage]
        })
    )
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
                    name="value"
                    className="border-gray-500 border w-4/5 h-[350px] mt-4"
                    onChange={handleContentText}
                    value={editPostData.contentText}
                    required
                    />
                    {console.log("conentImages EDITTTT : ", contentImages)}
                    <div className="flex">
                        
                        {contentImages &&              
                        <ContentImages contentImages={contentImages} contentText={editPostData?.contentText} />
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