import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#d7f2ea] flex items-center justify-center p-4 md:p-10 font-sans text-gray-800 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#449382] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-[#6de3ca] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-[#2c6155] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

            {/* Main Glassmorphism Card */}
            <div className="relative bg-white/50 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-[0_20px_60px_rgba(31,56,49,0.15)] w-full max-w-5xl p-10 md:p-16 text-center z-10 transition-transform duration-500 hover:scale-[1.01]">

                <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white border border-white/80 text-sm font-bold text-[#449382] tracking-widest shadow-sm uppercase">
                    HireChance Platform
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
                    Next-Gen Candidate <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#449382] to-[#204a40]">
                        Evaluation Intelligence
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                    Screen, evaluate, and rank candidates with precision using our advanced ATS algorithm. Identify top talent faster and smarter.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <button
                        onClick={() => navigate('/evaluate')}
                        className="group relative px-10 py-4 bg-[#449382] text-white font-bold rounded-full overflow-hidden shadow-[0_10px_20px_rgba(68,147,130,0.3)] hover:shadow-[0_15px_30px_rgba(68,147,130,0.4)] transition-all hover:-translate-y-1 w-full sm:w-auto text-lg"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#387e6f] to-[#255248] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative flex items-center justify-center gap-2">
                            Start Evaluation
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </button>

                    <button className="px-10 py-4 bg-white/70 hover:bg-white text-gray-800 font-bold rounded-full shadow-sm hover:shadow-md transition-all border border-gray-200/50 w-full sm:w-auto text-lg hover:-translate-y-1">
                        View Analytics
                    </button>
                </div>

                {/* Floating Badges */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 px-2 text-left">
                    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm flex flex-col gap-3 hover:-translate-y-2 transition-transform duration-300 cursor-default">
                        <div className="w-12 h-12 rounded-xl bg-[#e5f5f1] flex items-center justify-center text-[#449382]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900">Instant</p>
                            <p className="text-sm text-gray-500 font-medium">Processing</p>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm flex flex-col gap-3 hover:-translate-y-2 transition-transform duration-300 cursor-default">
                        <div className="w-12 h-12 rounded-xl bg-[#e5f5f1] flex items-center justify-center text-[#449382]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900">Accurate</p>
                            <p className="text-sm text-gray-500 font-medium">Scoring System</p>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm flex flex-col gap-3 hover:-translate-y-2 transition-transform duration-300 cursor-default">
                        <div className="w-12 h-12 rounded-xl bg-[#e5f5f1] flex items-center justify-center text-[#449382]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900">Unbiased</p>
                            <p className="text-sm text-gray-500 font-medium">Evaluation process</p>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm flex flex-col gap-3 hover:-translate-y-2 transition-transform duration-300 cursor-default">
                        <div className="w-12 h-12 rounded-xl bg-[#e5f5f1] flex items-center justify-center text-[#449382]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900">Tech First</p>
                            <p className="text-sm text-gray-500 font-medium">Engineering focus</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
