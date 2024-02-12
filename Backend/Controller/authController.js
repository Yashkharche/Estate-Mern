import User  from "../Model/usermodel.js";
import bcrypt from 'bcrypt'
import errorHandler from "../utils/error.js";
import jwt from 'jsonwebtoken';
const auth=async(req,res,next)=>{
    const {username,email,password}=req.body;

    try {
        const hashed=bcrypt.hashSync(password,10);
        await User.create({username:username,email:email,password:hashed})
        res.status(201).json("User created")
    } catch (error) {
        next(error)
        //handling error through errorhandler
        //next(errorHandler(error.statusCode,error.message));
    }
   
}

export const signin=async(req,res,next)=>{
    const{email,password}=req.body

    try {
    const user=await User.findOne({email});
    if(!user){
    return next(errorHandler('404',"user not found"))
    }
    const validpassword=await bcrypt.compare(password,user.password);
    if(!validpassword) return next(errorHandler(401,"Invalid Email or Password"));
    const userWithoutPassword = (({ password, ...rest }) => rest)(user._doc);
     const token=await jwt.sign({id:user._id},process.env.SECRET_KEY);
     res.cookie('access_token',token,{
        httpOnly:true,
        expires:new Date(Date.now()+24*60*60*1000),
     
     }).status(200).json(userWithoutPassword)

    } catch (error) {
        next(error);
    }
}


export const google=async(req,res,next)=>{
    try{
        const user=await User.findOne({email:req.body.email})
        if(user){
            const token=jwt.sign({id:user._id},process.env.SECRET_KEY);
            const {password:pass,...rest}=user._doc;
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }else{
            const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
            const hashedpassword=await bcrypt.hash(generatedPassword,10);
            const user1=await User.create({username:req.body.name,email:req.body.email,password:hashedpassword,avatar:req.body.photo})
            const token=jwt.sign({id:user1._id},process.env.SECRET_KEY)
            const {password:pass,...rest}=user1._doc;
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }
    }catch(error){
next(error)
    }
}


export const logout=(req,res,next)=>{
   try {
    res.clearCookie('access_token');
    res.status(200).json("user has been logged out")
   } catch (error) {
    next(error)
   }


}


export default auth;