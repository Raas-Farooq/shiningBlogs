import { useEffect, useState} from "react"

interface TitleProps{
    title:string
}
interface SlicedTitle{
    initialWords:string,
    lastWords:string
}

const Title:React.FC<TitleProps> = ({title}) => {
    const [slicedTitle, setSlicedTitle] = useState<SlicedTitle>({initialWords:'', lastWords:''});

    useEffect(() => {
        if(title.length > 35){
            const words = title.split(" ");
            const initialWords = words.slice(0,6).join(" ");
            const lastWords = words.slice(6).join(' ');
            setSlicedTitle({initialWords, lastWords})
        }else{
            setSlicedTitle({initialWords:title, lastWords:''})
        }
    }, [title]);

    return (
        <div>
            { !title? <h2> ... </h2>:
            (<>
                {slicedTitle.lastWords ? (
                    <>
                        <p className={`text-center xs:text-xs sm:text-sm font-semibold text-gray-800`}>
                            {slicedTitle?.initialWords}
                        </p>
                        <p className="text-center xs:text-xs sm:text-sm font-semibold text-gray-800">
                            {slicedTitle?.lastWords}
                        </p>
                    </>
                ):
                
                <p className="text-center xs:text-xs sm:text-sm font-semibold pb-5 text-gray-800"> {slicedTitle?.initialWords} </p>
                }
            </>)
            }
        </div>
    )
}

export default Title

