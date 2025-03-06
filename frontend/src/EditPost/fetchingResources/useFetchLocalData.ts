import { useEffect, useState } from "react";
import fetchImageAsBase64 from "./fetchImageBase64.ts";
// import { useAuthenContext } from "../../globalContext/globalContext.tsx";

interface PostData{
  _id:string,
  userId:string,
  title:string,
  titleImage:string,
  content:[],
  contentImages:[],
  
}


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
const [receiveLocalImages, setReceiveLocalImages] = useState([])

    useEffect(() => {
        if(!post) return;
        let newImagePreview = '';
        console.log("Post inside UseEffect of fetchLocalData: ", post);
            const loadTitleImage = async() => {
              const titleImage = localStorage.getItem("titleImagePreview") || '53vff  1q6]''
              ;
              if(titleImage){
                setSavedTitleImage(titleImage);
              }

              if (post?.titleImage && !titleImage) {
                newImagePreview = await fetchImageAsBase64(post.titleImage) || '';
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
            const titleStored = JSON.parse(localStorage.getItem("titleStorage")) || '';
            const newTitle = post?.title && !titleStored ? post.title : titleStored;
    
            // load Save content Text (Text Data of Post)
            const localContentText = JSON.parse(
              localStorage.getItem("textContent")
            );
            // console.log('localContentText:initialLoad ',localContentText);
            const newContentText =
              post?.content && !localContentText
                ? post.content.find((content) => content.type === "text")?.value ||
                  ""
                : localContentText;

            setLocalPostData((prev) => ({
              ...prev,
              title: newTitle || "",
              titleImage: post.titleImage || "",
              imagePreview: savedTitleImage || "",
              contentText: newContentText || "",
            }));
    
            // load content Images
            if (post?.contentImages) {
              let localContentImages =
                JSON.parse(localStorage.getItem("localContentImages")) || [];
              // console.log("localContentImages on initial load: ", localContentImages, " post.contentImages: ", post.contentImages);
              if (post?.contentImages && localContentImages.length === 0) {
                // console.log("contentImages: if local is empty", post.contentImages);
                const newImages = post.contentImages.map((image, index) => ({
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

      return {postLoading, localPostData, receiveLocalImages}
}

export default useFetchLocalData;