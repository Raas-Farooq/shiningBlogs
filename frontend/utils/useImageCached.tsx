import { useEffect, useState } from "react";

type ImageLoadingState = 'loading' | 'loaded' | 'failed'


const useImageCached = (src:string) => {

    const [imageStatus, setImageStatus] = useState<ImageLoadingState>('loading');

    useEffect(() => {

        if(!src) return;
        const image = new Image();                                                                                                                                                                                                                                   
         image.src= src;
            if(image.complete && image.naturalWidth > 0){
                setImageStatus('loaded')
                return;
            }

      
        const handleLoad = () => setImageStatus('loaded');
        const handleError = () => setImageStatus('failed');
       
        
        image.addEventListener('load', handleLoad);
        image.addEventListener('error', handleError);

        return () => {
            image.removeEventListener('load', handleLoad);
            image.removeEventListener('error', handleError);
        } 
        
    },[src])

    return {imageStatus}
}

export default useImageCached;
