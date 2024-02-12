import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './Listing.css'
import { Navigation, Pagination, Scrollbar, A11y,Keyboard} from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../../Components/Contact';

const Listing = () => {
    const {currentUser}=useSelector((state)=>state.user);

    
    const [listing,setListing]=useState(null);
    const[loading,setLoading]=useState();
    const[error,setError]=useState();
    const[copied,setcopied]=useState();
    const[contact,setcontact]=useState(false);
    const params=useParams();
    useEffect(()=>{
        const fetchListing=async()=>{
try {
    setLoading(true);            
    const res=await axios.get(`/api/listing/get/${params.listingid}`)
    setListing(res.data);
    setLoading(false) 
} catch (error) {
    setError(error.message);
    setLoading(false);
}        }
fetchListing();

    },[])
   const IndianCurrencyFormatter = ({ amount }) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  
    return <span>{formattedAmount}</span>;
  };
  return (
    <>
        {loading && <p style={{textAlign:"center"}}>Loading</p>}
        {error && <p style={{textAlign:"center"}}>something went wrong!!</p>}
        {listing &&
      
        <div>
            <div> 
             <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y,Keyboard]}
        spaceBetween={10}
        slidesPerView={3}
        navigation
        loop={true}
        keyboard={true}
        breakpoints={{
            1200:{
                slidesPerView:3
            },
            850:{
                slidesPerView: 2
            },
            0: {
              slidesPerView: 1
            },
          }}> 
        {listing.imageurls.map((url)=>(
           
            <SwiperSlide key={url}>
               
             <div className='swipe-image'> 
             <img src={url} alt="" />
             </div>  
            </SwiperSlide>
            
        ))} 
        
        </Swiper>  
        </div>
        <div className='share-listing fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setcopied(true);
                setTimeout(() => {
                 setcopied(false)
                }, 2000);
              }}
            />
          </div>
          {copied && <p className='listing-copied'>Copied to Clipboard</p>}
          <div className='listing-description'>
          {listing.name} - {listing.type==='rent'?<p className='listing-description-name'><IndianCurrencyFormatter amount={listing.regularprice}/>/month</p>: <p className='listing-description-name'><IndianCurrencyFormatter amount={listing.regularprice}/></p>}
          <div className='listing-description-address'>
          <FaMapMarkerAlt style={{color:'green'}}/>
          <p>{listing.address}</p>
          </div>
          <div className="listing-description-2btn">
           <p>{listing.type==='rent'?'For Rent':'For Sell'}</p>
           {listing.discountedprice >0 &&<p> <IndianCurrencyFormatter amount={listing.discountedprice}/>:Discounted</p>}

          </div>
          <div className='listing-description-desc'>
            <p>Description: {listing.description}</p>
          </div>
          <div className='listing-description-facility'>
            <div className='facilities'>
                <FaBed/>
                <span>{listing.bedroom}</span>
            </div>
            <div className='facilities'>
                <FaBath/>
                <span>{listing.bathroom}</span>
            </div>
            <div className='facilities'>
                <FaParking/>
                <span>{listing.parking?"Parking":"No Parking"}</span>
            </div>
            <div className='facilities'>
                <FaChair/>
                <span>{listing.furnished?"Furnished":"Not Furnished"}</span>
            </div>
          </div>
          {currentUser && listing.userref!==currentUser._id && !contact &&
          (
            <div className='contact-owner'>
            <button onClick={()=>setcontact(true)}>CONTACT LANDLORD</button>
           </div>
          )
          }
          
         {contact && <Contact listing={listing}/>}
          </div>
        </div>
       
}
     </>
)}
export default Listing