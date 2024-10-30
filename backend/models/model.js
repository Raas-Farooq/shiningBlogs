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
    
    TopicsInterested:{
        type:[String]
    },
    goal:{
        type:String
    },
    profileImg:{
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

usersSchema.index({username:1}, {unique:true});
usersSchema.index({email:1}, {unique:true});

const User = mongoose.model('User', usersSchema)

// User.createCollection().then(function(collection) {
//     console.log("this is the collections created: ", collection);
// })


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
        type:{
            type:String,
            enum:['text']
        },
        value:String
    }]
,
    contentImages:[{
        path:String,
        position:Number,
        fileName:String
    }]
,
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