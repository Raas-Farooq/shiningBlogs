import { useEffect, useState } from "react"
import Image from "./titleImage";
import ContentImages from "./ContentImage";
import { FaCookieBite } from "react-icons/fa";


export default function TextContent({content, isFullView=false, fromPost=false, contentImages=null}){

    const [text, setText] = useState('');
    const [image, setImage] = useState('');
    const [transformedText, setTransformedText] = useState([]);
  
    const makeWords = (textData) => {
        if(typeof textData !== 'string' || textData === "") return '';
        const splitted = textData.split(' ');
        const sliced = splitted.slice(0, 12);
        const smallText = sliced.join(' ');
        return smallText
    }
   
    useEffect(() => {
      const textContent = content?.find(text => text.type === 'text').value || '';
      setText(textContent); 
        // console.log("actual text of the Post ", textContent);
        if(textContent){
          const contentWithImages = [];
          
          let endIndex = 0;
          const sortedImages = contentImages?.sort((a,b) => a.position - b.position);
          const cleanText = textContent.replace(/\[image-\d+\]/g, '         ');
          // console.log("sortedImages 0: ", sortedImages[2].position);
          // const paragraphs = cleanText.split('\n');
          if(sortedImages){
            sortedImages?.forEach((image,index) => {
              const partOfText = cleanText.slice(endIndex, image.position);
              // console.log(`part Of Text image-${ind}: `, partOfText);      
              if(partOfText.trim('')){
                const paragraphs = partOfText.split(`\n`);
  
                paragraphs.forEach((para, ind) => {
                  contentWithImages.push(<p key={`para-${index}-${ind}`}> {para.trim()}</p>)
                })
                // console.log("withuot any modification: paragraph :", paragraphs.join(' ').trim(' '));
                
              }
  
              contentWithImages.push(
                <img key={`img-${index}`}
                src={image.path.startsWith('http://') ? image.path : `http://localhost:4100/${image.path}`}
                alt={image.fileName}
                className="block w-56 h-52 rounded-md max-w-full my-4"></img>
              )
              let remainingText;
              if(index === sortedImages.length-1){
                remainingText = cleanText.slice(image.position);
                const remaining = remainingText.split(`\n`);
                remaining.forEach((remain,ind) => {
  
                  contentWithImages.push(<p key={`remain${ind}`}>{remain}</p>)
                  // console.log("remain.trim: ", )
                })
              }
              
              endIndex = image.position;
            })
          }
          setTransformedText(contentWithImages);
          if(!contentWithImages.length){
            let myBlogText = [];
            const paragraphs = textContent.split('\n');
            paragraphs.forEach((para,ind) => {
              myBlogText.push(<div key={ind} style={{whiteSpace:"pre-wrap"}}>{para}</div>)
            })

            setTransformedText(myBlogText)
          }
        
        }
        

    }, [content, contentImages])
  
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

