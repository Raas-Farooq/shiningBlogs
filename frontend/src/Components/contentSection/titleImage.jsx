import { useEffect, useState } from "react";


const Image= ({postImg, title, isFullView=false}) => {

    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        console.log("postImage inside IMAGE : ", postImg);
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




// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const EditPost = () => {
//     const [editPostData, setEditPostData] = useState({
//         title: '',
//         titleImage: null,
//         contentText: '',
//         imagePreview: ''
//     });
//     const [contentImages, setContentImages] = useState([]);
//     const [cursorPosition, setCursorPosition] = useState(0);
//     const currentArea = useRef(null);
//     const navigate = useNavigate();
//     const { state } = useLocation();
//     const post = state?.post;

//     useEffect(() => {
//         // Load saved title
//         const savedTitle = JSON.parse(localStorage.getItem('titleStorage'));
//         if (post?.title && !savedTitle) {
//             setEditPostData(prev => ({ ...prev, title: post.title }));
//             localStorage.setItem('titleStorage', JSON.stringify(post.title));
//         } else if (savedTitle) {
//             setEditPostData(prev => ({ ...prev, title: savedTitle }));
//         }

//         // Load saved title image preview or fetch if necessary
//         const storedImagePreview = localStorage.getItem('titleImagePreview');
//         if (post?.titleImage && !storedImagePreview) {
//             fetchImageAsBase64(post.titleImage);
//         } else if (storedImagePreview) {
//             setEditPostData(prev => ({
//                 ...prev,
//                 imagePreview: storedImagePreview,
//                 titleImage: JSON.parse(localStorage.getItem('imageName'))
//             }));
//         }

//         // Load content text
//         const storedContentText = JSON.parse(localStorage.getItem('textContent'));
//         if (post?.content && !storedContentText) {
//             const textContent = post.content.find(cont => cont.type === 'text')?.value || '';
//             setEditPostData(prev => ({ ...prev, contentText: textContent }));
//             localStorage.setItem('textContent', JSON.stringify(textContent));
//         } else if (storedContentText) {
//             setEditPostData(prev => ({ ...prev, contentText: storedContentText }));
//         }

//         // Load content images
//         if (post?.contentImages && contentImages.length === 0) {
//             const formattedImages = post.contentImages.map((image, index) => ({
//                 id: index,
//                 fileName: image.fileName,
//                 preview: `http://localhost:4100/${image.path}`,
//             }));
//             setContentImages(formattedImages);
//         }
//     }, []);

//     // Convert and store image as Base64
//     const fetchImageAsBase64 = (imagePath) => {
//         fetch(`http://localhost:4100/${imagePath}`)
//             .then(response => response.blob())
//             .then(blob => {
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                     localStorage.setItem('titleImagePreview', reader.result);
//                     localStorage.setItem('imageName', JSON.stringify(imagePath));
//                     setEditPostData(prev => ({ ...prev, imagePreview: reader.result }));
//                 };
//                 reader.readAsDataURL(blob);
//             })
//             .catch(console.error);
//     };

//     // Handle changes to the title input
//     const handleChange = (e) => {
//         const title = e.target.value;
//         localStorage.setItem('titleStorage', JSON.stringify(title));
//         setEditPostData(prev => ({ ...prev, title }));
//     };

//     // Handle changes to content text
//     const handleContentText = (e) => {
//         const contentText = e.target.value;
//         localStorage.setItem('textContent', JSON.stringify(contentText));
//         setEditPostData(prev => ({ ...prev, contentText }));
//     };

//     // Handle title image upload
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         convertImageToBase64(file);
//     };

//     const convertImageToBase64 = (file) => {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             localStorage.setItem('titleImagePreview', reader.result);
//             localStorage.setItem('imageName', JSON.stringify(file.name));
//             setEditPostData(prev => ({
//                 ...prev,
//                 titleImage: file.name,
//                 imagePreview: reader.result
//             }));
//         };
//         reader.readAsDataURL(file);
//     };

//     // Handle adding content images
//     const handleContentImages = (e) => {
//         const newImage = e.target.files[0];
//         if (!newImage) return;
//         const imageMark = `[image-${contentImages.length}]`;
//         const beforeImage = editPostData.contentText.substring(0, cursorPosition);
//         const afterImage = editPostData.contentText.substring(cursorPosition);
//         const newContentText = beforeImage + imageMark + afterImage;

//         setEditPostData(prev => ({ ...prev, contentText: newContentText }));
//         localStorage.setItem('textContent', JSON.stringify(newContentText));

//         const newImagePreview = URL.createObjectURL(newImage);
//         setContentImages(prev => [
//             ...prev,
//             { id: contentImages.length, fileName: newImage.name, preview: newImagePreview }
//         ]);
//     };

//     return (
//         <form className="flex flex-col gap-4 my-4 mx-2">
//             <input type="text" name="title" placeholder="Edit the Title" onChange={handleChange} value={editPostData.title} />

//             <div>
//                 <label htmlFor="image">Change Title Image</label>
//                 <input type="file" accept="image/*" name="titleImg" onChange={handleImageChange} />
//                 {editPostData.imagePreview && <img src={editPostData.imagePreview} alt={editPostData.title} className="h-52 w-56" />}
//             </div>

//             <textarea
//                 placeholder="Start writing your Blog"
//                 ref={currentArea}
//                 name="value"
//                 className="border-gray-500 border w-4/5 h-[350px] mt-4"
//                 onChange={handleContentText}
//                 onClick={() => setCursorPosition(currentArea.current.selectionStart)}
//                 onKeyUp={() => setCursorPosition(currentArea.current.selectionStart)}
//                 value={editPostData.contentText}
//                 required
//             />

//             <input type="file" accept="image/*" onChange={handleContentImages} />
//         </form>
//     );
// };

// export default EditPost;
