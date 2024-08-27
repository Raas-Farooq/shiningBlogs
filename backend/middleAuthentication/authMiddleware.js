import jwt from 'jsonwebtoken';

const authMiddleware = async(req,res) => {
    const token = req.header("Authorization")?.replace('Bearer ', ' ');

    if(!token) return res.status(404).json({success:false, message:"Unable to get Token Bearer"});

    try{
        jwt.verify(token, process.env.JWT_SECRET);
        next()
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"server error while Token verification",
            error: err.message
        })
    }
    
}

export default authMiddleware;