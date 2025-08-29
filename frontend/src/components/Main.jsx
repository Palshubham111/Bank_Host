import React from 'react'
import { FaRegUser } from "react-icons/fa";
import Login from "./Login"
import Actdata from './actualdata/Actdata';

function Main() {
  return (
    <div className=''>

      <Actdata/>
     
   <div className='para text-center font-thin animate-color-pulse mt-25 '>
  <p>If slowness is observed during Login Page loading, please refresh the page for better experience.</p>
  <p>SBI never asks for confidential information such as PIN and OTP from customers. Any such call can be made only by a fraudster. Please do not share personal info.</p>
  
    </div>

      <div className='flex justify-between'>

        {/* right */}
        <div className='bank bg-slate-100 p-12 m-5 '>
          <div className='bankl text-center '>
            <h1  className='text-blue-700 p-2 text-4xl flex justify-center ' ><FaRegUser /></h1>
            <h1>PERSONAL BANKING</h1>
            <br />
            <a  className='text-center bg-blue-900  text-white  p-2  cursor-pointer    '>Login</a>
          </div>
          

          <div className=' mt-8 bracket'>
            <ul className='flex justify-between cursor-pointer'>
             
          <li className='user p-4'><img src="https://cdn-icons-png.flaticon.com/512/2534/2534185.png" className=' w-10' alt="" /><a href="">New user / <br/> Registration <br/> Activation </a></li>
          <li className='user p-5'><img src="https://cdn-icons-png.flaticon.com/512/3593/3593455.png" className='w-10' alt="" /><a href=""></a>How Do|</li>
          <li className='user p-5'><img src="https://fpua.com/wp-content/uploads/2019/09/CustomerService1.png" className='w-10' alt="" /><a href=""></a>Customer Care</li>
          <li className='user p-5'><img src="https://cdn-icons-png.flaticon.com/512/10969/10969567.png" className='w-10' alt="" /><a href=""></a>Lock and <br/>
          Unlock User</li>
            </ul>
          </div>

          <div className='font-light mt-5 text-blue-500'>
            <p>SBI's internet banking portal provides personal banking services that gives you complete control over all your banking demands online.</p>
          </div>

        </div>

        {/* left  */}

        <div className='bank bg-slate-100 p-12 m-5'>

        <div className='text-center'>
         
         <div className='flex justify-center mb-2'>
         <img  src="https://play-lh.googleusercontent.com/VKW7jBBa6uJuDyuQxzA1hkwJqMNq24AV6rHoxv2s5jS48Yg50nZXGA5anEOPfrEXZPo" className='flex justify-center w-20' alt="yono BUSINESS" title="yono BUSINESS"></img>
          </div>
          
          <a href="" className=' font-bold'>CORPORATE BANKING</a>
          <br />
         
          <div className="dropdown ">
          <div tabIndex={0} role="button" className="btn m-1">yono BUSINESS <sup className='animate-color-pulse'>New</sup></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li><a>yono BUSINESS <sup className='animate-color-pulse'>New</sup></a></li>
            <li><a>Corporate</a></li>
          <li><a>Supply Chain Finance</a></li>
  </ul>
  <a href="" className='p-2 bg-blue-900 text-white ml-5'>Login</a>
</div>
        </div>

        

        

        <div className='mt-8'>
        <p>Have you tried our new simplified and intuitive business banking platform? Log in to yonobusiness.sbi to avail business banking services.</p>
        <ul className='flex justify-between cursor-pointer'>
        <li className='user p-4'><img src="https://cdn-icons-png.flaticon.com/512/2534/2534185.png" className=' w-10' alt="" /><a href="">New user / <br/> Registration <br/> Activation </a></li>
          <li className='user p-5'><img src="https://cdn-icons-png.flaticon.com/512/3593/3593455.png" className='w-10' alt="" /><a href=""></a>How Do|</li>
          <li className='user p-5'><img src="https://fpua.com/wp-content/uploads/2019/09/CustomerService1.png" className='w-10' alt="" /><a href=""></a>Customer Care</li>
        </ul>

        <p className='text-blue-800 font-extralight'>Corporate Banking application to administer and manage non personal accounts online.</p>
        </div>


        </div>

      </div>

       {/* last */}
      
      
     
    </div>
  )
}

export default Main
