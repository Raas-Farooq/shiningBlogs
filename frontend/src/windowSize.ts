import { useEffect, useState} from "react";


const WindowSize = () => {

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const setWindowSize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight)
    }


    useEffect(() => {
        setWindowSize();
        window.addEventListener('resize', setWindowSize);

        return () => {
            window.removeEventListener('resize', setWindowSize)
        }
        
    }, [])
    
    return {width, height}
}

export default WindowSize