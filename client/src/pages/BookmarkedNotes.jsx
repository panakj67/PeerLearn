import React from 'react';

const bookmarkedNotes = [
  {
    id: 1,
    title: "DBMS Summary - Unit 2",
    branch: "CSE",
    semester: "5th",
    tags: ["#DBMS", "#CSE", "#Unit2"],
    points: 10,
    date: "2025-05-12",
  },
  {
    id: 2,
    title: "Compiler Design Notes",
    branch: "CSE",
    semester: "6th",
    tags: ["#CD", "#Semester6"],
    points: 15,
    date: "2025-05-10",
  },
];

const BookmarkedNotes = () => {
  return (
    <div className="w-full mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
        📌 Bookmarked Notes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Bookmarked on:</span> {note.date}
            </p>

            <div className="flex flex-wrap gap-2 mt-3 mb-4">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-blue-600">
                🔓 {note.points} Points
              </span>
              <button className="text-sm text-blue-700 font-medium hover:underline">
                View Document
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkedNotes;
