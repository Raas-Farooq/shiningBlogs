import './App.css'
import Navbar from './Components/Navbar/navbar.tsx';
import MainSection from  './Components/mainSection/main-section.tsx';
import BlogContent from './Components/contentSection/blog-content.tsx';
import { useAuthenContext } from './globalContext/globalContext.tsx';

function App() {
  const {loading} = useAuthenContext();
  return (
    <>
    {loading ? <h1> ..Loading </h1> : (
     <>
      <Navbar />
      <MainSection />
      <BlogContent />
     </>
    )}
      
    </>
  )
}

export default App
