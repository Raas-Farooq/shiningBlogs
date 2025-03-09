
import { useEffect } from "react";
import {FaTimes} from "react-icons/fa";

interface ContentImagesArray{
    _id:string,
    id:number,
    fileName:string,
    preview?:string,
    position:number,
    path?:string,
}

interface RemoveImageFunction {
    (id:number, text:string) :void;
}

interface EditContentImagesProps{
    contentImages:ContentImagesArray[],
    removeImage:RemoveImageFunction,
    contentText:string
}
interface HandleCancelInterface {
    (e:React.MouseEvent<HTMLButtonElement>, id:number):void
}
const EditContentImages:React.FC<EditContentImagesProps> = ({contentImages, removeImage=null, contentText}) => {

    const handleCancel:HandleCancelInterface = (e, id) => {
        // newText="text without image Name";
        e.preventDefault();
        const imageMark = `[image-${id}]`
        const newText = contentText.split(imageMark).join(' ');
        if(removeImage){
            removeImage(id, newText);
        }
        
    }
    useEffect(() => {
        console.log("contentImages received EDITCONTENTIMAGES ", contentImages);
    },[])

    return (
        <div className="flex flex-wrap gap-2">
            {contentImages && contentImages.map((image, ind) => 
                ( 
                <div key={ind}>
                    <div className="flex gap-3">
                        <span className="text-[11px]"> {"image-" + ind }</span>
                        <button className="bg-gray-300" onClick={(e) => handleCancel(e, image.id)}> <FaTimes /> </button>
                    </div>

                    <span className="text-[11px]"> {image.fileName && image.fileName.length > 22 ?  image.fileName.substring(0,22) : image.fileName } </span>
                   
                    {image.preview && <img src={image.preview} alt={image.fileName} className="w-20 h-20" />}
                </div>
                )
            )}
        </div>
    )
}

export default EditContentImages