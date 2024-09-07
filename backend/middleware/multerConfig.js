import multer from 'multer';
import path from 'path';


const storage= multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, "uploads/profileImgs")
    },
    
    filename:(req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const validFileType = ["image/jpg", "image/png", "image/jpeg"];

    if(validFileType.includes(file.mimetype)){
        cb(null, true)
    }
    else{
        cb(new Error('Only JPEG, JPG, and PNG formats are allowed'), false);
    }
}

const uploads = multer({
    storage:storage,
    limits:{fileSize: 2 * 1024 * 1024},
    fileFilter:fileFilter
})