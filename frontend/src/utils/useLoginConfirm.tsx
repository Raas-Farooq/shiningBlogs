import toast from "react-hot-toast"


type Message = null | undefined | string
const useLoginConfirm = () => {

  let currentToastNotify:string | null = null;
    function confirmUserLogin(message:Message){

      
        return new Promise((resolve) => {

            if(currentToastNotify){
                toast.dismiss(currentToastNotify);
                currentToastNotify = null;
            }
            const id = toast(t => (
                
                <div className="">
                    <span> {message? message : 'Please Login and Start Writing' }</span>

                   <div className="flex justify-center gap-10 p-3">
                     <button
                    className="bg-red-600 rounded-md text-white hover:bg-red-800 px-2 py-1 transition-colors duration-300"
                    onClick={() => {
                        toast.dismiss(t.id);
                        currentToastNotify= null;
                        resolve(true)
                    }} 
                    >
                        Login
                    </button>

                    <button

                    onClick={() => {
                        toast.dismiss(t.id);
                        currentToastNotify= null;
                        resolve(false);
                    }}
                    className="hover:text-red-800 rounded-lg w-14 bg-transparent transition-all duration-200" >
                        Cancel
                    </button>
                   </div>
                </div>
            ), {
                
                duration:Infinity
            });
            currentToastNotify = id;
        })
    }
    return confirmUserLogin;
}

export default useLoginConfirm;