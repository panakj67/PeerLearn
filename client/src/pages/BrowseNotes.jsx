import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NotesCard from '../components/notesCard';


const BrowseNotesPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  
  const notes = useSelector((state) => state.note.notes)
  
  const searchTerm = useSelector((state) => state.note.searchTerm);


  const filteredNotes = notes.filter((note) => {
    return (
      (branch ? note.branch === branch : true) &&
      (semester ? note.semester == semester : true) &&
      note?.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Browse Notes</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">

        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm"
        >
          <option value="">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm"
        >
          <option value="">All Semesters</option>
          <option value="1">Sem 1</option>
          <option value="2">Sem 2</option>
          <option value="3">Sem 3</option>
          <option value="4">Sem 4</option>
          <option value="5">Sem 5</option>
          <option value="6">Sem 6</option>
          <option value="7">Sem 7</option>
          <option value="8">Sem 8</option>
        </select>

      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {filteredNotes.map((note, index) => (
              <NotesCard note={note} key={index} />
           ))}
          </div>

      {filteredNotes.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No notes found matching your filters.
        </p>
      )}
    </div>
  );
};

export default BrowseNotesPage;
