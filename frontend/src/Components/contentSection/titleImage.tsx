import { useEffect, useState } from "react";


interface ImageProps {
    postImg:string,
    title:string,
    isFullView?:boolean
}

const Image:React.FC<ImageProps> = ({postImg, title, isFullView}) => {

    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const absUrl =  postImg.startsWith('https://');
        if(absUrl){
            setImageSrc(postImg);
        }
        else{
            console.log("image not set for this post")
        }
    }, [postImg])

    const imageStyles= isFullView ? 'rounded-t-lg max-h-[450px] w-full max-w-xl mb-12' : ' max-w-sm aspect-[4/3] rounded-t-lg overflow-hidden'
    return (
        <>   
            {imageSrc && <img src={imageSrc} alt={title} className={imageStyles} />}
        </>
    )
}

export default Image;

