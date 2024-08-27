import express from 'express';
import databaseConnection from './config/db.js';
import bcrypt from 'bcrypt';
import {User} from './models/model.js';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
const app = express();

app.use(express.json());

const port = process.env.PORT || 4100;
databaseConnection()

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:5
})


app.post('/weblog/registerUser',registerLimiter,
[
    body('username').isLength({min:3}).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({min:8})
]
, async (req,res) => {

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
                message:"User Has been added"
            })
        
        
    }
    catch(err){
            res.status(500).json({
                success:false,
                message:`Error Occured while server processing`,
                err:err.message
            })
    }
    
})


const loginLimiter = rateLimit({
    windowMs:15 * 60 * 1000,
    max:5
})

app.get('/weblog/userLogin',loginLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async(req,res) => {

    const loginErros = validationResult(req);
    if(!loginErros.isEmpty()){
        return res.status(404).json({
            success:false,
            message:"email or password not Valid",
            errors:loginErros.array()
        })
    }
    
    try{
        const {email, password}= req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({
                success:false,
                message:"user didn't exist"
            })
        }

        const isPasswordMatched = await bcrypt.compare(user.password, password);
        if(!isPasswordMatched){
            res.status(404).json(
                {
                    success:false,
                    message:"password didn't Match. Try again please"
                }
            )
        }

        jwt.sign(
            ({userId:user._id, email:user.email}), 
            process.env.JWT_SECRET,
             {expiresIn: '1h'}
            )
        res.status(201).json({
            success:true,
            message:"Successfully Logged In"
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:`server Error Occured while logging`,
            err:err.message
        })
    }
})
app.listen((port), () => console.log("App is running On ", port));


