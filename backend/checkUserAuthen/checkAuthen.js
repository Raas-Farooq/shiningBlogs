import jwt from 'jsonwebtoken';

const CheckAuthen = async(req, res) => {
    const token = req.cookies.token;
    console.log("token in CheckAuthen: ", token);

    if(!token){
        return res.status(401).json({
            isAuthenticated:false
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, {expiresIn:'1h'},
        (err, decoded) => {
            if(err){
                return res.status(401).json({
                    isAuthenticated:false
                })
            }
            console.log("succESS")
            res.status(200).json({isAuthenticated:true});
        }
    )
}

export default CheckAuthen;