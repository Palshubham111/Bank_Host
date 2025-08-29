import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Deposit() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const accountNumber = userData.accountNo;
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9006/api/sbidata/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if (response.status === 401) {
        // Token invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        setMessage('Session expired. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        setLoading(false);
        return;
      }
      if (response.ok) {
        setMessage('Deposit successful! Redirecting to home page...');
        setAmount('');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setMessage(data.message || 'Deposit failed.');
      }
    } catch {
      setMessage('An error occurred.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Deposit Money (Cash)</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Account Number</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            value={accountNumber || ''}
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Amount</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
            disabled={loading}
          >
            {loading ? 'Depositing...' : 'Deposit'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-4 py-2 rounded font-bold"
          >
            Back
          </button>
        </div>
      </form>
      {message && <div className="mt-4 text-center font-semibold">{message}</div>}
    </div>
  )
}

export default Deposit


