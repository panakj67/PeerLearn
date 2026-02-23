import React, { useEffect } from "react";
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
import axios from "axios";
import { fetchNotes } from "./features/notes/noteSlice";
import { setLoading, setUser, toggleVisible } from "./features/users/userSlice";
import EditProfile from "./components/EditProfile";
import AiChatBot from "./components/AiChatBot";
import ProtectedRoute from "./components/ProtectedRoute";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "https://peerlearn.onrender.com";

const App = () => {
  const user = useSelector((state) => state.user?.user);
  const showUserLogin = useSelector((state) => state.user.showUserLogin);
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.user?.visible);

  const getNotes = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await axios.get("/api/note/get");
      if (data.success) dispatch(fetchNotes(data.notes));
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchUser = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) dispatch(setUser(data.user));
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchUser();
    getNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Toaster />
      <Navbar />

      {!visible && (
        <button
          aria-label="Open AI assistant"
          onClick={() => dispatch(toggleVisible())}
          className="focus-ring fixed right-4 bottom-4 z-40 cursor-pointer rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1 shadow-lg sm:right-6 sm:bottom-6"
        >
          <img
            className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
            src="https://www.shutterstock.com/image-vector/chat-bot-icon-virtual-smart-600nw-2478937553.jpg"
            alt="AI assistant"
            loading="lazy"
          />
        </button>
      )}

      {showUserLogin && <Login />}
      {visible && <AiChatBot />}

      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />}>
            <Route path="edit" element={<EditProfile user={user} />} />
          </Route>
          <Route path="/upload" element={<ProtectedRoute element={<UploadPage />} />} />
          <Route path="/points" element={<PointSystem />} />
          <Route path="/about" element={<About />} />
          <Route path="/guidelines" element={<UploadGuidelines />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/browse" element={<BrowseNotesPage />} />
          <Route path="/my-uploads" element={<ProtectedRoute element={<MyUploads />} />} />
          <Route path="/bookmark" element={<ProtectedRoute element={<BookmarkedNotes />} />} />
          <Route path="/:branchName" element={<BranchNotes />} />
          <Route path="/:branch/:id" element={<ProtectedRoute element={<Preview />} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
