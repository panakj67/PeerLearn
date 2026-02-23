import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Container from "./layout/Container";

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-blue-100 bg-white/90">
      <Container className="py-12">
        <div className="grid gap-10 border-b border-blue-100 pb-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <img className="h-9 w-9" src="/images.png" alt="PeerLearn logo" loading="lazy" />
              <h2 className="text-3xl font-bold text-blue-700">peerlearn</h2>
            </div>
            <p className="max-w-md text-sm text-gray-600">Empowering students to share knowledge and learn collaboratively with better discoverability.</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><NavLink to="/browse" className="hover:text-blue-600">Browse Notes</NavLink></li>
              <li><NavLink to="/profile" className="hover:text-blue-600">Profile</NavLink></li>
              <li><NavLink to="/upload" className="hover:text-blue-600">Upload Notes</NavLink></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><NavLink to="/howitworks" className="hover:text-blue-600">How It Works</NavLink></li>
              <li><NavLink to="/guidelines" className="hover:text-blue-600">Guidelines</NavLink></li>
              <li><NavLink to="/points" className="hover:text-blue-600">Point System</NavLink></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Social</h3>
            <div className="flex items-center gap-3 text-gray-700">
              <a href="#" aria-label="Facebook" className="rounded-full border border-gray-200 p-2 hover:border-blue-200 hover:text-blue-600"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter" className="rounded-full border border-gray-200 p-2 hover:border-sky-200 hover:text-sky-600"><FaTwitter /></a>
              <a href="https://www.instagram.com/_pankaj_.soni/" aria-label="Instagram" className="rounded-full border border-gray-200 p-2 hover:border-pink-200 hover:text-pink-600"><FaInstagram /></a>
            </div>
          </div>
        </div>

        <p className="pt-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} peerlearn. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
