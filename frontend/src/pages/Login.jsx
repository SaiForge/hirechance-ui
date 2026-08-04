import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { API_ENDPOINTS } from '../config/api';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formDataObj = new URLSearchParams();
            formDataObj.append('username', formData.username);
            formDataObj.append('password', formData.password);

            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formDataObj.toString()
            });

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            navigate('/evaluate'); // Or dashboard if you prefer
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-margin-mobile">
            <div className="w-full max-w-md bg-cornsilk border-2 border-black-forest rounded p-stack-lg animate-fade-in relative">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary rounded-l"></div>
                
                <h2 className="font-h2 text-3xl mb-2 text-black-forest">Welcome Back</h2>
                <p className="text-on-surface-variant mb-stack-lg font-body-md">Sign in to continue your prediction.</p>

                {error && (
                    <div className="bg-error-container text-on-error-container p-3 mb-4 rounded border-2 border-error font-bold text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm uppercase">Email (Username)</label>
                        <input 
                            type="email" 
                            name="username" 
                            required 
                            className="brutal-border rounded p-3 bg-transparent brutal-input" 
                            value={formData.username} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm uppercase">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            required 
                            className="brutal-border rounded p-3 bg-transparent brutal-input" 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="brutal-button-primary mt-4 w-full"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-stack-md text-center">
                    <p className="text-sm font-bold text-on-surface-variant">
                        Don't have an account? <Link to="/register" className="text-secondary hover:underline">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
