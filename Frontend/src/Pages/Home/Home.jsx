import React, { useEffect } from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { Navigation, Pagination, Scrollbar, A11y,Keyboard} from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import ListingItem from '../../Components/ListingItem/ListingItem'
const Home = () => {
  const[offerListing,setOfferListing]=useState([]);
  const[rentListing,setRentListing]=useState([]);
  const[saleListing,setSaleListing]=useState([]);

  useEffect(()=>{
  const fetchOfferListing=async()=>{
    try {
      const res=await axios.get('/api/listing/get?offer=true&limit=4')
      setOfferListing(res.data)
      console.log(offerListing)
    } catch (error) {
      console.log(error.response.data.message);
    }

  }
  const fetchRentListing=async()=>{
    try {
      const res=await axios.get('/api/listing/get?type=sale&limit=4')
      setRentListing(res.data)
      console.log(rentListing)
    } catch (error) {
      console.log(error.response.data.message);
    }

  }
  const fetchSaleListing=async()=>{
    try {
      const res=await axios.get('/api/listing/get?type=rent&limit=4')
      setSaleListing(res.data)
      console.log(saleListing)
    } catch (error) {
      console.log(error.response.data.message);
    }

  }

  fetchOfferListing();
  fetchRentListing();
  fetchSaleListing();

  },[])
  return (
    <div>
      <div className='home-first'>
        <h1>Find your next <span>perfect</span></h1>
        <h1>place with ease</h1>
        <p>Grandeur Estate will help you find your home fast, easy and confortable.<br/>Our expert support are always available.</p>
        <Link to={'/search'}><p className='started-link'>Lets get started...</p></Link>
      </div>

      <div className='home-second'>
        {offerListing && offerListing.length>0 && (
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
        
           {offerListing.map((listing)=>(
            <SwiperSlide>
            <div className='home-second-div'>
            <img src={listing.imageurls[0]} alt="" />
            </div>
            </SwiperSlide>

           ))}
            
       
        
        </Swiper> 

          </div>
        )}
      </div>
      <div className='home-third'>
        <p>Recent Offer</p>
        <Link to='/search?offer=true'><p>Show more Offer</p></Link>
        <div className='home-third-list'>
        {offerListing.map((list)=>(
          <ListingItem listing={list}/>
        ))}
        </div> 
      </div>
      <div className='home-third'>
        <p>Recent Places for rent</p>
        <Link to='/search?type=rent'><p>Show more places</p></Link>
        <div className='home-third-list'>
        {rentListing.map((list)=>(
          <ListingItem listing={list}/>
        ))}
        </div> 
      </div>
    </div>
  )
}

export default Home