import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function UpdateMobile() {
  const [formData, setFormData] = useState({
    newMobile: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get user data from localStorage
    const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUserData.accountNo) {
      navigate('/login');
      return;
    }
    setUserData(storedUserData);
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:9006/api/sbidata/${userData.accountNo}/mobile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          mobile: formData.newMobile
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update mobile number');
      }

      setSuccess('Mobile number updated successfully!');
      
      // Update user data in localStorage
      const updatedUserData = {
        ...userData,
        mobile: formData.newMobile
      };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);

      // Clear form
      setFormData({ newMobile: '' });

      // Wait a moment to show the success message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to home page
      navigate('/');

    } catch (err) {
      setError(err.message || 'Failed to update mobile number');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !userData) {
    return null;
  }

  // Function to mask account number
  const maskAccountNumber = (accNo) => {
    if (!accNo) return null;
    const lastFour = accNo.slice(-4);
    const maskedPart = 'X'.repeat(accNo.length - 4);
    return `${maskedPart}${lastFour}`;
  };

  const maskedAccountNumber = maskAccountNumber(userData.accountNo);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Update Mobile Number</h2>
          
          <div className="mb-6">
            <p className="text-gray-600">
              Account Number: <span className="font-semibold">{maskedAccountNumber}</span>
            </p>
            <p className="text-gray-600">
              Current Mobile: <span className="font-semibold">{userData?.mobile || 'Not set'}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">New Mobile Number</label>
              <input
                type="tel"
                name="newMobile"
                value={formData.newMobile}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new mobile number"
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit mobile number"
                maxLength="10"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-500 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Updating...' : 'Update Mobile Number'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateMobile; 