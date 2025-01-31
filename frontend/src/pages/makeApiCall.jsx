import axios from "axios"
import { useAuthenContext } from "../globalContext/globalContext";




const MakeApiCall =  async(setLoading,url, method, onSuccess, onError) => {
    
        try{
            if (setLoading) setLoading(true);
            console.log("make Api Call is Running")
            console.log(`setLoading ${setLoading} inside ApiCall`);
            const response = await axios({url, ...method, withCredentials:true});
            console.log('res[pose: ', response);
            if(onSuccess){
                onSuccess(response)
            }
        }
        catch(error){
            if(onError){
                onError(error)
            }
        }
        finally{
            if(setLoading) setLoading(false);
        }
        
}

export default MakeApiCall