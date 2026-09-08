// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
import './App.css'
import Greeting from './Greeting.jsx'
import Footer from './footer.jsx'
function App(){
  const currentDate = new Date().toDateString();
  const city = 'Yaounde';
  const country = 'Cameroon';
  const population = 2700000;
  const location = navigator.geolocation.getCurrentPosition(
    (position) =>{
      // const { latitude, longitude } = position.coords;
      const longitude = position.coords.longitude;
      const latitude = position.coords.latitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }
  )
  return(
    <div className="App">
    <h1> Hello World! The date of today is {currentDate}</h1>
    <p>This is my first React component.</p>
    <p>City: {city}</p>
    <p>Country: {country}</p>
    <p>Population: {population.toLocaleString()}</p>
    <p>Location: {location ? `${location.latitude}, ${location.longitude}` : 'Location not available'}</p>
    <Greeting name="Michael" />
    <img src="https://images.unsplash.com/photo-1682685794700-1f3c5e7b8d6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="A beautiful landscape" />
    <Footer />
    </div>
    
  );
}
export default App;