import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UploadPage from "./pages/Upload";
import Login from "./components/Login";
import { useDispatch, useSelector } from "react-redux";
import PointSystem from "./pages/PointSystem";
import About from "./pages/About";
import HowItWorks from "./pages/Work";
import UploadGuidelines from "./pages/Guidelines";
import BrowseNotesPage from "./pages/BrowseNotes";
import Preview from "./pages/Preview";
import MyUploads from "./pages/MyUpload";
import BookmarkedNotes from "./pages/BookmarkedNotes";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import BranchNotes from "./pages/BranchNotes";
// axiosConfig.js or directly in index.js / App.js
import axios from "axios";
import { fetchNotes } from "./features/notes/noteSlice";
import { setLoading, setUser, toggleVisible } from "./features/users/userSlice";
import EditProfile from "./components/EditProfile";
import AiChatBot from "./components/AiChatBot";
import ProtectedRoute from "./components/ProtectedRoute";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://peer-learn-pankaj-kumars-projects-a2ff3a66.vercel.app";

const App = () => {

  const user = useSelector((state) => state.user?.user);

  const showUserLogin = useSelector((state) => state.user.showUserLogin);
  const loading = useSelector((state) => state.user.loading);
  const dispatch = useDispatch();

  const getNotes = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await axios.get("/api/note/get");
      if (data.success) {
        dispatch(fetchNotes(data.notes));
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
    finally{
      dispatch(setLoading(false));
    }
  };


  const fetchUser = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        console.log(data);
        
        dispatch(setUser(data.user));
      }
    } catch (error) {
      toast.error(error.message);
    }
    finally{
      dispatch(setLoading(false));
    }
  };

  const notes = useSelector((state) => state.note.notes);

  useEffect(() => {
    fetchUser();
    getNotes();
  }, []);

  const visible = useSelector((state) => state.user?.visible);

    // console.log(visible)


  return (
    <div className="pt-8 px-28 ">
      <Toaster />
      <Navbar />
      {!visible && (
        <div
          onClick={() => dispatch(toggleVisible())} // your function to toggle chatbot visibility
          className="fixed bottom-6 right-6 cursor-pointer rounded-full p-1 
             bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
        >
          <img  className="h-15 w-15 object-cover rounded-full"
           src="https://www.shutterstock.com/image-vector/chat-bot-icon-virtual-smart-600nw-2478937553.jpg" alt="" />
        </div>
      )}
      

      {showUserLogin && <Login />}
      {visible && <AiChatBot />}
      
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />}>
          <Route path="edit" element={<EditProfile user={user} />}></Route>
        </Route>
        <Route
          path="/upload"
          element={<ProtectedRoute element={<UploadPage />} />}
        ></Route>
        <Route path="/points" element={<PointSystem />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/guidelines" element={<UploadGuidelines />}></Route>
        <Route path="/howitworks" element={<HowItWorks />}></Route>
        <Route path="/browse" element={<BrowseNotesPage />}></Route>
        <Route
          path="/my-uploads"
          element={<ProtectedRoute element={<MyUploads />} />}
        ></Route>
        <Route path="/bookmark" element={<ProtectedRoute element={<BookmarkedNotes />} />}></Route>
        <Route path="/:branchName" element={<BranchNotes />} />
        <Route
          path="/:branch/:id"
          element={<ProtectedRoute element={<Preview />} />}
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
