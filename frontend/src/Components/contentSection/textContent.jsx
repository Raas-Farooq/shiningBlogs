import { useEffect, useState } from "react"


export default function TextContent({content, isFullView=false}){

    const [text, setText] = useState('');
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
        console.log("is Post: ", isFullView);
        content.forEach(myContent => {
            if(myContent.type==='text'){
                console.log("text: ", myContent.value);
                setText(myContent.value)
            }
        })
    }, [content]);

    return (
        <div className={`${isFullView ? 'w-4/5': 'w-60'} `}>
            {!isFullView ? <p>{makeWords(text)}..</p>
            : 
            <p> {text} </p>
            }
        </div>
    )
}