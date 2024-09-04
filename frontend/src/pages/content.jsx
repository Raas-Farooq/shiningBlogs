import { Link } from "react-router-dom";


export default function Content() {


    return(
        <div className="page-content">
            <h1> I am Content </h1> 
            <h2> Look the contents of LIfe Deliberately it is Short and Very Interactive</h2>

            <button><Link to={'/'} className=''> Back To Home</Link></button>
        </div>
    )
} 