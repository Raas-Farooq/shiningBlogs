import { ExpressValidator } from "express-validator";
import express from 'express';
import rateLimit from "express-rate-limit";
import { body} from "express-validator";
import {registerUser, logging, addBlog, updateBlogPost, deleteBlog, updateUserProfile, logout, allUsers, getUser, allBlogs} from "../controllers/blogController.js";
import authMiddleware from "../middleAuthentication/authMiddleware.js";
import CheckAuthen from "../checkUserAuthen/checkAuthen.js";
import multer from 'multer';

const router = express.Router();


router.get('/checkAuthen', authMiddleware, CheckAuthen);

const registerLimiter= rateLimit({
    WindowMs:15 * 60 * 1000,
    max:5,
    message:"Too many attempts plz try again after 15 minutes"
})

router.post('/logout', logout);

router.post('/registerUser', registerLimiter, [
    body('username').isLength({min:3}).trim().escape().withMessage('Enter at Least 3 characters'),
    body('email').isEmail().normalizeEmail().withMessage("Should be in Valid Email format"),
    body('password').isLength({min:8}).withMessage("Enter atleat 8 characters")
], registerUser)

const loginLimiter = rateLimit({
    windowMs:15 * 60 * 1000,
    max:15
})

router.post('/userLogin',loginLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], logging), async(req,res) => {
    console.log("req. email: ", req.body.email)
}

const newBlogLimiter = rateLimit({
    windowMs:15 * 60 * 1000,
    max:10,
    message:"Too many blogs created plz try again after some time"
})

const upload = multer({dest:'uploads/'})

router.post('/addBlog', upload.fields([{name:'titleImage', maxCount:1}, {name:"contentImage", maxCount:10}]), newBlogLimiter, authMiddleware, [
    body('title').isLength({min:1, max:200}).trim().escape().withMessage("title should be btween 1 and 200 characters"),
    body('content').isJSON().withMessage("content should be in JSON format"),
    body('content').custom((value) => {
        try{
            const content = JSON.parse(value);
            if(!Array.isArray(content)) throw new Error("Content should be in Array form");
            content.forEach(data => {
                if(!['text', 'image'].includes(data.type)) throw new Error("type should be either text or image");
                if(data.type === 'text' && typeof data.value !== 'string') throw new Error("text should be in String form");
        });
        return true;
        }catch(err){
            throw new Error("error related to content format", err.message)
        }
        
    })
], addBlog)

const updateLimit = rateLimit({
    windowMs:15 * 60 * 1000,
    message:"Too many attempts try again later"
})
const storage = multer.memoryStorage();
const uploads = multer({storage:storage});

router.put('/updatedBlog/:id',updateLimit, authMiddleware,
    [
        body('title').optional().isLength({min:1, max:200}).trim().escape().withMessage("title should be btween 1 and 200 characters"),
        body('content').optional().isArray().withMessage("content should be in Array format"),
        body('content.*.type').optional().isIn(['text', 'image', 'video']).withMessage("Data should be in Text, image or video format"),
        body('content.*.value').optional().trim().escape(),
        body('content.*.url').optional().isURL().withMessage(" Url SHuold be Valid")  
    ],
    updateBlogPost
)

const deleteLimit = rateLimit({
    windowMs:15 * 60 * 1000,
    max:5
})
router.delete('/deleteBlog/:id', deleteLimit, authMiddleware, deleteBlog);

const updateUserLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3
})



router.put('/updateUserProfile', uploads.single('profileImg'), updateUserLimit, authMiddleware,
    // [
    //     body('username').isLength({min:3}).trim().escape().withMessage("Username length should be atleast 3 characters"),
    //     body('goal').isLength({min:30}).withMessage("Your goal should consist of atleast 30 characters")
    // ],
updateUserProfile
)

const getCurrentLimit = rateLimit({
    WindowMs:15 * 60 * 1000,
    max:10
})
router.get('/current', authMiddleware,
    [
        body('email').isEmail().normalizeEmail()
    ]
)

router.get('/allUsers', allUsers);
router.get('/allBlogs', allBlogs);
router.get('/getUser', authMiddleware, getUser);

export default router;