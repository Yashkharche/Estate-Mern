import express from 'express';
import { verifytoken } from '../utils/verifyToken.js';
import { createListing, deleteListing, getListing, updateListing,getList} from '../Controller/listingController.js';


const Router=express.Router();

Router.post('/create',verifytoken,createListing);
Router.delete('/delete/:id',verifytoken,deleteListing);
Router.post('/update/:id',verifytoken,updateListing)
Router.get('/get/:id',getListing)
Router.get('/get',getList)

export default Router;