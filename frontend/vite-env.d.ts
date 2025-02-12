
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly REACT_APP_API:string
    // Add more environment variables if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  