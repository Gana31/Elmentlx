import jwt from 'jsonwebtoken';
import dotenv from'dotenv';
import userModel from '../model/userModel.js';
dotenv.config();


export const isAutheticated = async (req,res,next) => {
    const access_token = req.cookies["access_token"];
    // console.log("accesss TOken ",access_token)
    try {
        if(!access_token){
            const refresh_token = req.cookies["refresh_token"];
            if(!refresh_token){
                return res.status(400).json({message:"your are session are expired Please login to website",success:false});
            }
            return res.status(400).json({message:"Please refresh token",success:false});
        }
        const decoded = await jwt.verify(access_token,process.env.ACCESS_TOKEN);
        
        if(!decoded){
            return res.status(400).json({message:"access token is not vaild ",success:false});
        }
        // console.log("decoded datails",decoded);

        const user = await userModel.findById(decoded._id).select('-password');
        // console.log("from the auth middleware",user);

        if(!user){
            return res.status(400).json({message:"Please register To website",success:false});
        }
            req.user =user;
           
         next();
    } catch (error ) {
        console.log(error);
        return res.status(400).json({message:"Something Wrong in Auth",success:false});
    }
}
