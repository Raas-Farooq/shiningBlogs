import { useEffect, useState } from "react"
import Image from "./titleImage";
import ContentImages from "./ContentImage";


export default function TextContent({content, isFullView=false, fromPost=false, contentImages=null}){

    const [text, setText] = useState('');
    const [image, setImage] = useState('');
    const makeWords = (textData) => {
        if(typeof textData !== 'string' || textData === "") return '';
        // if(!textData) return '';

        const splitted = textData.split(' ');
        const sliced = splitted.slice(0, 12);
        const smallText = sliced.join(' ');
        return smallText
    }

  
    useEffect(() => { 
        console.log("contentImages: inside TextContent", contentImages);
        content.forEach(myContent => {
            if(myContent.type==='text'){
                
                const cleanText = myContent.value.replace(/\[image-\d\]/g, 'Good Morning');
                
                setText(cleanText)
            }
            // myContent.value.replace(/\[image-\d\]/g, 'HEllo')
            if(myContent.type==='image'){
                // console.log("image inside Text Content: ", myContent.value);
                setImage(myContent.value)
            }
        })
    }, [content]);

    return (
        <div className={`${isFullView ? 'w-4/5': 'w-60'} `}>
            {!isFullView ? 
            <p>{makeWords(text)}..</p>
            
            : 
            <p> {text} </p>
            }
            
            {contentImages && contentImages.map(image => (
                
                <img src={`http://localhost:4100/${image.path}`} alt={image.fileName} /> 
                
            )) }
        </div>
    )
}