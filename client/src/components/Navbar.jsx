import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { setUser, showLogin, userLogout } from "../features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from '../features/notes/noteSlice'
import { FaSearch } from "react-icons/fa"; 
import axios from 'axios'
import toast from 'react-hot-toast';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropDown, setShowDropDown] = useState(false);
  const user = useSelector((state) => state.user.user)

  const loginHandler = () => {
    dispatch(showLogin());
  };

  const logoutHandler = async () => {
    try {
      const { data }= await axios('/api/user/logout')
      console.log(data);
      
      if(data.success){
        dispatch(userLogout());
        setShowDropDown(false);
        toast.success("Logged out successfully");
        navigate("/");
      }   
    } catch (error) {
        toast.error(error.message) 
    }
  };

  const authUser = async () => {
    
    try {
       const {data} = await axios.get('/api/user/is-auth')
       if(data.success){
          dispatch(setUser(data.user));
          // console.log(data.user);
       }   
    } catch (error) {
       toast.error(error.message)
    }
  }

  useEffect(() => {
    authUser()
  }, [])

  const isLogin = useSelector((state) => state.user.isLogin);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-2">
      <div className="max-w-7xl mx-auto py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <img
            className="h-10"
            src="/images.png"
            alt="Logo"
          />
          <h1 className="font-bold text-4xl text-blue-700 tracking-tight">
            peerlearn
          </h1>
        </NavLink>

        <div className="border flex items-center gap-1 border-gray-300 px-2 py-1 rounded-3xl">
          <FaSearch  color="#888" />
          <input
            placeholder="Search by subject"
            onChange={(e) => {
            const value = e.target.value;
            dispatch(setSearch(value));
            navigate("/browse")}}
           className="outline-none" type="text" />
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/about"
            className="font-medium text-gray-800 hover:text-blue-600 transition"
          >
            About
          </NavLink>
          <NavLink
            to="/howitworks"
            className="font-medium text-gray-800 hover:text-blue-600 transition"
          >
            How it Works
          </NavLink>
          <NavLink
            to="/guidelines"
            className="font-medium text-gray-800 hover:text-blue-600 transition"
          >
            Upload Guidelines
          </NavLink>
          <NavLink
            to="/points"
            className="font-medium text-gray-800 hover:text-blue-600 transition"
          >
            Point System
          </NavLink>
        </div>

        {/* Login / Profile */}
        {!user ? (
          <button
            onClick={loginHandler}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition"
          >
            Login
          </button>
        ) : (
          <div className="relative">
            <img
              onClick={() => setShowDropDown(!showDropDown)}
              className="h-10 w-10 border border-blue-400 object-cover object-top rounded-full cursor-pointer"
              src={user?.profileImg || "https://cdn-icons-png.flaticon.com/512/9815/9815472.png"}
              alt="User"
            />
            {showDropDown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg z-50">
                <ul className="py-2 text-sm">
                  <li
                    onClick={() => {
                      navigate("/profile");
                      setShowDropDown(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Profile
                  </li>
                  <li
                    onClick={() => {
                      navigate("/my-uploads");
                      setShowDropDown(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      My Uploads
                  </li>
                  <li
                    onClick={logoutHandler}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
