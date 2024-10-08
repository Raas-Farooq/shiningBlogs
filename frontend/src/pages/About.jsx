import { useEffect, useState } from "react";
import { Link } from "react-router-dom"

export default function About() {

    const [shortText, setShortText] = useState('');

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
            <button><Link to={'/'} className=''> Back To Home</Link></button>
        </div>
    )
} 