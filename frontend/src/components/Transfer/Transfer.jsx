import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Transfer() {
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const fromAccount = userData.accountNo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9006/user/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fromAccount, toAccount, amount: Number(amount), description }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Transfer successful! Redirecting...');
        setTimeout(() => {
          navigate('/transhistory');
        }, 2000);
      } else {
        setMessage(data.error || data.message || 'Transfer failed.');
      }
    } catch (err) {
      console.error("Transfer error:", err);
      setMessage('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Fund Transfer</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Recipient's Account Number</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Amount</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Description (Optional)</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
            disabled={loading}
          >
            {loading ? 'Transferring...' : 'Transfer'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-4 py-2 rounded font-bold"
          >
            Back
          </button>
        </div>
      </form>
      {message && <div className="mt-4 text-center font-semibold">{message}</div>}
    </div>
  );
}

export default Transfer; 