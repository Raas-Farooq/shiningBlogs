import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../globalContext/globalContext";

export default function About() {
  const { setShowMenu } = useGlobalContext();
  const [shortText, setShortText] = useState("");
  const { setInHomePage } = useGlobalContext();
  const moveTo = useNavigate();
  function handleHome() {
    setShowMenu(false);
  }
  function smallText(text) {
    console.log("smallText Function Runs");
    const joined = text.split(" ");

    const short = joined.slice(0, 3);
    setShortText(short);
    console.log("short Text inside funtion: ", shortText);
  }
  var isSquare = function (n) {
    let res = 0;
    const num = Math.abs(n);
    console.log("num: ", num);
    console.log("is square running", n);
    console.log("logic Test: orgbak ", n === 0);
    if (num === 0) {
      console.log("zero condition run");
      res = 1;
    } else {
      for (let i = 0; i < num; i++) {
        if (i * i === num) {
          res = 1;
        }
      }
    }
    console.log("res value: ", res);
    if (res === 1) {
      console.log("Yes thhis is the square");
    } else {
      console.log("This is not a perfect squre ");
    }
  };
  isSquare(26);
  useEffect(() => {
    setInHomePage(false);
  }, []);

  return (
    <div className="page-content">
      <h1> I am ABout </h1>
      <h2>
        {" "}
        I know Believing in Allah(SWT) and Being Patient Make you a Way More
        Stronger Than you Think
      </h2>
      {/* {smallText('Fly over the Arizona')} */}
      <div>
        <button className="text-blue-500" onClick={() => moveTo(-1)}>
          {" "}
          Back{" "}
        </button>
      </div>
      <button>
        <Link to={"/"} onClick={handleHome} className="">
          {" "}
          Back To Home
        </Link>
      </button>
    </div>
  );
}
