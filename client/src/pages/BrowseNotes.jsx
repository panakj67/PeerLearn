import React, { useState } from "react";
import { useSelector } from "react-redux";
import NotesCard from "../components/NotesCard";
import Section from "../components/layout/Section";
import Grid from "../components/layout/Grid";

const BrowseNotesPage = () => {
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const notes = useSelector((state) => state.note.notes);
  const searchTerm = useSelector((state) => state.note.searchTerm);

  const filteredNotes = notes.filter((note) =>
    (branch ? note.branch === branch : true) &&
    (semester ? note.semester == semester : true) &&
    note?.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Section>
      <h1 className="text-fluid-title mb-6 font-bold text-blue-700">Browse Notes</h1>

      <div className="surface mb-8 flex flex-wrap gap-3 p-4">
        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="focus-ring min-w-40 rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm">
          <option value="">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="focus-ring min-w-40 rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm">
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>Sem {sem}</option>
          ))}
        </select>
      </div>

      <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredNotes.map((note, index) => (
          <NotesCard note={note} key={index} />
        ))}
      </Grid>

      {filteredNotes.length === 0 && <p className="mt-10 rounded-xl border border-dashed border-blue-200 p-8 text-center text-gray-500">No notes found matching your filters.</p>}
    </Section>
  );
};

export default BrowseNotesPage;
