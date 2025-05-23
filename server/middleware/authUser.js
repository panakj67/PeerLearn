import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
    const { token } = req.cookies;
    
    try {
        
        if(!token){
            return res.json({success : false, message : "Not Authorised"});
        }        
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.user = { id : decode.id}
        next();
    } catch (error) {
        return res.json({success : false, message : error.message});
    }
}
