
import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const UploadImage = async(req,res) => {

    const image = req.file;
    
    console.log("image inside cloudinary ", image);
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,     
        api_secret:process.env.CLOUDINARY_SECRET_KEY
    })

    try{
        const uploadImage= await cloudinary.uploader.upload(
            image.path,{
                folder:'ShinningBlogsImages'
            }
        ).catch(err => console.error('cloudinary caught error', err))
        if(uploadImage){
            console.log("this is the Upload Image")
        }
        console.log("cloudinaryUploaded Image: ", uploadImage);
        return res.status(200).json({
            success:true,
            message:"uploaded on cloudinary",
            cloudinary_link:uploadImage.url
        })
    }catch(err){
        console.log("error while uploading image on cloudinary", err.message)
    }
}

export default UploadImage