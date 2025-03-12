import clsx from "clsx";
import { useBlogContext, useUIContext } from "../../globalContext/globalContext"
import { useEffect } from "react";
import { VITE_API_URL } from "../../config";


const MainSection = () => {

    const {openUserAccount = false, showMenu = false, editProfile = false} = useUIContext() || {};
    const {searching=false} = useBlogContext() || {};

    useEffect(() => {
        console.log("VITE_APi url: inside Main-Section", VITE_API_URL);
        fetch(`${VITE_API_URL}/wake-up`)
  .catch(() => console.log("Backend might be sleeping, retrying..."));

    }, [])


    return (
        <>
            <div className={clsx(`flex justify-center h-full`,(openUserAccount || showMenu || editProfile) && 'mt-12', (showMenu && searching) && 'hidden')}>
                <img 
                src="https://wallpapercave.com/wp/wp2060641.jpg" 
                className='w-11/12 h-[60vh] object-cover' 
                alt="Greenery Of beautiful Garden" />
            </div>
        </>
    )
}

export default MainSection