import { useBlogContext, useUIContext } from "../../globalContext/globalContext"


const MainSection = () => {

    const {openUserAccount, showMenu, editProfile} = useUIContext();
    const {searching} = useBlogContext();
    return (
        <>
            <div className={`flex justify-center h-full ${(openUserAccount || showMenu || editProfile) && 'mt-12'} ${showMenu && searching && 'hidden'}`}>
                <img 
                src="https://wallpapercave.com/wp/wp2060641.jpg" 
                className='w-11/12 h-[60vh] object-cover' 
                alt="Greenery" />
            </div>
        </>
    )
}

export default MainSection