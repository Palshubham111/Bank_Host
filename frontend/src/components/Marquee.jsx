import React from 'react'

function Marquee() {
  return (
    <div>

      <div className='mar text-red-600 flex align-middle h-7 bg-cyan-100 mb-5  font-bold'>
     
       <p className='mars'>
       <marquee behavior="alternative" direction="left"  >
       Dear Customer, due to our routine banking maintenance activities, you may experience intermittent fluctuations for 3 to 4 minutes between 4.45 AM and 5.45 AM IST daily. We sincerely regret the inconvenience caused. Customers can now deposit Income Tax/Corporate Taxes using all Bank Debit Cards and Credit Cards under State Bank Payment Gateway.  Mandatory Profile password change after 365 days introduced for added security. Call us toll free on 1800 1234 and 1800 2100 and get a wide range of services through SBI Contact Centre. SBI never asks for your Card/PIN/OTP/CVV details on phone, message or email. Please do not click on links received on your email or mobile asking your Bank/Card details.
       </marquee>
       </p>
       
      </div>
      
      <div>
      <img src="https://sbi.co.in/documents/16012/44015527/Bank.sbi+Hindi.jpg/8210eb74-6fe6-5c0d-5470-a6ce2a35e7ca?t=1742360070219" alt="" />
      </div>
      </div>
    
  )
}

export default Marquee
