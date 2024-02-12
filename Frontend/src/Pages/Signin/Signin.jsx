import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector } from 'react-redux';
import { signInFailure,signInSuccess,signInStart } from '../../Redux/user/userSlice';
import Auth from '../../Components/Auth';


const Signin = () => {
  const [formData, setformData] = useState({})
  const {loading,error}=useSelector((state)=>state.user)

  const HandleChange=(e)=>{
    setformData({
      ...formData,
      [e.target.name]:e.target.value

    })
  }
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleSubmit=async(e)=>{
    e.preventDefault();
      try {
        
        const res1=await axios.post('/api/auth/signin',formData);
        dispatch(signInStart());

        dispatch(signInSuccess(res1.data))
        navigate('/');
      } catch (error) {
      
        if(error.response.data.success===false){
          dispatch(signInFailure(error.response.data.message))
          
        }
        
      }
      
      
    //   console.log(res1.data)
    //   setloading(true)
    //   if(data.success===false){
    //     seterror(data.message)
    //   }else{
        
    //     navigate('/sign-in')
       
    //   }
    // } catch (error) {
    //   setloading(false)
    //   seterror(error.message);

    // }
    
  
  }

  return (
    <div className='signup-main'>
    <div className="signup-heading">
      <p>Sign In</p>
    </div>
    <div className='signup-second'>
      <form className='signup-form' onSubmit={handleSubmit}>
       
        <input type="email" placeholder='email' name='email' onChange={HandleChange} />
        <input type='password' placeholder='password' name='password' onChange={HandleChange}/>
        <button type='submit' disabled={loading}>{loading?"loading":"Sign In"}</button>
        <Auth/>
      </form>
      {error && <p className='signup-error'>{error}</p>}
      <p>Don't have an account? <span><Link to={"/sign-up"}>Sign up</Link></span></p>
    </div>
    


  </div>
  )
}
  

export default Signin;