import React, {useEffect, useState} from 'react'
import './Profile.css'
import { useRef } from 'react'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../Firebase';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, logoutUserFailure, logoutUserStart, logoutUserSuccess, updateUserFailure, updateUserStart, updatedUserSuccess } from '../../Redux/user/userSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
 const dispatch=useDispatch();
 const {loading}=useSelector((state)=>state.user)
  
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [listing,setListing]=useState(false);
  const [listData,setListData]=useState([]);
  const [error, seterror] = useState("")


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const HandleChange=(e)=>{
    setFormData({
      ...formData,[e.target.name]:e.target.value
    })
    console.log(formData);
  }
  const HandleSubmit=async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart);
      const res=await axios.post(`/api/user/update/${currentUser._id}`,formData);
      dispatch(updatedUserSuccess(res.data))
    } catch (error) {
      dispatch(updateUserFailure(error.response.data.message))
    }
  }

  const HandleSignout=async()=>{
    try {
      dispatch(logoutUserStart());
      await axios.post("/api/auth/logout");
      dispatch(logoutUserSuccess());
      
    } catch (error) {
      dispatch(logoutUserFailure(error.response.data.message));
    }
  }

  const HandleDelete=async()=>{
  try {
    dispatch(deleteUserStart());
    const res=await axios.post(`/api/user/delete/${currentUser._id}`);
    dispatch(deleteUserSuccess());
  } catch (error) {
    dispatch(deleteUserFailure(error.response.data.message));
  }
  }
  const HandleListing=async()=>{
    setListing((prev)=>!prev);
    
    try {
      const res=await axios.get(`/api/user/listing/${currentUser._id}`);
      setListData(res.data);
    } catch (error) {
      seterror(error.response.data.message)
    }
   
   
  }
  
  const handleListDelete=async(id)=>{
    try {
        const res=await axios.delete(`/api/listing/delete/${id}`)
       setListData((prev)=>{
        prev.filter((list)=>list._id !==id);
       })
       
    } catch (error) {
        seterror(error.response.data.message)
    }

 }
  return (
    <div className="profile-parent">
    <div className='profile-main'>
      <div className="profile-heading">
        <p>Profile</p>
      </div>
      <div className='profile-input'>
      <form onSubmit={HandleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept='image/*' />
      <img   onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile' />

<p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
      <input type="text" defaultValue={currentUser.username} name='username' placeholder='username' onChange={HandleChange}/>
      <input type="text" defaultValue={currentUser.email} name='email' placeholder='email' onChange={HandleChange}/>
      <input type="password" name="password" placeholder='password' onChange={HandleChange} />
      <button type='submit' disabled={loading}>{loading?"updating...":"Update"}</button>
      <button style={{backgroundColor:"green"}}> <Link to={'/create-listing'}>Create Listing</Link></button>
      </form>
      </div>
      <div className="profile-last">
      <p onClick={HandleDelete}> {loading?"Loading...":"Delete Account"} </p>
      <p onClick={HandleSignout}>{loading?"Loading...":"Logout"}</p>
      </div>
    </div>
    <p onClick={HandleListing} style={{color:"green",marginTop:"-1vw", paddingBottom:"2vw" ,cursor:'pointer'}} >Show Listing</p>
    {listing? listData&&(listData.length>0? 
    <div className="listing-main">
    <p style={{textAlign:'center',fontSize:'2vw',padding:'1vw'} }>Your Listing</p>
{listData.map((list)=>(
   <div key={list._id} style={{display:'flex', alignItems:'center',justifyContent:'space-between', width:'100%', gap:'2vw',border:'1px solid grey',margin:'1vw 0vw',padding:'1vw'}}>
      <Link to={`/listing/${list._id}`}>
      <img style={{height:'10vw',width:'15vw'}} src={list.imageurls[0]}/>
      </Link>
      <Link to={`/listing/${list._id}`}>

      <p style={{flex:'1'}}>{list.name}</p>
      </Link>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1.4vw'}}>
        <p onClick={()=>{handleListDelete(list._id)}} style={{cursor:'pointer', color:'red'}}>Delete</p>
       <Link to={`/update-listing/${list._id}`}><p style={{cursor:'pointer', color:'green'}}>Update</p></Link>
      </div>
    </div>
))
}
</div> 
:"You have no listings yet..."):""}
    </div>
  )
}

export default Profile