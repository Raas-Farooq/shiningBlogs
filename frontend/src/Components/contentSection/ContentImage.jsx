import {FaTimes} from "react-icons/fa";

const ContentImages = ({contentImages, removeImage, contentText}) => {

    // console.log("contentText inside new Component ", contentText);
    const splitting = contentText.split(' ');
    // console.log("textContent  ", contentText);
    const handleCancel = (e,id) => {
        console.log("cancel clicked: ", `[image-${id}]`);
        const imageName=`[image-${id}]`;
        const newText = splitting.filter(text => text !== imageName);
        console.log("newText inside handle Cancel: ", newText);
        removeImage(id, newText);
        e.preventDefault();
    }
    
    return (
        <div className="flex flex-wrap gap-2">
            {contentImages && contentImages.map((image, ind) => 
                ( 
                <div key={ind}>
                    <div className="flex gap-3">
                        <span className="text-[11px]"> {"image-" + image.id }</span>
                        <button className="bg-gray-300" onClick={(e) => handleCancel(e, image.id)}> <FaTimes /> </button>
                    </div>
                    <span className="text-[11px]"> {image.fileName.length > 22 ?  image.fileName.substring(0,22) : image.fileName } </span>
                    <img src={image.preview} alt={image.fileName} className="w-20 h-20" />
                </div>
                )
            )}
        </div>
    )
}

export default ContentImages