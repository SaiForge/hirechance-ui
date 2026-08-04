import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const token = localStorage.getItem('token');

    return (
        <header className="bg-primary-container border-b-2 border-primary sticky top-0 h-[64px] flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop z-50 shrink-0">
            <Link to="/" className="font-h2 text-h2 font-bold text-surface-bright uppercase tracking-wider">
                HireChance
            </Link>

            <nav className="flex items-center gap-4 sm:gap-6 text-surface-bright">
                <Link 
                    to="/" 
                    className={`uppercase font-bold text-sm transition-colors ${
                        location.pathname === '/' ? 'text-accent underline underline-offset-4 font-black' : 'hover:text-secondary-container'
                    }`}
                >
                    Home
                </Link>

                {token ? (
                    <>
                        <Link 
                            to="/evaluate" 
                            className={`uppercase font-bold text-sm transition-colors ${
                                location.pathname === '/evaluate' ? 'text-accent underline underline-offset-4 font-black' : 'hover:text-secondary-container'
                            }`}
                        >
                            Evaluate
                        </Link>
                        <Link 
                            to="/dashboard" 
                            className={`uppercase font-bold text-sm transition-colors ${
                                location.pathname === '/dashboard' ? 'text-accent underline underline-offset-4 font-black' : 'hover:text-secondary-container'
                            }`}
                        >
                            Dashboard
                        </Link>
                        <button 
                            onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} 
                            className="text-surface-bright uppercase font-bold text-sm hover:text-secondary-container transition-colors cursor-pointer"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link 
                            to="/login" 
                            className={`uppercase font-bold text-sm transition-colors ${
                                location.pathname === '/login' ? 'text-accent underline underline-offset-4 font-black' : 'hover:text-secondary-container'
                            }`}
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className={`uppercase font-bold text-sm transition-colors ${
                                location.pathname === '/register' ? 'text-accent underline underline-offset-4 font-black' : 'hover:text-secondary-container'
                            }`}
                        >
                            Register
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
