import { useEffect,useState } from "react";
import { FaFacebook, FaTwitter, FaPinterest, FaWhatsapp } from "react-icons/fa";
import { useGlobalContext } from "../globalContext/globalContext";

export default function About() {
  return(
    <div className="page-content bg-gray-50 min-h-screen">

      <section className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-pink-600 text-center mb-8">About Us</h1>
        <div className="text-gray-700 leading-relaxed text-lg text-center max-w-4xl mx-auto font-serif">
          <p className="mb-4">
            In this era of technological revolution, innovation and the quest for knowledge demand 
            that we share our expertise, skills, and invaluable lessons with the world. This platform 
            empowers you to share and gain knowledge with the best minds globally.
          </p>
          <p>
            Unlock access to precious knowledge that awakens curiosity and inspires positive change. 
            Together, we can brighten the light of learning and dispel the darkness of ignorance.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-300 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-lg font-semibold mb-2 md:mb-0">Islamabad, Pakistan</p>
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
  )
}

