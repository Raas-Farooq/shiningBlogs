import { useEffect, useState } from "react";
import fetchImageAsBase64 from "./fetchImageBase64";
import { useAuthenContext } from "../../globalContext/globalContext";


const useFetchLocalData = (post) => {
const {loading, setLoading} = useAuthenContext();
const [savedTitleImage, setSavedTitleImage] = useState('');
const [localPostData, setLocalPostData] = useState(
    {
        title:'',
        titleImage:'',
        contentText:'',
        imagePreview:'',
    }
)
console.log("post inside fetching local: ", post)
const [contentImages, setContentImages] = useState([])

    useEffect(() => {
        // if(!post) return;
        console.log("post inside fetching local: ", post)
        let newImagePreview = '';
            const loadTitleImage = async() => {
              const titleImage = localStorage.getItem("titleImagePreview");
              setSavedTitleImage(titleImage);
              if (post?.titleImage && !titleImage) {
                newImagePreview = await fetchImageAsBase64(post.titleImage);
                localStorage.setItem('titleImagePreview', newImagePreview);
                setSavedTitleImage(newImagePreview)
              }
              localStorage.setItem("titleImage", post?.titleImage);
              // setSavedTitleImage(newImagePreview);
            }
            loadTitleImage();
            console.log("savedTitleImage after loadTitleImage; ", savedTitleImage)
      },[post?.titleImage])



    useEffect(() => {
        async function loadInitialData() {
          if (!post) {
            setLoading(true);
            return;
          }
          try {
            const titleStored = JSON.parse(localStorage.getItem("titleStorage"));
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
            // console.log('New Content Text initial load: ', newContentText);
            console.log("IF savedTitleImage on initial load: ", savedTitleImage);
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
                setContentImages(newImages);
                localStorage.setItem(
                  "localContentImages",
                  JSON.stringify(newImages)
                );
              } else {
                setContentImages(localContentImages);
              }
            }
          } catch (err) {
            console.error("Error while receiving post", err);
          } finally {
            setLoading(false);
          }
        }
    
        loadInitialData();
      }, [post]);

      return localPostData
}

export default useFetchLocalData;