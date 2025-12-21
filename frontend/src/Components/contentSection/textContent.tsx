import { ReactNode, useEffect, useState } from "react"

interface PostContent{

  type:string,
  value:string,
  id?:string
}
interface ContentImageInterface{
    fileName:string,
    id:number,
    _id:string,
    path:'string',
    public_id:string,
    position:number
}
interface TextContentProps{
  content:PostContent[] | null | undefined,
  isFullView? : boolean,
  contentImages?:ContentImageInterface[] | null
}
export default function TextContent({content=[], isFullView=false, contentImages=[]}:TextContentProps){

    const [text, setText] = useState('');
    const [transformedText, setTransformedText] = useState<React.ReactNode[]>([]);
  
    const makeWords = (textData:string) => {
    
        if(typeof textData !== 'string' || textData === "") return '';
        const splitted = textData.trim().split(' ');
        const sliced = splitted.slice(0, 8);
        const smallText = sliced.join(' ');   
        return smallText
    }
   
    useEffect(() => {
      const textContent = content?.find(text => text.type === 'text')?.value || '';
      setText(textContent); 
     
        if(textContent){
          const contentWithImages:ReactNode[] = [];
          
          let endIndex = 0;
          const sortedImages = contentImages?.sort((a,b) => a.position - b.position);
          const cleanText = textContent.replace(/\[image-\d+\]/g, '         ');
          // const paragraphs = cleanText.split('\n');
          if(sortedImages){
            sortedImages?.forEach((image,index) => {
              const partOfText = cleanText.slice(endIndex, image.position);   
              if(partOfText.trim()){
                const paragraphs = partOfText.split(`\n`);
  
                paragraphs.forEach((para, ind) => {
                  contentWithImages.push(<p className="text-justify leading-relaxed text-gray-700" key={`para-${index}-${ind}`}> {para.trim()}</p>)
                })  
              }
  
              contentWithImages.push(
                <img key={`img-${index}`}
                src={image.path}
                alt={image.fileName}
                className="block w-56 h-52 rounded-t-lg max-w-full my-4"></img>
              )
              let remainingText;
              if(index === sortedImages.length-1){
                remainingText = cleanText.slice(image.position);
                const remaining = remainingText.split(`\n`);
                remaining.forEach((remain,ind) => {
  
                  contentWithImages.push(<p className="text-justify leading-relaxed" key={`remain${ind}`}>{remain}</p>)
                  // console.log("remain.trim: ", )
                })
              }
              
              endIndex = image.position;
            })
          }
          setTransformedText(contentWithImages);
          if(!contentWithImages.length){
            let myBlogText:ReactNode[] = [];
            const paragraphs = textContent.split('\n');
            paragraphs.forEach((para,ind) => {
              myBlogText.push(<div key={ind} style={{whiteSpace:"pre-wrap"}}>{para}</div>)
            })

            setTransformedText(myBlogText)
          }
        
        }
        

    }, [content])
  
    return (
        <div className={`${isFullView ? 'w-4/5': 'max-w-sm'} `}>
            {!isFullView ? 
            <p className="text-gray-600 text-sm mt-2 h-auto overflow-hidden text-relaxed">{makeWords(text)}..</p>
            : 
            <div>
              {transformedText}
            </div>
            }
            
            
        </div>
    )
}


// test version:

// useState<React.ReactNode[]>([]); why you use empty array at the end ([])
// 2nd:
// interface PostContent{

//   type:string,
//   value:string,
//   id?:string
// }
// interface ContentImageInterface{
//     fileName:string,
//     id:number,
//     _id:string,
//     path:'string',
//     public_id:string,
//     position:number
// }
// interface TextContentProps{
//   content:PostContent[] | null | undefined,
//   isFullView : boolean,
//   fromPost:boolean,
//   contentImages:ContentImageInterface[] | null
// }
// export default function TextContent({content=[], isFullView=false, fromPost=false, contentImages=[]}:TextContentProps){


//   i have added types of contentImages as well but why we are assigning empty array inside the TextContent Parameter to contentImages and content?