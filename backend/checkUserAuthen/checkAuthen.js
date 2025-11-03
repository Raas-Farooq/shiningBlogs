import jwt from 'jsonwebtoken';
import { User } from '../models/model.js';

const CheckAuthen = async(req, res) => {
    const token = req.cookies.token;
     console.log("Token inside authentication ",token);
    if(!token){
        return res.status(401).json({
            isAuthenticated:false
        })
    }
    try{
        jwt.verify(token, process.env.JWT_SECRET,
            async (err, decoded) => {
                if(err){
                    return res.status(401).json({
                        isAuthenticated:false
                    })
                }
                try{
                    const userId = decoded.user.userId;
                    const user = await User.findById(userId).select('-password');
                    console.log("got user inside Authenticaton ", user)
                    if(!user){
                        return res.status(404).json({
                            success:false,
                            message:'User not found'
                        })
                    }
                    return res.status(200).json({isAuthenticated:true, user,token});
                }
                catch(err){
                    return res.status(500).json({
                        success:false,
                        message:'Got server err while varifying authentication'
                    })
                }
            }
        )
    }catch(err){
        res.status(401).json({
            success:false,
            message:"CheckAuthentication failed",
            error: err.message
        })
    }
    
}

export default CheckAuthen;