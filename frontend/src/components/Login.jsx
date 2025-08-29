import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Login() {
  const [formData, setFormData] = useState({
    accountNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show the modal when the component mounts
    const modal = document.getElementById('my_modal_3');
    if (modal) {
      modal.showModal();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { accountNumber: formData.accountNumber });
      
      const response = await fetch('http://localhost:9006/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error response:', errorData);
        throw new Error(errorData.message || 'Invalid account number');
      }

      const data = await response.json();
      console.log('Login successful, response:', data);

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');

      // Close modal and redirect
      const modal = document.getElementById('my_modal_3');
      if (modal) {
        modal.close();
      }
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <a href='/' className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</a>
          </form>

          <div className='flex justify-center p-4 m-5'>
            <h1 className='font-extrabold text-2xl'>LOGIN</h1>
            <img src="https://yt3.googleusercontent.com/NGhfS9Di_x-EquQdoHWnnCsws9C2ekE_qt5F6Cb9-Jllrecw86qwxr207V7Ffqv5bZAQYVU3e0k=s900-c-k-c0x00ffffff-no-rj" className='imgl' alt="SBI bank" />
          </div>

          <form onSubmit={handleSubmit} className='ml-11 mt-10'>
            <div>
              <label htmlFor="accountNumber" className="text-xl">Account Number</label>
              <input 
                className='inp w-130 p-1 ml-4 bg-gray-100' 
                placeholder="Enter your account number" 
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
                pattern="[0-9]*"
                title="Please enter only numbers"
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
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <div className='mt-4'>
            <p className='text-center'>Don't have an account? <a href="#" className='text-sky-500 font-bold' onClick={() => document.getElementById('my_modal_4').showModal()}>Sign up</a></p>
            <p className='text-center mt-5'>By continuing, you agree to SBI bank Terms <br /> of use and privacy policy</p>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Login;
