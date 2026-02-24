import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios'
import { hideLogin, setLoading, setUser } from '../features/users/userSlice';
import { FcGoogle } from 'react-icons/fc';

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const Login = () => {
  const [mode, setMode] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [resetToken, setResetToken] = React.useState("");
  const [authLoading, setAuthLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('');
  const dispatch = useDispatch();
  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const authHandler = async (endpoint, body, pendingText = 'Processing...') => {
    try {
      setAuthLoading(true);
      setLoadingText(pendingText);
      dispatch(setLoading(true));
      const { data } = await axios.post(endpoint, body);

      if (!data.success) {
        toast.error(data.message || 'Request failed');
        if (data.requiresVerification && data.email) {
          setEmail(data.email);
          setMode('verifyOtp');
        }
        return;
      }

      if (data.user) {
        dispatch(setUser(data.user));
        dispatch(hideLogin());
      }

      toast.success(data.message || 'Success');
    } catch (error) {
      toast.error(error.message || 'Request failed');
    } finally {
      setAuthLoading(false);
      setLoadingText('');
      dispatch(setLoading(false));
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if ((mode === 'register' || mode === 'reset') && !passwordRule.test(password)) {
      toast.error('Password must include upper, lower, number, special and be 8+ chars.');
      return;
    }

    if (mode === 'login') return authHandler('/api/user/login', { email, password }, 'Logging in...');
    if (mode === 'register') return authHandler('/api/user/register', { name, email, password }, 'Registering...');
    if (mode === 'verifyOtp') return authHandler('/api/user/verify-email-otp', { email, otp }, 'Confirming...');
    if (mode === 'forgot') return authHandler('/api/user/forgot-password', { email }, 'Sending OTP...');
    if (mode === 'reset') return authHandler('/api/user/reset-password', { token: resetToken, password }, 'Resetting password...');
  }

  const handleGoogleCredential = async (credential) => {
    return authHandler('/api/user/google-login', { credential }, 'Logging in...');
  };

  const resendOtpHandler = async () => {
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }
    return authHandler('/api/user/resend-email-otp', { email }, 'Sending OTP...');
  }

  useEffect(() => {
    if (!googleClientId || !window.google || !googleButtonRef.current || (mode !== 'login' && mode !== 'register')) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response) => {
        if (response?.credential) handleGoogleCredential(response.credential);
      },
    });

    googleButtonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: 'outline',
      size: 'large',
      width: 260,
      text: mode === 'register' ? 'signup_with' : 'signin_with',
      shape: 'pill'
    });
  }, [googleClientId, mode]);

  const primaryModes = ['login', 'register'];

  return (
  <div
    onClick={() => dispatch(hideLogin())}
    className="fixed inset-0 z-30 flex items-center justify-center bg-black/40  px-4"
  >
    <form
      onSubmit={onSubmitHandler}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
    >
      {/* Tabs */}
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-lg py-2 text-sm cursor-pointer font-semibold transition ${
            mode === "login"
              ? "bg-blue-600 text-white shadow"
              : "text-gray-600"
          }`}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => setMode("register")}
          className={`rounded-lg py-2 text-sm cursor-pointer font-semibold transition ${
            mode === "register"
              ? "bg-blue-600 text-white shadow"
              : "text-gray-600"
          }`}
        >
          Register
        </button>
      </div>

      {/* Google */}
      <p className="text-center text-sm text-gray-500">Continue with</p>

      <div className="mt-2 flex justify-center">
        {googleClientId ? (
          <div ref={googleButtonRef} />
        ) : (
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-gray-600"
          >
            <FcGoogle /> Google unavailable
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        {mode === "register" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-blue-500"
            required
          />
        )}

        {(mode === "login" ||
          mode === "register" ||
          mode === "verifyOtp" ||
          mode === "forgot") && (
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-blue-500"
            required
          />
        )}

        {(mode === "login" || mode === "register" || mode === "reset") && (
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              mode === "reset" ? "New password" : "Password"
            }
            type="password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-blue-500"
            required
          />
        )}

        {mode === "verifyOtp" && (
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-blue-500"
            required
          />
        )}

        {mode === "reset" && (
          <input
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            placeholder="Reset token from email"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-blue-500"
            required
          />
        )}
      </div>

      {/* Login Options */}
      {mode === "login" && (
        <div className="mt-3 flex items-center justify-between text-xs">
          <label className="flex items-center cursor-pointer gap-2 text-gray-600">
            <input
              type="checkbox"
              defaultChecked
              className="accent-blue-600"
            />
            Remember me
          </label>

          <button
            type="button"
            onClick={() => setMode("forgot")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Forgot password?
          </button>
        </div>
      )}

      {mode === "verifyOtp" && (
        <div className="mt-3 text-right">
          <button
            type="button"
            onClick={resendOtpHandler}
            className="text-xs cursor-pointer text-blue-600 hover:underline"
          >
            Resend OTP
          </button>
        </div>
      )}

      {/* Loading Text */}
      {authLoading && (
        <p className="mt-3 text-sm font-medium text-blue-600">
          {loadingText}
        </p>
      )}

      {(mode === "register" || mode === "reset") && (
        <p className="mt-3 text-xs text-gray-500">
          Password must be 8+ chars with uppercase, lowercase,
          number and special character.
        </p>
      )}

      {/* Submit */}
      <button
        disabled={authLoading}
        className="mt-5 w-full cursor-pointer rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {authLoading
          ? loadingText
          : mode === "register"
          ? "Create Account"
          : mode === "verifyOtp"
          ? "Verify OTP"
          : mode === "forgot"
          ? "Send Reset Email"
          : mode === "reset"
          ? "Reset Password"
          : "Sign In"}
      </button>

      {/* Footer */}
      <div className="mt-4 text-center text-xs text-gray-600">
        {primaryModes.includes(mode) ? (
          mode === "login" ? (
            <p>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Login
              </button>
            </p>
          )
        ) : (
          <button
            type="button"
            onClick={() => setMode("login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Back to login
          </button>
        )}
      </div>
    </form>
  </div>
);
}

export default Login
