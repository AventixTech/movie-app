import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, registerUser, user } = useContext(AuthContext);

  const [mode, setMode] = useState('login'); 
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error || success) {
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validate form
    if (mode === 'register') {
      if (!form.name.trim()) return setError('Name is required');
      if (form.password !== form.confirmPassword) return setError('Passwords do not match');
      if (form.password.length < 6) return setError('Password must be at least 6 characters');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if ((mode === 'login' || mode === 'register') && !emailRegex.test(form.email)) {
      setIsLoading(false);
      return setError('Please enter a valid email address');
    }

    try {
      if (mode === 'register') {
        await registerUser(form.name, form.email, form.password);
        setSuccess('Registration successful! You can now log in.');
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
        setMode('login');
      } else if (mode === 'login') {
        await loginUser(form.email, form.password);
        setSuccess('Login successful!');
        navigate('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!resetEmail) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }

    try {
      // const res = await fetch('/api/auth/forgot-password', {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', { 

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setSuccess('Password reset link sent! Check your email.');
      setResetEmail('');
      setMode('login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    if (newMode === 'forgot') setResetEmail(form.email); // pre-fill reset email
    if (newMode !== 'forgot') setForm(prev => ({ ...prev, confirmPassword: '' }));
  };

  return (
    <div className="login-container">
      <h2>
        {mode === 'register' ? 'Register' : mode === 'forgot' ? 'Forgot Password' : 'Login'}
      </h2>

      {mode !== 'forgot' && (
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            minLength={6}
          />

          {mode === 'register' && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          )}

          <button type="submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
            {isLoading
              ? 'Processing...'
              : mode === 'register'
              ? 'Register'
              : 'Login'}
          </button>
        </form>
      )}

      {mode === 'forgot' && (
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            name="resetEmail"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <button
            type="button"
            onClick={() => switchMode('login')}
            disabled={isLoading}
            style={{ marginLeft: '0.5rem' }}
          >
            Cancel
          </button>
        </form>
      )}

      {mode !== 'forgot' && (
        <>
          <button
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            disabled={isLoading}
            style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
          >
            {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>

          <button
            onClick={() => switchMode('forgot')}
            disabled={isLoading}
            style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
          >
            Forgot Password?
          </button>
        </>
      )}

      {error && (
        <div style={{ color: 'red', marginTop: '1rem', padding: '0.5rem', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ color: 'green', marginTop: '1rem', padding: '0.5rem', border: '1px solid green', borderRadius: '4px' }}>
          {success}
        </div>
      )}
    </div>
  );
};

export default Login;
