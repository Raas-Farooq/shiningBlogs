import { useEffect, useState } from "react";


const Image= ({postImg, title, isFullView=false}) => {

    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        // console.log("postImage inside IMAGE : ", postImg);
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

    const imageStyles= isFullView ? 'h-[400px] w-4/5 mb-12' : 'h-52 w-56 text-center'
    return (
        <>   
            {/* {console.log("Image source DOM: ", imageSrc)} */}
            {imageSrc && <img src={imageSrc} alt={title} className={imageStyles} />}
        </>
    )
}

export default Image;




 // useEffect(() => {
    //     let mounted = true;
    //     let isHandlingPopState = false;  // Add this flag
    
    //     // Add history entry on mount
    //     window.history.pushState({ page: 'edit' }, "", window.location.pathname);
        
    //     const handlePopState = async (e) => {
    //         if (isHandlingPopState) return;  // Prevent double handling
    //         isHandlingPopState = true;
            
    //         console.log("handlePopState is Running!");
            
    //         try {
    //             if (editedSomething) {
    //                 const canNavigate = await confirmNavigation();
                    
    //                 if (canNavigate && mounted) {
    //                     await clearLocalStorage();
    //                     window.history.back();
    //                 } else if (mounted) {
    //                     window.history.pushState({ page: 'edit' }, "", window.location.pathname);
    //                 }
    //             } else {
    //                 window.history.back();
    //             }
    //         } finally {
    //             isHandlingPopState = false;  // Reset the flag
    //         }
    //     };
    
    //     window.addEventListener('popstate', handlePopState);
        
    //     return () => {
    //         mounted = false;
    //         window.removeEventListener('popstate', handlePopState);
    //     };
    // }, [editedSomething, clearLocalStorage]);