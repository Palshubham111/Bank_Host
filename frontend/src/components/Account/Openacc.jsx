import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Openacc = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    aadharNumber: '',
    panNumber: '',
    address: '',
    initialDeposit: '',
    photo: null,
    aadharPhoto: null,
    panPhoto: null
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [aadharPhotoPreview, setAadharPhotoPreview] = useState(null);
  const [panPhotoPreview, setPanPhotoPreview] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to open an account');
      navigate('/login');
      return;
    }

    // Verify token is valid
    const verifyToken = async () => {
      try {
        await axios.get('http://localhost:9006/api/test', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        if (error.response?.status === 401) {
          alert('Your session has expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    verifyToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to open an account');
      navigate('/login');
      return;
    }

    try {
      // Validate form data
      const validationErrors = {};
      if (!formData.name.trim()) validationErrors.name = 'Name is required';
      if (!formData.email.trim()) validationErrors.email = 'Email is required';
      if (!formData.phone.trim()) validationErrors.phone = 'Phone number is required';
      if (!formData.dateOfBirth) validationErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.aadharNumber.trim()) validationErrors.aadharNumber = 'Aadhar number is required';
      if (!formData.panNumber.trim()) validationErrors.panNumber = 'PAN number is required';
      if (!formData.address.trim()) validationErrors.address = 'Address is required';
      if (!formData.initialDeposit) validationErrors.initialDeposit = 'Initial deposit is required';
      if (!formData.photo) validationErrors.photo = 'Photo is required';

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      // First check if server is accessible
      try {
        await axios.get('http://localhost:9006/api/test', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Server connection test failed:', error);
        if (error.response?.status === 401) {
          alert('Your session has expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        setErrors({ 
          submit: 'Cannot connect to server. Please ensure the backend server is running on port 9006.' 
        });
        setIsSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      console.log('Sending form data to server...');
      const response = await axios.post('http://localhost:9006/api/sbidata/open', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        timeout: 50000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      });

      console.log('Server response:', response.data);
      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } else {
        setErrors({ submit: response.data.message || 'Failed to open account. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response) {
        if (error.response.status === 401) {
          alert('Your session has expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        console.error('Error response:', error.response.data);
        setErrors(error.response.data.errors || { 
          submit: `Server error: ${error.response.data.message || 'Failed to open account'}` 
        });
      } else if (error.request) {
        console.error('No response received:', error.request);
        setErrors({ 
          submit: 'Network error: Cannot connect to server. Please check if the server is running on port 9006.' 
        });
      } else {
        console.error('Request setup error:', error.message);
        setErrors({ 
          submit: `Error: ${error.message}` 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Auto-format phone number
    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    // Auto-format Aadhar number
    else if (name === 'aadharNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 12);
    }
    // Auto-format PAN number
    else if (name === 'panNumber') {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    }
    // Auto-format initial deposit
    else if (name === 'initialDeposit') {
      formattedValue = value.replace(/[^0-9]/g, '');
      if (formattedValue && parseInt(formattedValue) < 1000) {
        formattedValue = '1000';
      }
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Add input masks for better UX
  const getInputMask = (name) => {
    switch (name) {
      case 'phone':
        return '9999999999';
      case 'aadharNumber':
        return '999999999999';
      case 'panNumber':
        return 'AAAAA9999A';
      default:
        return '';
    }
  };

  const handlePhotoChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({
          ...errors,
          [type]: 'Please upload an image file'
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          [type]: 'Photo size should be less than 5MB'
        });
        return;
      }

      setFormData({
        ...formData,
        [type]: file
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        switch(type) {
          case 'photo':
            setPhotoPreview(reader.result);
            break;
          case 'aadharPhoto':
            setAadharPhotoPreview(reader.result);
            break;
          case 'panPhoto':
            setPanPhotoPreview(reader.result);
            break;
        }
      };
      reader.readAsDataURL(file);

      // Clear error if validation passes
      if (errors[type]) {
        setErrors({
          ...errors,
          [type]: ''
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Open New Account</h2>
        
        {showSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">Account opened successfully! Redirecting to home page in 5 seconds...</p>
          </div>
        )}

        {errors.submit && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo Upload Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                    />
                  ) : (
                    <div className="h-32 w-32 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                      <span className="text-gray-400">No photo</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(e, 'photo')}
                    className={`block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      ${errors.photo ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.photo && (
                    <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a passport size photo (Max size: 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Aadhar Photo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Photo</label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {aadharPhotoPreview ? (
                    <img
                      src={aadharPhotoPreview}
                      alt="Aadhar Preview"
                      className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                    />
                  ) : (
                    <div className="h-32 w-32 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                      <span className="text-gray-400">No Aadhar photo</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <input
                    type="file"
                    id="aadharPhoto"
                    name="aadharPhoto"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(e, 'aadharPhoto')}
                    className={`block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      ${errors.aadharPhoto ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.aadharPhoto && (
                    <p className="mt-1 text-sm text-red-600">{errors.aadharPhoto}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Upload Aadhar card photo (Max size: 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* PAN Photo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">PAN Photo</label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {panPhotoPreview ? (
                    <img
                      src={panPhotoPreview}
                      alt="PAN Preview"
                      className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                    />
                  ) : (
                    <div className="h-32 w-32 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                      <span className="text-gray-400">No PAN photo</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <input
                    type="file"
                    id="panPhoto"
                    name="panPhoto"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(e, 'panPhoto')}
                    className={`block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      ${errors.panPhoto ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.panPhoto && (
                    <p className="mt-1 text-sm text-red-600">{errors.panPhoto}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Upload PAN card photo (Max size: 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength="10"
                pattern="[0-9]{10}"
                autoComplete="tel"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={getInputMask('phone')}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700">Aadhar Number</label>
              <input
                type="text"
                id="aadharNumber"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                required
                maxLength="12"
                pattern="[0-9]{12}"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.aadharNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={getInputMask('aadharNumber')}
              />
              {errors.aadharNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">PAN Number</label>
              <input
                type="text"
                id="panNumber"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                required
                maxLength="10"
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.panNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={getInputMask('panNumber')}
              />
              {errors.panNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.panNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="initialDeposit" className="block text-sm font-medium text-gray-700">Initial Deposit (₹)</label>
              <input
                type="number"
                id="initialDeposit"
                name="initialDeposit"
                value={formData.initialDeposit}
                onChange={handleChange}
                required
                min="1000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Minimum ₹1000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              autoComplete="street-address"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your complete address"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Opening Account...
                </>
              ) : (
                'Open Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Openacc;
