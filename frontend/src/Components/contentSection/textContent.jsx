import { useEffect, useState } from "react"
import Image from "./titleImage";


export default function TextContent({content, isFullView=false, fromPost=false}){

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
        // console.log("content: inside TextContent", content);
        // console.log("is Post: ", isFullView);
        content.forEach(myContent => {
            if(myContent.type==='text'){
                // console.log("text: ", myContent.value);
                setText(myContent.value)
            }
            if(myContent.type==='image'){
                console.log("image inside Text Content: ", myContent.value);
                setImage(myContent.value)
            }
        })
    }, [content]);

    return (
        <div className={`${isFullView ? 'w-4/5': 'w-60'} `}>
            {!isFullView ? <p>{makeWords(text)}..</p>
            : 
            <p> {text} </p>
            }
            {fromPost && <Image postImg={image} />}
        </div>
    )
}