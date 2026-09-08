// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
import './App.css'
import Greeting from './Greeting.jsx'
import Footer from './src/Footer.jsx'
function App(){
  return(
    <div>
    <h1> Hello World!</h1>
    <p>This is my first React component.</p>
    <Greeting />
    <img src="https://images.unsplash.com/photo-1682685794700-1f3c5e7b8d6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="A beautiful landscape" />
    <Footer />
    </div>
    
  );
}
export default App;