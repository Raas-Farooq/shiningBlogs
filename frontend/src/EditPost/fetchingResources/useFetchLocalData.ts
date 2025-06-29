import { useEffect,useState } from "react";
import fetchImageAsBase64 from "./fetchImageBase64.ts";
import { VITE_API_URL } from "../../config.ts";

// import { useAuthenContext } from "../../globalContext/globalContext.tsx";

interface PostData{
  _id:string,
  userId:string,
  title:string,
  public_id:string,
  titleImage:string,
  content:[{
    type:string,
    value:string
  }],
  contentImages:[{
    id:number,
    path:string,
    position:number,
    fileName:string,
    _id:string
  }],
  
}

interface ContentImage{
    path:string,
    position:number,
    fileName:string,
    preview?:string,
    _id:string,
    id:number
}

const getLocalContentImages = (): ContentImage[] => {
  const localContentImages = localStorage.getItem("localContentImages");
  if (!localContentImages) return []; // Return empty array if no data exists

  try {
    const parsedData = JSON.parse(localContentImages);
    // Validate that parsedData is an array and matches the ContentImage structure
    if (Array.isArray(parsedData) && parsedData.every(item => (
      typeof item._id === 'string' &&
      typeof item.id === 'number' &&
      typeof item.fileName === 'string' &&
      typeof item.path === 'string' &&
      typeof item.position === 'number'
    ))) {
      return parsedData;
    }
    return []; // Return empty array if validation fails
  } catch (error) {
    console.error("Error parsing localContentImages:", error);
    return []; // Return empty array if parsing fails
  }
};



const useFetchLocalData = (post:PostData) => {

const [loadingTitleImage, setLoadingTitleImage] = useState<boolean>(false);
const [postLoading, setPostLoading] = useState<boolean>(false);

const [localPostData, setLocalPostData] = useState(
    {
        title:'',
        titleImage:'',
        public_id:"",
        contentText:'',
        imagePreview:'',
    }
)
const [receiveLocalImages, setReceiveLocalImages] = useState<ContentImage[]>([])

    useEffect(() => {
        if(!post) return;
        
        const loadTitleImage = async() => {
          try{
            setLoadingTitleImage(true);
              const titleImage = localStorage.getItem("localTitleImage") || '';
              if(titleImage){
                setLocalPostData(prev => ({...prev, 
                  imagePreview:titleImage
                }))
              }

              if (post?.titleImage && !titleImage) {
                setLocalPostData(prev => ({...prev, 
                  imagePreview:titleImage
                }))
              }
              localStorage.setItem("localTitleImage", post?.titleImage);
              const public_id = localStorage.getItem('localPublic_id');
                setLocalPostData(prev => ({
                  ...prev,
                  public_id:!public_id ? post.public_id : public_id
                }))
          }
          catch(err){
            console.error("Got error while accessing image: ", err);
          }
          finally{
            setLoadingTitleImage(false);
          }
        }
        loadTitleImage();
      },[post?.titleImage, setLoadingTitleImage])


    useEffect(() => {
        async function loadInitialData() {
          if (!post) {
            setPostLoading(true);
            return;
          }
          try {
              const titleStored = localStorage.getItem("localTitle") || '';
              const newTitle = !titleStored && post?.title ? post.title : titleStored;
      
              // load Save content Text (Text Data of Post)
              const localContentText = JSON.parse(
                localStorage.getItem("localContent") || '""'
              );
              const newContentText =
                post?.content && !localContentText
                  ? post.content.find((content) => content.type === "text")?.value ||
                    '""'
                  : localContentText[0].value;
              
              setLocalPostData((prev) => ({
                ...prev,
                title: newTitle || "",
                titleImage: post.titleImage || "",
                contentText: newContentText || "",
              }));
              // JSON.parse(localStorage.getItem("localContentImages")) || [];
              // load content Images
              if (post?.contentImages.length) {
                const isContentImagesValid = post?.contentImages.every(
                  (image) => image.path && image.fileName && image._id
                );
                if(isContentImagesValid){
                  let localContentImages:ContentImage[] = getLocalContentImages();
                  const notLocalImages = !localContentImages.length ||
                  localContentImages.some(image => !image._id || !image.fileName || !image.position);

                  if (notLocalImages) {
                    const newImages:ContentImage[] = post.contentImages.map((image, index) => ({
                      _id:image._id,
                      id: index,
                      fileName: image.fileName,
                      path: image.path,
                      position: image.position,
                    }));
                    setReceiveLocalImages(newImages);
                    localStorage.setItem(
                      "localContentImages",
                      JSON.stringify(newImages)
                    );
                  }
                  else {
                    setReceiveLocalImages(localContentImages);
                  }
                } else{
                  console.log("fetchingImages..")
                }
              }else{
                setReceiveLocalImages([]);
              }

          } catch (err) {
            console.error("Error while receiving post", err);
          } finally {
            setPostLoading(false);
          }
        }
    
        loadInitialData();
      }, [post?._id]);
      return {postLoading, localPostData, receiveLocalImages}
}

export default useFetchLocalData;