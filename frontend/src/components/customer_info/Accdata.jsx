import React, { useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom';

function Accdata() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item || location.state?.resultData;

  useEffect(() => {
    // Check authentication on component mount
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // If we're coming from an update, show a success message
    if (location.state?.fromUpdate && item) {
      const timer = setTimeout(() => {
        // Remove the fromUpdate flag after showing the message
        navigate(`/sbidata/${item["A/C NO"]}`, { 
          state: { 
            resultData: item 
          },
          replace: true
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state?.fromUpdate, item, navigate]);

  if (!item) {
    return (
      <div className="text-center p-8 mt-8">
        <div className="text-red-600 text-lg mb-4">
          No result data found
        </div>
        <div className="text-gray-600 text-sm">
          Please ensure you have accessed this page through proper navigation.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {location.state?.fromUpdate && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          Mobile number updated successfully!
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {item.Name} ACCOUNT DETAILS
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <ul className="space-y-4">
          <li className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">NAME:</span>
            <span className="text-gray-900">{item.Name}</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">ACC NO:</span>
            <span className="text-gray-900">{item["A/C NO"]}</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">AMOUNT:</span>
            <span className= {item.AMOUNT ? "text-gray-800" : "text-red-400"}>{item.AMOUNT  ? item.AMOUNT : "PLEASE MAINTAIN YOUR BALANCE 0"} 
              <a className='text-2xl text-sky-300'>₹</a>
            </span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">BRANCH:</span>
            <span className="text-gray-900">{item.BRANCH}</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">IFSC CODE:</span>
            <span className="text-gray-900">{item["IFSC CODE"]}</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">ACC TYPE:</span>
            <span className="text-gray-900">{item["A/C TYPE"]}</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">MOBILE NO:</span>
            <span className={item.mobile ? "text-gray-900" : "text-red-600"}>
              {item.mobile || (
                <Link 
                  to="/updatemobile" 
                  state={{ accountNo: item["A/C NO"] }}
                  className="text-sky-500 hover:text-sky-600 underline"
                >
                  UPDATE MOBILE NO
                </Link>
              )}
            </span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">PAN NUMBER:</span>
            <span className="text-gray-900">{item.panNumber || "Not Available"}</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">AADHAR NUMBER:</span>
            <span className="text-gray-900">{item.aadharNumber || "Not Available"}</span>
          </li>
        </ul>
      </div>

      {/* Document Photos Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Document Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Profile Photo</h3>
            {item.photo ? (
              <img 
                src={`http://localhost:9006/${item.photo}`} 
                alt="Profile Photo" 
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                <span className="text-gray-400">No profile photo available</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Aadhar Photo</h3>
            {item.aadharPhoto ? (
              <img 
                src={`http://localhost:9006/${item.aadharPhoto}`} 
                alt="Aadhar Photo" 
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                <span className="text-gray-400">No Aadhar photo available</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">PAN Photo</h3>
            {item.panPhoto ? (
              <img 
                src={`http://localhost:9006/${item.panPhoto}`} 
                alt="PAN Photo" 
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                <span className="text-gray-400">No PAN photo available</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
        >
          Back
        </Link>
      </div>
    </div>
  );
}

export default Accdata;
