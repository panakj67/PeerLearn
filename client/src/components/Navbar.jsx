import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { setUser, showLogin, userLogout } from "../features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../features/notes/noteSlice";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "./layout/Container";

const navItems = [
  { to: "/about", label: "About" },
  { to: "/howitworks", label: "How it Works" },
  { to: "/guidelines", label: "Upload Guidelines" },
  { to: "/points", label: "Point System" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropDown, setShowDropDown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.user);

  const logoutHandler = async () => {
    try {
      const { data } = await axios("/api/user/logout");
      if (data.success) {
        dispatch(userLogout());
        setShowDropDown(false);
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const authUser = async () => {
      try {
        const { data } = await axios.get("/api/user/is-auth");
        if (data.success) dispatch(setUser(data.user));
      } catch (error) {
        toast.error(error.message);
      }
    };
    authUser();
  }, []);

  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/90 backdrop-blur">
      <Container>
        <nav className="flex items-center gap-3 py-3 sm:gap-4" aria-label="Primary navigation">
          <NavLink to="/" className="mr-auto flex items-center gap-2">
            <img className="h-9 w-9" src="/images.png" alt="PeerLearn logo" loading="lazy" />
            <h1 className="text-2xl font-bold tracking-tight text-blue-700 sm:text-3xl">peerlearn</h1>
          </NavLink>

          <div className="hidden flex-1 max-w-xs items-center gap-2 rounded-full border border-blue-100 bg-blue-50/60 px-3 py-2 md:flex">
            <FaSearch color="#6b7280" />
            <input
              aria-label="Search by subject"
              placeholder="Search by subject"
              onChange={(e) => {
                dispatch(setSearch(e.target.value));
                navigate("/browse");
              }}
              className="w-full bg-transparent text-sm outline-none"
              type="text"
            />
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <NavLink to="/bookmark" className="hidden rounded-full p-1 hover:bg-yellow-50 sm:block">
            <img className="h-9 w-9 rounded-full object-cover" src="https://static.vecteezy.com/system/resources/previews/006/118/158/non_2x/illustration-of-realistic-star-shape-with-highlight-and-shadow-suitable-for-design-element-of-game-rating-and-award-achievement-3d-star-icon-free-vector.jpg" alt="Bookmarks" loading="lazy" />
          </NavLink>

          {!user ? (
            <button onClick={() => dispatch(showLogin())} className="focus-ring hidden rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:inline-flex">
              Login
            </button>
          ) : (
            <div className="relative hidden sm:block">
              <img
                onClick={() => setShowDropDown((prev) => !prev)}
                className="h-10 w-10 cursor-pointer rounded-full border border-blue-300 object-cover object-top"
                src={user?.profileImg || "https://cdn-icons-png.flaticon.com/512/9815/9815472.png"}
                alt="User profile"
              />
              {showDropDown && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-blue-100 bg-white p-1 shadow-xl">
                  {[{ label: "Profile", to: "/profile" }, { label: "My Uploads", to: "/my-uploads" }].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.to);
                        setShowDropDown(false);
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-blue-50"
                    >
                      {item.label}
                    </button>
                  ))}
                  <button onClick={logoutHandler} className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="focus-ring rounded-lg p-2 text-gray-700 hover:bg-blue-50 lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="space-y-3 border-t border-blue-100 pb-4 lg:hidden">
            <div className="mt-3 flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/60 px-3 py-2">
              <FaSearch color="#6b7280" />
              <input
                aria-label="Search by subject"
                placeholder="Search by subject"
                onChange={(e) => {
                  dispatch(setSearch(e.target.value));
                  navigate("/browse");
                }}
                className="w-full bg-transparent text-sm outline-none"
                type="text"
              />
            </div>
            <div className="grid gap-1">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
              <NavLink to="/bookmark" className={linkClass} onClick={() => setMobileMenuOpen(false)}>
                Bookmarks
              </NavLink>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Navbar;
