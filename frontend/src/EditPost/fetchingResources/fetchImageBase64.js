import { useCallback } from "react";


const fetchImageAsBase64 = (async (image) => {
    try {
      alert("FetchImage As Base64 Runs");
      const response = await fetch(`http://localhost:4100/${image}`);
      console.log("response fetchImageAsBase64 :", response)
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          localStorage.setItem("titleImagePreview", reader.result);
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("err while converting server image to buffer", err);
      return null;
    }
  });

export default fetchImageAsBase64