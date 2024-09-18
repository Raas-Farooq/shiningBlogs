import { Link } from "react-router-dom"

export default function Write() {


    return(
        <div className="page-content">
            <h1> I am Write </h1> 
            <form method="post">
                <input type="text" name="title" />
                <input type="file" image=""  />
            </form>
            <button><Link to={'/'} className=''> Back To Home</Link></button>
        </div>
    )
} 