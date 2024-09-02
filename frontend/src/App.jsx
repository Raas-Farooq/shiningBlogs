import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar/navbar';
import MainSection from './Components/mainSection/main-section';
import BlogContent from './Components/contentSection/blog-content';
import UserAccount from './Components/userAccount/userAccout'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <UserAccount />
      <MainSection />
      <BlogContent />
    </>
  )
}

export default App
