import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import {useNavigate} from 'react-router-dom';


export default function About() {

    const [shortText, setShortText] = useState('');
    const moveTo = useNavigate();

    function smallText(text){
        console.log("smallText Function Runs");
        const joined = text.split(' ');
        

        const short = joined.slice(0,3);
        setShortText(short);
        console.log("short Text inside funtion: ", shortText);
    }
    useEffect(() => {
        console.log("LIving On Edge")
    }, [])
    
    return(
        <div className="page-content">
            <h1> I am ABout </h1> 
            <h2> I know Believing in Allah(SWT) and Being Patient Make you a Way More Stronger Than you Think</h2>
            {/* {smallText('Fly over the Arizona')} */}
            <div>
                <button className="text-blue-500" onClick={() => moveTo(-1)}> Back </button>
            </div>
            <button><Link to={'/'} className=''> Back To Home</Link></button>
        </div>
    )
} 