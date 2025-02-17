import {useState,useEffect} from 'react';
import axios from 'axios';
import { useAuthenContext } from '../globalContext/globalContext';


const useUserPrivileges = (id) => {
    const {setLoggedIn,setErrorMessage} = useAuthenContext(); 
    const [blogOwner, setBlogOwner] = useState(false);
    const [ownerLoading, setOwnerLoading] = useState(true);

    useEffect(() => {
        async function userPrivileges(){
                try{
                    if(id){
                        const response = await axios.get(`http://localhost:4100/weblog/canEditBlog/${id}`
                            ,{withCredentials:true}
                        );
                        if(response.data.success){
                            setBlogOwner(true);
                        }
                    }   
                
                }
            catch(err){
                if(err.response.data){
                    setBlogOwner(false);
                    // if(err.response.data.error === 'jwt expired' || err.response.data.error === 'Not-Authorized'){     
                }
                else if(err.request){
                    setErrorMessage("No response received from the backend. Unable to Connect");
                    setBlogOwner(false);;
                }
                else{
                    setBlogOwner(false);
                    setErrorMessage(err.message)
                }
            }
            finally{
                setOwnerLoading(false)
            }
        }
        
        userPrivileges();
    },[id]);
    return {ownerLoading, blogOwner, setBlogOwner}

}

export default useUserPrivileges;