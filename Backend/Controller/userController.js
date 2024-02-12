import { Listing } from "../Model/listingmodel.js";
import User from "../Model/usermodel.js";
import errorHandler from "../utils/error.js"
import bcrypt from 'bcrypt';
export const updateUser=async(req,res,next)=>{
if(req.user.id!==req.params.id)return next(errorHandler(401,'You can only update your own account'))

try {
    if(req.body.password){
        req.body.password=bcrypt.hashSync(req.body.password,10);
    }

    const updateUser=await User.findByIdAndUpdate(req.params.id,{ username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        avatar:req.body.avatar},{new:true})

    //     $set:{
    //          username:req.body.username,
    //         email:req.body.email,
    //         password:req.body.password,
    //         avatar:req.body.avatar
    //     }
    // },{new:true})

    const{password,...rest}=updateUser._doc;
    res.status(200).json(rest)
} catch (error) {
    next(error);
}
}

export const deleteUser=async(req,res,next)=>{
    if(req.user.id!==req.params.id){
        return next(errorHandler(401,'You can delete only your account'));
    }

   try {
    const res1=await User.findByIdAndDelete(req.params.id)
    res.status(200).json("User Deleted Successfully")
    console.log(res1)
   } catch (error) {
    next(error);
   }

}

export const getUserListing=async(req,res,next)=>{
if(req.user.id===req.params.id){ 
try {
    const listings=await Listing.find({userref:req.params.id})
    res.status(200).json(listings);
} catch (error) {
    next(error);
}}else{
    next(errorHandler(401,"You can view only your listing"))
}
}

export const getUser = async(req,res,next)=>{

    try {
        const user=await User.findById(req.params.id);
        if(!user) return next(errorHandler(404,"user not found"))
        const {password,...rest}=user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error.message)
    }
   
}