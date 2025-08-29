import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Edit() {
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!newName.trim()) {
      setErrorMessage('New name cannot be empty.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9006/user/update-name', {
        accountNumber: user.accountNo,
        newName: newName
      });

      if (response.data.message) {
        setSuccessMessage(response.data.message);
        
        const updatedUser = { ...user, fullname: newName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setNewName('');

        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating name:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred while updating the name.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2">Full Name</h2>
          <p className="text-gray-700 text-lg">{user.fullname}</p>
        </div>
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Your Name</h3>
          <form onSubmit={handleNameSubmit}>
            <div className="mb-4">
              <label htmlFor="newName" className="block text-gray-700 text-sm font-bold mb-2">
                New Full Name
              </label>
              <input
                type="text"
                id="newName"
                value={newName}
                onChange={handleNameChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter new full name"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update Name
              </button>
            </div>
          </form>
          {successMessage && <p className="text-green-500 text-xs italic mt-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-500 text-xs italic mt-4">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default Edit;
