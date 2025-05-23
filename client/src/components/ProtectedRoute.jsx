import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Login from "./Login";

const ProtectedRoute = ({ element }) => {
  const user = useSelector((state) => state.user?.user);
  const loading = useSelector((state) => state.user?.loading); // We'll set this up in Step 3

  if (loading) {
    return (
      <div
        className="flex flex-col items-center text-blue-600 bg-gradient-to-tr from-white via-indigo-50 to-indigo-100
 justify-center h-screen"
      >
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin"></div>
        <p className="mt-6 text-xl font-semibold animate-pulse tracking-wide">
          Loading, please wait...
        </p>
      </div>
    );
  }

  return user ? element : <Login />;
};

export default ProtectedRoute;
