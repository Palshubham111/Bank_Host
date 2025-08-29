import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Accdetai() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Account Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Account Number:</p>
            <p>{user.accountNo}</p>
          </div>
          <div>
            <p className="font-semibold">Full Name:</p>
            <p>{user.fullname}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="font-semibold">Mobile Number:</p>
            <p>{user.mobile}</p>
          </div>
          <div>
            <p className="font-semibold">Balance:</p>
            <p>₹ {user.balance}</p>
          </div>
          <div>
            <p className="font-semibold">Account Type:</p>
            <p>{user.accountType}</p>
          </div>
          <div>
            <p className="font-semibold">Address:</p>
            <p>{user.address}</p>
          </div>

          <div>
            <p className="font-semibold">PAN no:</p>
            <p>{user.pan}</p>
          </div>

          <div>
            <p className="font-semibold">Aadhar no:</p>
            <p>{user.aadhar}</p>
          </div>

          <div>
            <p className="font-semibold">Date of Birth:</p>
            <p>{new Date(user.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-semibold">Account Creation Date:</p>
            <p>{new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={handleGoHome}
          className="bg-sky-500 text-white font-bold py-2 px-4 rounded hover:bg-sky-600 focus:outline-none focus:shadow-outline"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default Accdetai;
