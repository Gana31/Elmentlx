import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
dotenv.config();
const emailValidator =  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true,
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique:true,
        lowercase:true,        
    },

    email: {
        type: String,
        required: true,
        validate:{
            validator : function(value){
                return emailValidator.test(value);
            },
            message:"Please enter the Valid Email",
        },
        unique:true,
        lowercase:true,
        trim:true
    },

    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
		type: String,
        default:null,
	},
},{timestamps:true});

UserSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();  
  })
  
  UserSchema.methods.isPasswordIsCorrect = async function (enterPassword ) {
      return await bcrypt.compare (enterPassword ,  this.password);
  }
  
  UserSchema.methods.signAcessToken = function(){
  return jwt.sign({_id : this._id},process.env.ACCESS_TOKEN || "fasdgadsfadsg",{
      expiresIn:"1d",
  })
  }
  
  UserSchema.methods.signrefreshToken = function(){
      return jwt.sign({_id : this._id},process.env.REFRESH_TOKEN || "asdgsadgasdg",{
          expiresIn:"3d",
      })
  }
  

const userModel = mongoose.model("User",UserSchema);
export default userModel;