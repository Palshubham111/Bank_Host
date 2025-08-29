import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Actdata() {
  const [greeting, setGreeting] = useState('');
  const [accountNumber, setAccountNumber] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [transferData, setTransferData] = useState({
    toAccount: '',
    amount: '',
    description: ''
  });
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  // Function to mask account number
  const maskAccountNumber = (accNo) => {
    if (!accNo) return null;
    const lastFour = accNo.slice(-4);
    const maskedPart = 'X'.repeat(accNo.length - 4);
    return `${maskedPart}${lastFour}`;
  };

  // Fetch account data
  const fetchAccountData = async (accNo) => {
    try {
      console.log('Fetching account data for:', accNo);
      const response = await fetch(`http://localhost:9006/api/sbidata/${accNo}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch account data');
      }

      const data = await response.json();
      console.log('Received account data:', data);
      console.log('Account data keys:', Object.keys(data));
      console.log('Raw AMOUNT value:', data.AMOUNT);
      console.log('Type of AMOUNT:', typeof data.AMOUNT);
      
      // Ensure AMOUNT is a number
      const amount = parseFloat(data.AMOUNT) || 0;
      console.log('Parsed amount:', amount);
      
      setAccountData({
        ...data,
        AMOUNT: amount
      });
      
      // Update user data in localStorage with latest balance
      const updatedUserData = {
        ...userData,
        balance: amount
      };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  // Debug log to check user data
  useEffect(() => {
    console.log('Current user data:', userData);
    console.log('Raw user data from localStorage:', localStorage.getItem('user'));
    console.log('Is authenticated:', isAuthenticated);

    // Get account number from user data
    const accNo = userData?.accountNo;
    console.log('Account number from user data:', accNo);
    setAccountNumber(accNo);

    // Fetch account data if we have an account number
    if (accNo) {
      fetchAccountData(accNo);
    }
  }, [userData, isAuthenticated]);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let timeGreeting = '';
      
      if (hour >= 5 && hour < 12) {
        timeGreeting = 'Good Morning';
      } else if (hour >= 12 && hour < 17) {
        timeGreeting = 'Good Afternoon';
      } else if (hour >= 17 && hour < 21) {
        timeGreeting = 'Good Evening';
      } else {
        timeGreeting = 'Good Night';
      }
      
      setGreeting(timeGreeting);
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  const handleTransferChange = (e) => {
    setTransferData({
      ...transferData,
      [e.target.name]: e.target.value
    });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setTransferError('');
    setTransferSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:9006/user/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fromAccount: accountNumber,
          toAccount: transferData.toAccount,
          amount: parseFloat(transferData.amount),
          description: transferData.description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Transfer failed');
      }

      setTransferSuccess(data.message);
      setTransferData({
        toAccount: '',
        amount: '',
        description: ''
      });

      // Refresh account data after successful transfer
      if (accountNumber) {
        await fetchAccountData(accountNumber);
      }

    } catch (err) {
      setTransferError(err.message || 'Failed to transfer funds');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    console.log('Not authenticated, returning null');
    return null;
  }

  const maskedAccountNumber = maskAccountNumber(accountNumber);
  const currentBalance = parseFloat(accountData?.AMOUNT) || 0;
  console.log('Current balance being displayed:', currentBalance);
  console.log('Account data for balance:', accountData);

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between'>
        <div className='userss mt-12 p-10'>
          <div className='bg-white p-6 rounded-lg mt-12 shadow-lg'>
            <h1 className='text-3xl font-bold text-blue-800 mt-10'>
              Hello {userData?.fullname?.split(' ')[0] || 'User'} <span className='text-green-600'>{greeting}</span>
            </h1>
          </div>
        </div>

        <div className='userss mt-12 p-10'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h1 className='text-2xl font-bold text-blue-800'>
              Savings Account
            </h1>
            {maskedAccountNumber ? (
              <p className='mt-4 text-lg text-gray-700'>
                Account Number: <span className='font-mono font-bold'>{maskedAccountNumber}</span>
              </p>
            ) : (
              <p className='mt-4 text-red-600'>
                Account number not available
              </p>
            )}
            <p className='mt-2 text-lg text-gray-700'>
              Balance: <span className='font-bold'>₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span className='ml-1 font-bold text-2xl text-sky-500'>cr</span></span>
            </p>
            {accountData && (
              <p className='mt-2 text-sm text-gray-500'>
                Last updated: {new Date().toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fund Transfer Section */}
      <div className='mt-8 p-10'>
        <div className='bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto'>
          <h2 className='text-2xl font-bold text-blue-800 mb-6'>Transfer Funds</h2>
          
          <form onSubmit={handleTransfer} className='space-y-4'>
            <div>
              <label className='block text-gray-700 mb-2'>To Account Number</label>
              <input
                type="text"
                name="toAccount"
                value={transferData.toAccount}
                onChange={handleTransferChange}
                className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder="Enter recipient's account number"
                required
                pattern="[0-9]*"
                title="Please enter only numbers"
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-2'>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={transferData.amount}
                onChange={handleTransferChange}
                className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder="Enter amount"
                required
                min="1"
                step="0.01"
                max={currentBalance}
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-2'>Description</label>
              <input
                type="text"
                name="description"
                value={transferData.description}
                onChange={handleTransferChange}
                className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder="Enter transfer description"
                required
              />
            </div>

            {transferError && (
              <div className="text-red-500 text-sm">
                {transferError}
              </div>
            )}

            {transferSuccess && (
              <div className="text-green-500 text-sm">
                {transferSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Transfer Funds'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Actdata;


