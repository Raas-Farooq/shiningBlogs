// import {decode} from 'he';
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import {Blog, User} from '../models/model.js';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleAuthentication/authMiddleware.js';
import he from 'he';
// import { isConstructorDeclaration } from 'typescript';



const registerUser = async (req,res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({
            success:false,
            message:"Validation Error",
            error:errors.array()
        })
    }

    try{
            
        const {username, email, password} = req.body;
        const isUserExist = await User.findOne({email});

        if (isUserExist){
            return res.status(404).json({
                success:false,
                message:"Username or email already Taken",
            })
        }
        const saltRange = 10;
        const protectedPassword = await bcrypt.hash(password, saltRange);
        const newUser = new User({
            username: username,
            email:email,
            password:protectedPassword
        })

        
            await newUser.save();

           const newUserObject = newUser.toObject();
           delete newUserObject.password;
            jwt.sign({user: {userId:newUserObject._id}}, 
            process.env.JWT_SECRET, 
            {expiresIn:'1h'},
            (err,token) => {
                if(err){
                    return res.status(500).json({
                        success: false,
                        message: "Error while signing the token",
                    });
                }

                res.cookie('token', token, {
                    httpOnly:true,
                    secure:true,
                    maxAge:3600000,
                    sameSite:'None'

                })
                res.status(201).json({
                    success:true,
                    message:"User Has been added",
                    newUser:{
                        username: newUserObject.username,
                        email:newUserObject.email,
                        _id: newUserObject._id,
                    }
                    
                })
            }
        )
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
    const {email, password}= req.body;
    const loginErrors = validationResult(req);
    if(!loginErrors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:"email or password not Valid",
            errors:loginErrors.array()
        })
    }
    
    try{

        // accessing User
        const user = await User.findOne({email}).lean();
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
                    message:"password didn't Match. Try again please",
                    
                }
            )
        }
        // Create a JWT token for the user
        jwt.sign(
            ({user:{userId:user._id}}), 
            process.env.JWT_SECRET,
             {expiresIn: '1h'}
             , (err, token) => {
                if(err){
                    return res.status(500).json({
                        success:false,
                        message:"Got Error, Didn't able to sign the token!"
                    })
                }
                res.cookie('token', token, {
                    httpOnly:true,
                    secure:true,
                    maxAge:3600000,
                    sameSite:'None'
                })

                return res.status(201).json({
                    success:true, 
                    message:"logged in and Successfully created the token",
                    token,
                    user
                })

             }
            )
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


// Update User name

/**
 * 
 * @param {Object} req - requests from user
 * @param {Object} res - response to user  
 * 
 * @param {body} profileImage - title image of the user
 * @param {body} username - name of the user 
 */

const current = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({
            success:false,
            message:"Vaidation Error Occured"
        })
    }
    try{
        const {email} = req.body;
        
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Unable to find the requested user. Try Again"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Successfully access the User"
        })
    }

    catch(err){
        res.status(500).json({
            success:false,
            message:"Got server error while getting the user"
        })
    }
}


const updateUserProfile = async (req, res) => {

    const errors = validationResult(req);
    const userId = req.user.userId;
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:"Not a valid data"
        })
    }
    
    const {username, email,goal} = req.body;
    const interests = req.body.interests ? JSON.parse(req.body.interests) : undefined;
    const user = await User.findById(userId);
    if(user._id.toString() !== userId){
        return res.status(403).json(
            {
                success:false,
                message:"You are not authorized to Edit this Profile"
            })
    }

    
    try{
        let updatingUser = {};
        if(username) updatingUser.username = username;
        if(email) updatingUser.email = email;
        if(req.file){
        
            updatingUser.profileImg=req.file.path;
        }
        if(goal) updatingUser.goal = goal;
        if(interests) updatingUser.TopicsInterested = interests;
        
        const updateUserProfile = await User.findByIdAndUpdate(userId,
            {
                $set:updatingUser,
            },
            {new:true, runValidators:true}
        )
        if(!updateUserProfile){
            return res.status(401).json({
                success:false,
                message:"Failed to update the Profile",
                }
            )
        }
        return res.status(200).json({
            success:true,
            message:" User Profile Updated",
            new_Profile:updateUserProfile
        })
 
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to Update the User",
            err:err.message
        })
    }

}



const addBlog = async (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:"errors came during validation",
            error: errors.array()
        })
    }
    const {content,contentImages, public_id} = req.body;
    const titleCorrected = he.decode(req.body.title);
    const user_id = req.user.userId;
    const titleImage = req.body.titleImage;
    try{
        const newBlog = new Blog({
            userId:user_id,
            title:titleCorrected,
            titleImage,
            content:JSON.parse(content),
            contentImages:JSON.parse(contentImages),
            public_id:public_id
            
        });
        const blogCreated = await newBlog.save();
        if(!blogCreated){
            return res.status(404).json({
                success:false,
                message:"Unable to Create Blog. Try again Later",   
            })
        }
        return res.status(201).json({
            success:true,
            message:"BlogPost Created successfuly",
            newBlog
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server Error",
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
        console.log("validation errors msg :", errs);
        return res.status(400).json({
            success:false,
            message:errs.array()[0]?.msg || 'Validation failed',
            name:'validationError',
            error:errs.array()
        })
    }
    const user_id = req.user.userId;
    const {title, newContent, contentImages, public_id} = req.body;
    const updatedContentImages= JSON.parse(contentImages);
    const id = req.params.id; 
 
    const parsedContent = JSON.parse(newContent);
    
    const newTitleImage = req.body.titleImage;
    try{
        //updating a blog
        const blogPost = await Blog.findById(id);
        if(!blogPost){
            return res.status(404).json({
                success:false,
                message:"Not found the Blog",
            })
        }

        if(blogPost.userId.toString() !== user_id){
            return res.status(403).json({
                success:false,
                message:"you are not authorize to Updte it"
            })
        }
      
        if(title) blogPost.title = title;
        if(public_id) blogPost.public_id = public_id;
        if(parsedContent) blogPost.content = parsedContent;
       
        if(newTitleImage) blogPost.titleImage = newTitleImage;
      
        if(updatedContentImages) blogPost.contentImages = updatedContentImages;
        
        const updatedBlog = await blogPost.save();
       
        // successfully updated the blogPost
        if(!updatedBlog){
            return res.status(402).json({
                success:true,
                message:"Failed to update the Blog"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog: updatedBlog
          });
    }
    catch(error){
        res.status(500).json({
            success:true,
            message:"Server responded with error while updating the Blog",error
        })
    }
}

const deleteBlog = async(req, res) => {
    const delId = req.params.id;
    const userId = req.user.userId;

    try{
    
        const delBlog = await Blog.findById(delId);
        if(delBlog.userId.toString() !== userId){
            return res.status(403).json({
                success:false,
                message:"Not an Authorized User to delete a Blog"
            })
        }
        if(!delBlog) {
            return res.status(404).json({
                success:false,
                message:"coudn't find the Blog",

            })
        }

        await Blog.findByIdAndDelete(delBlog);
        return res.status(200).json({
            success:true,
            message:"Successfully Deleted the Blog"
        })                                                                                                                                                                                                                                                                                                                                                                                                   
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server error occured during deleting Process"
        })
    }
}

const allUsers = async(req,res) => {
    const users = await User.find({});
    try{
        if(!users.length){
            return res.status(400).json({
                success:false,
                message:"no blog found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Successfully accessed Blogs",
            users
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server Error while fetching all Users"
        })
    }
}

const getUser = async(req,res) => {
    const userId = req.user.userId;
    try{
        const user = await User.findById(userId);

        if(!user){
            message:"Server Error while finding a User"
             return res.status(401).json({
                success:false,
                message:'Unable to find User Id'
            })

        }

        return res.status(200).json({
            success:true,
            message:"The User has been Found Successfully",
            user
        })
    }catch(err){
        return res.status(500).json({
            success:false,
       })
    }
}

const getBlogPost = async(req,res) => {

    let blogId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(blogId)){
        return res.status(400).json({
            success:false,
            message:"Blog Id is invalid"
        })
    }
    try{
        const blog = await Blog.findById(blogId);     
        
        if(!blog){
            return res.status(404).json({
                success:false,
                message:"Blog doesn't found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Blog Found successfully",
            blogPost:blog
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message: "Something went wrong while fetching the blog post. Please try later."
        })
    }
}


const allBlogs = async(req, res) => {
    try{
        const blogs = await Blog.find({});
        if(!blogs){
            return res.status(401).json({
                success:false,
                message:"Blogs not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Successfully found the blogs",
            blogs
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"somewhere inside the server error is dancing",
            err:err.message
        })
    }
}

const canEditBlog = async(req,res) => {
    const userIdReceived = req.user.userId.toString();
    const blogId = req.params.id;
    try{
        const blog = await Blog.findById(blogId);
        if(!blog){
            res.status(404).json({
                success:false,
                message:"Blog not fuond",
            })
        }
        if(blog.userId.toString() === userIdReceived){
            return res.status(200).json({
                success:true,
                message:"Yes! you are authorize to Edit It",
                
            })
        }
        else{
            return res.status(403).json({
                success:false,
                message:"You are not the authorized user",
                error:'Not-Authorized'
            })
        }
        
    }catch(err){
        res.status(500).json(
            {
                success:false,
                message:"Server error while checking the privilege of user",
                error: err.message
            }
        )
    }

}
const getMyContent = async(req,res) => {
    const id = req.params.id;
    try{
        const yourBlogs = await Blog.find({userId:id});
        if(!yourBlogs || yourBlogs.length === 0){
            return res.status(404).json({
                success:false,
                message:"You don't have Content"
            })
        }

        return res.status(200).json({
            success:true,
            message:"your content found successfully",
            yourBlogs
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Server error while accessing your Posts",
            error: err.message
        })
    }
}

const logout = (req,res) => {
    res.clearCookie('token');
    return res.status(200).json({
        success:true,
        message:"Logout Successfully"
    })
}

export {current, registerUser, logging, getMyContent,allBlogs,addBlog, updateBlogPost, deleteBlog, updateUserProfile, getBlogPost, allUsers, getUser, logout, canEditBlog}

// privilege few are made