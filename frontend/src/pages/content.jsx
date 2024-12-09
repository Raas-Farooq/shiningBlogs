import axios from "axios";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../globalContext/globalContext";


export default function Content() {
    const {setInHomePage} = useGlobalContext();
    const moveTo= useNavigate();
    useEffect(() => {
        console.log("Content useEffect ran");
        setInHomePage(false);
        axios.get(`http://localhost:4100/weblog/allUsers`)
        .then(response => console.log("using axios", response.data))
        .catch(err => console.log("err while fetching all blogs: ", err))

    }, [])

    return(
        <div className="page-content">
            <h1> I am Content </h1> 
            <h2> Look the contents of LIfe Deliberately it is Short and Very Interactive</h2>
            <div>
                <button className="text-blue-500" onClick={() => moveTo(-1)}> Back </button>
            </div>
            <button><Link to={'/'} className=''> Back To Home</Link></button>
        </div>
    )
} 