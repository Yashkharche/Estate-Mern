import express from "express";
import { verifytoken } from "../utils/verifyToken.js";
import { deleteUser, getUserListing, updateUser,getUser } from "../Controller/userController.js";

const router=express.Router();


router.get("/test",(req,res)=>{
    res.json({
        message:"success"
    })
})
router.post("/update/:id",verifytoken,updateUser);
router.post('/delete/:id',verifytoken,deleteUser);
router.get('/listing/:id',verifytoken,getUserListing);
router.get('/:id',verifytoken,getUser)


export default router;