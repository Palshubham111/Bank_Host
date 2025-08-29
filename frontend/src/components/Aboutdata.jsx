import React from 'react'


function Aboutdata({item}) {
  return (
    <div className=" br mt-9 ">
    <div>
    <img src={item.img} alt="" className='ceoimg ml-12' />
    <div >
   <h1 className='text-center text-sky-500'>{item.name}</h1>
   <h1 className='text-center font-bold'>{item.position}</h1>
    </div>
    </div>
    </div>
  )
}

export default Aboutdata
