import { useEffect, useState } from "react";


const Image= ({postImg, title, isFullView=false}) => {

    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        console.log("postImage inside IMAGE : ", postImg);
        const absUrl = postImg.startsWith('http://') || postImg.startsWith('https://');
        const relUrl = postImg.startsWith('uploads/');
        
        if(absUrl){
            setImageSrc(postImg);
        }
        else if(relUrl){
            setImageSrc(`http://localhost:4100/${postImg}`);
            
        }else{
            // setImageSrc('../public/Venice Blue.png')
            // console.error("unable to fetch the Image")
            console.log("image not set for this post")
        }
    }, [postImg])

    const imageStyles= isFullView ? 'h-2/5 w-4/5 mb-12' : 'h-52 w-56 text-center'
    return (
        <>   
            {/* {console.log("Image source DOM: ", imageSrc)} */}
            {imageSrc && <img src={imageSrc} alt={title} className={imageStyles} />}
        </>
    )
}

export default Image;