import { useEffect, useState } from "react"
import Image from "./titleImage";
import { VITE_API_URL } from "../../config";


interface ContentItem {
  type:string,
  value:string,
  _id:string
}
interface Image {
  fileName:string,
  path:string,
  position:number,
  _id:string
}
interface TextContentProps{
  content:ContentItem[],
  isFullView?:boolean,
  contentImages?:Image[] | null
}

interface CombinedContent {
  type:string,
  value?:string,
  imageUrl?:string
}


const TextContent: React.FC<TextContentProps> = ({
  content = [],
  isFullView = false,
  contentImages = null,
}) => {
  const [text, setText] = useState<string>("");
  const [transformedText, setTransformedText] = useState<CombinedContent[]>([]);

  const makeWords = (textData: string) => {
    if (typeof textData !== "string" || textData === "") return "";
    const splitted = textData.trim().split(" ");
    const sliced = splitted.slice(0, 8);
    const smallText = sliced.join(" ");
    return smallText;
  };
  useEffect(() => {
    const textItem = content.find((item) => item.type === "text");
    const textContent = textItem?.value || "";
    setText(textContent);

    if (textContent) {
      const contentWithImages: CombinedContent[] = [];
      let endIndex = 0;

      if (contentImages && contentImages.length > 0) {
        const sortedImages = contentImages.sort((a, b) => a.position - b.position);
        const cleanText = textContent.replace(/\[image-\d+\]/g, "         ");

        sortedImages.forEach((image, index) => {
          const partOfText = cleanText.slice(endIndex, image.position);
          if (partOfText.trim()) {
            const paragraphs = partOfText.split("\n");
            paragraphs.forEach((para) => {
              contentWithImages.push({ type: "text", value: para.trim() });
            });
          }

          contentWithImages.push({ type: "image", imageUrl: image.path });

          if (index === sortedImages.length - 1) {
            const remainingText = cleanText.slice(image.position);
            const remaining = remainingText.split("\n");
            remaining.forEach((remain) => {
              contentWithImages.push({ type: "text", value: remain });
            });
          }

          endIndex = image.position;
        });
      } else {
        const paragraphs = textContent.split("\n");
        paragraphs.forEach((para) => {
          contentWithImages.push({ type: "text", value: para });
        });
      }

      setTransformedText(contentWithImages); // Store CombinedContent objects
    }
  }, [content, contentImages]);

  return (
    <div className={`${isFullView ? "w-4/5" : "w-60"}`}>
      {!isFullView ? (
        <p className="text-gray-600 text-sm mt-2 h-12 overflow-hidden text-ellipsis">
          {makeWords(text)}..
        </p>
      ) : (
        <div>
          {transformedText.map((item, index) =>  
            item.type === "text" ? (
              <div key={index} className="text-black"> 
                {item.value}
              </div>
            ) : (
              <img
                key={index}
                src={item.imageUrl?.startsWith("http://") ? item.imageUrl : `${VITE_API_URL}/${item.imageUrl}`}
                alt="Image"
                className="block w-56 h-52 rounded-t-lg max-w-full my-4"
              />
            )
          )}
        </div>
      )}
    </div>
  );
};



export default TextContent






// With Divs and Elements

// const TextContent: React.FC<TextContentProps> = ({ 
//   content = [], 
//   isFullView = false, 
//   contentImages = null 
// }) => {
//   // export default function TextContent({content, isFullView=false, contentImages=[]}){

//     const [text, setText] = useState<string>('');
//     const [transformedText, setTransformedText] = useState<React.ReactNode[]>([]);
  
//     const makeWords = (textData:string) => {
    
//         if(typeof textData !== 'string' || textData === "") return '';
//         const splitted = textData.trim().split(' ');
//         const sliced = splitted.slice(0, 8);
//         const smallText = sliced.join(' ');   
//         return smallText
//     }
   
//     useEffect(() => {
//       const textItem = content.find(item => item.type === 'text');
//       const textContent = textItem?.value || '';
//       setText(textContent); 
//         // console.log("actual text of the Post ", textContent);
//         if(textContent){
//           const contentWithImages: React.ReactNode[] = [];
//           console.log("what is exactly the contentImages and its type: ", contentWithImages, " type ", typeof(contentWithImages));
//           let endIndex = 0;
//           const sortedImages = contentImages?.sort((a,b) => a.position - b.position);
//           const cleanText = textContent.replace(/\[image-\d+\]/g, '         ');
//           // console.log("sortedImages 0: ", sortedImages[2].position);
//           // const paragraphs = cleanText.split('\n');
//           if(sortedImages){
//             sortedImages?.forEach((image,index) => {
//               const partOfText = cleanText.slice(endIndex, image.position);
//               // console.log(`part Of Text image-${ind}: `, partOfText);      
//               if(partOfText.trim()){
//                 const paragraphs = partOfText.split(`\n`);
  
//                 paragraphs.forEach((para, ind) => {
//                   contentWithImages.push(<p className="text-justify leading-relaxed text-gray-700" key={`para-${index}-${ind}`}> {para.trim()}</p>)
//                 })
//                 // console.log("withuot any modification: paragraph :", paragraphs.join(' ').trim(' '));
                
//               }
  
//               contentWithImages.push(
//                 <img key={`img-${index}`}
//                 src={image.path.startsWith('http://') ? image.path : `http://localhost:4100/${image.path}`}
//                 alt={image.fileName}
//                 className="block w-56 h-52 rounded-t-lg max-w-full my-4"></img>
//               )
              
//               let remainingText;
//               if(index === sortedImages.length-1){
//                 remainingText = cleanText.slice(image.position);
//                 const remaining = remainingText.split(`\n`);
//                 remaining.forEach((remain,ind) => {
  
//                   contentWithImages.push(<p className="text-justify leading-relaxed" key={`remain${ind}`}>{remain}</p>)
//                   // console.log("remain.trim: ", )
//                 })
//               }
              
//               endIndex = image.position;
//             })
//           }
//           setTransformedText(contentWithImages);
//           if(!contentWithImages.length){
//             const paragraphs = textContent.split('\n');
//             console.log("paragrapshs: ",paragraphs, "TextContetn: ", textContent);
//             // paragraphs.forEach((para,ind) => {
              
//             // })
//             paragraphs.forEach((para,ind) => {
//               contentWithImages.push(<div key={ind} style={{whiteSpace:"pre-wrap"}}>{para}</div>)
//             })
   
//             setTransformedText(contentWithImages)
//           }
        
//         }
        

//     }, [content, contentImages])
  
//     return (
//         <div className={`${isFullView ? 'w-4/5': 'w-60'} `}>
//             {!isFullView ? 
//             <p className="text-gray-600 text-sm mt-2 h-12 overflow-hidden text-ellipsis">{makeWords(text)}..</p>
//             : 
//             <div>
//               {transformedText}
//             </div>
//             }
            
            
//         </div>
//     )
// }

// export default TextContent
// You might need to change

