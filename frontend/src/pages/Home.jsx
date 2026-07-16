import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex-grow flex flex-col w-full bg-surface text-on-surface">
            {/* HERO SECTION */}
            <section className="w-full flex flex-col md:flex-row h-auto md:h-[560px] bg-black-forest border-b-2 border-primary">
                {/* LEFT HALF */}
                <div className="w-full md:w-1/2 p-margin-mobile md:p-margin-desktop flex flex-col justify-center border-b-2 md:border-b-0 md:border-r-2 border-primary-container">
                    <span className="text-accent font-label-caps text-label-caps uppercase tracking-[2px] mb-stack-md block">
                        AI-POWERED PLACEMENT TOOL
                    </span>
                    <h1 className="text-cornsilk font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 mb-stack-lg leading-tight">
                        Know Your Placement Chances.
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-stack-md">
                        <button 
                            onClick={() => navigate('/evaluate')}
                            className="brutal-button-primary"
                        >
                            Predict Now
                        </button>
                        <button className="brutal-button-secondary">Upload Resume</button>
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
                            78%
                        </span>
                    </div>
                </div>
            </section>

            {/* STATS STRIP */}
            <section className="w-full bg-accent py-stack-md border-b-2 border-black-forest text-black-forest">
                <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-stack-md md:gap-0 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black-forest">
                    <div className="text-center py-stack-sm md:py-0">
                        <div className="font-h2 text-h2 mb-unit">10,000+</div>
                        <div className="font-label-caps text-label-caps uppercase">Students Analyzed</div>
                    </div>
                    <div className="text-center py-stack-sm md:py-0">
                        <div className="font-h2 text-h2 mb-unit">94%</div>
                        <div className="font-label-caps text-label-caps uppercase">Prediction Accuracy</div>
                    </div>
                    <div className="text-center py-stack-sm md:py-0">
                        <div className="font-h2 text-h2 mb-unit">500+</div>
                        <div className="font-label-caps text-label-caps uppercase">Partner Companies</div>
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
