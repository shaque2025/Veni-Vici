import { useState } from 'react'
import './App.css'

const ACCESS_KEY = 'live_W61JLSTU5dvmPIzl2UmjrddkhiCotQiH1dR2cAETTk6ue5dRtsbtZorKvcbnXG92';

function App() {
  const [currentItem, setCurrentItem] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToBanList = (attribute) => {
    if (!banList.includes(attribute)) {
      setBanList((prev) => [...prev, attribute]);
    }
  };

  // NEW: Function to remove an item from the ban list (unban)
  const removeFromBanList = (attribute) => {
    setBanList((prev) => prev.filter((item) => item !== attribute));
  };

  const fetchRandomData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.thecatapi.com/v1/images/search?has_breeds=1&api_key=${ACCESS_KEY}`
      );
      const json = await response.json();

      if (json[0] && json[0].breeds.length > 0) {
        const breed = json[0].breeds[0];
        const currentAttributes = [
          breed.name,
          breed.origin,
          breed.life_span,
          breed.weight.imperial
        ];

        const isBanned = currentAttributes.some(attr => banList.includes(attr));

        if (isBanned) {
          await fetchRandomData();
        } else {
          setCurrentItem(json[0]);
          setHistory((prev) => [json[0], ...prev]);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Something went wrong with the data fetch!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="whole-page">
      
      {/* LEFT SIDEBAR: History List */}
      <div className="history-sidebar">
        <h2>Who have we seen so far?</h2>
        <div className="history-container">
          {history.length > 0 ? (
            history.map((item, index) => (
              <div key={index} className="history-card">
                <p>{item.breeds[0].name}</p>
                <img src={item.url} width="80px" alt="Past discovery" />
              </div>
            ))
          ) : (
            <p>You haven't discovered anything yet!</p>
          )}
        </div>
      </div>

      {/* CENTER: Main Discovery App */}
      <div className="App">
        <h1>Veni Vici! 🐾</h1>
        <h3>Discover new things from across the world!</h3>

        <div className="main-content">
          <div className="display-container">
            {currentItem ? (
              <div className="listing-container">
                <h2>{currentItem.breeds[0].name}</h2>
                
                <div className="attributes">
                  <button className="attribute-btn" onClick={() => addToBanList(currentItem.breeds[0].name)}>
                    {currentItem.breeds[0].name}
                  </button>
                  <button className="attribute-btn" onClick={() => addToBanList(currentItem.breeds[0].weight.imperial)}>
                    {currentItem.breeds[0].weight.imperial} lbs
                  </button>
                  <button className="attribute-btn" onClick={() => addToBanList(currentItem.breeds[0].origin)}>
                    {currentItem.breeds[0].origin}
                  </button>
                  <button className="attribute-btn" onClick={() => addToBanList(currentItem.breeds[0].life_span)}>
                    {currentItem.breeds[0].life_span} years
                  </button>
                </div>

                <img 
                  src={currentItem.url} 
                  alt="Random discovery" 
                  className="discover-image" 
                />
              </div>
            ) : (
              <div className="empty-state">
                <br />
                <h3>Click the button to start discovering!</h3>
                <p>🐱 🐈 🦁 🐯</p>
              </div>
            )}
          </div>

          <button 
            className="discover-btn" 
            onClick={fetchRandomData}
            disabled={isLoading}
          >
            {isLoading ? "Fetching... 🔄" : "Discover! 🔍"}
          </button>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Ban List */}
      <div className="ban-list-container">
        <h2>Ban List</h2>
        <h4>Select an attribute from a listing to ban it</h4>
        <div className="ban-items-display">
          {banList.map((item, index) => (
            /* UPDATED: Added onClick to allow unbanning */
            <button 
              key={index} 
              className="banned-item" 
              onClick={() => removeFromBanList(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      
    </div>
  )
}

export default App