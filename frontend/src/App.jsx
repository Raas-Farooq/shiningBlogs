import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './navbar';
import MainSection from './main-section';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <MainSection />
    </>
  )
}

export default App
