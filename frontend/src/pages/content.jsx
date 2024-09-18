import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";


export default function Content() {

    useEffect(() => {
        console.log("Content useEffect ran");
        
        axios.get(`http://localhost:4100/weblog/allUsers`)
        .then(response => console.log("using axios", response.data))
        .catch(err => console.log("err while fetching all blogs: ", err))

    }, [])

    return(
        <div className="page-content">
            <h1> I am Content </h1> 
            <h2> Look the contents of LIfe Deliberately it is Short and Very Interactive</h2>

            <button><Link to={'/'} className=''> Back To Home</Link></button>
        </div>
    )
} 