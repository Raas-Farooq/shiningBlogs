
import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const UploadImage = async(req,res) => {

    const image = req.file;
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,     
        api_secret:process.env.CLOUDINARY_SECRET_KEY, 
        secure:true
    })

    try{
        const uploadImage= await cloudinary.uploader.upload(
            image.path,{
                folder:'ShinningBlogsImages'
            }
        ).catch(err => console.error('cloudinary caught error', err))
        return res.status(200).json({
            success:true,
            message:"uploaded on cloudinary",
            cloudinary_link:uploadImage.secure_url,
            public_id:uploadImage.public_id
        })
    }catch(err){
        console.log("error while uploading image on cloudinary", err.message);

        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

export default UploadImage