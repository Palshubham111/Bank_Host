import React, { useState, useEffect } from 'react'
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function Accdetailsearch() {
  const [acc, setAcc] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const validateAccountNumber = (accountNumber) => {
    // Remove any spaces or special characters
    const cleanAcc = accountNumber.replace(/[^0-9]/g, '');
    
    // Check if the account number is empty
    if (!cleanAcc) {
      return 'Please enter an account number';
    }
    
    // Check if the account number is exactly 11 digits (SBI account number format)
    if (cleanAcc.length !== 11) {
      return 'Account number must be 11 digits';
    }
    
    // Check if the account number contains only digits
    if (!/^\d+$/.test(cleanAcc)) {
      return 'Account number must contain only digits';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateAccountNumber(acc);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:9006/api/sbidata/${acc}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
        return;
      }
      
      if (response.ok) {
        navigate(`/sbidata/${acc}`, { state: { resultData: data } });
      } else {
        setError(data.message || 'Account not found');
      }
    } catch {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <p className='text-center text-red-700 font-medium'>
            Dear Customer, Please Note That Only Account Details Show Not Use for other Activity.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="acc" className="block text-sm font-medium text-gray-700">
              Account Number:
            </label>
            <input 
              type="text" 
              id="acc" 
              value={acc}
              onChange={(e) => {
                setAcc(e.target.value);
                setError(''); // Clear error when user types
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your 11-digit account number"
              maxLength="11"
              pattern="[0-9]*"
              inputMode="numeric"
            />
            <p className="text-sm text-gray-500">
              Please enter your 11-digit SBI account number
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${
                loading 
                  ? 'bg-red-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {loading ? 'Searching...' : 'Submit'}
            </button>

            <a 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
            >
              <IoChevronBack className="mr-1" />
              Back
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Accdetailsearch;
