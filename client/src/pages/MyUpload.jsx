import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaThumbsUp,
  FaThumbsDown,
  FaBookmark,
} from "react-icons/fa";

const MyUploads = () => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const uploads = useSelector((state) => state.user.user.uploads);
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        📚 My Uploaded Documents
      </h1>

      {uploads.length === 0 ? (
        <p className="text-center text-gray-500">No uploads yet.</p>
      ) : (
        <div className="grid gap-4">
          {uploads.map((doc) => (
            <div
              key={doc.id}
              className="bg-gradient-to-r from-blue-50 to-purple-100/60 rounded-2xl shadow-md hover:shadow-lg transition p-5 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {doc.title}
                </h2>
                <p className="text-sm text-gray-600">
                  Subject: <span className="font-medium">{doc.subject}</span> |
                  Branch: <span className="font-medium">{doc.branch}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Uploaded on:{" "}
                  {new Date(doc.createdAt).toLocaleDateString(
                    undefined,
                    options
                  )}
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mt-4 md:mt-0">
                <div className="flex gap-6 items-center">
                  <div
                    name="like"
                    className="flex cursor-pointer items-center gap-1 px-3 py-2 rounded-full border text-gray-400 border-gray-200"
                  >
                    <FaThumbsUp className="text-green-500 text-10" />
                    <span className="text-md">{doc?.like.length}</span>
                  </div>

                  <div
                    name="dislike"
                    className="flex cursor-pointer items-center gap-1 px-3 py-2 rounded-full border text-gray-400 border-gray-200"
                  >
                    <FaThumbsDown className="text-red-500"  />
                    <span className="text-md">{doc?.dislike.length}</span>
                  </div>
                </div>

                <span className="text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-xl text-sm">
                  +10 Points
                </span>
                <div
                  onClick={() => navigate(`/${doc.branch}/${doc._id}`)}
                  className="flex gap-2"
                >
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm">
                    Preview
                  </button>
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
