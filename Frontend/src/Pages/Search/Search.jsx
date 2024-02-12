import React, { useEffect, useState } from 'react'
import './Search.css'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ListingItem from '../../Components/ListingItem/ListingItem'
const Search = () => {
    const [sidebardata,setSidebardata]=useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc'

})
const[loading,setloading]=useState(false);
const[listing,setlisting]=useState([])

useEffect(()=>{
    const urlParams=new URLSearchParams(location.search)
    const searchTermFromUrl=urlParams.get('searchTerm')
    const typeFromUrl=urlParams.get('type')
    const parkingFromUrl=urlParams.get('parking')
    const furnishedFromUrl=urlParams.get('furnished')
    const offerFromUrl=urlParams.get('offer')
    const sortFromUrl=urlParams.get('sort')
    const orderFromUrl=urlParams.get('order')

    if(searchTermFromUrl||typeFromUrl||parkingFromUrl||furnishedFromUrl||offerFromUrl||sortFromUrl||orderFromUrl){
        setSidebardata({
            searchTerm:searchTermFromUrl || '',
            type:typeFromUrl || 'all',
            parking:parkingFromUrl==='true'?true:false,
            furnished:furnishedFromUrl==='true'?true:false,
            offer:offerFromUrl==='true'?true:false,
            sort:sortFromUrl||'created_at',
            order:orderFromUrl||'desc' 
        })
    }
   
    const fetchListing=async()=>{
        setloading(true);
        const searchQuery=urlParams.toString();
        try {
            const res=await axios.get(`/api/listing/get?${searchQuery}`)
            setlisting(res.data)
            setloading(false) 
        } catch (error) {
            console.log(error)
            setloading(false)
        }
    }

    fetchListing();

},[location.search])
console.log(listing)
const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };
const navigate=useNavigate();
const handleSubmit=(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);

}

  return (
    <div className='search-main'>
        <div className='search-left'>
            <form onSubmit={handleSubmit}>
            <div className='search-search'>
            <span>Search Term</span>
            <input type="text" value={sidebardata.searchTerm}
            onChange={handleChange} id='searchTerm' placeholder='Search...'/>
            </div>
            <div className='search-parameter'>
                <div className='search-inner'>
                <label>Type:</label>
                <div className='search-type'>
                    <input type="checkbox" id="all" checked={sidebardata.type==='all'} onChange={handleChange}/>
                    <span>Rent & sell</span>
                </div>
                </div>
                <div className='search-inner'>
              
                <div className='search-type'>
                    <input type="checkbox" id="rent" onChange={handleChange} checked={sidebardata.type==='rent'}/>
                    <span>Rent</span>
                </div>
                </div>
                <div className='search-inner'>
               
                <div className='search-type'>
                    <input type="checkbox" id="sale" onChange={handleChange} checked={sidebardata.type==='sale'}/>
                    <span>sell</span>
                </div>
                </div>
                <div className='search-inner'>
               
                <div className='search-type'>
                    <input type="checkbox" id="offer" onChange={handleChange} checked={sidebardata.offer}/>
                    <span>offer</span>
                </div>
                </div>
            </div>
        
            <div className='search-parameter'>
                <div className='search-inner'>
                <label>Amenities:</label>
                <div className='search-type'>
                    <input type="checkbox" id="parking" onChange={handleChange} checked={sidebardata.parking}/>
                    <span>Parking</span>
                </div>
                </div>
                <div className='search-inner'>
              
                <div className='search-type'>
                    <input type="checkbox" id="furnished" onChange={handleChange} checked={sidebardata.furnished}/>
                    <span>Furnished</span>
                </div>
                </div>
            </div>
            <div className='search-sort'>
                <label>Sort:</label>
                <select id="sort_order" onChange={handleChange} defaultValue={'created_at_desc'}>
                    <option value='regularprice_desc'>Price high to low</option>
                    <option value='regularprice_asc'>Price low to high</option>
                    <option value='createdAt_desc'>Latest</option>
                    <option value='createdAt_asc'>Oldest</option>
                </select>
            </div>
            <button className='search-button'>Search</button>
            </form>
        </div>
        <div className="search-right">
<h2>Listing Results: </h2>
<div>
    {!loading && listing.length===0 && (
        <p style={{fontSize:'2vw',textAlign:'center'}}>No listing found!!</p>
    )}

    {loading && <p style={{fontSize:'2vw',textAlign:'center'}}>Loading...</p>}
</div>
<div className='right-inner'>

{!loading && listing && listing.map((list)=><ListingItem key={list._id} listing={list}/>)}
</div>
        </div>
    </div>
  )
}

export default Search