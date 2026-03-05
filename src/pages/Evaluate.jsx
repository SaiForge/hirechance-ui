import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES = ['AI Engineer', 'MLOps Engineer', 'LLM Engineer', 'Data Engineer', 'Data Scientist', 'Data Analyst', 'Software Engineer'];

const DEGREES = ['B.Tech', 'B.E.', 'B.Sc', 'BCA', 'M.Tech', 'M.Sc', 'MCA', 'Other'];
const BRANCHES = ['CSE', 'IT', 'ECE', 'Mechanical', 'Other'];
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
        const { name, type, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const handleEduChange = (e) => {
        const { name, type, value } = e.target;
        setEducation(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const addExp = () => setExperience(prev => [...prev, { company: '', role: '', duration_months: 3, is_relevant: 'true', tech_used: '' }]);
    const removeExp = (i) => setExperience(prev => prev.filter((_, idx) => idx !== i));
    const handleExpChange = (i, field, value) => {
        setExperience(prev => {
            const a = [...prev];
            a[i] = { ...a[i], [field]: value };
            return a;
        });
    };

    const addProject = () => setProjects(prev => [...prev, { title: '', project_type: '', tech_stack: '', description: '', github_link: '', team_size: 1, duration_weeks: 4, is_open_source: 'false', production_deployed: 'false' }]);
    const removeProject = (i) => setProjects(prev => prev.filter((_, idx) => idx !== i));
    const handleProjectChange = (i, field, value) => {
        setProjects(prev => {
            const a = [...prev];
            a[i] = { ...a[i], [field]: value };
            return a;
        });
    };

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
                is_relevant: exp.is_relevant === 'true' || exp.is_relevant === true, duration_months: Number(exp.duration_months),
                tech_used: exp.tech_used.split(',').map(s => s.trim()).filter(Boolean)
            })),
            projects: projects.map(p => ({
                ...p,
                team_size: Number(p.team_size), duration_weeks: Number(p.duration_weeks),
                is_open_source: p.is_open_source === 'true' || p.is_open_source === true, production_deployed: p.production_deployed === 'true' || p.production_deployed === true,
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

    const inputClass = "w-full rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm outline-none py-3 px-4 text-[14px] text-gray-800 focus:bg-white/80 focus:border-[#449382] transition-all shadow-sm";
    const labelClass = "block text-[12px] font-bold text-[#449382] uppercase tracking-wider mb-2 ml-1";
    const headerClass = "text-[14px] font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2";
    const headerIconClass = "w-8 h-8 rounded-lg bg-[#449382]/10 flex items-center justify-center text-[#449382]";

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h3 className={headerClass}>
                                <span className={headerIconClass}>1</span>
                                Personal Details
                            </h3>

                            <div className="mb-6">
                                <label className={labelClass}>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleFormChange} className={inputClass} />
                                <p className="text-[11px] text-[#449382]/80 mt-2 ml-2 font-semibold">Must match legal documents.</p>
                            </div>

                            <div className="pt-4">
                                <label className={labelClass}>Target Role</label>
                                <select name="target_role" value={formData.target_role} onChange={handleFormChange} className={inputClass}>
                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div className="pt-4">
                                <label className={labelClass}>Experience & Presence</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-xs text-[#449382]/80 mb-1 block font-semibold ml-1">Total Exp (Months)</span>
                                        <input type="number" name="total_experience_months" value={formData.total_experience_months} onChange={handleFormChange} placeholder="Months of Exp" className={inputClass} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-[#449382]/80 mb-1 block font-semibold ml-1">Presence Score (0-10)</span>
                                        <input type="number" name="online_presence_score" value={formData.online_presence_score} onChange={handleFormChange} placeholder="Score" className={inputClass} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h3 className={headerClass}>
                                <span className={headerIconClass}>2</span>
                                Education Details
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className={labelClass}>Degree</label>
                                    <select name="degree" value={education.degree} onChange={handleEduChange} className={inputClass}>
                                        {DEGREES.map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Branch</label>
                                    <select name="branch" value={education.branch} onChange={handleEduChange} className={inputClass}>
                                        {BRANCHES.map(b => <option key={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className={labelClass}>Institute Tier (1-4)</label>
                                    <input type="number" name="institute_tier" value={education.institute_tier} onChange={handleEduChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>CGPA</label>
                                    <input type="number" name="cgpa" step="0.1" value={education.cgpa} onChange={handleEduChange} placeholder="CGPA" className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Graduation Year</label>
                                    <select name="graduation_year" value={education.graduation_year} onChange={handleEduChange} className={inputClass}>
                                        {GRAD_YEARS.map(y => <option key={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Backlogs</label>
                                    <input type="number" name="backlogs" value={education.backlogs} onChange={handleEduChange} className={inputClass} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className={headerClass}>
                            <span className={headerIconClass}>3</span>
                            Experience
                        </h3>

                        {experience.map((exp, i) => (
                            <div key={i} className="p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm relative group">
                                {experience.length > 1 && (
                                    <button onClick={() => removeExp(i)} className="absolute top-4 right-4 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 rounded-full p-1 border border-white/80">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                )}
                                <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                                    <div>
                                        <label className={labelClass}>Company</label>
                                        <input type="text" value={exp.company} onChange={(e) => handleExpChange(i, 'company', e.target.value)} className={inputClass} placeholder="Company Name" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Role</label>
                                        <input type="text" value={exp.role} onChange={(e) => handleExpChange(i, 'role', e.target.value)} className={inputClass} placeholder="Role" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className={labelClass}>Duration (Months)</label>
                                        <input type="number" value={exp.duration_months} onChange={(e) => handleExpChange(i, 'duration_months', e.target.value)} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Relevant Experience</label>
                                        <select value={exp.is_relevant} onChange={(e) => handleExpChange(i, 'is_relevant', e.target.value)} className={inputClass}>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Tech Used (comma separated)</label>
                                    <input type="text" value={exp.tech_used} onChange={(e) => handleExpChange(i, 'tech_used', e.target.value)} className={inputClass} placeholder="React, Node.js..." />
                                </div>
                            </div>
                        ))}

                        <button onClick={addExp} type="button" className="flex items-center justify-center w-full py-3 bg-white/40 border border-white/60 shadow-sm text-[#449382] font-semibold rounded-xl hover:bg-white/60 hover:-translate-y-0.5 transition-all">
                            + Add Experience
                        </button>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className={headerClass}>
                            <span className={headerIconClass}>4</span>
                            Projects
                        </h3>

                        {projects.map((proj, i) => (
                            <div key={i} className="p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm relative group">
                                {projects.length > 1 && (
                                    <button onClick={() => removeProject(i)} className="absolute top-4 right-4 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 rounded-full p-1 border border-white/80">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                )}
                                <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                                    <div>
                                        <label className={labelClass}>Project Title</label>
                                        <input type="text" value={proj.title} onChange={(e) => handleProjectChange(i, 'title', e.target.value)} className={inputClass} placeholder="Title" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Project Type</label>
                                        <input type="text" value={proj.project_type} onChange={(e) => handleProjectChange(i, 'project_type', e.target.value)} className={inputClass} placeholder="e.g. Web, ML" />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className={labelClass}>Tech Stack (comma separated)</label>
                                    <input type="text" value={proj.tech_stack} onChange={(e) => handleProjectChange(i, 'tech_stack', e.target.value)} className={inputClass} placeholder="Tech Stack" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className={labelClass}>Duration (Weeks)</label>
                                        <input type="number" value={proj.duration_weeks} onChange={(e) => handleProjectChange(i, 'duration_weeks', e.target.value)} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Team Size</label>
                                        <input type="number" value={proj.team_size} onChange={(e) => handleProjectChange(i, 'team_size', e.target.value)} className={inputClass} />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button onClick={addProject} type="button" className="flex items-center justify-center w-full py-3 bg-white/40 border border-white/60 shadow-sm text-[#449382] font-semibold rounded-xl hover:bg-white/60 hover:-translate-y-0.5 transition-all">
                            + Add Project
                        </button>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className={headerClass}>
                            <span className={headerIconClass}>5</span>
                            Achievements & Additional
                        </h3>

                        <div>
                            <label className={labelClass}>Skills (comma separated)</label>
                            <textarea name="skills" value={formData.skills} onChange={handleFormChange} rows="2" className={inputClass} placeholder="e.g. Python, React" />
                        </div>

                        <div className="pt-2">
                            <label className={labelClass}>Certifications (comma separated)</label>
                            <textarea name="certifications" value={formData.certifications} onChange={handleFormChange} rows="2" className={inputClass} placeholder="e.g. AWS Certified" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className={labelClass}>Coding Rating</label>
                                <input type="number" name="coding_rating" value={formData.coding_rating} onChange={handleFormChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Leetcode Solved</label>
                                <input type="number" name="leetcode_solved" value={formData.leetcode_solved} onChange={handleFormChange} className={inputClass} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className={labelClass}>Open Source PRs</label>
                                <input type="number" name="open_source_contributions" value={formData.open_source_contributions} onChange={handleFormChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>GitHub Stars</label>
                                <input type="number" name="github_stars" value={formData.github_stars} onChange={handleFormChange} className={inputClass} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className={labelClass}>Hackathons Won / Part.</label>
                                <div className="flex gap-2">
                                    <input type="number" name="hackathons_won" value={formData.hackathons_won} onChange={handleFormChange} className={inputClass} placeholder="Won" />
                                    <input type="number" name="hackathons_participated" value={formData.hackathons_participated} onChange={handleFormChange} className={inputClass} placeholder="Part" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Publications</label>
                                <input type="number" name="publications" value={formData.publications} onChange={handleFormChange} className={inputClass} />
                            </div>
                        </div>

                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#d7f2ea] flex items-center justify-center p-4 md:p-10 font-sans text-gray-800 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#449382] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-[#6de3ca] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-[#2c6155] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

            {/* Main Glassmorphism Card */}
            <div className="relative bg-white/50 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-[0_20px_60px_rgba(31,56,49,0.15)] w-full max-w-5xl h-[85vh] min-h-[600px] flex overflow-hidden z-10 transition-transform duration-500">

                {/* Sidebar */}
                <div className="w-[300px] bg-white/40 border-r border-white/50 p-8 flex flex-col relative flex-shrink-0 backdrop-blur-md">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-sm font-bold text-[#449382]/70 hover:text-[#449382] transition-colors mb-8 group w-fit"
                    >
                        <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>

                    <div className="text-[26px] font-black text-[#449382] mb-6 tracking-wide select-none cursor-default bg-white/60 px-4 py-2 rounded-xl inline-block w-fit shadow-sm border border-white/80">
                        HireChance
                    </div>
                    <h2 className="text-[18px] font-bold text-gray-900 mb-8 ml-1">Evaluate Candidate</h2>

                    <div className="flex flex-col relative space-y-6 flex-1 px-1">
                        <div className="absolute left-[20px] top-[15px] bottom-[30px] w-0.5 bg-white/60 z-0 content-['']"></div>

                        {APP_STEPS.map((step) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;
                            return (
                                <div key={step.id} className="flex items-center gap-4 relative z-10 cursor-pointer group" onClick={() => !loading && !result && setCurrentStep(step.id)}>
                                    <div className={`w-[36px] h-[36px] rounded-xl flex items-center justify-center text-[13px] font-bold transition-all duration-300 shadow-sm
                    ${isCompleted || isActive ? 'bg-[#449382] text-white' : 'bg-white/80 backdrop-blur-sm text-gray-400 border border-white/90 group-hover:bg-white'}
                    ${isActive ? 'scale-110 shadow-md ring-4 ring-[#449382]/20' : ''}`}>
                                        {isCompleted ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        ) : isActive ? (
                                            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-inner"></div>
                                        ) : step.id}
                                    </div>
                                    <span className={`text-[13px] font-black transition-colors duration-300 tracking-wide ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500/80 group-hover:text-gray-700'}`}>
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-transparent p-8 md:p-10 flex flex-col overflow-hidden relative">

                    {loading || result ? (
                        <div className="flex-1 overflow-y-auto animate-fade-in flex flex-col">
                            {loading && (
                                <div className="h-full flex flex-col items-center justify-center space-y-4">
                                    <div className="w-16 h-16 border-4 border-[#449382]/20 border-t-[#449382] rounded-full animate-spin"></div>
                                    <div className="text-[#449382] font-black tracking-widest text-lg animate-pulse uppercase">Evaluating Profile...</div>
                                </div>
                            )}
                            {result && (
                                <div className="space-y-6 animate-fade-in flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
                                    <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-10 border border-white/80 shadow-[0_10px_40px_rgba(31,56,49,0.1)] text-center relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#449382] to-[#255248]"></div>
                                        <div className="w-20 h-20 mx-auto bg-[#e5f5f1] text-[#449382] rounded-full flex items-center justify-center mb-6 shadow-sm border border-white">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-widest">
                                            Evaluation Complete
                                        </h2>

                                        <div className="bg-white/50 rounded-2xl p-6 border border-white/80 mb-8">
                                            <p className="text-sm text-[#449382] uppercase font-black mb-2 tracking-widest">Final Grade & Score</p>
                                            <div className="flex items-center justify-center gap-4">
                                                <span className="text-7xl font-black text-gray-900 drop-shadow-sm">{result.ats_grade}</span>
                                                <div className="h-12 w-0.5 bg-gray-300 rounded-full mx-2"></div>
                                                <span className="text-3xl font-bold text-[#449382]">{result.ats_score}<span className="text-xl text-gray-400">/100</span></span>
                                            </div>
                                        </div>

                                        <button onClick={() => { setResult(null); setCurrentStep(1); }} className="w-full px-8 py-4 bg-white border border-[#449382]/20 text-[#449382] font-black uppercase tracking-wider rounded-xl hover:bg-white/80 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                                            Evaluate Another Candidate
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto pr-4 flex flex-col" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            <div className="flex-1 pb-4">
                                {renderStepContent()}
                            </div>

                            {/* Navigation Footer */}
                            <div className="border-t-2 border-white/50 pt-6 flex justify-between items-center mt-auto">
                                <div>
                                    {currentStep > 1 && (
                                        <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="px-6 py-3 rounded-xl text-[14px] font-black text-gray-500 hover:text-gray-900 hover:bg-white/60 transition-all shadow-sm border border-transparent hover:border-white/80">
                                            Previous
                                        </button>
                                    )}
                                </div>

                                {currentStep < 5 ? (
                                    <button type="button" onClick={() => setCurrentStep(prev => prev + 1)} className="bg-[#449382] hover:bg-[#347668] text-white px-10 py-3 rounded-xl text-[14px] font-black transition-all shadow-[0_10px_20px_rgba(68,147,130,0.2)] hover:shadow-[0_15px_30px_rgba(68,147,130,0.3)] transform hover:-translate-y-0.5 uppercase tracking-wider">
                                        Continue
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleSubmit} className="bg-gradient-to-r from-[#449382] to-[#255248] hover:from-[#347668] hover:to-[#1d4038] text-white px-10 py-3 rounded-xl text-[14px] font-black transition-all shadow-[0_10px_20px_rgba(68,147,130,0.3)] hover:shadow-[0_15px_30px_rgba(68,147,130,0.4)] transform hover:-translate-y-0.5 flex items-center gap-2 uppercase tracking-wider">
                                        Submit Evaluation
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
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
