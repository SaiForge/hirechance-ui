import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4 md:p-10 font-sans text-[#1a1a1a] relative overflow-hidden">

            {/* ── Background: dot grid ── */}
            <div
                className="absolute inset-0 bg-grid-drift pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #d0d0d0 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    opacity: 0.7,
                }}
            />

            {/* ── Background: floating dots ── */}
            {[
                { size: 5, top: '18%',  left: '12%',  cls: 'float-dot float-dot-d1' },
                { size: 4, top: '72%',  left: '80%',  cls: 'float-dot float-dot-d2' },
                { size: 6, top: '40%',  left: '90%',  cls: 'float-dot float-dot-d3' },
                { size: 3, top: '85%',  left: '25%',  cls: 'float-dot float-dot-d4' },
                { size: 5, top: '10%',  left: '60%',  cls: 'float-dot float-dot-d5' },
                { size: 4, top: '55%',  left: '5%',   cls: 'float-dot float-dot-d6' },
            ].map((d, i) => (
                <span
                    key={i}
                    className={`absolute rounded-full bg-black pointer-events-none ${d.cls}`}
                    style={{ width: d.size, height: d.size, top: d.top, left: d.left }}
                />
            ))}

            {/* ── Background: scan lines ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="scan-line scan-line-d1 absolute left-0 right-0 h-px bg-black" />
                <div className="scan-line scan-line-d2 absolute left-0 right-0 h-px bg-black" />
            </div>

            {/* ── Main card ── */}
            <div className="relative w-full max-w-4xl p-10 md:p-16 text-center z-10 animate-fade-up">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-sm border border-[#ddd] bg-white text-xs font-semibold text-[#888] tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                    HireChance Platform
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-black mb-6 tracking-tight leading-[1.08]">
                    Next-Gen Candidate<br className="hidden md:block" />
                    <span className="text-[#aaa]"> Evaluation Testing </span>
                </h1>

                <p className="text-base md:text-lg text-[#888] mb-12 max-w-xl mx-auto leading-relaxed">
                    Screen, evaluate, and rank candidates with precision using our advanced ATS algorithm. Identify top talent faster.
                </p>

                {/* CTA row */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <button
                        onClick={() => navigate('/evaluate')}
                        className="group flex items-center gap-2 px-8 py-3.5 bg-black text-white font-bold text-sm rounded-sm hover:bg-[#222] transition-colors w-full sm:w-auto tracking-wide"
                    >
                        Start Evaluation
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    <button className="px-8 py-3.5 border border-[#ddd] text-[#888] font-semibold text-sm rounded-sm hover:border-[#bbb] hover:text-[#555] transition-colors w-full sm:w-auto tracking-wide">
                        View Analytics
                    </button>
                </div>

                {/* Feature grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                    {[
                        { label: 'Instant',    sub: 'Processing',        icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                        { label: 'Accurate',   sub: 'Scoring System',    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                        { label: 'Unbiased',   sub: 'Evaluation',        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                        { label: 'Tech First', sub: 'Engineering focus', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                    ].map(({ label, sub, icon }) => (
                        <div key={label} className="p-4 bg-white border border-[#e8e8e8] rounded-sm flex flex-col gap-3 hover:border-[#ccc] transition-colors cursor-default">
                            <div className="w-9 h-9 rounded-sm bg-[#f5f5f5] border border-[#e0e0e0] flex items-center justify-center text-[#888]">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-black">{label}</p>
                                <p className="text-xs text-[#aaa] mt-0.5">{sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
