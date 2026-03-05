import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES = ['AI Engineer', 'MLOps Engineer', 'LLM Engineer', 'Data Engineer', 'Data Scientist', 'Data Analyst', 'Software Engineer'];

const DEGREES = ['B.Tech', 'B.E.', 'B.Sc', 'BCA', 'M.Tech', 'M.Sc', 'MCA', 'Other'];
const BRANCHES = ['CSE', 'IT', 'ECE', 'Mechanical', 'Other'];
const TIERS = [{ value: 1, label: 'Tier 1' }, { value: 2, label: 'Tier 2' }, { value: 3, label: 'Tier 3' }, { value: 4, label: 'Tier 4' }];
const GRAD_YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

export default function Evaluate() {
    const navigate = useNavigate();
    const API_URL = "http://localhost:8000/predict";

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [currentStep, setCurrentStep] = useState(1);
    const APP_STEPS = [
        { id: 1, title: 'Personal Details' },
        { id: 2, title: 'Education' },
        { id: 3, title: 'Experience' },
        { id: 4, title: 'Projects' },
        { id: 5, title: 'Achievements' },
    ];

    const [formData, setFormData] = useState({
        name: "Aryan Sharma", target_role: "MLOps Engineer", total_experience_months: 9,
        skills: "python, docker, kubernetes, aws", certifications: "AWS Cloud Practitioner",
        coding_rating: 1650, leetcode_solved: 220, open_source_contributions: 4, github_stars: 35,
        hackathons_participated: 3, hackathons_won: 1, publications: 1, online_presence_score: 7,
        has_portfolio_site: true, has_video_resume: false
    });

    const [education, setEducation] = useState({
        degree: "B.Tech", branch: "CSE", institute_tier: 2, cgpa: 8.5, graduation_year: 2024, backlogs: 0
    });

    const [softSkills, setSoftSkills] = useState({
        communication: 4, teamwork: 4, problem_solving: 5, leadership: 3, adaptability: 4
    });

    const [experience, setExperience] = useState([
        { company: 'TechCorp', role: 'Intern', duration_months: 6, is_relevant: 'true', tech_used: 'python, docker' }
    ]);

    const [projects, setProjects] = useState([
        { title: 'ML Pipeline', project_type: 'Cloud', tech_stack: 'python', description: 'MLOps', github_link: 'link', team_size: 2, duration_weeks: 10, is_open_source: 'true', production_deployed: 'true' }
    ]);

    const handleFormChange = (e) => {
        const { name, type, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleEduChange = (e) => {
        const { name, type, value } = e.target;
        setEducation(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const addExp = () => setExperience(prev => [...prev, { company: '', role: '', duration_months: 3, is_relevant: 'true', tech_used: '' }]);
    const removeExp = (i) => setExperience(prev => prev.filter((_, idx) => idx !== i));
    const handleExpChange = (i, field, value) => setExperience(prev => { const a = [...prev]; a[i] = { ...a[i], [field]: value }; return a; });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        const payload = {
            ...formData,
            internships: experience.length,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            certifications: formData.certifications.split(',').map(s => s.trim()).filter(Boolean),
            education: { ...education, institute_tier: Number(education.institute_tier) },
            soft_skills: softSkills,
            work_experience: experience.map(exp => ({
                ...exp,
                is_relevant: exp.is_relevant === 'true', duration_months: Number(exp.duration_months),
                tech_used: exp.tech_used.split(',').map(s => s.trim()).filter(Boolean)
            })),
            projects: projects.map(p => ({
                ...p,
                team_size: Number(p.team_size), duration_weeks: Number(p.duration_weeks),
                is_open_source: p.is_open_source === 'true', production_deployed: p.production_deployed === 'true',
                tech_stack: p.tech_stack.split(',').map(s => s.trim()).filter(Boolean)
            })),
        };

        try {
            const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            alert('Error connecting to backend.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-6">YOUR PERSONAL DETAILS</h3>

                            <div className="mb-6">
                                <label className="block text-[13px] font-medium text-[#449382] bg-white absolute mt-[-8px] ml-3 px-1">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full rounded border border-[#449382] outline-none py-3 px-4 text-[14px] text-gray-800 focus:ring-1 focus:ring-[#449382]" />
                                <p className="text-[11px] text-gray-400 mt-1 ml-1">Must match legal documents.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input type="text" placeholder="First Name" className="w-full rounded border border-gray-200 outline-none py-3 px-4 text-[14px] text-gray-800 focus:border-[#449382] transition-colors" />
                                </div>
                                <div>
                                    <input type="text" placeholder="Last Name" className="w-full rounded border border-gray-200 outline-none py-3 px-4 text-[14px] text-gray-800 focus:border-[#449382] transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-4">TARGET ROLE</h3>
                            <select name="target_role" value={formData.target_role} onChange={handleFormChange} className="w-full rounded border border-gray-200 outline-none py-3 px-4 text-[14px] text-gray-800 focus:border-[#449382] transition-colors appearance-none bg-white">
                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-4">EXPERIENCE & PRESENCE</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" name="total_experience_months" value={formData.total_experience_months} onChange={handleFormChange} placeholder="Months of Exp" className="w-full rounded border border-gray-200 outline-none py-3 px-4 text-[14px] text-gray-800 focus:border-[#449382] transition-colors" />
                                <input type="number" name="online_presence_score" value={formData.online_presence_score} onChange={handleFormChange} placeholder="Presence Score (0-10)" className="w-full rounded border border-gray-200 outline-none py-3 px-4 text-[14px] text-gray-800 focus:border-[#449382] transition-colors" />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-6">EDUCATION DETAILS</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <select name="degree" value={education.degree} onChange={handleEduChange} className="w-full rounded border border-gray-200 py-3 px-4 text-[14px] outline-none">
                                    {DEGREES.map(d => <option key={d}>{d}</option>)}
                                </select>
                                <select name="branch" value={education.branch} onChange={handleEduChange} className="w-full rounded border border-gray-200 py-3 px-4 text-[14px] outline-none">
                                    {BRANCHES.map(b => <option key={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" name="cgpa" step="0.1" value={education.cgpa} onChange={handleEduChange} placeholder="CGPA" className="w-full rounded border border-gray-200 outline-none py-3 px-4 text-[14px]" />
                                <select name="graduation_year" value={education.graduation_year} onChange={handleEduChange} className="w-full rounded border border-gray-200 py-3 px-4 text-[14px] outline-none">
                                    {GRAD_YEARS.map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 3:
            case 4:
            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-6">ADDITIONAL DATA</h3>
                        <p className="text-sm text-gray-500">Provide remaining data to finalize evaluation...</p>
                        <textarea name="skills" value={formData.skills} onChange={handleFormChange} rows="3" placeholder="Skills (comma separated)" className="w-full rounded border border-gray-200 outline-none py-3 px-4 text-[14px]" />
                        <input type="number" name="coding_rating" value={formData.coding_rating} onChange={handleFormChange} placeholder="Coding Rating" className="w-full rounded border border-gray-200 outline-none py-3 px-4 text-[14px]" />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#d7f2ea] flex items-center justify-center p-4 md:p-10 font-sans text-gray-800">
            <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-5xl h-[80vh] min-h-[600px] flex overflow-hidden">

                {/* Sidebar */}
                <div className="w-[300px] bg-[#f4fbfa] p-10 flex flex-col relative flex-shrink-0">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-[#449382] transition-colors mb-6 group w-fit"
                    >
                        <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>

                    <div className="text-[28px] font-light text-[#449382] mb-6 tracking-wide select-none cursor-default">
                        DNB
                    </div>
                    <h2 className="text-[20px] font-bold text-gray-900 mb-10">Evaluate candidate</h2>

                    <div className="flex flex-col relative space-y-7 flex-1">
                        <div className="absolute left-[15px] top-[15px] bottom-[30px] w-0.5 bg-gray-200 z-0 content-['']"></div>

                        {APP_STEPS.map((step) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;
                            return (
                                <div key={step.id} className="flex items-center gap-5 relative z-10 cursor-pointer" onClick={() => !loading && !result && setCurrentStep(step.id)}>
                                    <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                    ${isCompleted || isActive ? 'bg-[#449382] text-white' : 'bg-[#e5ebe9] text-gray-400'}`}>
                                        {isCompleted ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        ) : isActive ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        ) : step.id}
                                    </div>
                                    <span className={`text-[14px] font-semibold transition-colors duration-300 ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white p-10 flex flex-col overflow-hidden relative">

                    {loading || result ? (
                        <div className="flex-1 overflow-y-auto">
                            {loading && <div className="h-full flex items-center justify-center text-[#449382] font-semibold animate-pulse">Evaluating Profile...</div>}
                            {result && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">Evaluation Results</h2>
                                    <div className="bg-[#f4fbfa] rounded-lg p-5 border border-[#449382]/20">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Grade</p>
                                        <p className="text-4xl font-black text-[#449382]">{result.ats_grade}</p>
                                        <p className="text-lg font-bold text-gray-800 mt-2">Score: {result.ats_score}/100</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto pr-4 flex flex-col" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            <div className="flex-1">
                                {renderStepContent()}
                            </div>

                            {/* Navigation Footer */}
                            <div className="border-t-2 border-gray-100 pt-6 flex justify-end items-center mt-6">
                                {currentStep < 5 ? (
                                    <button type="button" onClick={() => setCurrentStep(prev => prev + 1)} className="bg-[#449382] hover:bg-[#347668] text-white px-8 py-3 rounded-full text-[14px] font-medium transition-colors">
                                        Next
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleSubmit} className="bg-[#449382] hover:bg-[#347668] text-white px-8 py-3 rounded-full text-[14px] font-medium transition-colors shadow-lg">
                                        Evaluate
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
