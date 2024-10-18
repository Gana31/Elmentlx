import userModel from "../model/userModel.js";

export const registerUser = async(req,res) =>{
    try {
        const {
            Name,
            userName,
            email,
            password,
            dateOfBirth
          } = req.body

        //   console.log(req.body)
        
          if(!Name || !userName || !email || !password || !dateOfBirth){
            return res.status(400).json({message:"all Fields Are Required",success:false})
          }

          const userExist = await userModel.findOne({ email });
          const userNameExist = await userModel.findOne({ userName });
          if(userExist){
           return res.status(400).json({message:"You Are Alreday Register the website",success:false})
          }
          if(userNameExist){
            return res.status(400).json({message:"Use Different User Name ",success:false})
          }

          const createUser = await userModel.create({Name,userName,email,password,dateOfBirth});
        if(!createUser){
            return res.status(400).json({message:"user Is Not Register ",success:false})
        }
        return res.status(201).json({message:"user Is created",success:true})

    } catch (error) {
        return res.status(400).json({message:"something wrong in register user",success:false})
    }
}

export const loginUser = async(req,res) =>{
    try {
        const {
            userName,
            password,
          } = req.body
        
          if(!userName || !password){
            return res.status(400).json({message:"all Fields Are Required",success:false})
          }
          const userExist = await userModel.findOne({ userName });
          if(!userExist){
            return res.status(400).json({message:"user Not Exist Please Register the Website",success:false})
          }
          const isPassword = await userExist.isPasswordIsCorrect(password);;
           if(!isPassword){
            return res.status(400).json({message:"Password iss Incorrect",success:false})
           }
           const accessToken = userExist.signAcessToken();
           const refreshToken = userExist.signrefreshToken();

           res.cookie("access_token", accessToken, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, 
            sameSite: "strict",      
        });

           res.cookie("refresh_token", refreshToken,{
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",      
        });
        const { password: removedPassword, ...userWithoutPassword } = userExist._doc;
        return res.status(200).json({message:"Login successful",success:true,user:userWithoutPassword})

    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"something wrong in login user",success:false})
    }
}

export const logoutUser = async(req,res)=>{
    try {
        const id = req.user?._id || '';
        if(!id){
            return res.status(400).json({message:"User Is not Login ",success:false})
        }
        res.clearCookie("access_token", {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/'
        });

        res.clearCookie("refresh_token", {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/'
        });

        req.user = null
        return res.status(200).json({message:"User Logout Sccuessfull ",success:true})
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"something wrong in Logout user",success:false})
    }
}

export const dashboardPage = async (req,res)=>{
    try {
        const users = await userModel.find({}).select('-password');
        
        return res.status(200).json({
            message: "Data retrieved successfully",
            success: true,
            data: users,
        });
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"something wrong in dashboard",success:false})
    }
}