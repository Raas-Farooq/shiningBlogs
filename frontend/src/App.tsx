import './App.css'
import Navbar from './Components/Navbar/navbar.tsx';
import MainSection from  './Components/mainSection/main-section.tsx';
import BlogContent from './Components/contentSection/blog-content.tsx';
import { useAuthenContext } from './globalContext/globalContext.tsx';
import Home from './Home/home.tsx';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

function App() {
  const {loading} = useAuthenContext();
  return (
    <>
    {loading ? <h1> ..Loading </h1> : (
     <>
     
      <Navbar />
      <Toaster 
      position='top-center'
      toastOptions={
       {
         duration:4000
       }
      }
      containerStyle={{zIndex:9999}}
      />
      <Outlet />
     </>
    )}
      
    </>
  )
}

export default App

// https://chatgpt.com/s/t_69072b7b6f88819191e108e04de2e8f3