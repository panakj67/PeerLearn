import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BookmarkedNotes = () => {
  const bookmarkedNotes = useSelector((state) => state.user?.bookmarks);
  // console.log(bookmarkedNotes);
  const navigate = useNavigate()

  return (
    <div className="w-full mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
        📌 Bookmarked Notes
      </h1>

      {bookmarkedNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {bookmarkedNotes.map((note) => (
            <div
              key={note.id}
              className="border border-blue-200 rounded-xl p-6 hover:bg-blue-50 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {note.title}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Branch:</span> {note.branch}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Semester:</span> {note.semester}
              </p>

              {<div className="flex flex-wrap gap-2 mt-3 mb-4">
                 <span
                  className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {note.branch}
                </span>
                 <span
                  className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {note.subject}
                </span>
            </div> }

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-blue-600">
                  🔓 {note.points} Points
                </span>
                <button
                 onClick={() => navigate(`/${note.branch}/${note._id}`)}
                 className="text-sm text-blue-700 cursor-pointer font-medium hover:underline">
                  View Document
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Bookmark is Empty!!</p>
      )}
    </div>
  );
};

export default BookmarkedNotes;
