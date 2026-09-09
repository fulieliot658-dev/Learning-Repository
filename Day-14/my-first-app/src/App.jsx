import { useState, useEffect } from 'react'
import './App.css'
import Greeting from './Greeting.jsx'
import Footer from './footer.jsx'
import Card from './Card.jsx'
import Button from './Button.jsx'
import ProfileCard from './ProfileCard.jsx'

function App() {
  // 1. Declare state (starts as null so we know location hasn't arrived yet)
  const [location, setLocation] = useState(null);
const [currentDateTime, setCurrentDateTime] = useState(null);
  const currentDate = new Date().toDateString();
  const city = 'Yaounde';
  const country = 'Cameroon';
  const population = 2700000;

  // 2. Fetch coordinates inside useEffect when the component mounts
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Save coordinates into state using setLocation
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error("Error fetching geolocation:", error);
      }
    );
  }, []); // Empty array ensures this runs only once when page loads
useEffect(() => {
    // Function to calculate and update current time
    const updateTime = () => {
      const now = new Date();

      const timeString = now.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const dateString = now.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      // Update state with formatted date and time string
      setCurrentDateTime(`${dateString} at ${timeString}`);
    };

    // Run once immediately when component loads
    updateTime();

    // Optional: Update every second (1000ms) to create a ticking clock!
    const intervalId = setInterval(updateTime, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Run once on mount
  return (
    <div className="App">
      <h1>Hello World! The date of today is {currentDate}</h1>
      <p>This is my first React component.</p>
      <p>City: {city}</p>
      <p>Country: {country}</p>
      <p>Population: {population.toLocaleString()}</p>
      
      {/* 3. Display the location state cleanly */}
      <p>
        Location: {location 
          ? `${location.latitude}, ${location.longitude}` 
          : 'Location not available'}
      </p>
<div>
      <p>Current Time: {currentDateTime ? currentDateTime : 'Loading time...'}</p>
    </div>
      <Greeting name="Michael" />
      <ProfileCard name="Michael" job="Data Analyst" city="California" />
      <ProfileCard name="John Doe" job="Petroleum Engineer" city="Mumbai" />
      <ProfileCard name="Bob" job="Builder" city="Douala" />
      
      <Card>
        <img src="" alt="Card Image" />
        <h3>Card Title</h3>
        <p>This is the content of the card.</p>
      </Card>
      
      <Button /><br />
      <img 
        src="https://images.unsplash.com/photo-1682685794700-1f3c5e7b8d6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
        alt="A beautiful landscape" 
      />
      <Footer />
    </div>
  );
}

export default App;