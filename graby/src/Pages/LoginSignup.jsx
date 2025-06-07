import React, { useState, useEffect, useRef } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import ReCAPTCHA from 'react-google-recaptcha';

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const messageTimeout = useRef(null);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (message) {
      messageTimeout.current = setTimeout(() => {
        setMessage('');
      }, 5000);
    }
    return () => clearTimeout(messageTimeout.current);
  }, [message]);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!validateEmail(formData.email)) {
      setMessage('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const token = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();

      if (!token) {
        setMessage('reCAPTCHA verification failed. Please try again.');
        setLoading(false);
        return;
      }

      if (isForgot) {
        await sendPasswordResetEmail(auth, formData.email);
        setMessage('Password reset email sent! Check inbox/spam.');
        setIsForgot(false);
        setLoading(false);
        return;
      }

      if (!isLogin) {
        if (!formData.name.trim()) {
          setMessage('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (!validatePassword(formData.password)) {
          setMessage(
            'Password must be at least 6 characters long and contain at least one letter and one number.'
          );
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match.');
          setLoading(false);
          return;
        }
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        setMessage('Login successful!');
        navigate('/profile');
      } else {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        setMessage('Signup successful! Redirecting to login...');
        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setMessage('Google sign-in successful!');
      navigate('/profile');
    } catch (err) {
      setMessage('Google Sign-In failed: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-8">
          {isForgot ? 'Forgot Password' : isLogin ? 'Login' : 'Signup'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {!isLogin && !isForgot && (
            <div>
              <label htmlFor="name" className="block mb-2 font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            />
          </div>

          {!isForgot && (
            <>
              <div className="relative">
                <label htmlFor="password" className="block mb-2 font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((show) => !show)}
                  className="absolute right-3 top-[38px] text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                </button>
              </div>

              {!isLogin && (
                <div className="relative mt-4">
                  <label htmlFor="confirmPassword" className="block mb-2 font-medium">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((show) => !show)}
                    className="absolute right-3 top-[38px] text-gray-600"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                  </button>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-600 mt-1 text-sm">
                      Passwords do not match.
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LfRmFgrAAAAAEL33aeZ7YwXCVTpJa4Qy2UzMzYM"
            size="invisible"
            badge="bottomright"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:text-[#cccccc] flex justify-center items-center"
          >
            {loading ? (
              <svg
                className="animate-spin mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : null}
            {isForgot
              ? 'Reset Password'
              : isLogin
              ? 'Login'
              : 'Signup'}
          </button>
        </form>

        <div className="text-center my-6 text-gray-500 font-semibold">OR</div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full border border-gray-300 rounded py-2 flex justify-center items-center gap-2 hover:bg-gray-100"
        >
          <FcGoogle size={24} />
          {loading ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            'Sign in with Google'
          )}
        </button>

        <div className="mt-10 space-y-4 text-sm text-center">
          <div>
            {!isForgot ? (
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setIsForgot(true);
                  setMessage('');
                }}
              >
                Forgot Password?
              </button>
            ) : (
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setIsForgot(false);
                  setMessage('');
                }}
              >
                Back to Login
              </button>
            )}
          </div>
          <div>
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => {
                setIsLogin(!isLogin);
                setIsForgot(false);
                setMessage('');
              }}
            >
              {isLogin ? "Don't have an account? Signup" : 'Already have an account? Login'}
            </button>
          </div>
        </div>

        {message && (
          <p
            className={`text-center mt-6 text-sm ${
              message.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'
            }`}
            role="alert"
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
