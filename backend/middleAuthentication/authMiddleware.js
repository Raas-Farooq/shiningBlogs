import jwt, {decode} from 'jsonwebtoken';

const authMiddleware = async(req,res, next) => {
    const token = req.header("Authorization")?.replace('Bearer ', '');

    if(!token) return res.status(404).json({success:false, message:"Unable to get Token Bearer"});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
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