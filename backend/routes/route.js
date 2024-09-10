import { ExpressValidator } from "express-validator";
import express from 'express';
import rateLimit from "express-rate-limit";
import { body} from "express-validator";
import {registerUser, logging, addBlog, updateBlogPost, deleteBlog, updateUserProfile, allBlogs} from "../controllers/blogController.js";
import authMiddleware from "../middleAuthentication/authMiddleware.js";


const router = express.Router();

const registerLimiter= rateLimit({
    WindowMs:15 * 60 * 1000,
    max:5
})


router.post('/registerUser', registerLimiter, [
    body('username').isLength({min:3}).trim().escape().withMessage('Enter at Least 3 characters'),
    body('email').isEmail().normalizeEmail().withMessage("Should be in Valid Email format"),
    body('password').isLength({min:8}).withMessage("Enter atleat 8 characters")
], registerUser)

const loginLimiter = rateLimit({
    windowMs:15 * 60 * 1000,
    max:5
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

router.post('/addBlog', newBlogLimiter, authMiddleware, [
    body('title').isLength({min:1, max:200}).trim().escape().withMessage("title should be btween 1 and 200 characters"),
    body('content').isArray().withMessage("content should be in Array format"),
    body('content.*.type').isIn(['text', 'image', 'video']).withMessage("Data should be in Text, image or video format"),
    body('content.*.value').optional().trim().escape(),
    body('content.*.url').optional().isURL().withMessage(" Url SHuold be Valid")  
], addBlog)

const updateLimit = rateLimit({
    windowMs:15 * 60 * 1000,
    message:"Too many attempts try again later"
})
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
    max: 2
})

router.put('/updateUserProfile', updateUserLimit, authMiddleware,
    [
        body('username').isLength({min:3}).trim().escape().withMessage("Username length should be atleast 3 characters"),
        body('password').isLength({min:8}).withMessage("Password Length Should be More than 8 characters")
    ],
updateUserProfile
)

router.get('/getAllBlogs', allBlogs);


export default router;