import bcrypt from 'bcrypt';
import {Blog, User} from '../models/model.js';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleAuthentication/authMiddleware.js';




const registerUser = async (req,res) => {
    
    const errors = validationResult(req);
    console.log("validation Result to Err: ", errors);
    if(!errors.isEmpty()){
        return res.status(404).json({
            success:false,
            message:"Validation Error",
            error:errors.array()
        })
    }

    try{
            
        console.log("webLog is Growing faster than Plant ");
        const {username, email, password} = req.body;
        console.log("webLog is Growing faster than Plant ", username, " ", email);
        const isUserExist = await User.findOne({email});

        if (isUserExist){
            return res.status(404).json({
                success:false,
                message:"Username or email already Taken",
            })
        }
        const saltRange = 10;
        const protectedPassword = await bcrypt.hash(password, saltRange);
        console.log("protected Password", protectedPassword);
        const newUser = new User({
            username: username,
            email:email,
            password:protectedPassword
        })

        
            await newUser.save();

           const newUserObject = newUser.toObject();
           console.log("newUserObject", newUserObject);

           delete newUserObject.password;

            res.status(201).json({
                success:true,
                message:"User Has been added",
                
            })
        
        
    }
    catch(err){
            res.status(500).json({
                success:false,
                message:`Error Occured while server processing`,
                err:err.message
            })
    }
    
}

// user Login Function

/**Handles user login by validating input, checking credentials, and generating a JWT token.
 * 
 * @param {Object} req - request Object : it have the user requests/data   
 * @param {Object} res - response Object:  it is used to send the responses back to user
 * @returns {Object} it shows the result of user responses after login attempt
 * 
 * @param {String} req.body.username - username of the user
 * @param {String} req.body.email - user email address
 * @param {String} req.body.password - user's password
 * 
 * @returns {Object} - JSON response with a status and message indicating the result of the login attempt.
 * @returns {Object} res.success - Indicates whether the login was successful.
 * @returns {string} res.message - Provides additional information on the result (e.g., errors or success messages).
 * 
 * @description This function This function uses bcrypt for password comparison and jwt for token generation.
 *              Also checks whether the user is valid who is trying to login and
 *              and it returns different responses like 200 for (Ok), 400 for (bad request), 
 *              404 for (Not Found) and 500 for (Server Error) 
 */


const logging =  async(req,res) => {
    //checking Result of Validation
    const loginErros = validationResult(req);
    if(!loginErros.isEmpty()){
        return res.status(400).json({
            success:false,
            message:"email or password not Valid",
            errors:loginErros.array()
        })
    }
    
    try{

        const {email, password}= req.body;
        // accessing User
        const user = await User.findOne({email});

        // if user didn't exist
        if(!user) {
            return res.status(404).json({
                success:false,
                message:"user didn't exist"
            })
        }
        // Match the provided password with the stored password
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            return res.status(404).json(
                {
                    success:false,
                    message:"password didn't Match. Try again please"
                }
            )
        }
        // Create a JWT token for the user
        console.log("user._id: ", user._id);
        jwt.sign(
            ({user:{userId:user._id, email:user.email}}), 
            process.env.JWT_SECRET,
             {expiresIn: '1h'}
             , (err, token) => {
                if(err){
                    console.log(' error occured ');
                    throw(console.error)
                }

                return res.status(201).json({success:true, message:"logged in and Successfully created the token", token})

             }
            )
        // res.status(201).json({
        //     success:true,
        //     message:"Successfully Logged In",
        //     user
        // })
    }
    // Handle server errors
    catch(err){
        res.status(500).json({
            success:false,
            message:`server Error Occured while logging`,
            err:err.message
        })
    }
}


const addBlog = async (req,res) => {

    console.log("AddBlog Running :",)
    const {title, content} = req.body;
    const user_id = req.user.userId;
    console.log("user _id  :", user_id)
    try{
        const newBlog = new Blog({
            userId:user_id,
            title:title,
            content:content
        })

        const blogCreated = await newBlog.save();
        if(!blogCreated){
            return res.status(404).json({
                success:false,
                message:"Not Able to Create Blog. Try again Later",
                
            })
        }
        res.status(201).json({
            success:true,
            message:"BlogPost has been Created successfuly"
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Server responded with Errror",
            error:err.message
        })
    }

}

/**
 * the Purpose of this function is to update the blog post by authenticating the valid user
 * and updating the content (textContent, images or videos) and title of the Blog Post 
 * @param {Object} req - user's request 
 * @param {Object} res - responses send back to the user 
 * @param {return} return the success/fail result of update
 * 
 * @param {body} req.content - user new content 
 * @param {body} req.title - updated title
 * @param {req} req.user.id - id of the user, got by authMiddleWare  
 *  
 * @returns {Object} res.success - Indicates whether the login was successful.
 * @returns {string} res.message - Provides additional information on the result (e.g., errors or success messages).
 */
const updateBlogPost = async(req,res) => {

    // checking the validation Result
    const errs = validationResult(req);

    if(!errs.isEmpty()){
        return res.status(400).json({
            success:false,
            message:"Validation Error",
            error:errs.array()
        })
    }

    // 
    const user_id = req.user.userId;
    const { new_title, new_content} = req.body;
    const id = req.params.id; 

    try{
        //updating a blog

        const blogPost = await Blog.findById(id);

        if(!blogPost){
            res.status(404).json({
                success:false,
                message:"Not found the Blog Post",
            })
        }

        if(blogPost.userId.toString() !== user_id){
            return res.status(403).json({
                success:false,
                message:"you are not authorize to Updte it"
            })
        }

        if(new_title) blogPost.title = new_title;
        if(new_content) blogPost.content = new_content;

        await blogPost.save();
        // successfully updated the blogPost
        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog: updatedBlog
          });
    }
    catch(error){
        res.status(500).json({
            success:true,
            message:"Server responded with error while updating the Blog"
        })
    }
}
export {registerUser, logging, addBlog, updateBlogPost}