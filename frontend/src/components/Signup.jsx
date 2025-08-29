import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

function Signup() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show the modal when the component mounts
    const modal = document.getElementById('my_modal_4');
    if (modal) {
      modal.showModal();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:9006/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Close the modal on successful signup
      const modal = document.getElementById('my_modal_4');
      if (modal) {
        modal.close();
      }
      // Show success message and redirect to login
      alert('Signup successful! Please login.');
      navigate('/login');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <a href='/' className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</a>
          </form>

          <div className='flex justify-center p-4 m-5'>
            <h1 className='font-extrabold text-2xl'>SIGN UP</h1>
            <img src="https://yt3.googleusercontent.com/NGhfS9Di_x-EquQdoHWnnCsws9C2ekE_qt5F6Cb9-Jllrecw86qwxr207V7Ffqv5bZAQYVU3e0k=s900-c-k-c0x00ffffff-no-rj" className='imgl' alt="SBI bank" />
          </div>

          <form onSubmit={handleSubmit} className='ml-11 mt-10'>
            <div>
              <label htmlFor="fullname" className="text-xl">Full Name</label>
              <input
                className='inp w-130 p-1 ml-4 bg-gray-100'
                placeholder="Enter your full name"
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className='mt-5'>
              <label htmlFor="email" className="text-xl">Email</label>
              <input
                className='inp w-130 p-1 ml-4 bg-gray-100'
                placeholder="Enter your email"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className='mt-5'>
              <label htmlFor="password" className="text-xl">Password</label>
              <input
                className='inp w-130 p-1 ml-4 bg-gray-100'
                placeholder="Enter your password"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`p-2 mt-4 bg-sky-500 text-white border-r-black w-full ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          <div className='mt-4'>
            <p className='text-center'>Already have an account? <a href="#" className='text-sky-500 font-bold' onClick={() => document.getElementById('my_modal_3').showModal()}>Login</a></p>
            <p className='text-center mt-5'>By continuing, you agree to SBI bank Terms <br /> of use and privacy policy</p>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Signup
