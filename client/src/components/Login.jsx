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
  const dispatch = useDispatch();
  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const authHandler = async (endpoint, body) => {
    try {
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
      dispatch(setLoading(false));
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if ((mode === 'register' || mode === 'reset') && !passwordRule.test(password)) {
      toast.error('Password must include upper, lower, number, special and be 8+ chars.');
      return;
    }

    if (mode === 'login') return authHandler('/api/user/login', { email, password });
    if (mode === 'register') return authHandler('/api/user/register', { name, email, password });
    if (mode === 'verifyOtp') return authHandler('/api/user/verify-email-otp', { email, otp });
    if (mode === 'forgot') return authHandler('/api/user/forgot-password', { email });
    if (mode === 'reset') return authHandler('/api/user/reset-password', { token: resetToken, password });
  }

  const handleGoogleCredential = async (credential) => {
    return authHandler('/api/user/google-login', { credential });
  };

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
    <div onClick={() => dispatch(hideLogin())} className='fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4'>
      <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="w-full max-w-[560px] rounded-xl bg-[#ececec] px-6 py-8 shadow-2xl sm:px-10">
        <div className='grid grid-cols-2 gap-4'>
          <button type='button' onClick={() => setMode('login')} className={`h-14 rounded-md text-lg font-semibold transition ${mode === 'login' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-300 text-gray-600'}`}>
            LOGIN
          </button>
          <button type='button' onClick={() => setMode('register')} className={`h-14 rounded-md text-lg font-semibold transition ${mode === 'register' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-300 text-gray-600'}`}>
            REGISTER
          </button>
        </div>

        <p className='mt-8 text-center text-4 text-gray-700'>Sign in with:</p>

        <div className='mt-4 flex justify-center'>
          {googleClientId ? (
            <div ref={googleButtonRef} className='min-h-10' />
          ) : (
            <button type='button' className='inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600'>
              <FcGoogle className='text-xl' /> Google unavailable
            </button>
          )}
        </div>

        <p className='mt-6 text-center text-4 text-gray-700'>or:</p>

        <div className='mt-5 space-y-4'>
          {mode === "register" && (
            <input onChange={(e) => setName(e.target.value)} value={name} placeholder='Full name' className='h-14 w-full rounded-md border border-gray-300 bg-white px-4 text-2xl outline-blue-500' type='text' required />
          )}

          {(mode === 'login' || mode === 'register' || mode === 'verifyOtp' || mode === 'forgot') && (
            <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Email' className='h-14 w-full rounded-md border border-gray-300 bg-white px-4 text-2xl outline-blue-500' type='email' required />
          )}

          {(mode === 'login' || mode === 'register' || mode === 'reset') && (
            <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder={mode === 'reset' ? 'New password' : 'Password'} className='h-14 w-full rounded-md border border-gray-300 bg-white px-4 text-2xl outline-blue-500' type='password' required />
          )}

          {mode === 'verifyOtp' && (
            <input onChange={(e) => setOtp(e.target.value)} value={otp} placeholder='Enter 6-digit OTP' maxLength={6} className='h-14 w-full rounded-md border border-gray-300 bg-white px-4 text-2xl outline-blue-500' type='text' required />
          )}

          {mode === 'reset' && (
            <input onChange={(e) => setResetToken(e.target.value)} value={resetToken} placeholder='Reset token from email' className='h-14 w-full rounded-md border border-gray-300 bg-white px-4 text-2xl outline-blue-500' type='text' required />
          )}
        </div>

        {mode === 'login' && (
          <div className='mt-4 flex items-center justify-between text-sm'>
            <label className='flex items-center gap-2 text-gray-700'>
              <input type='checkbox' defaultChecked className='h-4 w-4 accent-blue-600' /> Remember me
            </label>
            <button type='button' onClick={() => setMode('forgot')} className='text-blue-600 hover:underline'>Forgot password?</button>
          </div>
        )}

        {mode === 'verifyOtp' && (
          <div className='mt-3 text-right'>
            <button type='button' onClick={() => authHandler('/api/user/resend-email-otp', { email })} className='text-sm text-blue-600 hover:underline'>Resend OTP</button>
          </div>
        )}

        {(mode === 'register' || mode === 'reset') && (
          <p className='mt-3 text-xs text-gray-500'>Password must be 8+ chars with uppercase, lowercase, number and special character.</p>
        )}

        <button className='mt-6 h-14 w-full rounded-md bg-blue-600 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700'>
          {mode === 'register' ? 'SIGN UP' : mode === 'verifyOtp' ? 'VERIFY OTP' : mode === 'forgot' ? 'SEND RESET EMAIL' : mode === 'reset' ? 'RESET PASSWORD' : 'SIGN IN'}
        </button>

        <div className='mt-6 text-center text-gray-700'>
          {primaryModes.includes(mode) ? (
            mode === 'login' ? (
              <p>Not a member? <button type='button' onClick={() => setMode('register')} className='text-blue-600 hover:underline'>Register</button></p>
            ) : (
              <p>Already have account? <button type='button' onClick={() => setMode('login')} className='text-blue-600 hover:underline'>Login</button></p>
            )
          ) : (
            <button type='button' onClick={() => setMode('login')} className='text-blue-600 hover:underline'>Back to login</button>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login
