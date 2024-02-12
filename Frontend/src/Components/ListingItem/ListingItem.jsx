import React from 'react'
import { Link } from 'react-router-dom'
import './ListingItem.css'
const ListingItem = ({listing}) => {
    const IndianCurrencyFormatter = ({ amount }) => {
        const formattedAmount = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
        }).format(amount);
      
        return <span>{formattedAmount}</span>;
      };
  return (
     <div className='listingitem-main'>
      <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageurls[0]} alt="" />
            <p>{listing.name}</p>
            <p>{listing.address}</p>
            {listing.type==='rent'?<p className='price'><IndianCurrencyFormatter amount={listing.regularprice}/>/month</p>:<p className='price'><IndianCurrencyFormatter amount={listing.regularprice}/></p>}
      </Link>
      </div>
  )
}

export default ListingItem