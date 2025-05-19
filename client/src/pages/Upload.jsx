import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { addPoints, setUser } from '../features/users/userSlice';
import { useDispatch } from 'react-redux';
import { addNotes } from '../features/notes/noteSlice';

const UploadPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const branchOptions = [
    { value: "Computer Science", label: "Computer Science" },
    { value: "Electrical Engineering", label: "Electrical Engineering" },
    { value: "Mechanical Engineering", label: "Mechanical Engineering" },
    { value: "Civil Engineering", label: "Civil Engineering" },
    { value: "Pharmacy", label: "Pharmacy" },
    { value: "Humanities", label: "Humanities" },
    { value: "Electronics and Communication", label: "Electronics and Communication" },
    { value: "Information Technology", label: "Information Technology" },
  ];

  const [formData, setFormData] = useState({
    college: '',
    degree: '',
    branch: '',
    subject: '',
    title: '',
    semester: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleBranchSelect = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      branch: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const details = new FormData();
    details.append('college', formData.college);
    details.append('degree', formData.degree);
    details.append('branch', formData.branch);
    details.append('subject', formData.subject);
    details.append('title', formData.title);
    details.append('semester', formData.semester);
    details.append('file', formData.file);

    try {
      const { data } = await axios.post('/api/note/create-notes', details);
      if (data.success) {
        toast.success(data.message);
        dispatch(addNotes(data.note));
        setFormData({
          college: '',
          degree: '',
          branch: '',
          subject: '',
          title: '',
          semester: '',
          file: null,
        });
        const userRes = await axios.get('/api/user/is-auth');
        navigate('/');
        dispatch(addNotes(userRes.data.note));
        dispatch(addPoints(10));
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 mb-20 px-6 py-10 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 text-center mb-8">Upload Your Notes</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">College Name</label>
            <input
              type="text"
              name="college"
              placeholder="e.g. LNCT Bhopal"
              value={formData.college}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Degree</label>
            <input
              type="text"
              name="degree"
              placeholder="e.g. B.Tech"
              value={formData.degree}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Branch</label>
            <Select
              options={branchOptions}
              onChange={handleBranchSelect}
              value={branchOptions.find((opt) => opt.value === formData.branch) || null}
              placeholder="e.g. Computer Science"
              isClearable
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  borderColor: state.isFocused ? '#3b82f6' : '#d1d5db', // blue-500 or gray-300
                  boxShadow: state.isFocused ? '0 0 0 1.5px rgba(13, 102, 247, 0.76)' : 'none',
                  padding: '1px 4px',
                  minHeight: '42px',
                  fontSize: '0.945rem', // text-sm
                })}}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="e.g. DBMS"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="border text-[16px] border-gray-300 text-gray-700 outline-blue-600 px-4 py-3 rounded-lg w-full"
              required
            >
              <option value="">Select</option>
              {[...Array(8)].map((_, i) => (
                <option key={i} value={i + 1}>Sem {i + 1}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. DBMS Unit 1 Notes"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Upload File</label>
          <input
            type="file"
            name="file"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="mt-6 px-8 cursor-pointer py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Upload Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;
