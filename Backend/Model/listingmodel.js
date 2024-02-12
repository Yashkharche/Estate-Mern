import mongoose from "mongoose";

const listingSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    regularprice:{
        type:Number,
        required:true
    },
    discountedprice:{
        type:Number,
        required:true
    },
    bathroom:{
        type:Number,
        required:true 
    },
    bedroom:{
        type:Number,
        required:true
    },
    furnished:{
        type:Boolean,
        required:true
    },
    parking:{
        type:Boolean,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    offer:{
        type:Boolean,
        required:true
    },
    imageurls:{
        type:Array,
        required:true
    },
    userref:{
        // type:mongoose.Schema.Types.ObjectId,
        // ref:'User',
        type:String,
        required:true
    }
},{timestamps:true})



const Listing=mongoose.model('Listing',listingSchema);

export {Listing};