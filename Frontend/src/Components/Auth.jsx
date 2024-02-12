import React from 'react'
import {GoogleAuthProvider,getAuth,signInWithPopup} from '@firebase/auth';
import {app} from '../Firebase.js'
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { signInFailure, signInSuccess } from '../Redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';



const Auth = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleClick=async()=>{
try {
  const provider=new GoogleAuthProvider()
  const auth=getAuth(app);

  const result=await signInWithPopup(auth,provider);
  console.log(result)
  const res=await axios.post('/api/auth/google',{name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
  navigate('/');
  dispatch(signInSuccess(res.data))
} catch (error) {
  dispatch(signInFailure("firebase error"))
  console.log('could not sign in with google',error)
}
  }
  const {error}=useSelector((state)=>state.user)
  return (
    <>
    <button onClick={handleClick} style={{ padding: '1vw',fontSize:'1.2vw',backgroundColor:'red',borderRadius:'1vw',width:'25vw' }} type='button'>Continue with google</button>
  
    </>
  )
}

export default Auth