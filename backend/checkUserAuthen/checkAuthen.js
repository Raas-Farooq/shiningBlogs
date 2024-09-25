import jwt from 'jsonwebtoken';
import { User } from '../models/model.js';

const CheckAuthen = async(req, res) => {
    const token = req.cookies.token;
    console.log("token in CheckAuthen: ", token);
    console.log("user id inside check Auth: ", req.user.userId);
    if(!token){
        return res.status(401).json({
            isAuthenticated:false
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, {expiresIn:'1h'},
        async (err, decoded) => {
            if(err){
                return res.status(401).json({
                    isAuthenticated:false
                })
            }
            console.log("succESS")
            const user = await User.findById(req.user.userId).select('-password');

            console.log('user inside the authentication: ', user)
            res.status(200).json({isAuthenticated:true, user});
        }
    )
}

export default CheckAuthen;