import { useNavigate } from "react-router-dom";
import { useAuthenContext } from "../globalContext/globalContext"



const NotFound:React.FC = () => {
    const moveTo = useNavigate();

    const {errorMessage} = useAuthenContext();

    return(
        <div className="flex justify-center text-center flex-col">
            <h1 className="text-3xl md:text-5xl my-8"> Page not found. Please try again later!</h1>
            <p> 
                Error :
                <span className="text-red-600 mx-6 italic">{errorMessage}</span>
            </p>

            <button className="mt-5 rounded-lg p-3 shadow-lg hover:border-blue-600 hover:text-blue-600 w-28" onClick={() => moveTo('/')}> Back</button>
        </div>
    )
} 

export default NotFound