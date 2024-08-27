import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        unique:true
    },
    password:{
        required:true,
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }                                                
},{
    timestamps:true,
    collection:'User'
})

const User = mongoose.model('User', usersSchema)


export {User}