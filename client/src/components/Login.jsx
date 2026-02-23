import React from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { hideLogin, setLoading, setUser } from "../features/users/userSlice";

const Login = () => {
  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const dispatch = useDispatch();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      dispatch(setLoading(true));
      const { data } = await axios.post(`/api/user/${state}`, { name, email, password });
      if (data.success) {
        toast.success(data.message);
        if (state === "register") toast.success("50 points added to your account");
        dispatch(setUser(data.user));
        dispatch(hideLogin());
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div onClick={() => dispatch(hideLogin())} className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-label="Authentication dialog">
      <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="w-full max-w-md space-y-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-2xl sm:p-8">
        <h2 className="text-center text-2xl font-semibold text-gray-900">
          <span className="text-blue-600">User</span> {state === "login" ? "Login" : "Sign Up"}
        </h2>

        {state === "register" && (
          <label className="block text-sm font-medium text-gray-700">
            Name
            <input onChange={(e) => setName(e.target.value)} value={name} className="focus-ring mt-1 w-full rounded-lg border border-gray-200 p-2.5" type="text" required />
          </label>
        )}

        <label className="block text-sm font-medium text-gray-700">
          Email
          <input onChange={(e) => setEmail(e.target.value)} value={email} className="focus-ring mt-1 w-full rounded-lg border border-gray-200 p-2.5" type="email" required />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Password
          <input onChange={(e) => setPassword(e.target.value)} value={password} className="focus-ring mt-1 w-full rounded-lg border border-gray-200 p-2.5" type="password" required />
        </label>

        <p className="text-sm text-gray-600">
          {state === "register" ? "Already have account?" : "Create an account?"}{" "}
          <button type="button" onClick={() => setState(state === "register" ? "login" : "register")} className="font-semibold text-blue-600 underline-offset-2 hover:underline">
            Click here
          </button>
        </p>

        <button className="focus-ring w-full rounded-lg bg-blue-600 py-2.5 text-base font-semibold text-white transition hover:bg-blue-700" type="submit">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
