// Add an ErrorBoundary component
import {useState, useEffect} from 'react';


const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const errorHandler = (error) => {
      console.error('Error caught by boundary:', error);
      setHasError(true);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);
  
  if (hasError) {
    return <div>
        Something went wrong. 
        <button onClick={() => window.location.reload()}>
            Refresh
        </button>
        </div>;
  }
  
  return children;
};

export default ErrorBoundary