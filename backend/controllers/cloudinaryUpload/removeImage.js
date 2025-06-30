import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

const RemoveImage = async(req,res) => {

     cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,     
            api_secret:process.env.CLOUDINARY_SECRET_KEY
        })

    try{
        let titleResult;
        let contentResult;
        if(req.body.public_id){
            titleResult = await cloudinary.uploader.destroy(req.body.public_id
            )
        }
        if(req.body.images_public_id){
            console.log("case of images_public_id ", req.body.images_public_id);
            if(!Array.isArray(images_public_id) || images_public_id.length < 1){
                return res.status(404).json({
                    success:false,
                    message:"empty or invalid public_ids"
                })
            }
            contentResult = await cloudinary.uploader.delete_resources(images_public_id);
        }
        return res.status(200).json({
            success:true,
            titleImageRemoved:titleResult,
            contentImagesRemoved:contentResult
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Got error while deleting cloudinary image",err
            
        })
    }
}

export default RemoveImage