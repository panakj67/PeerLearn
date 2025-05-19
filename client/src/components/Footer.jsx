import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#f8f9fb] text-[#1e1e2f] py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 border-b border-gray-300 pb-10">
        {/* Logo & Description */}
        <div className="md:col-span-2">
            <div className="flex cursor-pointer">
                <img className='h-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuXGHsjFwcBaHsC0HqFowzkj2fFRayCf1Cag&s" alt="" />
                <h2 className="text-4xl font-bold text-blue-700 mb-2">peerlearn</h2>
            </div>
          
          <p className="text-sm text-[#4a4a68]">
            Empowering students to share knowledge and learn collaboratively.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/dashboard" className="hover:text-blue-500">Dashboard</a></li>
            <li><a href="/profile" className="hover:text-blue-500">Profile</a></li>
            <li><a href="/upload" className="hover:text-blue-500">Upload Notes</a></li>
          </ul>
        </div>

        {/* Subjects */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Subjects</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/subjects/cse" className="hover:text-blue-500">Computer Science</a></li>
            <li><a href="/subjects/mech" className="hover:text-blue-500">Mechanical Engineering</a></li>
            <li><a href="/subjects/mba" className="hover:text-blue-500">MBA</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/how-it-works" className="hover:text-blue-500">How It Works</a></li>
            <li><a href="/community" className="hover:text-blue-500">Community</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright & Socials */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-6 pt-6 text-sm text-[#4a4a68]">
        <p>© {new Date().getFullYear()} peerlearn. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#"><FaFacebookF className="text-[#1e1e2f] hover:text-blue-600" /></a>
          <a href="#"><FaTwitter className="text-[#1e1e2f] hover:text-sky-500" /></a>
          <a href="#"><FaInstagram className="text-[#1e1e2f] hover:text-pink-500" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
