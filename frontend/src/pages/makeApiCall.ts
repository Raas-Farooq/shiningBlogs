import axios, { AxiosResponse } from "axios"
// import { useAuthenContext } from "../globalContext/globalContext";

type loadingState = (loading:boolean)=>void


interface MethodRoute {
    method: 'GET'|'POST'|'PUT'|'DELETE',
    data?:any,
    // header:Record<string, string>

}

interface RespReceived<T>{
    data:T,
    status:number
}

interface ErrReceived {
    response? : {
        data: {
            message:string
            error:string
        }
    },
    request?:any,
    message:string
}


const MakeApiCall = async<T>(
    setLoading:loadingState,
    url:string,
    method:MethodRoute,
    onSuccess:(response:RespReceived<T>)=>void,
    onError:(err:ErrReceived)=>void
) => {

    try{
        setLoading(true);
        const {method:httpMethod, data} = method;
        console.log("method before destruct: ", method);
        const fetchResult:AxiosResponse<T> = await axios(
           { 
            url, 
            method:httpMethod,
            data: data || undefined,
            withCredentials:true
        });
        // console.log("below axios ");
        if(onSuccess){
            onSuccess(fetchResult)
        }
    }
    catch(err){
        onError(err as ErrReceived);
    }
    finally{
        if(setLoading) setLoading(false)
    }
}



export default MakeApiCall

