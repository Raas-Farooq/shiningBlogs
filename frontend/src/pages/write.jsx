import { useState } from "react";
import { Link } from "react-router-dom"
import axios from 'axios';

export default function Write() {

    const [blogTitle, setBlogTitle] = useState({
        title:'',
        titleImg:null,
        imgPreview:''
    })
    const [titleErr, setTitleErr] = useState('');
    const [errors, setErrors] = useState({});
    // const [titleImgErr, setTitleImgErr] = useState('');
    // const [contentTextErr, setContentTextErr] = useState('');
    const [contentText, setContentText] = useState();
    const [imagesShortNames, setImagesShortNames] = useState([]);
    const [contentImages, setContentImages] = useState([]);

    function smallText(text){
        console.log("smallText Function Runs");
        const joined = text.split(' ');
        

        const short = joined.slice(0,3);
        setImagesShortNames((prev) => [
            ...prev,
            short
        ]);
       
    }

    


    const handleTitles = (e) => {

        
        console.log("value: ", e.target.value);
        console.log("name: ", e.target.name)
        setBlogTitle(prev => ({...prev, 
            [e.target.name]: e.target.value
        }))

        console.log("blogTitle after adding Title:", blogTitle);
    }

    const handleTitleImage= (e) => {
        const image=e.target.files[0];
        console.log("image when submitting: files[0]", image);
        setBlogTitle(prev => ({
            ...prev,
            titleImg:image,
            imgPreview:URL.createObjectURL(image)
        }))

        console.log(
            "Image attached with blogImage: ", blogTitle.titleImg
        )
    }
    const handleContent = (e) => {
        console.log(`blogContent name: ${e.target.name}, value ${e.target.value}`)
        setContentText(e.target.value)

        console.log("content after setting the value: ", contentText)
    }

    const handleContentImage=(e) => {

        const image = e.target.files[0];
        smallText(image.name);
        setContentImages(prev => ([
            ...prev,
            {
                type:'image',
                imageFile:image,
            }    
        ]))

        console.log("content inside handle Image: ", contentImages);
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
                    setBlogTitle({
                        title:'',
                        titleImg:null,
                        imgPreview:''
                    });
                    setContentImages([]);
                    setContentText('');
                    // setTitleErr('');
                    // setTitleImgErr('');
                    // setContentTextErr('')
                    alert('Blog Created Successfully');
                    }
            }
            
            catch(err){
            console.log("error while posting new Blog ", err)
            }
        }
        
            
            
        
    }


    return(
        <div className="page-content">
            {/* {console.log(`title Err ${titleErr} , image Error ${titleImgErr}`)} */}
            <h1> I am Write </h1> 
            <form method="post" className="ml-5 flex flex-col">
                <label htmlFor="title" className="text-blue-500"> Enter your title</label>
                <input type="text"
                 name="title" 
                 placeholder="enter the Title of Blog" 
                 className="border border-gray-500 mt-4 w-100" 
                 onChange={handleTitles}
                 required/>
                
                {errors.titleError && <p className="text-red-600"> {errors.titleError}* </p> }
                <label htmlFor="titleImage" className="text-blue-500">Upload Your Title Image</label>
                <input type="file" name="titleImg" accept="image/*" onChange={handleTitleImage} className="w-[88px] cursor-pointer" /> 
                {blogTitle && blogTitle.imgPreview ? <img src={blogTitle.imgPreview} className="w-24 h-24 mt-3" /> : ''}

                {errors.titleImageError && <p className="text-red-600 font-larger"> {errors.titleImageError}* </p> }
                <label for="content" className="break-all"></label>
                
                <div>
                
                    <textarea placeholder="start writing your Blog"
                    name="value"
                    className="border-gray-500 border w-4/5 h-[350px] mt-4"
                    onChange={handleContent}
                    required
                    />
                    
                    <div className="absolute bottom-28">
                        <label htmlFor="imageUpload" className="text-bold p-2 mr-4"> upload Your Image</label>
                        <input type="file" 
                        name="image"
                        accept="image/*" 
                        onChange={handleContentImage} 
                        className="w-[88px] cursor-pointer"
                        id="contentImg" />
                        <div className="">

                        {imagesShortNames.length > 0 && <ul className="flex gap-2"> {imagesShortNames.map((short, ind) =>  <li key={ind} className="bg-gray-300">{ind+1}-{short}</li>)} </ul>}
                        </div>
                       
                    </div>

                    
                </div>
                {errors.textContentError && <p className="text-red-600 font-larger"> {errors.textContentError}* </p> }
               <button type="submit" onClick={handleSubmit} className="border border-blue-400 bg-red-500 w-fit mt-4 p-2">Create New Blog</button>
            </form>
            <button><Link to={'/'} className=''> Back To Home</Link></button>
        </div>
    )
} 