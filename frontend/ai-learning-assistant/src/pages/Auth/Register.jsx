import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { BrainCircuit, Mail, Lock, ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';
import PageTransition from '../../components/common/PageTransition';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            const msg = 'Password must be at least 6 characters long.';
            setError(msg);
            toast.error(msg);
            return;
        }

        setLoading(true);

        try {
            await authService.register(username, email, password);
            toast.success('Registered successfully! Please login.');
            navigate('/login');
        } catch (err) {
            const message =
                err.message || 'Failed to register. Please try again.';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>

            
        
        <div className="min-h-screen flex items-center justify-center  px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-green-700 p-3 rounded-full mb-3">
                        <BrainCircuit className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Create Account
                    </h1>
                    <p className="text-sm text-gray-700">
                        Start your learning journey today
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div className="relative">
                        <User
                            className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                                focusedField === 'username'
                                    ? 'text-green-700'
                                    : 'text-gray-400'
                            }`}
                        />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Username"
                            required
                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 transition"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail
                            className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                                focusedField === 'email'
                                    ? 'text-green-700'
                                    : 'text-gray-400'
                            }`}
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Email address"
                            required
                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 transition"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock
                            className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                                focusedField === 'password'
                                    ? 'text-green-700'
                                    : 'text-gray-400'
                            }`}
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Password"
                            required
                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 transition"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-70"
                    >
                        {loading ? 'Creating account...' : 'Register'}
                        {!loading && <ArrowRight className="h-4 w-4" />}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-700 mt-6">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-green-700 font-medium hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
        </PageTransition>
    );
};

export default Register;
