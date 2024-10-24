import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
import ContentImages from "../Components/contentSection/ContentImage";

export default function Write() {

    const [blogTitle, setBlogTitle] = useState({
        title:'',
        titleImg:null,
        imgPreview:''
    });
    const moveTo = useNavigate();
    const currentTextArea = useRef(null);
    const [cursorPosition, setCursorPosition] = useState(0);
    // const [titleErr, setTitleErr] = useState('');
    const [errors, setErrors] = useState({});
    const [contentText, setContentText] = useState('');
    const [imagesShortNames, setImagesShortNames] = useState([]);
    const [contentImages, setContentImages] = useState([]);

    function smallText(text){
        console.log("smallText Function Runs");
        const joined = text.split(' ');
        

        const short = joined.slice(0,3).join(' ');
        return short
       
    }

    

    useEffect(() => {
        console.log("contentImages useEffect: ",contentImages);
        // console.log("blogTitle.title: ",blogTitle.title);
        // console.log("blogTitle.titleImg: ",blogTitle.titleImg);
    }, [contentImages])
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
        const myText = 'the light of your heart and the love with Allah (SWT) all of the things made you more strong and enable you to achieve your goals';
        
        setContentText(e.target.value)
        if(errors.textContentError){
            errors.textContentError = "";
            setErrors(errors);
        }
  
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
        const images = contentImages.filter(image => image.id != id);
        setContentImages(images);
        console.log("newText inside removeContentImage: ", newText.join(" "));
        const newContent = newText.join(" ");
        setContentText(newContent)
        // console.log("Received Id inside The Write pPost ", id);
    }

    const checkValidation = () => {
        const validationErrors = {};
        if(!blogTitle.title){
            validationErrors.titleError = "Title is Missing"
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
            let contentArray = [{
                type:'text',
                value:contentText
            }];
            const blogData = new FormData();
            blogData.append('title', blogTitle.title);
            blogData.append('titleImage', blogTitle.titleImg);
            blogData.append('content', JSON.stringify(contentArray));
            if(contentImages){
                contentImages.forEach((image, index ) => {
                    blogData.append(`contentImage`, image.imageFile);
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
            console.log("error while posting new Blog ", err)
            }
        }
        
            
            
        
    }


    return(
        <div className="page-content">
            {console.log('images inside DOM',contentImages)}
            <h1> I am Write </h1> 
            <form method="post" className="ml-5 flex flex-col">
                <label htmlFor="title" className="text-blue-500"> Enter your title</label>
                <input type="text"
                 name="title" 
                 placeholder="enter the Title of Blog" 
                 className="border border-gray-500 mt-4 w-100" 
                 onChange={handleTitles}
                 
                 value={blogTitle.title}
                 required/>
                
                {errors.titleError && <p className="text-red-600"> {errors.titleError}* </p> }
                <label htmlFor="titleImage" className="text-blue-500">Upload Your Title Image</label>
                <input type="file" name="titleImg" accept="image/*" onChange={handleTitleImage} className="w-[88px] cursor-pointer" /> 
                {blogTitle && blogTitle.imgPreview ? <img src={blogTitle.imgPreview} className="w-24 h-24 mt-3" /> : ''}
                {errors.titleImageError && <p className="text-red-600 font-larger"> {errors.titleImageError}* </p> }
                <label for="content" className="break-all"></label>
                
                <div>
                
                    <textarea placeholder="start writing your Blog"
                    ref={currentTextArea}
                    name="value"
                    className="border-gray-500 border w-4/5 h-[350px] mt-4 px-16"
                    onChange={handleContent}
                    onClick={handleAreaSelect}
                    onKeyUp={handleAreaSelect}
                    value={contentText}
                    required
                    />
                    {contentImages.length && <ContentImages contentImages={contentImages} removeImage={removeContentImage} contentText={contentText} />}
                    <div className="absolute top-52 right-56">
                        <label htmlFor="imageUpload" className="text-bold p-2 mr-4"> </label>
                        <input type="file" 
                        name="image"
                        accept="image/*" 
                        onChange={handleContentImage} 
                        className="w-[88px] cursor-pointer"
                        id="contentImg" />
                        <div className="">

                        </div>
                        
                    </div>

                    
                </div>
                {errors.textContentError && <p className="text-red-600 font-larger absolute top-[40%] right-48"> {errors.textContentError}* </p> }
               <button type="submit" onClick={handleSubmit} className="border border-blue-400 bg-red-500 w-fit mt-4 p-2">Create New Blog</button>
            </form>
            
            <button><Link to={'/'} className=''> Back To Home</Link></button>
        </div>
    )
} 