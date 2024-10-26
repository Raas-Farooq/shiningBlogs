import { useEffect } from "react";
import {FaTimes} from "react-icons/fa";

const ContentImages = ({contentImages, removeImage, contentText}) => {


    const handleCancel = (e, id) => {
        // newText="text without image Name";
        e.preventDefault();
        const imageMark = `[image-${id}]`
        const newText = contentText.split(imageMark).join(' ');
        // console.log("newText inside cancel:", newText);
        removeImage(id, newText);
    }
   
    return (
        <div className="flex flex-wrap gap-2">
            {contentImages && contentImages.map((image, ind) => 
                ( 
                <div key={ind}>
                    {console.log("image isni")}
                    <div className="flex gap-3">
                        
                        <span className="text-[11px]"> {"image-" + image.id }</span>
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

export default ContentImages