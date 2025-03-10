import { VITE_API_URL } from "../../config"


const fetchImageAsBase64 = (async (image:string):Promise<string | null> => {
    try {
      const response = await fetch(`${VITE_API_URL}/${image}`);
      console.log("response fetchImageAsBase64 :", response)
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if(typeof reader.result === 'string'){
            localStorage.setItem("titleImagePreview", reader.result);
            resolve(reader.result);
          }else{
            console.error("Failed to convert Image to base64");
            return null
          }
          
        };
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("err while converting server image to buffer", err);
      return null;
    }
  });

export default fetchImageAsBase64