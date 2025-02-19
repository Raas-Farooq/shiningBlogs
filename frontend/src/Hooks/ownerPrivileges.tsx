import {useState,useEffect} from 'react';
import axios from 'axios';
import { useAuthenContext } from '../globalContext/globalContext';


const useUserPrivileges= (blogId:string) => {
    const {setErrorMessage} = useAuthenContext(); 
    const [blogOwner, setBlogOwner] = useState<boolean>(false);
    const [ownerLoading, setOwnerLoading] = useState<boolean>(true);

    useEffect(() => {
        async function userPrivileges(){
                try{
                    if(blogId){
                        const response = await axios.get(`http://localhost:4100/weblog/canEditBlog/${blogId}`
                            ,{withCredentials:true}
                        );
                        if(response.data.success){
                            setBlogOwner(true);
                        }
                    }   
                
                }
            catch(err){
                if(axios.isAxiosError(err)){
                    if(err.response){
                        setBlogOwner(false);
                        // if(err.response.data.error === 'jwt expired' || err.response.data.error === 'Not-Authorized'){
                        //     setErrorMessage("Not Authenticated")     
                        // }
                    }
                    else if(err.request){
                        // setErrorMessage("No response received from the backend. Unable to Connect");
                        setBlogOwner(false);;
                    }
                    else{
                        setBlogOwner(false);
                        // setErrorMessage(err.message)
                    }
                }
                else{
                    setBlogOwner(false);
                    setErrorMessage("Unexpected Error occurred")
                }  
            }

            finally{
                setOwnerLoading(false)
            }
        }
        
        userPrivileges();
    },[blogId]);
    return {ownerLoading, blogOwner, setBlogOwner}

}

export default useUserPrivileges;