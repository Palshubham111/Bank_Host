import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Transactionhis() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const accountNumber = userData.accountNo;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:9006/api/sbidata/transactions/${accountNumber}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch transactions.');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accountNumber) {
      fetchTransactions();
    }
  }, [accountNumber]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Start from the user's actual balance
  let runningBalance = Number(userData.balance) || 0;

  // Calculate running balances (backward)
  const transactionsWithBalance = sortedTransactions.map(tx => {
    const txWithBalance = { ...tx, runningBalance };
    if (tx.type === 'deposit') {
      runningBalance -= tx.amount;
    } else {
      runningBalance += tx.amount;
    }
    return txWithBalance;
  }).reverse(); // Reverse to display oldest first in the table

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded font-bold"
        >
          Back
        </button>
      </div>
      <div className="mb-4 text-right text-lg font-semibold">
        Balance: <span className="text-blue-700 font-mono">₹{userData.balance ? Number(userData.balance).toFixed(2) : '0.00'}</span>
      </div>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Date</th>
              <th className="py-2">Description</th>
              <th className="py-2">Type</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactionsWithBalance.map(tx => (
              <tr key={tx._id} className="text-center border-t">
                <td className="py-2">{new Date(tx.timestamp).toLocaleDateString()}</td>
                <td className="py-2">{tx.description}</td>
                <td className="py-2 capitalize">{tx.type}</td>
                <td className={`py-2 ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toFixed(2)}
                </td>
                <td className="py-2 font-mono">{tx.runningBalance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Transactionhis;
