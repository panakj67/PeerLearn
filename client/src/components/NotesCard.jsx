import React from "react";
import { useNavigate } from "react-router-dom";

const NotesCard = ({ note }) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/${note.branch}/${note._id}`)}
      className="surface cursor-pointer overflow-hidden p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/${note.branch}/${note._id}`)}
    >
      <img className="mb-4 h-40 w-full rounded-xl object-cover object-top" src={note.image} alt={note.branch} loading="lazy" />
      <h3 className="line-clamp-2 text-lg font-semibold text-blue-900">{note.title}</h3>
      <p className="mt-1 text-sm text-gray-500">{note.subject}</p>
      <div className="mt-3 text-sm font-medium text-amber-600">⭐ 4.9 • 1.2k views</div>
    </article>
  );
};

export default NotesCard;
