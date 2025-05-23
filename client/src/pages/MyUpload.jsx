import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaDownload, FaThumbsUp, FaThumbsDown, FaBookmark } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { removeFromUploads } from "../features/users/userSlice";
import { deleteNotes } from "../features/notes/noteSlice";

const MyUploads = () => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const uploads = useSelector((state) => state.user?.uploads || []);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    try {
      dispatch(removeFromUploads(id));
      dispatch(deleteNotes(id));
      const { data } = await axios.delete(`/api/note/delete/${id}`);

      if (data.success) {
        toast.success(data.message);
      } else toast.error(data.message);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
        📚 My Uploaded Documents
      </h1>

      {uploads.length === 0 ? (
        <p className="text-center text-gray-500">No uploads yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {uploads.map((doc) => (
            <div
              key={doc._id}
              className="border border-blue-200 rounded-xl p-6 hover:bg-blue-50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {doc.title}
                </h2>

                <p className="text-sm text-gray-600 mb-1">
                  Subject: <span className="font-medium">{doc.subject}</span> | Branch:{" "}
                  <span className="font-medium">{doc.branch}</span>
                </p>

                <p className="text-sm text-gray-500 mb-3">
                  Uploaded on: {new Date(doc.createdAt).toLocaleDateString(undefined, options)}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {doc.branch}
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {doc.subject}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-blue-700 font-medium mt-2">
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300 text-gray-600 cursor-default">
                    <FaThumbsUp className="text-green-500" />
                    <span>{doc.like?.length || 0}</span>
                  </div>

                  <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300 text-gray-600 cursor-default">
                    <FaThumbsDown className="text-red-500" />
                    <span>{doc.dislike?.length || 0}</span>
                  </div>

                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-xl">
                    +10 Points
                  </span>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => navigate(`/${doc.branch}/${doc._id}`)}
                    className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm"
                  >
                    Preview
                  </button>

                  <FaTrash
                    onClick={() => handleDelete(doc._id)}
                    size={20}
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    title="Delete"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyUploads;
