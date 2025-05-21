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
import { setUser, toggleVisible } from "./features/users/userSlice";
import EditProfile from "./components/EditProfile";
import AiChatBot from "./components/AiChatBot";
axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://peer-learn-pankaj-kumars-projects-a2ff3a66.vercel.app";

const App = () => {
  // const api = () => {
  //   useEffect(() => {
  //     axios.get('/api/note/temp')
  //       .then(res => console.log(res.data))
  //       .catch(() => console.log('error'));
  //   }, []);

  //   return <div>Hello</div>;
  // };

  // api()
  const user = useSelector((state) => state.user?.user);

  const showUserLogin = useSelector((state) => state.user.showUserLogin);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getNotes = async () => {
    try {
      const { data } = await axios.get("/api/note/get");
      if (data.success) {
        dispatch(fetchNotes(data.notes));
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        toast.success("User verified !!")
        dispatch(setUser(data.user));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const notes = useSelector((state) => state.note.notes);

  setTimeout(() => {
      setLoading(false);
    }, 1000);

  useEffect(() => {
    getNotes();
  }, [notes]);

  const visible = useSelector((state) => state.user?.visible);

  if (loading)
    return (
      <div
        className="flex flex-col items-center text-blue-600 bg-gradient-to-tr from-white via-indigo-50 to-indigo-100
 justify-center h-screen"
      >
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin"></div>
        <p className="mt-6 text-xl font-semibold animate-pulse tracking-wide">
          Loading, please wait...
        </p>
      </div>
    );

  return (
    <div className="pt-8 px-28 ">
      {/* <button onClick={() => toast.success("This is a success toast!")}>
        Show Toast
      </button> */}
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
        <Route path="/profile" element={<Profile />}>
          <Route path="edit" element={<EditProfile user={user} />}></Route>
        </Route>
        <Route
          path="/upload"
          element={user ? <UploadPage /> : <Login />}
        ></Route>
        <Route path="/points" element={<PointSystem />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/guidelines" element={<UploadGuidelines />}></Route>
        <Route path="/howitworks" element={<HowItWorks />}></Route>
        <Route path="/browse" element={<BrowseNotesPage />}></Route>
        <Route
          path="/my-uploads"
          element={user ? <MyUploads /> : <Login />}
        ></Route>
        <Route path="/bookmark" element={<BookmarkedNotes />}></Route>
        <Route path="/:branchName" element={<BranchNotes />} />
        <Route
          path="/:branch/:id"
          element={user ? <Preview /> : <Login />}
        ></Route>
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
