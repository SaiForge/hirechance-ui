// src/pages/Evaluate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES = [
    // AI / ML
    'AI Engineer', 'MLOps Engineer', 'LLM Engineer', 'Data Engineer', 'Data Scientist', 'Data Analyst',
    // Cloud / Infrastructure
    'Platform Engineer', 'Cloud Architect', 'DevOps Engineer', 'Site Reliability Engineer', 'System Administrator',
    // Software Engineering
    'Backend Developer', 'Full Stack Developer', 'Software Engineer', 'iOS Developer', 'Android Developer', 'Frontend Developer', 'Embedded Engineer',
    // Security
    'Security Engineer', 'DevSecOps Engineer',
    // QA / Testing
    'SDET', 'QA Automation Engineer', 'Manual Tester',
    // Product / Management
    'Product Manager', 'Scrum Master', 'Blockchain Developer',
];
const DEGREES = ['B.Tech', 'B.E.', 'B.Sc', 'BCA', 'M.Tech', 'M.Sc', 'MCA', 'MBA', 'PhD', 'Other'];
const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Mathematics', 'Physics', 'Data Science', 'AI/ML', 'Other'];
const GRAD_YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
const INSTITUTE_TIERS = [
    { value: 1, label: 'Tier 1 — IIT / IISc / BITS' },
    { value: 2, label: 'Tier 2 — NIT / IIIT / Top State' },
    { value: 3, label: 'Tier 3 — Reputed Private' },
    { value: 4, label: 'Tier 4 — Average / Deemed' },
    { value: 5, label: 'Tier 5 — Open / Distance' },
];
const YES_NO = [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }];
const EXP_ROLES = ['Intern', 'Junior Engineer', 'Software Engineer', 'Senior Engineer', 'Lead', 'Manager', 'Consultant', 'Other'];
const PROJECT_TYPES = ['Web', 'Mobile', 'ML / AI', 'Data Pipeline', 'DevOps / Cloud', 'Research', 'Open Source', 'Other'];
const PRESENCE_SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const APP_STEPS = [
    { id: 1, title: 'Info', icon: 'person' },
    { id: 2, title: 'Academic', icon: 'school' },
    { id: 3, title: 'Experience', icon: 'work' },
    { id: 4, title: 'Projects', icon: 'folder' },
    { id: 5, title: 'Skills', icon: 'psychology' },
];

export default function Evaluate() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/placement/predict` : "http://localhost:8000/api/v1/placement/predict";

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '', target_role: 'AI Engineer', total_experience_months: 0,
        skills: '', certifications: '', coding_rating: 0, leetcode_solved: 0,
        open_source_contributions: 0, github_stars: 0, hackathons_participated: 0,
        hackathons_won: 0, publications: 0, online_presence_score: 0,
        has_portfolio_site: false, has_video_resume: false,
    });

    const [education, setEducation] = useState({
        degree: 'B.Tech', branch: 'CSE', institute_tier: 3, cgpa: 8.5, graduation_year: 2024, backlogs: 0,
    });

    const [softSkills, setSoftSkills] = useState({
        communication: 3, teamwork: 3, problem_solving: 3, leadership: 3, adaptability: 3,
    });

    const [experience, setExperience] = useState([]);
    const [projects, setProjects] = useState([]);

    const handleFormChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }));
        setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    };

    const handleEduChange = (e) => {
        const { name, type, value } = e.target;
        setEducation(prev => ({ ...prev, [name]: type === 'number' || type === 'range' ? Number(value) : value }));
        setErrors(prev => { const n = { ...prev }; delete n[`edu_${name}`]; return n; });
    };

    const addExp = () => setExperience(prev => [...prev, { company: '', role: 'Intern', duration_months: 3, is_relevant: 'true', tech_used: '' }]);
    const removeExp = (i) => { setExperience(prev => prev.filter((_, idx) => idx !== i)); };
    const handleExpChange = (i, field, value) => { setExperience(prev => { const a = [...prev]; a[i] = { ...a[i], [field]: value }; return a; }); if (field === 'company') setErrors(prev => { const n = { ...prev }; delete n[`exp_${i}_company`]; return n; }); };

    const addProject = () => setProjects(prev => [...prev, { title: '', project_type: 'Web', tech_stack: '', description: '', github_link: '', team_size: 1, duration_weeks: 4, is_open_source: 'false', production_deployed: 'false' }]);
    const removeProject = (i) => { setProjects(prev => prev.filter((_, idx) => idx !== i)); };
    const handleProjectChange = (i, field, value) => { setProjects(prev => { const a = [...prev]; a[i] = { ...a[i], [field]: value }; return a; }); if (field === 'title') setErrors(prev => { const n = { ...prev }; delete n[`proj_${i}_title`]; return n; }); };

    const validate = () => {
        const errs = {};
        let firstStep = null;
        if (!formData.name.trim()) { errs.name = 'Required'; firstStep = firstStep ?? 1; }
        experience.forEach((exp, i) => { if (!exp.company.trim()) { errs[`exp_${i}_company`] = 'Required'; firstStep = firstStep ?? 3; } });
        projects.forEach((proj, i) => { if (!proj.title.trim()) { errs[`proj_${i}_title`] = 'Required'; firstStep = firstStep ?? 4; } });
        return { errs, firstStep };
    };

    const handleSubmit = async (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        const { errs, firstStep } = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            setCurrentStep(firstStep);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to use the predictor');
            navigate('/login');
            return;
        }

        setErrors({});
        setLoading(true);
        setResult(null);
        
        const payload = {
            full_name: formData.name,
            branch: education.branch,
            degree_type: education.degree,
            graduation_year: Number(education.graduation_year),
            cgpa: Number(education.cgpa),
            tenth_percentage: 85.0, // Mocked 
            twelfth_percentage: 85.0, // Mocked 
            backlogs: Number(education.backlogs),
            gap_year: false,
            skills: formData.skills.split(',').map(s => ({ name: s.trim(), level: 'intermediate' })).filter(s => s.name),
            projects: projects.map(p => ({
                title: p.title,
                tech_stack: String(p.tech_stack).split(',').map(s => s.trim()).filter(Boolean),
                description: '',
                has_github: p.is_open_source === 'true' || p.is_open_source === true,
                has_live_demo: p.production_deployed === 'true' || p.production_deployed === true,
                domain: p.project_type
            })),
            internships: experience.map(exp => ({
                company: exp.company,
                role: exp.role,
                duration_months: Number(exp.duration_months),
                domain: 'Software',
                is_paid: true
            })),
            leetcode_problems: Number(formData.leetcode_solved) || 0,
            certifications: formData.certifications.split(',').map(s => ({ name: s.trim(), provider: 'Unknown' })).filter(s => s.name),
            hackathons_won: Number(formData.hackathons_won) || 0,
            publications: Number(formData.publications) || 0,
            communication_level: 'good',
            english_proficiency: 'fluent',
            leadership_experience: false,
            preferred_roles: [formData.target_role],
            preferred_work_mode: 'hybrid'
        };

        try {
            const minDelay = new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
            const res = await fetch(API_URL, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }, 
                body: JSON.stringify(payload) 
            });
            if (res.status === 401) {
                alert('Session expired. Please login again.');
                localStorage.removeItem('token');
                navigate('/login');
                throw new Error('Unauthorized');
            }
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const [data] = await Promise.all([res.json(), minDelay]);
            setResult(data);
        } catch (err) {
            console.error(err);
            if (err.message !== 'Unauthorized') {
                alert('Error connecting to backend.');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return (
                <section className="border-2 border-black-forest rounded bg-cornsilk p-stack-lg relative animate-fade-in">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l"></div>
                    <h3 className="font-h2 text-2xl text-black-forest mb-stack-md uppercase border-b-2 border-primary pb-2">Personal Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-stack-md">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase">Full Name</label>
                            <input className={`brutal-border rounded p-3 bg-transparent brutal-input ${errors.name ? 'border-red-500' : ''}`} type="text" name="name" value={formData.name} onChange={handleFormChange} />
                            {errors.name && <span className="text-red-500 text-xs">Required</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase">Target Role</label>
                            <select className="brutal-border rounded p-3 bg-transparent brutal-input appearance-none" name="target_role" value={formData.target_role} onChange={handleFormChange}>
                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase">Online Presence Score</label>
                            <select className="brutal-border rounded p-3 bg-transparent brutal-input appearance-none" name="online_presence_score" value={formData.online_presence_score} onChange={handleFormChange}>
                                {PRESENCE_SCORES.map(s => <option key={s} value={s}>{s} / 10</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 justify-center">
                            <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
                                <input type="checkbox" name="has_portfolio_site" checked={formData.has_portfolio_site} onChange={handleFormChange} className="w-4 h-4 accent-accent" />
                                Has portfolio site
                            </label>
                            <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
                                <input type="checkbox" name="has_video_resume" checked={formData.has_video_resume} onChange={handleFormChange} className="w-4 h-4 accent-accent" />
                                Has video resume
                            </label>
                        </div>
                    </div>
                </section>
            );
            case 2: return (
                <section className="border-2 border-black-forest rounded bg-cornsilk p-stack-lg relative animate-fade-in">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l"></div>
                    <h3 className="font-h2 text-2xl text-black-forest mb-stack-md uppercase border-b-2 border-primary pb-2">Academic Performance</h3>
                    <div className="flex flex-col md:flex-row gap-gutter items-center mb-stack-lg">
                        <div className="flex-1 w-full">
                            <label className="font-bold text-sm uppercase block mb-4">Cumulative GPA</label>
                            <input type="range" name="cgpa" min="0" max="10" step="0.1" value={education.cgpa} onChange={handleEduChange} />
                            <div className="flex justify-between text-xs font-bold mt-2 text-primary">
                                <span>0.0</span><span>10.0</span>
                            </div>
                        </div>
                        <div className="shrink-0 text-center p-4 border-2 border-primary bg-primary text-cornsilk w-32">
                            <div className="text-sm font-bold uppercase mb-1">Current</div>
                            <div className="text-4xl font-mono font-bold">{Number(education.cgpa).toFixed(1)}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-stack-md">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase">Degree</label>
                            <select className="brutal-border rounded p-3 bg-transparent brutal-input appearance-none" name="degree" value={education.degree} onChange={handleEduChange}>
                                {DEGREES.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase">Branch</label>
                            <select className="brutal-border rounded p-3 bg-transparent brutal-input appearance-none" name="branch" value={education.branch} onChange={handleEduChange}>
                                {BRANCHES.map(b => <option key={b}>{b}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase">Institute Tier</label>
                            <select className="brutal-border rounded p-3 bg-transparent brutal-input appearance-none" name="institute_tier" value={education.institute_tier} onChange={handleEduChange}>
                                {INSTITUTE_TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase">Graduation Year</label>
                            <select className="brutal-border rounded p-3 bg-transparent brutal-input appearance-none" name="graduation_year" value={education.graduation_year} onChange={handleEduChange}>
                                {GRAD_YEARS.map(y => <option key={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase">Number of Backlogs</label>
                            <input className="brutal-border rounded p-3 bg-transparent brutal-input" type="number" name="backlogs" min="0" value={education.backlogs} onChange={handleEduChange} />
                        </div>
                    </div>
                </section>
            );
            case 3: return (
                <section className="border-2 border-black-forest rounded bg-cornsilk p-stack-lg relative animate-fade-in">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#606c38] rounded-l"></div>
                    <h3 className="font-h2 text-2xl text-black-forest mb-stack-md uppercase border-b-2 border-primary pb-2">Work Experience</h3>
                    <div className="mb-stack-md">
                        <label className="font-bold text-sm uppercase">Total Experience (Months)</label>
                        <div className="text-2xl font-bold mt-2 text-primary font-mono">
                            {experience.reduce((sum, exp) => sum + (Number(exp.duration_months) || 0), 0)}
                        </div>
                    </div>
                    {experience.map((exp, i) => (
                        <div key={i} className="mb-stack-md p-4 border-2 border-primary-container relative">
                            <button type="button" onClick={() => removeExp(i)} className="absolute top-2 right-2 text-error font-bold text-lg">X</button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm uppercase">Company</label>
                                    <input className={`brutal-border rounded p-3 bg-transparent brutal-input ${errors[`exp_${i}_company`] ? 'border-error' : ''}`} value={exp.company} onChange={e => handleExpChange(i, 'company', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm uppercase">Role</label>
                                    <select className="brutal-border rounded p-3 bg-transparent brutal-input appearance-none" value={exp.role} onChange={e => handleExpChange(i, 'role', e.target.value)}>
                                        {EXP_ROLES.map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm uppercase">Duration (Months)</label>
                                    <input className="brutal-border rounded p-3 bg-transparent brutal-input" type="number" value={exp.duration_months} onChange={e => handleExpChange(i, 'duration_months', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm uppercase">Relevant to Role?</label>
                                    <select className="brutal-border rounded p-3 bg-transparent brutal-input appearance-none" value={exp.is_relevant} onChange={e => handleExpChange(i, 'is_relevant', e.target.value)}>
                                        {YES_NO.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                                <label className="font-bold text-sm uppercase">Tech Used (Comma separated)</label>
                                <input className="brutal-border rounded p-3 bg-transparent brutal-input" value={exp.tech_used} onChange={e => handleExpChange(i, 'tech_used', e.target.value)} />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addExp} className="brutal-border rounded font-bold uppercase py-3 px-6 text-black-forest hover:bg-primary-container hover:text-cornsilk w-full transition-colors">Add Experience</button>
                </section>
            );
            case 4: return (
                <section className="border-2 border-black-forest rounded bg-cornsilk p-stack-lg relative animate-fade-in">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l"></div>
                    <h3 className="font-h2 text-2xl text-black-forest mb-stack-md uppercase border-b-2 border-primary pb-2">Projects</h3>
                    {projects.map((proj, i) => (
                        <div key={i} className="mb-stack-md p-4 border-2 border-primary-container relative">
                            <button type="button" onClick={() => removeProject(i)} className="absolute top-2 right-2 text-error font-bold text-lg">X</button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm uppercase">Project Title</label>
                                    <input className={`brutal-border rounded p-3 bg-transparent brutal-input ${errors[`proj_${i}_title`] ? 'border-error' : ''}`} value={proj.title} onChange={e => handleProjectChange(i, 'title', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm uppercase">Type</label>
                                    <select className="brutal-border rounded p-3 bg-transparent brutal-input appearance-none" value={proj.project_type} onChange={e => handleProjectChange(i, 'project_type', e.target.value)}>
                                        {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm uppercase">Tech Stack</label>
                                    <input className="brutal-border rounded p-3 bg-transparent brutal-input" value={proj.tech_stack} onChange={e => handleProjectChange(i, 'tech_stack', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm uppercase">Team Size</label>
                                    <input className="brutal-border rounded p-3 bg-transparent brutal-input" type="number" value={proj.team_size} onChange={e => handleProjectChange(i, 'team_size', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addProject} className="brutal-border rounded font-bold uppercase py-3 px-6 text-black-forest hover:bg-primary-container hover:text-cornsilk w-full transition-colors">Add Project</button>
                </section>
            );
            case 5: return (
                <section className="border-2 border-black-forest rounded bg-cornsilk p-stack-lg relative animate-fade-in">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l"></div>
                    <h3 className="font-h2 text-2xl text-black-forest mb-stack-md uppercase border-b-2 border-primary pb-2">Skills & Achievements</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase">Skills</label>
                            <textarea className="brutal-border rounded p-3 bg-transparent brutal-input" name="skills" value={formData.skills} onChange={handleFormChange} rows={2}></textarea>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase">Certifications</label>
                            <textarea className="brutal-border rounded p-3 bg-transparent brutal-input" name="certifications" value={formData.certifications} onChange={handleFormChange} rows={2}></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-sm uppercase">LeetCode Solved</label>
                                <input className="brutal-border rounded p-3 bg-transparent brutal-input" type="number" name="leetcode_solved" value={formData.leetcode_solved} onChange={handleFormChange} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-sm uppercase">GitHub Stars</label>
                                <input className="brutal-border rounded p-3 bg-transparent brutal-input" type="number" name="github_stars" value={formData.github_stars} onChange={handleFormChange} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-sm uppercase">Hackathons Won</label>
                                <input className="brutal-border rounded p-3 bg-transparent brutal-input" type="number" name="hackathons_won" value={formData.hackathons_won} onChange={handleFormChange} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-sm uppercase">Publications</label>
                                <input className="brutal-border rounded p-3 bg-transparent brutal-input" type="number" name="publications" value={formData.publications} onChange={handleFormChange} />
                            </div>
                        </div>
                    </div>
                </section>
            );
            default: return null;
        }
    };

    if (result) {
        return (
            <div className="flex-grow flex flex-col w-full bg-surface pb-32">
                {/* Top Banner */}
                <section className="bg-black-forest text-cornsilk py-stack-lg px-margin-mobile md:px-margin-desktop border-b-[3px] border-accent">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-md w-full">
                        <div>
                            <h1 className="font-h2 text-h2 mb-stack-sm">Hi {result.candidate_name || formData.name}, here's your result.</h1>
                            <div className="inline-block bg-accent text-black-forest font-label-caps text-label-caps px-4 py-2 uppercase font-bold border-2 border-black-forest">
                                {result.ats_score >= 80 ? 'Excellent Chances' : result.ats_score >= 60 ? 'Good Chances' : 'Needs Improvement'}
                            </div>
                            <p className="mt-2 text-surface-bright/80 text-lg font-bold uppercase">{result.target_role || formData.target_role}</p>
                        </div>
                        <div className="text-[120px] leading-none font-h1 font-bold text-cornsilk">
                            {result.ats_score}%
                        </div>
                    </div>
                </section>

                {/* Content Grid */}
                <div className="max-w-7xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    <div className="md:col-span-7 flex flex-col gap-stack-lg">
                        {/* Summary & Reasoning */}
                        <div className="bg-cornsilk border-2 border-black-forest border-l-[4px] border-l-primary-container p-gutter rounded-[4px]">
                            <h2 className="font-h2 text-h2 mb-stack-md text-black-forest">Evaluation Details</h2>
                            <p className="font-body-md whitespace-pre-wrap">{result.evaluation_reasoning || "Based on the provided metrics and target role requirements."}</p>
                        </div>
                    </div>

                    <div className="md:col-span-5 flex flex-col gap-stack-lg">
                        {/* Improvements */}
                        {result.improvements && result.improvements.length > 0 && (
                            <div className="bg-cornsilk border-2 border-black-forest border-l-[4px] border-l-accent p-gutter rounded-[4px]">
                                <h2 className="font-h2 text-h2 mb-stack-md text-black-forest">Actionable Improvements</h2>
                                <ul className="flex flex-col gap-stack-md list-disc list-inside">
                                    {result.improvements.map((imp, idx) => (
                                        <li key={idx} className="font-body-md font-bold text-black-forest">{imp}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky Action Bar */}
                <div className="sticky bottom-0 mt-auto left-0 w-full bg-black-forest border-t-[3px] border-accent p-margin-mobile md:p-gutter z-40">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-end items-center gap-stack-md">
                        <button onClick={() => { setResult(null); setCurrentStep(1); }} className="w-full sm:w-auto bg-transparent border-2 border-cornsilk text-cornsilk font-label-caps text-label-caps font-bold uppercase py-3 px-6 hover:bg-primary-container transition-colors">Re-Predict</button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center bg-surface w-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="font-h2 text-2xl uppercase">Analyzing Profile...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow flex flex-col bg-surface overflow-hidden relative">
            {/* HEADER BAR */}
            <div className="bg-primary-container text-cornsilk px-margin-desktop py-stack-md flex justify-between items-center border-b-2 border-primary">
                <h1 className="font-h2 text-h2">New Prediction</h1>
                <div className="hidden md:flex border-2 border-black-forest">
                    <button className="bg-black-forest text-cornsilk px-6 py-2 font-bold uppercase transition-colors">Manual Entry</button>
                    <button className="bg-cornsilk text-black-forest px-6 py-2 font-bold uppercase hover:bg-surface-variant transition-colors">Resume Upload</button>
                </div>
            </div>

            {/* MAIN LAYOUT */}
            <div className="flex flex-1 overflow-hidden relative pb-32">
                {/* SideNavBar */}
                <aside className="hidden md:flex flex-col gap-stack-md p-margin-mobile bg-surface h-full w-64 border-r-2 border-primary shrink-0 z-10">
                    <div className="mb-stack-lg">
                        <h2 className="font-h2 text-h2 text-primary uppercase">Prediction Wizard</h2>
                        <p className="text-on-surface-variant text-sm mt-1">Process Progress</p>
                    </div>
                    <nav className="flex flex-col gap-2 flex-1">
                        {APP_STEPS.map(step => (
                            <button key={step.id} onClick={() => setCurrentStep(step.id)} className={`flex items-center gap-3 p-3 font-bold hover:bg-secondary-container transition-all text-left w-full font-label-caps text-label-caps ${step.id === currentStep ? 'bg-secondary text-on-secondary-fixed border-2 border-primary scale-95' : 'text-on-surface-variant opacity-70'}`}>
                                <span className="material-symbols-outlined">{step.icon}</span> Step {step.id}: {step.title}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-auto pt-4 border-t-2 border-primary">
                        <div className="text-sm font-bold mb-2 text-primary">COMPLETION</div>
                        <div className="w-full h-4 border-2 border-primary bg-surface-container">
                            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${(currentStep / APP_STEPS.length) * 100}%` }}></div>
                        </div>
                    </div>
                </aside>

                {/* MAIN FORM AREA */}
                <main className="flex-1 overflow-y-auto bg-cornsilk p-margin-mobile md:p-margin-desktop z-0 h-full">
                    <div className="max-w-4xl mx-auto">
                        {renderStepContent()}
                    </div>
                </main>
            </div>

            {/* SUBMIT SECTION (Sticky Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 bg-black-forest p-4 md:p-6 z-40 border-t-4 border-accent flex justify-center">
                <button 
                    onClick={handleSubmit} 
                    disabled={currentStep !== APP_STEPS.length}
                    className={`font-bold uppercase py-4 px-8 md:px-16 text-lg transition-colors border-2 border-transparent w-full md:w-auto max-w-2xl ${
                        currentStep === APP_STEPS.length
                            ? 'bg-accent text-black-forest hover:bg-[#bc6c25]'
                            : 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'
                    }`}
                >
                    Predict My Placement Chances
                </button>
            </div>
        </div>
    );
}
