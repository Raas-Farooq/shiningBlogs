import clsx from "clsx";
import { useBlogContext, useUIContext } from "../../globalContext/globalContext"
import { useCallback, useEffect } from "react";
import { VITE_API_URL } from "../../config";
import heroImage from '../../assets/images/notepad.jpg'

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
                (openUserAccount || showMenu || editProfile) && 'mt-20',
                (showMenu && searching) && 'hidden'
                )}>
                <div className="relative w-full h-[100vh] max-h-[450px] lg:max-h-[68vh] overflow-hidden">
                     <img 
                    src={heroImage} 
                    className="absolute w-full h-full object-cover object-top top-16"
                    alt="Hero Image" />
                </div>
               
            </div>
        </>
    )
}

export default MainSection