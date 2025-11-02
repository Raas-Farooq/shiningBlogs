import toast from "react-hot-toast"



const useLoginConfirm = () => {


    function confirmUserLogin(){

        return new Promise((resolve) => {
            toast(t => (
                <div className="">
                    <span> Please Login and Start Writing</span>

                   <div className="flex justify-center gap-10 p-3">
                     <button
                    className="bg-red-500 text-white hover:bg-red-600 px-2 py-1 transition-colors duration-300"
                    onClick={() => {
                        toast.dismiss(t.id);
                        resolve(true)
                    }} 
                    >
                        Login
                    </button>

                    <button

                    onClick={() => {
                        toast.dismiss(t.id);
                        resolve(false);
                    }}
                    className=" hover:text-gray-900 hover:font-medium w-8" >
                        Cancel
                    </button>
                   </div>
                </div>
            ), {
                duration:Infinity
            })
        })
    }
    return confirmUserLogin;
}

export default useLoginConfirm;