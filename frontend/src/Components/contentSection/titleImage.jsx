import { useEffect, useState } from "react";


const Image= ({postImg, title, isFullView=false}) => {

    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const absUrl = postImg.startsWith('http://') || postImg.startsWith('https://');
        const relUrl = postImg.startsWith('uploads/');
        
        if(absUrl){
            setImageSrc(postImg);
        }
        else if(relUrl){
            setImageSrc(`http://localhost:4100/${postImg}`);
            
        }else{
            setImageSrc('../public/Venice Blue.png')
            console.error("unable to fetch the Image")
        }
    }, [postImg])

    const imageStyles= isFullView ? 'h-2/5 w-4/5 mb-12' : 'h-56 w-64 '
    return (
        <>   
            {console.log("Image source DOM: ", imageSrc)}
            {imageSrc && <img src={imageSrc} alt={title} className={imageStyles} />}
        </>
    )
}

export default Image;