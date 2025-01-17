import { useEffect, useState} from "react"


const Title = ({title}) => {
    const [slicedTitle, setSlicedTitle] = useState({initialWords:'', lastWords:''});

    useEffect(() => {
        if(title.length > 35){
            const words = title.split(" ");
            const initialWords = words.slice(0,6).join(" ");
            const lastWords = words.slice(6).join(' ');
            let reduceTitle = {initialWords, lastWords};
            setSlicedTitle(reduceTitle);
        }
    }, [title]);

    return (
        <>
            {title && title?.length > 35 ? (
                <>
                    <p className="text-center xs:text-xs sm:text-sm font-semibold text-gray-800">{slicedTitle?.initialWords}</p>
                    <p className="text-center xs:text-xs sm:text-sm font-semibold">{slicedTitle?.lastWords}</p>
                </>
            ):
            
            <p className="text-center xs:text-xs sm:text-sm font-semibold pb-5"> {title} </p>
            }
        </>
    )
}

export default Title

