import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import {Home,About, Signin,Profile, CreateListing, UpdateListing, Search} from './Pages/index'
import { Header } from './Components/Header/Header'
import Signup from './Pages/Signup/Signup'
import ProtectedRoute from './Components/ProtectedRoute'
import ProtectedSignin from './Components/ProtectedSignin'
import Listing from './Pages/Listing/Listing'

function App() {
  
  return (
    <>
    <Router>
<Header/>
<Routes>
<Route path='/' element={<Home/>}/>
<Route path='/about' element={<About/>}/>
<Route path='/search' element={<Search/>}/>
<Route element={<ProtectedSignin/>}>
<Route path='/sign-in' element={<Signin/>}/>
<Route path='/sign-up' element={<Signup/>}/>
</Route>
<Route path='/listing/:listingid' element={<Listing/>}/>
<Route element={<ProtectedRoute/>}> 
<Route path='/profile' element={<Profile/>}/>
<Route path='/create-listing' element={<CreateListing/>}/>
<Route path='/update-listing/:listing_id' element={<UpdateListing/>}/>
</Route>
</Routes>



    </Router>
    </>
  )
}

export default App
