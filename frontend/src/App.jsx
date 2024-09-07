import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar/navbar';
import MainSection from './Components/mainSection/main-section.jsx';
import BlogContent from './Components/contentSection/blog-content';

function App() {


  return (
    <>
      <Navbar />
      <MainSection />
      <BlogContent />
    </>
  )
}

export default App
