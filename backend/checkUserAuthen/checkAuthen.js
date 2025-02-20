import jwt from 'jsonwebtoken';
import { User } from '../models/model.js';

const CheckAuthen = async(req, res) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            isAuthenticated:false
        })
    }
    try{
        jwt.verify(token, process.env.JWT_SECRET, {expiresIn:'1h'},
            async (err, decoded) => {
                if(err){
                    return res.status(401).json({
                        isAuthenticated:false
                    })
                }
                console.log("succESS")
                const user = await User.findById(req.user.userId).select('-password');
                res.status(200).json({isAuthenticated:true, user,token});
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