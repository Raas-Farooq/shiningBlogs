import { useEffect, useState } from "react";
import fetchImageAsBase64 from "./fetchImageBase64.ts";
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
const [postLoading, setPostLoading] = useState<boolean>(false);
const [savedTitleImage, setSavedTitleImage] = useState('');
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
        let newImagePreview:string = '';
        console.log("Post inside UseEffect of fetchLocalData: ", post);
            const loadTitleImage = async() => {
              const titleImage = localStorage.getItem("titleImagePreview") || '';
              if(titleImage){
                setSavedTitleImage(titleImage);
              }

              if (post?.titleImage && !titleImage) {
                newImagePreview = (await fetchImageAsBase64(post.titleImage) || '""') ;
                localStorage.setItem('titleImagePreview', newImagePreview);
                setSavedTitleImage(newImagePreview)
              }
              // console.log("newImage Preview outside if: ",newImagePreview);
              localStorage.setItem("titleImage", post?.titleImage);
              // setSavedTitleImage(newImagePreview);
            }
            loadTitleImage();
      },[post?.titleImage])



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
            // console.log('localContentText:initialLoad ',localContentText);
            const newContentText =
              post?.content && !localContentText
                ? post.content.find((content) => content.type === "text")?.value ||
                  '""'
                : localContentText;

            setLocalPostData((prev) => ({
              ...prev,
              title: newTitle || "",
              titleImage: post.titleImage || "",
              imagePreview: savedTitleImage || "",
              contentText: newContentText || "",
            }));
             // JSON.parse(localStorage.getItem("localContentImages")) || [];
            // load content Images
            if (post?.contentImages) {
              let localContentImages:ContentImage[] = getLocalContentImages();
              // console.log("localContentImages on initial load: ", localContentImages, " post.contentImages: ", post.contentImages);
              const notLocalImages = !localContentImages.length ||
              localContentImages.some(image => !image._id || !image.fileName || !image.position);

              if (notLocalImages) {
                console.log("contentImages: if local is empty", post.contentImages);
                const newImages:ContentImage[] = post.contentImages.map((image, index) => ({
                  _id:image._id,
                  id: index,
                  fileName: image.fileName,
                  preview: image.path.startsWith("http://")
                    ? image.path
                    : `http://localhost:4100/${image.path}`,
                  position: image.position,
                }));
                setReceiveLocalImages(newImages);
                localStorage.setItem(
                  "localContentImages",
                  JSON.stringify(newImages)
                );
              } else {
                console.log("LOCALLLLL IMAGESSSS ", localContentImages)
                setReceiveLocalImages(localContentImages);
              }
            }
          } catch (err) {
            console.error("Error while receiving post", err);
          } finally {
            setPostLoading(false);
          }
        }
    
        loadInitialData();
      }, [post,savedTitleImage]);
      // console.log("BEFORE RETURN postLoading: ", 'localPostData :', localPostData, "receiveLocalImages ",receiveLocalImages);
      return {postLoading, localPostData, receiveLocalImages}
}

export default useFetchLocalData;