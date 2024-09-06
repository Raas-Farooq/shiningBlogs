import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar/navbar';
import MainSection from './Components/mainSection/main-section';
import BlogContent from './Components/contentSection/blog-content';
import UserAccount from './Components/userAccount/userAccout'
import UpdateProfile from './pages/updateProfile';

function App() {


  return (
    <>
      {/* {currentState === 'Navbar' && <Navbar />}
      {currentState === 'UserAccount' && <UserAccount />} */}
      <Navbar />
      <MainSection />
      <BlogContent />
    </>
  )
}

export default App
