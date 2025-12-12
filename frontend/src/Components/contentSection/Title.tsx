import { useEffect, useState} from "react"
// import { useAuthenContext } from "../../globalContext/globalContext"

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
            const initialWords = words.slice(0,3).join(" ");
            let lastWords = words.slice(3,8).join(' ');
            if(words.length > 8){
                lastWords = lastWords + '..'
            }
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
                        <p className={`text-center xs:text-xs sm:text-xs font-semibold text-gray-800 `}>
                            {slicedTitle?.initialWords}
                        </p>
                        <p className={`text-center xs:text-xs xl:text-sm font-semibold text-gray-800 pb-1`}>
                            {slicedTitle?.lastWords} 
                        </p>
                    </>
                ):
                
                <p className="text-center xs:text-xs font-semibold sm:text-sm pb-4 text-gray-800"> {slicedTitle?.initialWords} </p>
                }
            </>)
            }
        </div>
    )
}

export default Title

