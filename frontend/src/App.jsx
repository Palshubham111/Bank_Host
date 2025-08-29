import { Route, Routes } from 'react-router-dom';
import './App.css'
import Homes from './Home/Homes';
import Accdetailsearch from './components/customer_info/Accdetailsearch';
import Accountdetailshow from './components/customer_info/Accountdetailshow';
import About from './components/About/About';
import Accdata from './components/customer_info/Accdata';
import Signup from './components/Signup';
import Updatemob from './components/update/Updatemob';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Saving from './components/Account/Saving';
import Openacc from './components/Account/Openacc';
import UpdateMobile from './components/UpdateMobile';
import Accdetai from './components/usercomponent/Accdetai';
import Edit from './components/EDIT_NAME/Edit';
import Transactionhis from './components/Transaction/Transactionhis';
import Deposit from './components/Deposit/Deposit';
import Transfer from './components/Transfer/Transfer';

function App() {
  
  return (
    <div>

    

    <Routes>
       <Route path="/" element={<Homes/>} ></Route>
       <Route path="/login" element={<Login/>} />
       <Route path="/signup" element={<Signup/>} />
       <Route path="/accsearch" element={
        
           <Accdetailsearch/>
        
       } />
       <Route path='/accshow' element={
        
           <Accountdetailshow/>
         
       } />
       <Route path='/about' element={
        
           <About/>
         
       } />
       <Route path="/sbidata/:acc" element={
         
           <Accdata/>
         
       } />
       <Route path='/updatemobile' element={
         <ProtectedRoute>
           <Updatemob/>
         </ProtectedRoute>
       } />

       <Route path='/saving' element={
        
          <Saving/>
        
       } />

       <Route path='/open-account' element={
        <Openacc/>
       } />

       <Route path="/UpdateMob" element={<UpdateMobile/>} />

       <Route path="/Accdetail" element={<Accdetai/>} />

       <Route path='/editname'  element={<Edit/>}/>

       <Route path="/transhistory" element={<ProtectedRoute><Transactionhis/></ProtectedRoute>} />

       <Route path='/deposit' element={<ProtectedRoute><Deposit/></ProtectedRoute>}/>

       <Route path='/transfer' element={<ProtectedRoute><Transfer/></ProtectedRoute>} />

    </Routes>



    </div>
   

   

    
    
  )
}

export default App;
