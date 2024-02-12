import React, { useState } from 'react'
import './signup.css'
import { Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import Auth from '../../Components/Auth';



const Signup = () => {
  const [formData, setformData] = useState({});
  const [loading,setloading]=useState();
  const [error,seterror]=useState("");

  const HandleChange=(e)=>{
    setformData({
      ...formData,
      [e.target.name]:e.target.value
    });
   
  }
  const navigate=useNavigate();
  const HandleSubmit=async(e)=>{
    e.preventDefault();
    try {
      setloading(false)
      const re=await axios.post('/api/auth/signup',formData)
      setloading(true)
      if(re.success===false){
        seterror(data.message)
      }else{
        console.log(re.data)
        navigate('/sign-in')
       
      }
    } catch (error) {
      setloading(false)
      seterror(error.message);
    }
    
  }
  return (
    <div className='signup-main'>
      <div className="signup-heading">
        <p>Sign Up</p>
      </div>
      <div className='signup-second'>
        <form className='signup-form' onSubmit={HandleSubmit}>
          <input type="text" placeholder='username' name='username' onChange={HandleChange} />
          <input type="email" placeholder='email' name='email' onChange={HandleChange}/>
          <input type='password' placeholder='password' name='password' onChange={HandleChange}/>
          <button type='submit' disabled={loading}>{loading?"loading...":"Sign up"}</button>
          <Auth/>
        </form>
        <p>Already have an account? <span><Link to={"/sign-in"}>Sign In</Link></span></p>
      </div>
      {error && <p className='signup-error'>{error}</p>}


    </div>
  )
}

export default Signup