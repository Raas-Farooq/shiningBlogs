import { useNavigate } from "react-router-dom";
import { useAuthenContext } from "../globalContext/globalContext"



export default function NotFound(){
    const moveTo = useNavigate();

    const {errorMessage} = useAuthenContext();
    return(
        <div>
            <h1> Page is Not Found. Try Again Later!</h1>
            <p> 
                Error 
                "{errorMessage}" 
            </p>

            <button className="mt-5 bg-red-400 rounded-lg p-3 shadow-lg hover:bg-red-500" onClick={() => moveTo('/')}> Back</button>
        </div>
    )
} 