import clsx from "clsx";
import { useBlogContext, useUIContext } from "../../globalContext/globalContext"
import { useCallback, useEffect } from "react";
import { VITE_API_URL } from "../../config";


const MainSection = () => {

    const clearLocalStorage = useCallback(() => {
        localStorage.removeItem("localTitle");
        localStorage.removeItem("localTitleImage");
        localStorage.removeItem("localContent");
        localStorage.removeItem("localContentImages");
        localStorage.removeItem("localPublic_id");
        // localStorage.removeItem("localContentImages");
      }, []);
    

      useEffect(() => {
        clearLocalStorage();
      },[])

    const {openUserAccount = false, showMenu = false, editProfile = false, setOpenUserAccount, setEditProfile} = useUIContext() || {};
    const {searching=false} = useBlogContext() || {};

    useEffect(() => {
        fetch(`${VITE_API_URL}/wake-up`).catch(() => console.log("Backend might be sleeping, retrying..."));
        setOpenUserAccount(false);
        setEditProfile(false)

    }, [])


    return (
        <>
            <div className={clsx(
            "flex justify-center items-center w-full mx-auto p-2",
            (openUserAccount || showMenu || editProfile) && 'mt-12',
            (showMenu && searching) && 'hidden'
            )}>
                <img 
                src="public/blogPostHero.jpg" 
                className="w-full max-w-4xl h-auto aspect-video object-cover rounded-lg shadow-lg"
                // className='w-[80vw] h-[60vh] ' 
                alt="Greenery Of beautiful Garden" />
            </div>
        </>
    )
}

export default MainSection