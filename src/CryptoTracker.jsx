import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API CONFIGURATION ---
// Hum CoinGecko se 4 Crypto Assets: Bitcoin, Ethereum, Dogecoin aur Ripple (XRP) ka data lenge.
// XAU (Gold) ke liye, hum 'paxos-gold' (PAXG) ka token price use kar rahe hain, jo gold ko represent karta hai.
const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,ripple,paxos-gold&vs_currencies=usd&include_24hr_change=true';

function CryptoTracker() {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data fetch karne ka function
  const fetchPrices = async () => {
    try {
      const response = await axios.get(API_URL);
      setPrices(response.data);
      setLoading(false);
      console.log("Prices successfully received.");
    } catch (error) {
      console.error("ERROR: Failed to fetch crypto data.", error);
      setLoading(false);
      // Fail hone par error data set karte hain
      setPrices({ error: 'DATA_STREAM_INTERRUPTED' });
    }
  };

  useEffect(() => {
    // 1. Component load hote hi pehli baar fetch karo
    fetchPrices(); 

    // 2. Har 60 seconds mein data dobara fetch karo (Real-time update ke liye)
    const intervalId = setInterval(fetchPrices, 60000); 

    // 3. Cleanup: Component hatne par interval band kar do
    return () => clearInterval(intervalId);
  }, []); 

  // --- RENDERING PART ---

  if (loading) {
    return <div className="hacker-text loading-screen">{'// CONNECTING TO DATA STREAM...'}</div>;
  }
  
  if (prices.error) {
    return <div className="hacker-text error-message">{'[ERROR 404] DATA_STREAM_INTERRUPTED. Retrying in 60s...'}</div>;
  }

  // Data destructuring aur safety checks
  const btc = prices.bitcoin || {};
  const eth = prices.ethereum || {};
  const doge = prices.dogecoin || {}; // Doge data
  const xrp = prices.ripple || {};     // XRP data
 // PAXG (Gold Token) data
  
  // Prices display karna, Hacker Theme ke saath
  return (
    <div className="hacker-container">
      <h1 className="hacker-title glitch">{'>>> RONIT"S_ASSET_MONITOR_v1.0'}</h1>
      <p className="terminal-prompt">STATUS: Connection secured. Displaying live feed.</p>
      
      {/* --- BITCOIN DISPLAY --- */}
      {btc.usd && (
        <div className="coin-data-block">
          <p className="coin-name">ASSET: BITCOIN (BTC)</p>
          <p className="coin-price">{'USD: $'}{btc.usd.toLocaleString()}</p>
          <p className={`coin-change ${btc.usd_24h_change > 0 ? 'green-glow' : 'red-glow'}`}>
            {'24H_CHG: '}{btc.usd_24h_change.toFixed(2)}%
          </p>
        </div>
      )}

      {/* --- ETHEREUM DISPLAY --- */}
      {eth.usd && (
        <div className="coin-data-block">
          <p className="coin-name">ASSET: ETHEREUM (ETH)</p>
          <p className="coin-price">{'USD: $'}{eth.usd.toLocaleString()}</p>
          <p className={`coin-change ${eth.usd_24h_change > 0 ? 'green-glow' : 'red-glow'}`}>
            {'24H_CHG: '}{eth.usd_24h_change.toFixed(2)}%
          </p>
        </div>
      )}

      {/* --- DOGE DISPLAY (Fixed) --- */}
      {doge.usd && (
        <div className="coin-data-block">
          <p className="coin-name">ASSET: DOGECOIN (DOGE)</p>
          <p className="coin-price">{'USD: $'}{doge.usd.toLocaleString()}</p>
          {/* Change variable ko 'doge' use kiya gaya hai */}
          <p className={`coin-change ${doge.usd_24h_change > 0 ? 'green-glow' : 'red-glow'}`}>
            {'24H_CHG: '}{doge.usd_24h_change.toFixed(2)}%
          </p>
        </div>
      )}

      {/* --- XRP DISPLAY (NEW) --- */}
      {xrp.usd && (
        <div className="coin-data-block">
          <p className="coin-name">ASSET: RIPPLE (XRP)</p>
          <p className="coin-price">{'USD: $'}{xrp.usd.toLocaleString()}</p>
          <p className={`coin-change ${xrp.usd_24h_change > 0 ? 'green-glow' : 'red-glow'}`}>
            {'24H_CHG: '}{xrp.usd_24h_change.toFixed(2)}%
          </p>
        </div>
      )}
      
    
      <p className="terminal-prompt footer-status">{'// END_OF_FEED. next_update_in_60s...'}</p>
    </div>
  );
}

export default CryptoTracker;