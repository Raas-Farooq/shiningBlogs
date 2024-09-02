import { useGlobalContext } from "../../globalContext/globalContext"

const UserAccount = () => {

    const {openUserAccount, setOpenUserAccount} = useGlobalContext();

    return (
        <div className="mt-16">
            {openUserAccount && (
                <>
                    <h1> UPDATE Your Profile</h1>
                    <form className="flex flex-col p-5">
                        <input type="input" 
                        name="input" 
                        className="border border-gray-300 w-[25vw] p-2 m-5" 
                        placeholder="Enter New Username" />

                        <input type="password" 
                        name="password" 
                        className="border border-gray-300 w-[25vw] p-2 m-5" 
                        placeholder="Enter New Password" />

                        <button type="submit" className="border border-gray-300 w-[15vw] p-2 m-5 bg-red-400 hover:bg-red-300 ">Update Account</button>

                    </form>

                    <button onClick={()=> setOpenUserAccount(false)} className="bg-green-400 border p-3 ml-8">Go Back</button>
                </>
            )}
            
        </div>
    )
}

export default UserAccount