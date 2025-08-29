import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateMobile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [accountNo, setAccountNo] = useState(location.state?.accountNo || '');
  const [message, setMessage] = useState('');
  const [accountData, setAccountData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Check authentication on component mount
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (accountNo) {
      fetchAccountData();
    }
  }, [accountNo, navigate]);

  const fetchAccountData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:9006/api/sbidata/${accountNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAccountData(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
        return;
      }
      console.error('Error fetching account data:', error);
      setMessage('Error fetching account details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage('');

    if (!/^\d{10}$/.test(mobile)) {
      setMessage('Please enter a valid 10-digit mobile number.');
      setIsUpdating(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Update mobile number
      const updateResponse = await axios.patch(
        `http://localhost:9006/api/sbidata/${accountNo}/mobile`,
        { mobile },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!updateResponse.data.account) {
        throw new Error('Update was not successful');
      }

      // Show success message
      setMessage('Mobile number updated successfully! Redirecting...');
      
      // Fetch the latest account data
      const updatedAccountData = await axios.get(`http://localhost:9006/api/sbidata/${accountNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Wait a moment to show the success message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to sbidata with the account number
      navigate(`/sbidata/${accountNo}`, { 
        state: { 
          resultData: updatedAccountData.data,
          fromUpdate: true
        } 
      });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
        return;
      }
      console.error('Error details:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Error updating mobile number. Please try again.');
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {accountData && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">Updating mobile for:</h2>
          <p className="text-gray-600">Account: {accountData["A/C NO"]}</p>
          <p className="text-gray-600">Name: {accountData.Name}</p>
          {accountData.mobile && (
            <p className="text-gray-600">Current Mobile: {accountData.mobile}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        {!location.state?.accountNo && (
          <div className='p-4'>
            <label htmlFor="accountNo" className="text-sky-500 font-semibold">
              ENTER ACCOUNT NUMBER:
            </label>
            <input
              type="text"
              id="accountNo"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              className="ml-2 text-center border border-gray-300 rounded px-2 py-1"
              required
              disabled={isUpdating}
            />
          </div>
        )}
        <div className='p-4'>
          <label htmlFor="mobile" className="text-sky-500 font-semibold">
            ENTER NEW MOBILE NUMBER:
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            placeholder="Mobile No."
            className="ml-2 text-center border border-gray-300 rounded px-2 py-1"
            maxLength="10"
            pattern="[0-9]{10}"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            disabled={isUpdating}
          />
        </div>
        <div className='p-4'>
          <button
            type="submit"
            className={`p-2 bg-sky-500 text-white font-bold rounded hover:bg-sky-600 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Mobile'}
          </button>
        </div>
      </form>
      {message && (
        <div className={`mt-4 p-2 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      
      {accountData && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-sky-600 mb-4">Account Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Name:</p>
              <p>{accountData.Name}</p>
            </div>
            <div>
              <p className="font-semibold">Account Number:</p>
              <p>{accountData["A/C NO"]}</p>
            </div>
            <div>
              <p className="font-semibold">IFSC Code:</p>
              <p>{accountData["IFSC CODE"]}</p>
            </div>
            <div>
              <p className="font-semibold">Branch:</p>
              <p>{accountData.BRANCH}</p>
            </div>
            <div>
              <p className="font-semibold">Account Type:</p>
              <p>{accountData["A/C TYPE"]}</p>
            </div>
            <div>
              <p className="font-semibold">Amount:</p>
              <p>₹{accountData.AMOUNT}</p>
            </div>
            <div>
              <p className="font-semibold">Mobile Number:</p>
              <p>{accountData.mobile}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateMobile;
