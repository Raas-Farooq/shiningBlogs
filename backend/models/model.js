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

const blogSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    titleImage:{
        type:String,
        required:true
    },
    
    content:[{
        type:{type:String, enum:['text', 'image', 'video']},
        value:String,
        url:String
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
}, {
    timestamps:true,
    collection:'Blogs'
})

const Blog = mongoose.model('blog', blogSchema)
export {User, Blog}