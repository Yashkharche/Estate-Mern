import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = (props)=>{
    const [landlord, setlandlord] = useState(null);
    const [message,setmessage]=useState('');
    useEffect(()=>{
    const fetchOwner=async()=>{
        try {
            const res=await axios.get(`/api/user/${props.listing.userref}`)
            setlandlord(res.data);
        } catch (error) {
            console.log(error.response.data.message)
        }
    }
    fetchOwner();
    },[props.listing.userref])
    const handlechange=(e)=>{
      setmessage(e.target.value)
    }
  return (
    
    <>
    {landlord && (
        <div style={{display:'flex',flexDirection:'column',gap:'1vw',alignItems:'center',paddingBottom:'3vw'}}>
            <p style={{fontSize:'1.2vw',fontFamily:'montserrat',fontWeight:'700'}}>Contact {landlord.username} for <span style={{color:'grey'}}>{props.listing.name.toLowerCase()}</span></p>
            <textarea name='message' rows='2' onChange={handlechange} placeholder='Enter Your Message' style={{width:'100%',textAlign:'center'}}></textarea>
            <Link style={{border:'1px solid black',padding:'1vw 2vw',backgroundColor:'grey',borderRadius:'10px'}} to={`mailto:${landlord.email}?subject=Regarding ${props.listing.name}&body=${message}`}>Send Message</Link>
        </div>
    )}
    </>
  )
}

export default Contact