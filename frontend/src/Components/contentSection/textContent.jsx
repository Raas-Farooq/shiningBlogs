import { useEffect, useState } from "react"
import Image from "./titleImage";
import ContentImages from "./ContentImage";
import { FaCookieBite } from "react-icons/fa";


export default function TextContent({content, isFullView=false, fromPost=false, contentImages=null}){

    const [text, setText] = useState('');
    const [image, setImage] = useState('');
    const [transformedText, setTransformedText] = useState([]);
    // console.log("contentImage: ", contentImages)
    const makeWords = (textData) => {
        if(typeof textData !== 'string' || textData === "") return '';
        const splitted = textData.split(' ');
        const sliced = splitted.slice(0, 12);
        const smallText = sliced.join(' ');
        return smallText
    }

  
    useEffect(() => {
      const textContent = content.find(item => item.type === 'text')?.value || '';
      setText(textContent);
      console.log("acutal text : ", textContent)
      // for (const image of contentImages){
      //   console.log("position :", image.position)
      // }
      const contentAndImages = [];
      let endIndx = 0;
    
      if (contentImages && textContent) {
        // Sort images by position
        const sortedImages = [...contentImages].sort((a, b) => a.position - b.position);
        
        // Remove image placeholders and split by newlines
        const cleanText = textContent.replace(/\[image-\d+\]/g, '         ');
        
        // Process each image and text segment
        sortedImages.forEach((image, index) => {
          // Add text segment before image
          const textSegment = cleanText.slice(endIndx, (image.position ));
          // console.log("text Segment: ", textSegment);
          if (textSegment) {
            // Split text segment by newlines and add each paragraph
            textSegment.split('\n').forEach((paragraph, pIndex) => {
              if (paragraph.trim()) {
                // console.log("paragraph trim  inside first split by \n ", paragraph.trim())
                contentAndImages.push(
                  <p key={`text-${index}-${pIndex}`} className="mb-4">
                    {paragraph.trim()}
                  </p>
                );
              }
              // console.log("contentAnd Images after first forEach:", contentAndImages);
            });
          }
    
          // Add image
          contentAndImages.push(
            <img
              key={`img-${index}`}
              src={`http://localhost:4100/${image.path}`}
              alt={image.fileName}
              className="block w-60 h-56 rounded-md my-4 max-w-full"
            />
          );
    
          endIndx = image.position;
          // console.log("endIndex: ", endIndx)
        });
    
        // Add remaining text after last image
        const remainingText = cleanText.slice(endIndx);
        if (remainingText) {
         
          remainingText.split('\n').forEach((paragraph, index) => {
            if (paragraph.trim()) {
              contentAndImages.push(
                <p key={`end-text-${index}`} className="mb-4">
                  {paragraph.trim()}
                </p>
              );
            }
          });
        }
        
       
        setTransformedText(contentAndImages);
      }
    }, [content, contentImages]);

    return (
        <div className={`${isFullView ? 'w-4/5': 'w-60'} `}>
            {!isFullView ? 
            <p>{makeWords(text)}..</p>
            
            : 
            <div>
              {transformedText}
            </div>
            }
            
            
        </div>
    )
}


// test version:

