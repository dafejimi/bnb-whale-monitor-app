import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import logo from '../assets/images/NYXlogo.png'

const Navbar = () => (
  <nav className="bg-black border-b border-gray-800">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img 
              src={logo}
              alt="NYX Cipher" 
              className="h-8 w-8"
            />
          </div>
          <div className="ml-10 flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white">Toolkit</a>
            <a href="#" className="text-gray-300 hover:text-white">Features</a>
            <a href="#" className="text-gray-300 hover:text-white">Use Cases</a>
            <a href="#" className="text-gray-300 hover:text-white">Nyx vs PaaR</a>
            <a href="#" className="text-gray-300 hover:text-white">Partners</a>
            <a href="#" className="text-gray-300 hover:text-white">Whitepaper</a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-transparent border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white px-4 py-2 rounded transition-colors duration-200">
            Launch App
          </button>
          <button className="bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded transition-colors duration-200">
            Connect
          </button>
          <div className="flex items-center space-x-2 ml-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 5L11 22 9 13 0 11z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const WhaleTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [interval, setIntervalState] = useState('');  // Updated to avoid conflict with the built-in setInterval function
    const [countdown, setCountdown] = useState(null);
    const [error, setError] = useState(null);
    const [countdownIntervalId, setCountdownIntervalId] = useState(null);  // Store the interval ID
  
    // Fetch transactions from the backend
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/transactions');
        const data = await response.json();
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch transactions');
        setLoading(false);
      }
    };
  
    // Update the cron interval
    const updateInterval = async () => {
      const parsedInterval = parseInt(interval);
  
      if (!parsedInterval || isNaN(parsedInterval) || parsedInterval < 1) {
        setError('Please enter a valid interval in minutes');
        return;
      }
  
      try {
        // Convert minutes to a cron string
        const cronString = `*/${parsedInterval} * * * *`;
        
        const response = await fetch('http://localhost:8000/api/cron-interval', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            interval: cronString,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update interval');
        }
  
        // Set countdown to match the interval (in seconds)
        setCountdown(parsedInterval * 60);  // Convert minutes to seconds
  
      } catch (err) {
        setError('Failed to update interval');
      }
    };
  
    // Set the countdown timer
    useEffect(() => {
      let timer;
      if (countdown !== null && countdown > 0) {
        timer = setInterval(() => {
          setCountdown(prev => prev - 1);
        }, 1000);  // Decrement every second
  
        setCountdownIntervalId(timer);  // Store the interval ID
      } else if (countdown === 0) {
        fetchTransactions();  // Fetch transactions when countdown reaches 0
        setCountdown(null);  // Reset the countdown
      }
  
      // Clear previous intervals when updating the timer
      return () => clearInterval(timer);
    }, [countdown]);
  
    // Clear the interval when the component unmounts
    useEffect(() => {
      return () => clearInterval(countdownIntervalId);
    }, [countdownIntervalId]);
  
    // Fetch transactions on component mount
    useEffect(() => {
      fetchTransactions();
    }, []);
  
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-12">Transactions</h1>
  
          <div className="mb-12">
            <p className="text-center mb-6 text-gray-300">Enter the interval in minutes</p>
            <div className="flex justify-center gap-4">
              <input
                type="number"
                value={interval}
                onChange={(e) => setIntervalState(e.target.value)}  // Updated to setIntervalState
                className="bg-transparent border border-gray-800 rounded px-4 py-2 w-64 focus:outline-none focus:border-teal-500"
                min="1"
              />
              <button
                onClick={updateInterval}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded transition-colors duration-200"
              >
                Set Interval
              </button>
            </div>
            {countdown !== null && (
              <p className="text-center mt-4 text-teal-500">
                Your transactions will be refreshed in {countdown} seconds
              </p>
            )}
            {error && (
              <p className="text-red-500 text-center mt-4">{error}</p>
            )}
          </div>
  
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-teal-500" size={48} />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-gray-400">Transaction Hash</th>
                    <th className="p-4 text-left text-gray-400">Value (BNB)</th>
                    <th className="p-4 text-left text-gray-400">From</th>
                    <th className="p-4 text-left text-gray-400">To</th>
                    <th className="p-4 text-left text-gray-400">Timestamp</th>

                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {transactions.map((tx) => (
                    <tr key={tx.hash} className="bg-gray-900/30 hover:bg-gray-900/50 transition-colors duration-150">
                      <td className="p-4 font-mono text-sm text-gray-300">
                        {tx.hash.slice(0, 18)}...
                      </td>
                      <td className="p-4 text-gray-300">{tx.value} BNB</td>
                      <td className="p-4 font-mono text-sm text-gray-300">
                        {tx.from.slice(0, 18)}...
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-mono text-sm text-gray-300">
                            {tx.to.slice(0, 18)}...
                          </div>
                          <div className="text-gray-500 text-sm">
                            Contract: {tx.contractType || 'Generic'}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{tx.timestamp || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };
  

export default WhaleTransactions;