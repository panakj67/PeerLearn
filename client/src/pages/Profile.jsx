import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Leaderboard from "../components/Leaderboard";
import BadgesSection from "../components/Badge";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaThumbsUp,
  FaThumbsDown,
  FaBookmark,
} from "react-icons/fa";

const StudentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.pathname.includes("edit");

  const user = useSelector((state) => state.user.user);
  const points = useSelector((state) => state.user?.points);
  const uploads = useSelector((state) => state.user?.uploads);
  const downloads = useSelector((state) => state.user?.downloads);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {isEditing ? (
        <Outlet />
      ) : (
        <div>
          {/* Profile Header - Gamified & Light Theme */}
          <div className="flex flex-col sm:flex-row items-center shadow-lg border border-blue-100 justify-between bg-gradient-to-r from-blue-50 to-purple-100/60 rounded-3xl p-8 mb-12">
            <div className="flex items-center gap-6">
              <img
                src={
                  user?.profileImg ||
                  "https://cdn-icons-png.flaticon.com/512/9815/9815472.png"
                }
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover object-top border-4 border-pink-500 shadow-md "
              />
              <div>
                <h2 className="text-3xl font-bold text-purple-800 drop-shadow-md">
                  {user?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {user?.college || user?.email} | 🎓{" "}
                  {user?.semester && `${user?.semester}th Semester`}
                </p>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 mt-2 rounded-full shadow-sm animate-bounce">
                  🏅 Toppers Club
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/profile/edit")}
              className="mt-6 sm:mt-0 px-6 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              ✏️ Edit Profile
            </button>
          </div>

          {/* Stats Section - Gamified Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 border border-blue-200 shadow-xl rounded-xl text-center hover:scale-105 transition-transform">
              <div className="w-full flex items-center justify-center">
                <img
                  className="h-15 animate-bounce"
                  src="https://static.vecteezy.com/system/resources/thumbnails/010/833/923/small_2x/gold-dollar-coin-game-asset-2d-icon-transparent-background-png.png"
                  alt=""
                />
              </div>
              <h3 className="text-3xl font-bold text-blue-700">{points}</h3>
              <p className="text-gray-600">🏆 Points Earned</p>
            </div>
            <div className="bg-gradient-to-br from-white to-green-50 p-6 border border-green-200 shadow-xl rounded-xl text-center hover:scale-105 transition-transform">
              <div className="w-full flex items-center justify-center">
                <img
                  className="h-15"
                  src="https://cdn-icons-png.freepik.com/512/6870/6870041.png"
                  alt=""
                />
              </div>
              <h3 className="text-3xl font-bold text-green-700">
                {(uploads || [])?.length}
              </h3>
              <p className="text-gray-600">📤 Notes Uploaded</p>
            </div>
            <div className="bg-gradient-to-br from-white to-purple-50 p-6 border border-purple-200 shadow-xl rounded-xl text-center hover:scale-105 transition-transform">
              <div className="w-full flex items-center justify-center">
                <img
                  className="h-15"
                  src="https://cdn-icons-png.flaticon.com/512/4007/4007698.png"
                  alt=""
                />
              </div>
              <h3 className="text-3xl font-bold text-purple-700">
                {(downloads || []).length}
              </h3>
              <p className="text-gray-600">📥 Downloads Made</p>
            </div>
          </div>

          <BadgesSection />
          <Leaderboard />

          {/* Recent Uploads */}
          <div className="bg-gradient-to-br from-white to-green-50 py-10 pb-20 via-green-50 to-white rounded-2xl shadow-xl p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-extrabold text-green-700">
                📂 Recent Uploads
              </h3>
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full shadow-md">
                <span className="font-semibold text-sm">🎯 Points Earned:</span>
                <span className="text-lg font-bold">{user?.points || 0}</span>
              </div>
            </div>

            {user && uploads.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {uploads.map((upload) => (
                  <div
                    key={upload?._id}
                    className="bg-white hover:shadow-xl transition-shadow border border-gray-200 rounded-xl p-5 hover:bg-green-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                        {upload?.title}
                      </h4>
                      <div className="flex gap-6 items-center">
                        <div
                          name="like"
                          className="flex items-center gap-1 px-3 py-2 rounded-full border text-gray-400 border-gray-200"
                        >
                          <FaThumbsUp className="text-green-500 text-10" />
                          <span className="text-md">{upload?.like?.length}</span>
                        </div>

                        <div
                          name="dislike"
                          className="flex items-center gap-1 px-3 py-2 rounded-full border text-gray-400 border-gray-200"
                        >
                          <FaThumbsDown className="text-red-500" />
                          <span className="text-md">
                            {upload?.dislike?.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {upload?.description}
                    </p>
                    <a
                      href={upload?.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-green-600 font-medium hover:underline text-sm"
                    >
                      🔗 View File
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                No recent uploads available.
              </p>
            )}
          </div>

          
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 py-10 pb-20 via-blue-50 to-white rounded-2xl shadow-xl p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-extrabold text-blue-700">
                📂 Recent Downloads
              </h3>
            
            </div>

            {user && downloads.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {downloads.map((note) => (
                  <div
                    key={note?._id}
                    className="bg-white hover:shadow-xl transition-shadow border border-gray-200 rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                        {note?.title}
                      </h4>
                      <div className="flex gap-6 items-center">
                        <div
                          name="like"
                          className="flex items-center gap-1 px-3 py-2 rounded-full border text-gray-400 border-gray-200"
                        >
                          <FaThumbsUp className="text-green-500 text-10" />
                          <span className="text-md">{note?.like?.length}</span>
                        </div>

                        <div
                          name="dislike"
                          className="flex items-center gap-1 px-3 py-2 rounded-full border text-gray-400 border-gray-200"
                        >
                          <FaThumbsDown className="text-red-500" />
                          <span className="text-md">
                            {note?.dislike?.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {note?.description}
                    </p>
                    <button
                      onClick= {() => navigate(`/${note?.branch}/${note?._id}`)}
                      className="text-blue-600 font-medium cursor-pointer hover:underline text-sm"
                    >
                      🔗 View File
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                No recent downloads available.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
