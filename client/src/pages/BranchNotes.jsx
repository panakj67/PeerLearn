import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Images } from '../assets/util'; // Adjust the import path as necessary
import { useSelector } from 'react-redux';
import image1 from '../assets/book1.png'
import image2 from '../assets/book2.png'
import image3 from '../assets/book3.png'
import image4 from '../assets/book4.png'
import image5 from '../assets/book5.png'
import { FaSearch } from "react-icons/fa"; 
import NotesCard from '../components/notesCard';

const imageArray = [image1, image2, image3, image4, image5];

// const { image1, image2, image3, image4, image5 } = Images; // Destructure images

const BranchNotes = () => {
  const { branchName } = useParams();
  const navigate = useNavigate()
  console.log(branchName);
  
  const [semester, setSemester] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  }
  

  // Dummy notes data
  const notes = useSelector((state) => state.note.notes);

  // Filter notes by branch from URL param
  const filteredNotes = notes.filter(note => (semester ? note.semester == semester : true)  &&
    (searchTerm ? note.title.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
    note?.branch.toLowerCase() === decodeURIComponent(branchName).toLowerCase()
  );

  return (
    <div className="w-full mt-12 pb-16">
      <h1 className="text-3xl text-center font-bold text-blue-700 mb-1 capitalize">
        {branchName}
      </h1>
      <div className="w-30 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
      

      <div className="flex flex-wrap gap-4 mb-8">
      
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

        <div className="border flex items-center gap-1 border-gray-300 px-2 py-1 rounded-3xl">
          <FaSearch  color="#888" />
          <input
           placeholder='Search by title'
           value={searchTerm}
           onChange={handleChange}
           className="outline-none" type="text" />
        </div>

      </div>


      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-4 gap-6">
          {filteredNotes.map((note, index) => (
             <NotesCard note={note} key={index} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No notes found for this branch.</p>
      )}
    </div>
  );
};

export default BranchNotes;
