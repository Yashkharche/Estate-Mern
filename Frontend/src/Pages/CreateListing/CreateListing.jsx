import React, { useState } from 'react'
import './CreateListing.css'
import { getStorage,uploadBytesResumable,ref,getDownloadURL} from 'firebase/storage';
import { app } from '../../Firebase.js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
  const {currentUser}=useSelector((state)=>state.user)
  const [files,setFiles]=useState([]);
  const [loading, setLoading] = useState()
  const [imageloading,setimageLoading]=useState();
  const [formData,setForm]=useState({
    imageurls:[],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bedroom:1,
    bathroom:1,
    regularprice:0,
    discountedprice:0,
    offer:false,
    parking:false,
    furnished:false
  })
  const [error,setError]=useState("");
  
const HandleClick=()=>{
    if(files.length>0 && files.length<7){
        const promises=[];
        setimageLoading(true)
        for(let i=0;i<files.length;i++){
            promises.push(HandleFileSave(files[i]));
        }    
        Promise.all(promises).then((url)=>{
            setForm({...formData,imageurls:url})
            setimageLoading(false);
        }).catch((error)=>{
            setimageLoading(false)
            setError("Image upload failed (2 mb max per image)")
        })   
    }else{
        setimageLoading(false)
        setError("Only 6 images allowed") 
    }
}

const HandleFileSave=async(file)=>{
    return new Promise((resolve,reject)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(Math.round(progress));
      },
      (error) => {
        reject(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          resolve(downloadURL));
        
      }
    );
}
)}

const deleteImage=(index)=>{
    setForm({
        ...formData,
        imageurls:formData.imageurls.filter((url)=>url!==index)
    })
}

const handleChange=(e)=>{
 
    if(e.target.name==='sale' || e.target.name==='rent'){
        setForm({
            ...formData,
            type:e.target.name
        })
    }
    if(e.target.name==='parking' || e.target.name==='furnished' || e.target.name==='offer'){
        setForm({
            ...formData,
            [e.target.name]:e.target.checked
        })
    }
    if(e.target.type==='number' || e.target.type==='text' || e.target.type==='textarea'){
        setForm({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

}
const navigate=useNavigate();
const handleFormSubmit=async(e)=>{
    e.preventDefault();
    if(formData.imageurls.length<1) return setError("atleast one image is required")
    if(formData.discountedprice>formData.regularprice) return setError("discounted price cannot be more than regular price")
    try {
    setLoading(true);
    const res=await axios.post('/api/listing/create',{
        ...formData,
        userref:currentUser._id    
    })
    console.log(res.data)
    navigate(`/listing/${res.data._id}`);
    setLoading(false);
    } catch (error) {
        setLoading(false)
        setError(error.response.data.message)
    }

}

  return (
    <div className='create-listing-main'>
    <p>Create a Listing</p>
   <form className='create-list-form' onSubmit={handleFormSubmit}>
    <div className='form-first'>
    <input type="text" name="name" onChange={handleChange} value={formData.name} placeholder='Name' required/>
    <textarea type="text" name="description" onChange={handleChange} value={formData.description} placeholder='Description' required/>
    <input type="text" name="address" onChange={handleChange} value={formData.address} placeholder='Address' required/>
    <div className='form-checkbox'>
        <div className='form-checkbox-inside'>
            <input type="checkbox" name='sale' onChange={handleChange} checked={formData.type==='sale'}/>
            <span>Sale</span> 
        </div>
        <div className='form-checkbox-inside'>
            <input type="checkbox" name='rent' onChange={handleChange} checked={formData.type==='rent'}/>
            <span>Rent</span> 
        </div>
        <div className='form-checkbox-inside'>
            <input type="checkbox" name='parking' onChange={handleChange} checked={formData.parking}/>
            <span>Parking Spot</span> 
        </div>
        <div className='form-checkbox-inside'>
            <input type="checkbox" name='furnished' onChange={handleChange} checked={formData.furnished}/>
            <span>Furnished</span> 
        </div>
        <div className='form-checkbox-inside'>
            <input type="checkbox" name='offer' onChange={handleChange} checked={formData.offer}/>
            <span>Offer</span> 
        </div>
    </div>
    <div className='form-bath-input'>
    <div className='form-input'>
        <input type="number" name="bedroom" onChange={handleChange} value={formData.bedroom}/>
        <span>Beds</span>
    </div>
    <div className='form-input'>
        <input type="number" name="bathroom" onChange={handleChange} value={formData.bathroom}/>
        <span>Baths</span>
    </div>
    </div>

   <div className='form-price-input'>
    <div className='form-price-inside'>
        <input type="number" name='regularprice' onChange={handleChange} value={formData.regularprice}/>
        <div className='form-price'> 
        <p>Regular Price</p>
        <span>(Rs./month)</span>

        </div>
    </div>
    {formData.offer && 
    <div className='form-price-inside'>
        <input type="number" name='discountedprice'onChange={handleChange} value={formData.discountedprice}/>
        <div className='form-price'> 
        <p>Discounted Price</p>
        <span>(Rs./month)</span>

        </div>
    </div>
}
   </div>
    </div>
   
    <div className='form-second'>
    <p>Images:<span> The first image will be the cover (max 6)</span></p>
    <div className='form-image'>
    <input className='form-second-input' type="file" onChange={(e)=>{setFiles(e.target.files)}} name='imageurls' accept='image/*' multiple />
    <button type='button' disabled={imageloading} onClick={HandleClick}>{
   imageloading?"Uploading..,":"UPLOAD"}</button>
    </div>
    <p style={{color:"red",marginTop:".7vw"}}>{error} </p>  
    
    
    {files && 
    formData.imageurls.map((file)=>(
    <div key={file} className='photo-list'>
        <img src={file} alt="image" />
        <p onClick={()=>{deleteImage(file)}}>Delete</p>
    </div>
    
    ))

}
<button type='submit' disabled={loading || imageloading} className='createlisting-submit'>
    {loading? "creating...":"Create Listing"}
    </button>
    </div>
   </form> 
    </div>
  )
}

export default CreateListing