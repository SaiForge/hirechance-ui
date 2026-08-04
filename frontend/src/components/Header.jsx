import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();

    return (
        <header className="bg-primary-container border-b-2 border-primary sticky top-0 h-[64px] flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop z-50 shrink-0">
            <Link to="/" className="font-h2 text-h2 font-bold text-surface-bright uppercase">
                HireChance
            </Link>

            <div className="flex items-center gap-4 text-surface-bright">
                {localStorage.getItem('token') ? (
                    <button 
                        onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} 
                        className="text-surface-bright uppercase font-bold text-sm hover:text-secondary-container transition-colors"
                    >
                        Logout
                    </button>
                ) : (
                    <Link to="/login" className="text-surface-bright uppercase font-bold text-sm hover:text-secondary-container transition-colors">
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
}
