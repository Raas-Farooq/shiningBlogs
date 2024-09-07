import { useGlobalContext } from "../../globalContext/globalContext"


const MainSection = () => {

    const {openUserAccount, showMenu, editProfile} = useGlobalContext();
    return (
        <>
            <div className={`flex justify-center h-full ${(openUserAccount || showMenu || editProfile) && 'mt-12 xs:mt-[10rem]'} `}>
                <img 
                src="https://wallpapercave.com/wp/wp2060641.jpg" 
                className='w-11/12 h-[80vh] object-cover' 
                alt="Greenery" />
            </div>
        </>
    )
}

export default MainSection