import { Listing } from "../Model/listingmodel.js"
import errorHandler from "../utils/error.js";

export const createListing=async(req,res,next)=>{

    try {
        const listing=await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
}


export const deleteListing =async(req,res,next)=>{
 const list=await Listing.findById(req.params.id);
if(req.user.id!==list.userref){
    return next(errorHandler(401,"You can only delete your lists"))
}

try {
    await Listing.findByIdAndDelete(req.params.id)
    res.status(200).json("Item has been deleted")
} catch (error) {
    next(error)
}

}

export const updateListing=async(req,res,next)=>{
    const list=await Listing.findById(req.params.id);
    if(req.user.id!==list.userref){
        return next(errorHandler(401,"You can delete only your listings.."))
    }

    try {
        const updatedlist=await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(200).json(updatedlist)
    } catch (error) {
        next(error)
    }
}

export const getListing=async(req,res,next)=>{
   
    try {
     const re=await Listing.findById(req.params.id);
     if(!re){
        return next(404,"Listing not found")
     }
     res.status(200).json(re);
   } catch (error) {
    next(error)
   }
}

export const getList=async(req,res,next)=>{
    try {
        const limit=parseInt(req.query.limit) || 10; 
        const startIndex=parseInt(req.query.startIndex)|| 0;
        let offer=req.query.offer;
        if(offer===undefined || offer==='false'){
            offer={$in:[false,true]}
        }

        let furnished=req.query.furnished;
        if(furnished===undefined || furnished==='false'){
            furnished={$in:[false,true]};
        }
         
        let parking=req.query.parking;
        if(parking===undefined || parking==='false'){
            parking={$in:[false,true]};
        }

        let type=req.query.type;
        if(type===undefined || type==='all'){
            type={$in:['sale','rent']};
        }
         
        const searchTerm=req.query.searchTerm || '';

        const sort=req.query.sort||'createdAt';

        const order=req.query.order||'desc';

        const listing=await Listing.find({
            name:{$regex:searchTerm,$options:'i'},
            offer,
            furnished,
            parking,
            type
        }).sort({[sort]:order}).limit(limit).skip(startIndex)


        return res.status(200).json(listing);





    } catch (error) {
        next(error)
    }
}