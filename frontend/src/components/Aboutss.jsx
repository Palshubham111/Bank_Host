import React from 'react';

import Aboutdata from './Aboutdata';
import axios from "axios";
import { useState } from 'react';
import { useEffect } from 'react';


function Aboutss() {


  const[about, setAbout] = useState([]);

  

  useEffect(() => {
    const getData = async () =>{
      try {
        const res = await axios.get("http://localhost:9006/sbi");
        console.log(res.data);
        setAbout(res.data);
      } catch (error) {
        console.log(error)
      }
    };
    getData();
  }, [])



  return (
    <div className='p-20 '>
      <ul className=' grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  '>
        {about.map((item) =>(
          <li key={item.name}>
          <Aboutdata item={item} />
        </li>
        ))}
      </ul>
    </div>
  );
}

export default Aboutss;
