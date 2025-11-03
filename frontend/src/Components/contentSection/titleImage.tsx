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
        const absUrl =  postImg.startsWith('https://');
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

    const imageStyles= isFullView ? 'rounded-t-lg h-[450px] w-4/5 mb-12' : ' max-w-sm aspect-[4/3] rounded-t-lg overflow-hidden'
    return (
        <>   
            {imageSrc && <img src={imageSrc} alt={title} className={imageStyles} />}
        </>
    )
}

export default Image;

