import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addDownloads, deductPoints, toggleChatVisible } from "../features/users/userSlice";
import toast from "react-hot-toast";
import axios from "axios";
import NotesCard from "../components/NotesCard";
import {
  FaDownload,
  FaThumbsUp,
  FaThumbsDown,
  FaBookmark,
} from "react-icons/fa";
import { fetchNotes, updateThumb } from "../features/notes/noteSlice";
import GroupChat from "../components/GroupChat";

// import 'pdfjs-dist/web/pdf_viewer.css';
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const Preview = () => {
  const [showModal, setShowModal] = useState(false);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const navigate = useNavigate();
  const userPoints = useSelector((state) => state.user?.points);
  const notes = useSelector((state) => state.note?.notes);
  const user = useSelector((state) => state.user?.user);
  const [loading, setLoading] = useState(false);

  const { id, branch } = useParams();
  const note = notes.find((note) => note._id === id);

  const url = note?.fileUrl;
  const dispatch = useDispatch();
  const downloads = useSelector((state) => state.user.downloads);
  const uploads = useSelector((state) => state.user.uploads);

  const hasPurchased = downloads?.some(note => note?._id === id) || uploads?.find(note => note?._id === id);
   // 5 seconds
  
  const relatedNotes = notes.filter(
    (note) => note?.branch === branch && note?._id !== id
  );

  const confirmPurchase = async (e) => {
    // 🛑 Prevent default <a> behavior
    setLoading(true);
    
    if (!hasPurchased) {
      if (userPoints >= 10) {
        // Deduct points from the user
        dispatch(deductPoints(10));
        const { data } = await axios.post("/api/user/download", { id: id });
        if (data.success) {
          dispatch(addDownloads(note));
          toast.success("Purchase successful!");
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error("Not enough coins");
        setShowModal(false);
        setLoading(false);
        return;
      }
    }

    setShowModal(false);
  
    // Trigger download manually
    fetch(note.fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${note.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Start downloading!!!");

      })
      .catch(() => {
        toast.error("Failed to download file.");
      });
      setLoading(false);
  };

  const [upvoted, setUpvoted] = useState(false);
  const [reported, setReported] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const canvasRef = useRef(null);
  const fileInputRef = React.useRef(null);
  const [pagesToRender, setPagesToRender] = useState([]);

  const [show, setShow] = useState(false);



  const handleClick = async (event) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/note/${note._id}`, {
        id: user._id,
        event,
      });
      if (data.success) {
         dispatch(updateThumb({id , note : data.note}))
      } else toast.error(data.message);
      
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1200); // 5 seconds
    return () => clearTimeout(timer);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const goToNextPage = () =>
    setCurrentPage((prev) => {
      if (!hasPurchased && prev === 4) {
        setShow(true);
        return prev;
      }
      return Math.min(prev + 1, totalPages);
    });
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Load PDF document
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1); // reset to first page on new load
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();
  }, [url]);

  // Render current page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc) return;
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 3 });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    };

    renderPage();
  }, [pdfDoc, currentPage]);

  const chatVisible = useSelector((state) => state.user?.chatVisible);
  console.log(chatVisible);
  

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white space-y-3">
      {/* Loading */}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bac z-50">
          <div className="w-10 h-10 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
        </div>
      )}

      {chatVisible ? <GroupChat /> 
        : (
          <div
          onClick={() => dispatch(toggleChatVisible(true))} // your function to toggle chatbot visibility
          className="fixed bottom-27 right-6 cursor-pointer rounded-full overflow-hidden  p-1"
        >
          <img  className="h-17 w-17 object-cover"
           src="https://cdn-icons-png.freepik.com/512/6388/6388074.png" alt="" />
        </div>
        )}

      {/* Title */}
      <div className="flex justify-between items-center ">
        <h1 className="text-3xl font-bold text-blue-700">{note?.title}</h1>

        <div className="flex gap-6 items-center">
          <div
            name="like"
            onClick={() => handleClick("like")}
            className="flex cursor-pointer items-center gap-1 px-3 py-2 rounded-full border text-gray-400 border-gray-200"
          >
            <FaThumbsUp className="text-green-500 text-10" size={20} />
            <span  className="text-lg">{note?.like.length}</span>
          </div>

          <div
            name="dislike"
            onClick={() => handleClick("dislike")}
            className="flex cursor-pointer items-center gap-1 px-3 py-2 rounded-full border text-gray-400 border-gray-200"
          >
            <FaThumbsDown className="text-red-500" size={20} />
            <span  className="text-lg">{note.dislike.length}</span>
          </div>

          <button
            onClick={() => {
              hasPurchased ? confirmPurchase() : setShowModal(true);
            }}
            className="bg-[#2cc302] px-6 font-semibold cursor-pointer text-lg py-2 rounded-3xl text-white"
          >
            <FaDownload className="inline-block mr-2" />
            Download
          </button>
        </div>
      </div>

      {/* Tags and Meta */}
      <div className="flex flex-wrap items-center justify-between text-gray-600 text-sm">
        <div className="flex gap-3 flex-wrap">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {note?.branch}
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {note?.semester}th Semester
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {note?.subject}
          </span>
        </div>
        <p>
          Uploaded on:{" "}
          <span className="font-medium">
            {new Date(note.createdAt).toLocaleDateString(undefined, options)}
          </span>
        </p>
      </div>

      {/* Uploader */}
      <div className="text-gray-800">
        Uploaded by:{" "}
        <a
          href="/profile/username"
          className="text-blue-600 hover:underline font-medium"
        >
          {note?.user.name}
        </a>
      </div>

      <div className="space-y-2 mt-15 relative flex items-center justify-between">
        <button
          onClick={goToPrevPage}
          className="bg-gradient-to-r from-red-200 to-orange-600 px-2 py-3 text-white rounded-full cursor-pointer"
          disabled={currentPage === totalPages}
        >
          Prev
        </button>
        <canvas
          ref={canvasRef}
          style={{ border: "1px solid black", marginTop: "10px", width: "85%" }}
        />
        <button
          onClick={goToNextPage}
          className="bg-gradient-to-r from-blue-200 to-purple-600 px-2 py-3 text-white rounded-full cursor-pointer"
          disabled={currentPage === totalPages}
        >
          Next
        </button>

        {showModal && (
          <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-[90%] max-w-md text-center relative border-[1px] border-yellow-200">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/010/833/923/small_2x/gold-dollar-coin-game-asset-2d-icon-transparent-background-png.png"
                alt="Coin"
                className="w-20 h-20 mx-auto mb-4 animate-bounce"
              />
              <h2 className="text-2xl font-bold text-yellow-700 mb-2">
                Unlock with Coins
              </h2>
              <p className="text-gray-700 mb-1">
                Your Balance:{" "}
                <span className="font-semibold text-green-600">
                  {userPoints} coins
                </span>
              </p>
              <p className="text-red-600 font-semibold mb-6">Cost: 10 coins</p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 cursor-pointer rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  className="px-5 py-2 cursor-pointer rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition shadow-md"
                >
                  Purchase & Download
                </button>
              </div>

              {/* Stylish Close Button */}
              <button
                className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}

      {show && !hasPurchased && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-lg text-center border-[1px] border-yellow-300 relative">
            <h2 className="text-2xl font-bold text-yellow-700 mb-2">
              Preview Only
            </h2>
            <p className="text-gray-700 mb-4">
              This is a sample preview of the document.
              <br />
              To download the full file, you'll need to spend{" "}
              <strong className="text-green-600">10 coins</strong>.
            </p>
            <button
              className="mt-3 px-6 cursor-pointer py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
              onClick={() => setShow(false)}
            >
              Got It 👍
            </button>

            <button
              onClick={() => setShow(false)}
              className="absolute  cursor-pointer top-2 right-4 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Related Documents Section */}
      <div className="space-y-6 mt-16 mb-10">
        <h2 className="text-2xl font-semibold text-blue-700">
          Related Documents
        </h2>
        {relatedNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedNotes.slice(0, 8).map((note, index) => (
              <NotesCard note={note} key={index} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No related documents found.</p>
        )}
      </div>
    </div>
  );
};

export default Preview;
