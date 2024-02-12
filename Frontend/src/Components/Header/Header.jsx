import React, { useEffect, useState } from 'react'
import './Header.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaSearch } from 'react-icons/fa'

export const Header = () => {
  const {currentUser}=useSelector((state)=>state.user);
  const [searchItem,setsearchitem]=useState('');
  const navigate=useNavigate();
  const handleSubmit=(e)=>{
    e.preventDefault();
    const urlParams=new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',searchItem);
    const searchQuery=urlParams.toString();
    navigate(`/search?${searchQuery}`);

  }

  useEffect(()=>{
    const urlParams=new URLSearchParams(window.location.search);
    const fromurl=urlParams.get("searchTerm");
    if(fromurl){

      setsearchitem(fromurl);
    }
  },[window.location.search])
  return (
    <>
    <div className='header-main'>
    <div className='header-heading'>
        <Link to='/'><p><span>Grandeur</span><span> Estate</span></p></Link>
    </div>
    <div className='header-search'>
        <form onSubmit={handleSubmit} style={{display:'flex',alignItems:'center',gap:'5px'}}>
            <input type="text" placeholder='Search...' value={searchItem} onChange={(e)=>{setsearchitem(e.target.value)}} />
            <button style={{border:'none'}}>

            <FaSearch style={{color:'gray',backgroundColor:'white',fontSize:'1.2vw'}}/>
            </button>
        </form>
    </div>
    <div className='header-links'>
    <Link to={"/"}><li>Home</li></Link>
    <Link to={"/about"}><li>About</li> </Link>
    <Link to={"/profile"}>
      {
        currentUser?<img className='header-img' src ={currentUser.avatar}/>:<li>Sign In</li>
      }
     
    </Link>
    </div>
    </div>
    </>
  )
}
