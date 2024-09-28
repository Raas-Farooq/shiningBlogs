import { useState } from "react";
import { Link } from "react-router-dom"
import axios from 'axios';

export default function Write() {

    const [blogTitle, setBlogTitle] = useState({
        title:'',
        titleImg:null,
        imgPreview:''
    })
    const [contentText, setContentText] = useState('');
    const [contentImages, setContentImages] = useState([]);

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

    }
    const handleContent = (e) => {
        console.log(`blogContent name: ${e.target.name}, value ${e.target.value}`)
        setContentText(
          e.target.value
        )

        console.log("content after setting the value: ", contentText)
    }

    const handleContentImage=(e) => {

        const image = e.target.files[0];

        setContentImages(prev => ([
            ...prev,
            {
                type:'image',
                url:URL.createObjectURL(image)
            }    
        ]))

        console.log("content inside handle Image: ", contentImages);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("your title ", blogTitle);
        console.log("your Content: ", contentText);
        console.log("this is the contentImages: ", contentImages);
        let contentArray = [{
            type:'text',
            value:contentText
        }];

        
        contentImages.map(image => (
            contentArray.push(image)
        ))

        const blogData = new FormData();
        blogData.append('content', JSON.stringify(contentArray));
        console.log("contentArray: ", contentArray);
        // console.log("blog Data: ", blogData);

        try{
            const response = await axios.post('http://localhost:4100/weblog/addBlog', 
            blogData, 
            {},
            {withCredentials:true}
        );
            console.log("response after sending new Blog: ", response);
        }catch(err){
            console.log("error while posting new Blog ", err)
        }
    }
    return(
        <div className="page-content">
            {console.log("content ")}
            <h1> I am Write </h1> 
            <form method="post" className="ml-5 flex flex-col">
                <label for="title" className="text-blue-500"> Enter your title</label>
                <input type="text"
                 name="title" 
                 placeholder="enter the Title of Blog" 
                 className="border border-gray-500 mt-4 w-100" 
                 onChange={handleTitles}
                 required/>
                
                <label htmlFor="titleImage" className="text-blue-500">Upload Your Title Image</label>
                <input type="file" name="titleImg" accept="image/*" onChange={handleTitleImage} className="w-fit" /> 
                {blogTitle && blogTitle.imgPreview ? <img src={blogTitle.imgPreview} className="w-24 h-24 mt-3" /> : ''}
                <label for="content" className="break-all"></label>
                
                <div>
                    <textarea placeholder="start writing your Blog"
                    name="value"
                    className="border-gray-500 border w-4/5 h-[350px] mt-4"
                    onChange={handleContent}
                    required
                    />
                    <div className="absolute bottom-24">
                        <label htmlFor="imageUpload" className="bg-blue-500 rounded p-2 mr-4"> upload Your Image</label>
                        <input type="file" 
                        name="image"
                        accept="image/*" 
                        onChange={handleContentImage} 
                        id="contentImg" />
                    </div>
                </div>
               <button type="submit" onClick={handleSubmit} className="border border-blue-400 bg-red-500 w-fit mt-4 p-2">Create New Blog</button>
            </form>
            <button><Link to={'/'} className=''> Back To Home</Link></button>
        </div>
    )
} 