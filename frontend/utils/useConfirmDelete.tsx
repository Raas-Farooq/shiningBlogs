import toast from "react-hot-toast"


type Message = null | undefined | string
const useConfirmDelete = () => {

  let currentToastNotify:string | null = null;
    function confirmPostDelete(message:Message){

      
        return new Promise((resolve) => {

            if(currentToastNotify){
                toast.dismiss(currentToastNotify);
                currentToastNotify = null;
            }
            const id = toast(t => (
                
                <div className="">
                    <span> {message? message : 'Are You really Want to Delete this Post. You will not be able to recover again' }</span>

                   <div className="flex justify-center gap-10 p-3">
                     <button
                    className="bg-red-600 rounded-md text-white hover:bg-red-900 px-2 py-1 transition-colors duration-300"
                    onClick={() => {
                        toast.dismiss(t.id);
                        currentToastNotify= null;
                        resolve(true)
                    }} 
                    >
                        Delete
                    </button>

                    <button

                    onClick={() => {
                        toast.dismiss(t.id);
                        currentToastNotify= null;
                        resolve(false);
                    }}
                    className=" hover:text-gray-900 hover:bg-gray-500 hover:text-white px-2 rounded-md transition-all uration-200 bg-gray-200" >
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
    return confirmPostDelete;
}

export default useConfirmDelete;