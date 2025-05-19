import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setUser } from "../features/users/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const [profilePicFile, setProfilePicFile] = useState(null);

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    college: user.college || "",
    branch: user.branch || "",
    degree: user.degree || "",
    semester: user.semester || "",
    profilePic: user.profileImg || "",
  });

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicFile(file);
      setFormData({ ...formData, profilePic: imageUrl });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Here you would typically send the updated data to your backend
    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("college", formData.college);
    form.append("branch", formData.branch);
    form.append("degree", formData.degree);
    form.append("semester", formData.semester);
    if (profilePicFile) {
      form.append("file", profilePicFile);
    }

    try {
      const { data } = await axios.post(
        "/api/user/update",
        form
      );
      if (data.success) {
        toast.success("Profile updated successfully");
        dispatch(setUser(data.user));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white p-8 mt-10 mb-20">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
        Edit Profile
      </h2>

      <div className="flex flex-col items-center mb-8">
        <label
          htmlFor="profilePic"
          className="relative w-28 h-28 cursor-pointer"
        >
          <img
            src={
              formData.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/9815/9815472.png"
            }
            alt="Profile"
            className="w-26 h-26 rounded-full object-cover object-top border-2 border-gray-300"
          />
          <input
            id="profilePic"
            type="file"
            name="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="hidden"
          />
        </label>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500 mt-2">Click to change photo |</p>
          <button
           onClick={() => {
                setFormData({ ...formData, profilePic: "" });
                setProfilePicFile(null);
           }}
           className="text-sm text-red-500 cursor-pointer hover:underline mt-2">Remove</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none text-gray-500"
            type="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            College
          </label>
          <input
            name="college"
            value={formData.college}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Branch
          </label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Degree
          </label>
          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Degree</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Semester
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Semester</option>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={`${i + 1}`}>
                Semester {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10 flex justify-center space-x-6">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
