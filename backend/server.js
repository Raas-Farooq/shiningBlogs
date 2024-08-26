import express from 'express';
import databaseConnection from './config/db.js';
import bcrypt from 'bcrypt';
import {User} from './models/model.js';

const app = express();

app.use(express.json());

const port = process.env.PORT || 4100;
databaseConnection()

app.get('/weblog/registerUser', async (req,res) => {
    console.log("My App is running ");
    const {newUsername, newEmail, newPassword} = req.body;

    try{
        const protectedPassword = await bcrypt.hash(newPassword, 10);
        
        const newUser = new User({
            username: newUsername,
            email:newEmail,
            password:protectedPassword
        })

        
            await newUser.save();

            if(!newUser){
                res.status(404).json({
                    success:false,
                    message:`Something goes wrong`,
                    err:err.message
                })
            }
            
            res.status(201).json({
                success:true,
                message:"User Has been added"
            })
        
        
    }
    catch(err){
        if(err.code === 11000){
            const errElement = Object.keys(err.keyCode[0]);

            res.status(404).json({
                success:false,
                message:`${errElement} has already defined, take any other element`,
                err:err.message
            })
        }

        if(err.name === 'ValidationError'){

            res.status(404).json({
                success:false,
                message:"Validation Error",
                error:err.message
            })
        }
        else{
            res.status(500).json({
                success:false,
                message:`Error Occured while server processing`,
                err:err.message
            })
        }
    }
    
})

app.listen((port), () => console.log("App is running On ", port));


