import React, { useEffect, useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaPinterest,
  FaWhatsapp,
  FaSpinner,
} from "react-icons/fa";
import { useGlobalContext } from "../globalContext/globalContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { slice } from "lodash";

const About = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localBlogs, setLocalBlogs] = useState([]);
  const [rule, setRule] = useState([]);

  //controller Example

  // useEffect(() => {
  //   setLoading(true);
  //   setError(null);
  //   async function fetchResources(){
  //    try{
  //     const controller = new AbortController();

  //     const fetchResponse = await axios.get('http://localhost:4100/weblog/allBlogs',{
  //       signal:controller.signal
  //     })
  //     // const result = await fetchResponse.json();
  //     console.log("controller way fetchResponse: ", fetchResponse);
  //     setLocalBlogs(fetchResponse.data.blogs);
  //     }
  //     catch(err){
  //       if (err.name === 'AbortError'){
  //         console.log("request has been canceled");
  //         setError(err)
  //         return
  //       }
  //       throw err
  //     }
  //     finally{
  //       setLoading(false)
  //     }

  //     return () => controller.abort();
  //   }
  //   fetchResources()
  // },[])

  
  return (
    <div className="page-content bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-pink-600 text-center py-5">
        About Us
      </h1>
      <section className="container mx-auto px-6 py-12">
        <div className="text-gray-700 leading-relaxed text-lg text-center max-w-4xl mx-auto font-serif">
          <p className="mb-4">
            In this era of technological revolution, innovation and the quest
            for knowledge demand that we share our expertise, skills, and
            invaluable lessons with the world. This platform empowers you to
            share and gain knowledge with the best minds globally.
          </p>
          <p>
            Unlock access to precious knowledge that awakens curiosity and
            inspires positive change. Together, we can brighten the light of
            learning and dispel the darkness of ignorance.
          </p>
        </div>
      </section>
      <footer className="bg-slate-900 text-gray-300 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-lg font-semibold mb-2 md:mb-0">
              Islamabad, Pakistan
            </p>
          </div>
          <ul className="flex space-x-6">
            <li>
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-blue-600 transition-colors duration-300"
              >
                <FaFacebook size={24} />
              </a>
            </li>
            <li>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                <FaTwitter size={24} />
              </a>
            </li>
            <li>
              <a
                href="#"
                aria-label="Pinterest"
                className="hover:text-red-400 transition-colors duration-300"
              >
                <FaPinterest size={24} />
              </a>
            </li>
            <li>
              <a
                href="#"
                aria-label="WhatsApp"
                className="hover:text-green-400 transition-colors duration-300"
              >
                <FaWhatsapp size={24} />
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default About;
