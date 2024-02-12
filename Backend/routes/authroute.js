import express from 'express';
import auth, { google, logout } from '../Controller/authController.js';
import { signin } from '../Controller/authController.js';
const router=express.Router();


router.post("/signup",auth)
router.post("/signin",signin)
router.post('/google',google)
router.post('/logout',logout)


export default router;