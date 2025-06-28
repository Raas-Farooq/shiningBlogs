import { useEffect, useState } from "react";
import { VITE_API_URL } from "../../config";


interface ImageProps {
    postImg:string,
    title:string,
    isFullView?:boolean
}

const Image:React.FC<ImageProps> = ({postImg, title, isFullView}) => {

    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const absUrl = postImg.startsWith('http://') || postImg.startsWith('https://');
        const relUrl = postImg.startsWith('uploads/');
        
        if(absUrl){
            setImageSrc(postImg);
        }
        else if(relUrl){
            setImageSrc(`${VITE_API_URL}/${postImg}`);
            
        }else{
            console.log("image not set for this post")
        }
    }, [postImg])

    const imageStyles= isFullView ? 'h-[400px] w-4/5 mb-12' : 'rounded-t-lg object-cover h-52 w-56'
    return (
        <>   
            {imageSrc && <img src={imageSrc} alt={title} className={imageStyles} />}
        </>
    )
}

export default Image;

