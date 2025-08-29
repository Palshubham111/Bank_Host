import React, { useState } from 'react'
import { ImCheckmark2 } from "react-icons/im";

function Saving() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      
      <div className='saving'>
        <img src="https://cardinsider.com/wp-content/uploads/2024/10/Which-Savings-Account-To-Choose-From-SBI.webp" alt="Saving Account"
          />
      </div>

      <div className='flex justify-around mt-7  w-1/1 ml-7 mr-7'>

     <div className=' '>
      <h1 className='text-blue-900  font-bold text-center '>Features</h1>
      <p className=' mt-5 '></p>

      <ul className='ml-9'>
        <li className='flex items-center gap-2 mt-4'><ImCheckmark2 className="text-green-500" /> <a href="">sms alert</a></li>
        <li className='flex items-center gap-2 mt-4'><ImCheckmark2 className="text-green-500" /> <a href="">net banking</a></li>
        <li className='flex items-center gap-2 mt-4'><ImCheckmark2 className="text-green-500" /> <a href="">state bank anywhere</a></li>
        <li className='flex items-center gap-2 mt-4'><ImCheckmark2 className="text-green-500" /> <a href="">Nomination facility is Available</a></li>
        <li className='flex items-center gap-2 mt-4'><ImCheckmark2 className="text-green-500" /> <a href="">Monthly Average Balance: NIL</a></li>
        <li className='flex items-center gap-2 mt-4'><ImCheckmark2 className="text-green-500" /> <a href="">No limit on Maximum balance</a></li>
        <li className='flex items-center gap-2 mt-4'><ImCheckmark2 className="text-green-500" /> <a href="">Free Consolidated Account Statement</a></li>
        <li className='flex items-center gap-2 mt-4'><ImCheckmark2 className="text-green-500" /> <a href="">The facility of transfer of accounts through Internet Banking channel.</a></li>
      </ul>
     </div>

     <div className=''>
      <h1 className='text-blue-900  font-bold text-center'>Eligibility</h1>
      
      <div className='uls'>
        <ul>
          <p className='mt-9 font-thin'>All individuals/Central/State Govt Departments (if eligible to open SB accounts) such as:</p>
          
          <li className='flex items-center gap-2 mt-4'><ImCheckmark2 className="text-green-500" /> <a>Govt depts. /bodies/agencies in respect of grants, subsidies released for implementation of various programmes/schemes sponsored by Central Government/State Governments subject to production of an authorisation from the respective Govt depts to open Savings Bank account.</a></li>
          <li className='flex items-center gap-2 mt-4'><ImCheckmark2 className="text-green-500" /> <a>Development of Women and Children in Rural areas</a></li>
          <li className='flex items-center gap-2 mt-4'><ImCheckmark2 className="text-green-500" /> <a>Self-help Groups, etc.</a></li>
          <li className='flex items-center gap-2 mt-4'><ImCheckmark2 className="text-green-500" /> <a>Mode of Operation : Single/Jointly/Either or survivor/ Former or survivor, Later or survivor, etc</a></li>
        </ul>
      </div>

      <div className='flex justify-end mt-10'>
        <p>
          Last Updated On: Wednesday, 09-02-2025
        </p>
      </div>
     </div>
      </div>

      <div>

         <div className='flex justify-center mt-10'>
          <p className='text-blue-900 font-bold'>I read all terms and condition given by the bank and i am interested to open bank account </p>
          <input 
            type="checkbox" 
            className='ml-2'
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
         </div>

         <div className='flex justify-center mt-10 mb-9'>
          {isChecked ? (
            <a href='/open-account' className='bg-blue-900 text-white px-4 py-2 rounded-md'>open account</a>
          ) : (
            <button disabled className='bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed'>open account</button>
          )}
         </div>
      </div>

     
    </div>
  )
}

export default Saving;