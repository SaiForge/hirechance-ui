import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { API_ENDPOINTS } from '../config/api';

export default function Register() {
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
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
            const response = await fetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Registration failed');
            }

            // Immediately login after registration
            const formDataObj = new URLSearchParams();
            formDataObj.append('username', formData.email);
            formDataObj.append('password', formData.password);

            const loginRes = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formDataObj.toString()
            });

            if (loginRes.ok) {
                const data = await loginRes.json();
                localStorage.setItem('token', data.access_token);
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-margin-mobile">
            <div className="w-full max-w-md bg-cornsilk border-2 border-black-forest rounded p-stack-lg animate-fade-in relative">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-accent rounded-l"></div>
                
                <h2 className="font-h2 text-3xl mb-2 text-black-forest">Create Account</h2>
                <p className="text-on-surface-variant mb-stack-lg font-body-md">Join us to predict your placements.</p>

                {error && (
                    <div className="bg-error-container text-on-error-container p-3 mb-4 rounded border-2 border-error font-bold text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm uppercase">Full Name</label>
                        <input 
                            type="text" 
                            name="full_name" 
                            required 
                            className="brutal-border rounded p-3 bg-transparent brutal-input" 
                            value={formData.full_name} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm uppercase">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            required 
                            className="brutal-border rounded p-3 bg-transparent brutal-input" 
                            value={formData.email} 
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
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-stack-md text-center">
                    <p className="text-sm font-bold text-on-surface-variant">
                        Already have an account? <Link to="/login" className="text-secondary hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
