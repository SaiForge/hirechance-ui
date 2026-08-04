import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="flex-grow flex flex-col w-full bg-surface text-on-surface">
            {/* HERO SECTION */}
            <section className="w-full flex flex-col md:flex-row h-auto md:h-[560px] bg-black-forest border-b-2 border-primary">
                {/* LEFT HALF */}
                <div className="w-full md:w-1/2 p-margin-mobile md:p-margin-desktop flex flex-col justify-center border-b-2 md:border-b-0 md:border-r-2 border-primary-container">
                    <span className="text-accent font-label-caps text-label-caps uppercase tracking-[2px] mb-stack-md block">
                        AI-POWERED JOB RECOMMENDER
                    </span>
                    <h1 className="text-cornsilk font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 mb-stack-lg leading-tight">
                        Find Your Ideal Job.
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-stack-md relative">
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className="brutal-button-primary"
                        >
                            Get Recommendations
                        </button>
                        {showMenu && (
                            <div className="absolute top-full mt-2 left-0 flex flex-col gap-3 bg-cornsilk border-2 border-black-forest p-4 z-10 min-w-[240px]" style={{ boxShadow: '4px 4px 0px #606c38' }}>
                                <button 
                                    onClick={() => navigate('/evaluate')}
                                    className="w-full py-2 px-4 uppercase font-bold text-black-forest border-2 border-black-forest hover:bg-black-forest hover:text-cornsilk transition-colors"
                                >
                                    Enter Manually
                                </button>
                                <button 
                                    onClick={() => navigate('/evaluate', { state: { uploadMode: true } })}
                                    className="w-full py-2 px-4 uppercase font-bold text-black-forest border-2 border-black-forest hover:bg-black-forest hover:text-cornsilk transition-colors"
                                >
                                    Upload Resume
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* RIGHT HALF - Geometric Illustration */}
                <div className="w-full md:w-1/2 relative bg-black-forest overflow-hidden min-h-[300px]">
                    {/* Geometric Blocks */}
                    <div className="absolute top-[10%] right-[10%] w-[40%] h-[60%] bg-primary-container border-2 border-accent"></div>
                    <div className="absolute bottom-[15%] left-[20%] w-[50%] h-[30%] bg-accent border-2 border-cornsilk"></div>
                    <div className="absolute top-[30%] left-[10%] w-[20%] h-[20%] bg-transparent border-4 border-primary-container"></div>
                    {/* Large Overlay Text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-cornsilk font-bold text-[120px] md:text-[180px] leading-none opacity-90 tracking-tighter" style={{ textShadow: '4px 4px 0px #606c38' }}>
                            99%
                        </span>
                    </div>
                </div>
            </section>

            {/* STATS STRIP */}
            <section className="w-full bg-accent py-stack-md border-b-2 border-black-forest text-black-forest">
                <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-stack-md md:gap-0 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black-forest">
                    <div className="text-center py-stack-sm md:py-0">
                        <div className="font-h2 text-h2 mb-unit">10,000+</div>
                        <div className="font-label-caps text-label-caps uppercase">Jobs Analyzed</div>
                    </div>
                    <div className="text-center py-stack-sm md:py-0">
                        <div className="font-h2 text-h2 mb-unit">98%</div>
                        <div className="font-label-caps text-label-caps uppercase">Match Accuracy</div>
                    </div>
                    <div className="text-center py-stack-sm md:py-0">
                        <div className="font-h2 text-h2 mb-unit">500+</div>
                        <div className="font-label-caps text-label-caps uppercase">Tech Roles</div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="w-full bg-cornsilk py-margin-desktop border-b-2 border-black-forest flex-grow">
                <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
                    <h2 className="font-h2 text-h2 text-black-forest mb-stack-lg border-b-2 border-primary-container pb-stack-sm inline-block">
                        Evaluation Metrics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                        {/* Card 1 */}
                        <div className="bg-cornsilk brutal-border p-gutter relative">
                            <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-accent"></div>
                            <span className="material-symbols-outlined text-[32px] text-primary-container mb-stack-sm block" data-icon="school">school</span>
                            <h3 className="font-bold text-lg text-black-forest mb-unit uppercase">Academic Profile</h3>
                            <p className="text-on-surface-variant font-body-md">Analyze GPA trends, core subject performance, and institutional standing against historical placement data.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-cornsilk brutal-border p-gutter relative">
                            <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-accent"></div>
                            <span className="material-symbols-outlined text-[32px] text-primary-container mb-stack-sm block" data-icon="psychology">psychology</span>
                            <h3 className="font-bold text-lg text-black-forest mb-unit uppercase">Technical Skills</h3>
                            <p className="text-on-surface-variant font-body-md">Quantify coding proficiency, framework knowledge, and algorithmic problem-solving capabilities.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-cornsilk brutal-border p-gutter relative">
                            <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-accent"></div>
                            <span className="material-symbols-outlined text-[32px] text-primary-container mb-stack-sm block" data-icon="description">description</span>
                            <h3 className="font-bold text-lg text-black-forest mb-unit uppercase">Resume Parsing</h3>
                            <p className="text-on-surface-variant font-body-md">Extract and weight key action verbs, project impacts, and structural formatting scoring.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
