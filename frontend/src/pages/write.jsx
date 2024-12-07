import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
import ContentImages from "../Components/contentSection/ContentImage";
import { useGlobalContext } from "../globalContext/globalContext";

export default function Write() {

    const [blogTitle, setBlogTitle] = useState({
        title:'',
        titleImg:null,
        imgPreview:''
    });
    const moveTo = useNavigate();
    const currentTextArea = useRef(null);
    const {loggedIn} = useGlobalContext();
    const [cursorPosition, setCursorPosition] = useState(0);
    // const [titleErr, setTitleErr] = useState('');
    const [loadingErr, setLoadingErr] = useState(false);
    const [errors, setErrors] = useState({});
    const [contentText, setContentText] = useState('');
    const [imagesShortNames, setImagesShortNames] = useState([]);
    const [contentImages, setContentImages] = useState([]);

    function smallText(text){
        const joined = text.split(' ');
        

        const short = joined.slice(0,3).join(' ');
        return short
       
    }

    

    useEffect(() => {
        if(!loggedIn){
            const moveToLoginPage = window.confirm("you are logged out. please Login Again and Write Your Post");

            if(moveToLoginPage){
                moveTo('/login')
            }
        }
    }, [loggedIn,moveTo])


    const handleTitles = (e) => {
        // const errors = checkValidation();
        setBlogTitle(prev => ({...prev, 
            [e.target.name]: e.target.value
        }))
        if(errors.titleError){
            console.log("Yes")
            errors.titleError = "";
            
            setErrors(errors);
        }
    }
    function handleAreaSelect(){
        setCursorPosition(currentTextArea.current.selectionStart);
    }
    const handleTitleImage= (e) => {
        const image=e.target.files[0];
        console.log("image when submitting: files[0]", image);
        setBlogTitle(prev => ({
            ...prev,
            titleImg:image,
            imgPreview:URL.createObjectURL(image)
        }))
        if(errors.titleImageError){
            errors.titleImageError = "";
            setErrors(errors);
        }
        
    }
    const handleContent = (e) => {
        const originalPlaceholders = contentText.match(/\[image-\d\]/g) || [];
        const currentContent = e.target.value;
        const placeholders = currentContent.match(/\[image-\d+\]/g) || [];
        if(originalPlaceholders.length !== placeholders.length){
            alert("you can't remove the image placeholders manualy");
            console.log("you deleted the placeholder");
            return
        }
        if(errors.textContentError){
            errors.textContentError = "";
            setErrors(errors);
        }
        setContentText(e.target.value);
    }

    const handleContentImage=(e) => {

        const image = e.target.files[0];
        const shortName = smallText(image.name);
   
        const imageName = `[image-${contentImages.length}]`
        const beforeImage = contentText.substring(0, cursorPosition);
        const afterImage = contentText.substring(cursorPosition);
        const newContent = beforeImage + imageName + afterImage;

        setContentImages([
            ...contentImages,
            {
                id:contentImages.length,
                type:'image',
                file:image,
                fileName:shortName,
                preview:URL.createObjectURL(image),
                position:cursorPosition
            }    
        ])
        setContentText(newContent);
        // console.log("content inside handle Image: ", contentImages.length);
    }

    const removeContentImage = (id,newText) => {
        const images = contentImages.filter(image => image.id !== id);
        const updateImages = images.map((images, index) => ({
            ...images,
            id:index
        }))
        setContentImages(updateImages);
        setContentText(newText);
        let updatedText = newText;
        images.forEach((img, ind) => {
            const oldMark = `[image-${img.id}]`;
            const newMark = `[image-${ind}]`;
            // console.log(`oldMark ${oldMark} & newMark ${newMark}`);
            updatedText = updatedText.split(oldMark).join(newMark); 
        });
        
        console.log("updateImages: ", updateImages)
        setContentText(updatedText)


    }

    const checkValidation = () => {
        const validationErrors = {};
        if(!blogTitle.title){
            validationErrors.titleError = "Title is Missing"
        }
        if(blogTitle.title.length > 60){
            validationErrors.titleError = "Title length Must be under 60"
        }
        
        if(!blogTitle.titleImg){
            validationErrors.titleImageError = "You should Insert Title Image"
        }

        if(!contentText){
            validationErrors.textContentError = "Blog Must have some Text Content"
        }
        return validationErrors;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const seeErrors = checkValidation();
        if(Object.keys(seeErrors).length > 0){
            setErrors(seeErrors);
            alert("Some Necessary Data is Missing")
            return;
        }
        else{
            setErrors({});
            setLoadingErr(true);
            let contentArray = [{
                type:'text',
                value:contentText
            }];
            const blogData = new FormData();
            blogData.append('title', blogTitle.title);
            blogData.append('titleImage', blogTitle.titleImg);
            blogData.append('content', JSON.stringify(contentArray));
            
            if(contentImages){
                const positions = contentImages.map((img, index) => ({
                    position:img.position,
                    fileName:img.fileName
                }))
                blogData.append('positions', JSON.stringify(positions))
                contentImages.forEach((image, index ) => {
                    blogData.append(`contentImages`, image.file);
                })
                console.log("blogData: before sending",blogData);
            }

            try{

                const response = await axios.post('http://localhost:4100/weblog/addBlog', 
                blogData,
    
                    {
                        withCredentials:true,
                        headers:{
                            'Content-Type':'multipart/form-data'
                        }
    
                    }
                );
                console.log("response after sending new Blog: ", response);
                if(response.data.success){
                    console.log("response.data.success: ", response.data.success);
                    blogTitle.title="";
                    blogTitle.imgPreview = '';
                    setBlogTitle(prev => 
                        ({
                            ...prev,
                            title:"",
                            titleImg:"",
                            imgPreview:""
                        } )
                    );
                    setContentImages([]);
                    setContentText('');
                    setImagesShortNames([])
                    alert('Blog Created Successfully');
                    moveTo('/');
                }
            }
            
            catch(err){
                console.log("error while posting new Blog ", err.response.data);
                if(err.response.data.error === 'jwt expired'){
                    // alert("You are logged Out! Please Login In First");
                    const confirmMovingLogin = window.confirm("you Are Logged Out! please login and Come Again.");

                    console.log("confirmMOving : ", confirmMovingLogin);
                    if(confirmMovingLogin){
                        moveTo("/login")
                    }
                }
                
            }
            finally{
                setLoadingErr(false)
            }
        }
        
            
            
        
    }

    if(loadingErr) return (<h1> Processing </h1>)

    return(
        <div className="page-content">
            <form method="post" className="ml-5 flex flex-col">
                <label htmlFor="title" className="text-blue-500"> Enter your title</label>
                <input type="text"
                 name="title" 
                 placeholder="enter the Title of Post " 
                 className="border border-gray-500 w-100" 
                 onChange={handleTitles}
                 
                 value={blogTitle.title}
                 required/>
                <span className="text-xs"> *Title Length Must Not Exceed 60 characters</span>
                {errors.titleError && <p className="text-red-600"> {errors.titleError}* </p> }
                <label htmlFor="titleImage" className="text-blue-500 mt-4">Upload Your Title Image</label>
                <input type="file" name="titleImg" accept="image/*" onChange={handleTitleImage} className="w-[88px] cursor-pointer" /> 
                {blogTitle && blogTitle.imgPreview ? <img src={blogTitle.imgPreview} className="w-24 h-24 mt-3" /> : ''}
                {errors.titleImageError && <p className="text-red-600 font-larger"> {errors.titleImageError}* </p> }

                <label htmlFor="titleImage" className="text-blue-500 mt-5">Start Writing Your Post Content</label>
                <div className="">
                
                    <textarea placeholder="start writing your Blog"
                    ref={currentTextArea}
                    name="value"
                    className="border-gray-500 border w-4/5 h-[350px] mt-2 px-16"
                    onChange={handleContent}
                    onClick={handleAreaSelect}
                    onKeyUp={handleAreaSelect}
                    value={contentText}
                    required
                    />

                    <div className={`${blogTitle.imgPreview ? 'absolute top-[45%] right-[20%]' : 'absolute top-64 xs:right-28 sm:right-48 lg:right-56' }`}>
                        <label htmlFor="imageUpload" className="text-bold p-2 mr-4"> </label>
                        <input type="file" 
                        name="image"
                        accept="image/*" 
                        onChange={handleContentImage} 
                        className="w-[88px] cursor-pointer"
                        id="contentImg" />   
                    </div>
                    {contentImages.length > 0 && <ContentImages contentImages={contentImages} removeImage={removeContentImage} contentText={contentText} />}

                    
                </div>
                {errors.textContentError && <p className="text-red-600 font-larger absolute top-[40%] right-48"> {errors.textContentError}* </p> }
               <button type="submit" onClick={handleSubmit} className="border border-blue-400 bg-red-500 w-fit mt-4 p-2">Publish Post</button>
            </form>
            
            <button><Link to={'/'} className=''> Back To Home</Link></button>
        </div>
    )
} 