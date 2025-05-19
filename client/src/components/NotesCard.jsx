import React from "react";
import { useNavigate } from "react-router-dom";

const NotesCard = ({ note }) => {
    const navigate = useNavigate();
    
  return (
    <div
      onClick={() => navigate(`/${note.branch}/${note._id}`)}
      className="bg-gradient-to-br from-blue-50 to-white cursor-pointer hover:from-blue-100 transition-all duration-300 rounded-2xl p-4 border border-blue-100"
    >
      <img
        className="w-full h-36 object-cover object-top rounded-xl mb-4"
        src={note.image}
        alt={note.branch}
      />
      <h2 className="text-xl font-semibold text-blue-800 truncate">
        {note.title}
      </h2>
      <p className="text-sm text-gray-500 mt-1">{note.subject}</p>
      <div className="mt-3 flex items-center gap-2 text-sm text-yellow-600 font-medium">
        ⭐ 4.9 | 1.2k views
      </div>
    </div>
  );
};

export default NotesCard;
