import { useEffect,useState } from "react";
import fetchImageAsBase64 from "./fetchImageBase64.ts";
import { VITE_API_URL } from "../../config.ts";

// import { useAuthenContext } from "../../globalContext/globalContext.tsx";

interface PostData{
  _id:string,
  userId:string,
  title:string,
  titleImage:string,
  content:[{
    type:string,
    value:string
  }],
  contentImages:[{
    path:string,
    position:number,
    fileName:string,
    _id:string
  }],
  
}

interface ContentImage{
    path?:string,
    position:number,
    fileName:string,
    preview?:string,
    _id:string,
    id:number
}

const getLocalContentImages = (): ContentImage[] => {
  const localData = localStorage.getItem("localContentImages");
  if (!localData) return []; // Return empty array if no data exists

  try {
    console.log("localDAta (contentImages) inside hook ", localData);
    const parsedData = JSON.parse(localData);
    // Validate that parsedData is an array and matches the ContentImage structure
    if (Array.isArray(parsedData) && parsedData.every(item => (
      typeof item._id === 'string' &&
      typeof item.id === 'number' &&
      typeof item.fileName === 'string' &&
      typeof item.preview === 'string' &&
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
              const titleImage = localStorage.getItem("titleImage") || '';
              if(titleImage){
                setLocalPostData(prev => ({...prev, 
                  imagePreview:titleImage
                }))
              }

              if (post?.titleImage && !titleImage) {
                console.log("IF post.titleImage ", post.titleImage ," titleImage got grom localStorage: ", titleImage);
                localStorage.setItem('titleImagePreview', titleImage);
                setLocalPostData(prev => ({...prev, 
                  imagePreview:titleImage
                }))
              }
              // console.log("newImage Preview outside if: ",newImagePreview);
              localStorage.setItem("titleImage", post?.titleImage);
           
          }
          catch(err){
            console.error("Got error while accessing image: ", err);
          }
          finally{
            setLoadingTitleImage(false)
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
              const titleStored = JSON.parse(localStorage.getItem("titleStorage") || '""');
              const newTitle = post?.title && !titleStored ? post.title : titleStored;
      
              // load Save content Text (Text Data of Post)
              const localContentText = JSON.parse(
                localStorage.getItem("textContent") || '""'
              );
              
              const newContentText =
                post?.content && !localContentText
                  ? post.content.find((content) => content.type === "text")?.value ||
                    '""'
                  : localContentText;
              
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
                  // alert("isContentImagesValid true and if runs")
                  console.log("contentImages before running separate funcitno ", post?.contentImages);
                  let localContentImages:ContentImage[] = getLocalContentImages();
                  console.log("localContentImages after fetching from separate func: ", localContentImages, " post.contentImages: older version", post.contentImages);
                  const notLocalImages = !localContentImages.length ||
                  localContentImages.some(image => !image._id || image.fileName || !image.position);

                  if (notLocalImages) {
                    const newImages:ContentImage[] = post.contentImages.map((image, index) => ({
                      _id:image._id,
                      id: index,
                      fileName: image.fileName,
                      preview: image.path.startsWith("http://")
                        ? image.path
                        : `${VITE_API_URL}/${image.path}`,
                      position: image.position,
                    }));
                    console.log("if Not localImages & newImages created: ", newImages)
                    setReceiveLocalImages(newImages);
                    localStorage.setItem(
                      "localContentImages",
                      JSON.stringify(newImages)
                    );
                  }
                  else {
                    // console.log("LOCALLLLL IMAGESSSS ", localContentImages)
                    setReceiveLocalImages(localContentImages);
                  }
                } else{
                  console.log("isContentImage invalid contentImages", post?.contentImages)
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
      console.log('loading: ', loadingTitleImage)
      // console.log("BEFORE RETURN postLoading: ", 'localPostData :', localPostData, "receiveLocalImages ",receiveLocalImages);
      return {postLoading, localPostData, receiveLocalImages}
}

export default useFetchLocalData;