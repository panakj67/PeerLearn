import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios'
import { hideLogin, setLoading, setUser } from '../features/users/userSlice';

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const Login = () => {
    const [mode, setMode] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [resetToken, setResetToken] = React.useState("");
    const dispatch = useDispatch()
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

  return (
    <div onClick={() => dispatch(hideLogin())} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
        <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-10 sm:w-[420px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-blue-600 font-semibold">User</span> {mode === "register" ? "Sign Up" : mode === 'verifyOtp' ? 'Verify OTP' : mode === 'forgot' ? 'Forgot Password' : mode === 'reset' ? 'Reset Password' : 'Login'}
            </p>

            {mode === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-600" type="text" required />
                </div>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'verifyOtp' || mode === 'forgot') && (
              <div className="w-full">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-600" type="email" required />
              </div>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'reset') && (
              <div className="w-full">
                <p>{mode === 'reset' ? 'New Password' : 'Password'}</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-600" type="password" required />
                {(mode === 'register' || mode === 'reset') && <p className='text-[11px] text-gray-500 mt-1'>8+ chars with uppercase, lowercase, number and special character.</p>}
              </div>
            )}

            {mode === 'verifyOtp' && (
              <div className='w-full'>
                <p>OTP</p>
                <input onChange={(e) => setOtp(e.target.value)} value={otp} className='border border-gray-200 rounded w-full p-2 mt-1 outline-blue-600' type='text' maxLength={6} required />
                <button type='button' onClick={() => authHandler('/api/user/resend-email-otp', { email })} className='text-blue-600 text-xs mt-1'>Resend OTP</button>
              </div>
            )}

            {mode === 'reset' && (
              <div className='w-full'>
                <p>Reset Token</p>
                <input onChange={(e) => setResetToken(e.target.value)} value={resetToken} className='border border-gray-200 rounded w-full p-2 mt-1 outline-blue-600' type='text' required />
              </div>
            )}

            <button className="bg-blue-600 hover:bg-blue-700 transition-all text-white text-lg w-full py-2 rounded-md cursor-pointer">
              {mode === 'register' ? 'Create Account' : mode === 'verifyOtp' ? 'Verify OTP' : mode === 'forgot' ? 'Send Reset Email' : mode === 'reset' ? 'Reset Password' : 'Login'}
            </button>

            <div className='w-full text-xs space-y-1'>
              {mode !== 'login' && <button type='button' onClick={() => setMode('login')} className='text-blue-600'>Back to login</button>}
              {mode === 'login' && <button type='button' onClick={() => setMode('register')} className='text-blue-600'>Create an account</button>}
              {mode === 'login' && <button type='button' onClick={() => setMode('forgot')} className='text-blue-600 ml-3'>Forgot password?</button>}
              {mode === 'forgot' && <button type='button' onClick={() => setMode('reset')} className='text-blue-600'>Have reset token? reset password</button>}
            </div>

            {(mode === 'login' || mode === 'register') && (
              <>
                <div className='w-full flex items-center gap-2 my-1'>
                  <div className='h-[1px] bg-gray-300 flex-1'></div>
                  <span className='text-xs text-gray-500'>OR</span>
                  <div className='h-[1px] bg-gray-300 flex-1'></div>
                </div>

                {googleClientId ? (
                  <div ref={googleButtonRef} className='w-full flex justify-center min-h-10' />
                ) : (
                  <p className='text-xs text-amber-600 w-full text-center'>Google login disabled (missing <code>VITE_GOOGLE_CLIENT_ID</code>).</p>
                )}
              </>
            )}
        </form>
    </div>
  )
}

export default Login
