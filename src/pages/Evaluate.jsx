import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES = [
    // AI / ML
    'AI Engineer',
    'MLOps Engineer',
    'LLM Engineer',
    'Data Engineer',
    'Data Scientist',
    'Data Analyst',
    // Cloud / Infrastructure
    'Platform Engineer',
    'Cloud Architect',
    'DevOps Engineer',
    'Site Reliability Engineer',
    'System Administrator',
    // Software Engineering
    'Backend Developer',
    'Full Stack Developer',
    'Software Engineer',
    'iOS Developer',
    'Android Developer',
    'Frontend Developer',
    'Embedded Engineer',
    // Security
    'Security Engineer',
    'DevSecOps Engineer',
    // QA / Testing
    'SDET',
    'QA Automation Engineer',
    'Manual Tester',
    // Product / Management
    'Product Manager',
    'Scrum Master',
    'Blockchain Developer',
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
const SKILL_RATINGS = [1, 2, 3, 4, 5];

const APP_STEPS = [
    { id: 1, title: 'Personal' },
    { id: 2, title: 'Education' },
    { id: 3, title: 'Experience' },
    { id: 4, title: 'Projects' },
    { id: 5, title: 'Achievements' },
];

const inputCls = 'w-full bg-white border border-[#d9d9d9] text-[#1a1a1a] text-sm rounded-sm px-3 py-2.5 outline-none focus:border-[#999] transition-colors placeholder-[#bbb]';
const labelCls = 'flex items-center gap-1.5 text-[11px] font-semibold text-[#888] uppercase tracking-widest mb-1.5';
const sectionHeadCls = 'text-xs font-bold text-[#999] uppercase tracking-widest mb-5 border-b border-[#e8e8e8] pb-2';

// ── Info tooltip ──────────────────────────────────────────────────────────────
function InfoTip({ text }) {
    return (
        <span className="info-tip relative inline-flex items-center cursor-default">
            <span className="w-3.5 h-3.5 rounded-full border border-[#bbb] text-[#bbb] text-[9px] flex items-center justify-center font-bold leading-none select-none hover:border-[#777] hover:text-[#777] transition-colors">
                i
            </span>
            <span className="info-tip-box">{text}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]" />
            </span>
        </span>
    );
}

export default function Evaluate() {
    const navigate = useNavigate();
    const API_URL = 'http://placement-api-env-v9.eba-tfmcvj6s.us-east-1.elasticbeanstalk.com/predict';

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        target_role: 'AI Engineer',
        total_experience_months: 0,
        skills: '',
        certifications: '',
        coding_rating: 0,
        leetcode_solved: 0,
        open_source_contributions: 0,
        github_stars: 0,
        hackathons_participated: 0,
        hackathons_won: 0,
        publications: 0,
        online_presence_score: 0,
        has_portfolio_site: false,
        has_video_resume: false,
    });

    const [education, setEducation] = useState({
        degree: 'B.Tech',
        branch: 'CSE',
        institute_tier: 3,
        cgpa: '',
        graduation_year: 2024,
        backlogs: 0,
    });

    const [softSkills, setSoftSkills] = useState({
        communication: 3,
        teamwork: 3,
        problem_solving: 3,
        leadership: 3,
        adaptability: 3,
    });

    const [experience, setExperience] = useState([]);

    const [projects, setProjects] = useState([]);

    const handleFormChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }));
    };

    const handleEduChange = (e) => {
        const { name, type, value } = e.target;
        setEducation(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const addExp = () => setExperience(prev => [...prev, { company: '', role: 'Intern', duration_months: 3, is_relevant: 'true', tech_used: '' }]);
    const removeExp = (i) => setExperience(prev => prev.filter((_, idx) => idx !== i));
    const handleExpChange = (i, field, value) => setExperience(prev => { const a = [...prev]; a[i] = { ...a[i], [field]: value }; return a; });

    const addProject = () => setProjects(prev => [...prev, { title: '', project_type: 'Web', tech_stack: '', description: '', github_link: '', team_size: 1, duration_weeks: 4, is_open_source: 'false', production_deployed: 'false' }]);
    const removeProject = (i) => setProjects(prev => prev.filter((_, idx) => idx !== i));
    const handleProjectChange = (i, field, value) => setProjects(prev => { const a = [...prev]; a[i] = { ...a[i], [field]: value }; return a; });

    const handleSubmit = async (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
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
                is_relevant: exp.is_relevant === 'true' || exp.is_relevant === true,
                duration_months: Number(exp.duration_months),
                tech_used: String(exp.tech_used).split(',').map(s => s.trim()).filter(Boolean),
            })),
            projects: projects.map(p => ({
                ...p,
                team_size: Number(p.team_size),
                duration_weeks: Number(p.duration_weeks),
                is_open_source: p.is_open_source === 'true' || p.is_open_source === true,
                production_deployed: p.production_deployed === 'true' || p.production_deployed === true,
                tech_stack: String(p.tech_stack).split(',').map(s => s.trim()).filter(Boolean),
            })),
        };
        try {
            const minDelay = new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 2000));
            const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const [data] = await Promise.all([res.json(), minDelay]);
            setResult(data);
        } catch (err) {
            console.error(err);
            alert('Error connecting to backend. Make sure the server is running at localhost:8000.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1: return (
                <div className="space-y-5 animate-fade-in">
                    <p className={sectionHeadCls}>Personal Details</p>

                    <div>
                        <label className={labelCls}>
                            Full Name
                            <InfoTip text="Enter your legal name exactly as it appears on official documents and certificates." />
                        </label>
                        <input type="text" name="name" value={formData.name} onChange={handleFormChange} className={inputCls} placeholder="Legal full name" />
                    </div>

                    <div>
                        <label className={labelCls}>
                            Target Role
                            <InfoTip text="The specific job role you are applying for. This affects how your profile is scored against role-specific requirements." />
                        </label>
                        <select name="target_role" value={formData.target_role} onChange={handleFormChange} className={inputCls}>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className={labelCls}>
                            Online Presence Score
                            <InfoTip text="Rate your online professional presence (0–10). Consider LinkedIn activity, GitHub contributions, blogs, and portfolio." />
                        </label>
                        <select name="online_presence_score" value={formData.online_presence_score} onChange={handleFormChange} className={inputCls}>
                            {PRESENCE_SCORES.map(s => <option key={s} value={s}>{s} / 10</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-6 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" name="has_portfolio_site" checked={formData.has_portfolio_site} onChange={handleFormChange} className="accent-black w-3.5 h-3.5" />
                            <span className="text-xs text-[#888]">Has portfolio site</span>
                            <InfoTip text="A public portfolio website showcasing your projects and work. Adds credibility to your profile." />
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" name="has_video_resume" checked={formData.has_video_resume} onChange={handleFormChange} className="accent-black w-3.5 h-3.5" />
                            <span className="text-xs text-[#888]">Has video resume</span>
                            <InfoTip text="A short video introduction of yourself. Some employers value this for communication skills assessment." />
                        </label>
                    </div>
                </div>
            );

            case 2: return (
                <div className="space-y-5 animate-fade-in">
                    <p className={sectionHeadCls}>Education Details</p>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>
                                Degree
                                <InfoTip text="Your highest completed or ongoing academic degree." />
                            </label>
                            <select name="degree" value={education.degree} onChange={handleEduChange} className={inputCls}>
                                {DEGREES.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>
                                Branch / Specialisation
                                <InfoTip text="Your primary field of study. CSE and IT branches generally score higher for tech roles." />
                            </label>
                            <select name="branch" value={education.branch} onChange={handleEduChange} className={inputCls}>
                                {BRANCHES.map(b => <option key={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>
                                Institute Tier
                                <InfoTip text="Tier 1 = IIT/IISc/BITS, Tier 2 = NIT/IIIT/top state, Tier 3 = reputed private, Tier 4 = average/deemed, Tier 5 = open/distance. Affects scoring weight." />
                            </label>
                            <select name="institute_tier" value={education.institute_tier} onChange={handleEduChange} className={inputCls}>
                                {INSTITUTE_TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>
                                CGPA
                                <InfoTip text="Cumulative Grade Point Average on a 10-point scale. Above 8.0 is generally considered strong." />
                            </label>
                            <input type="number" name="cgpa" step="0.1" min="0" max="10" value={education.cgpa} onChange={handleEduChange} className={inputCls} placeholder="e.g. 8.5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>
                                Graduation Year
                                <InfoTip text="Year of degree completion or expected completion. Recent graduates are scored relative to their batch." />
                            </label>
                            <select name="graduation_year" value={education.graduation_year} onChange={handleEduChange} className={inputCls}>
                                {GRAD_YEARS.map(y => <option key={y}>{y}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>
                                Active Backlogs
                                <InfoTip text="Number of currently pending/failed subjects. Zero backlogs is preferred; any number reduces the score." />
                            </label>
                            <input type="number" name="backlogs" min="0" value={education.backlogs} onChange={handleEduChange} className={inputCls} />
                        </div>
                    </div>

                    <div className="pt-1">
                        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#888] uppercase tracking-widest mb-3">
                            Soft Skills
                            <InfoTip text="Rate each soft skill from 1 (poor) to 5 (excellent). Be honest — these are factored into overall scoring." />
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(softSkills).map(([key, val]) => (
                                <div key={key}>
                                    <label className={labelCls}>{key.replace(/_/g, ' ')}</label>
                                    <select value={val} onChange={e => setSoftSkills(p => ({ ...p, [key]: Number(e.target.value) }))} className={inputCls}>
                                        {SKILL_RATINGS.map(r => <option key={r} value={r}>{r} / 5</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

            case 3: return (
                <div className="space-y-5 animate-fade-in">
                    <p className={sectionHeadCls}>Work Experience</p>
                    <div>
                        <label className={labelCls}>
                            Total Experience (Months)
                            <InfoTip text="Total professional experience in months including internships, full-time, and freelance work." />
                        </label>
                        <input type="number" name="total_experience_months" value={formData.total_experience_months} onChange={handleFormChange} min="0" className={inputCls} placeholder="e.g. 12" />
                    </div>
                    {experience.map((exp, i) => (
                        <div key={i} className="p-4 bg-[#fafafa] border border-[#e8e8e8] rounded-sm relative">
                            {(
                                <button type="button" onClick={() => removeExp(i)} className="absolute top-3 right-3 text-[#bbb] hover:text-red-400 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className={labelCls}>
                                        Company
                                        <InfoTip text="Name of the organisation where you worked or interned." />
                                    </label>
                                    <input type="text" value={exp.company} onChange={e => handleExpChange(i, 'company', e.target.value)} className={inputCls} placeholder="Company name" />
                                </div>
                                <div>
                                    <label className={labelCls}>
                                        Role
                                        <InfoTip text="Your job title at this company. Select the closest matching option." />
                                    </label>
                                    <select value={exp.role} onChange={e => handleExpChange(i, 'role', e.target.value)} className={inputCls}>
                                        {EXP_ROLES.map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className={labelCls}>
                                        Duration (Months)
                                        <InfoTip text="Total duration of this specific role in months. Longer relevant experience boosts your score." />
                                    </label>
                                    <input type="number" min="1" value={exp.duration_months} onChange={e => handleExpChange(i, 'duration_months', e.target.value)} className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>
                                        Relevant to Role?
                                        <InfoTip text="Is this experience relevant to your target role? Relevant experience is weighted significantly higher." />
                                    </label>
                                    <select value={exp.is_relevant} onChange={e => handleExpChange(i, 'is_relevant', e.target.value)} className={inputCls}>
                                        {YES_NO.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>
                                    Tech Used (comma-separated)
                                    <InfoTip text="Technologies, frameworks, and tools you used in this role. More overlap with target role skills = higher score." />
                                </label>
                                <input type="text" value={exp.tech_used} onChange={e => handleExpChange(i, 'tech_used', e.target.value)} className={inputCls} placeholder="e.g. Python, Docker, AWS" />
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={addExp} className="flex items-center gap-1.5 text-xs font-semibold text-[#aaa] hover:text-[#555] border border-[#e8e8e8] hover:border-[#ccc] px-4 py-2.5 rounded-sm transition-colors w-full justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Experience
                    </button>
                </div>
            );

            case 4: return (
                <div className="space-y-5 animate-fade-in">
                    <p className={sectionHeadCls}>Projects</p>

                    {projects.map((proj, i) => (
                        <div key={i} className="p-4 bg-[#fafafa] border border-[#e8e8e8] rounded-sm relative">
                            {(
                                <button type="button" onClick={() => removeProject(i)} className="absolute top-3 right-3 text-[#bbb] hover:text-red-400 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className={labelCls}>
                                        Project Title
                                        <InfoTip text="Name of the project. Make it descriptive — e.g. 'Real-time Fraud Detection Pipeline'." />
                                    </label>
                                    <input type="text" value={proj.title} onChange={e => handleProjectChange(i, 'title', e.target.value)} className={inputCls} placeholder="e.g. ML Pipeline" />
                                </div>
                                <div>
                                    <label className={labelCls}>
                                        Project Type
                                        <InfoTip text="Category that best describes the project. Helps the ATS match it against role requirements." />
                                    </label>
                                    <select value={proj.project_type} onChange={e => handleProjectChange(i, 'project_type', e.target.value)} className={inputCls}>
                                        {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className={labelCls}>
                                    Tech Stack (comma-separated)
                                    <InfoTip text="All technologies used in this project. Overlap with target role's required skills increases your score." />
                                </label>
                                <input type="text" value={proj.tech_stack} onChange={e => handleProjectChange(i, 'tech_stack', e.target.value)} className={inputCls} placeholder="e.g. Python, FastAPI, Kubernetes" />
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className={labelCls}>
                                        Duration (Weeks)
                                        <InfoTip text="How long this project took from start to finish. Longer substantial projects score higher." />
                                    </label>
                                    <input type="number" min="1" value={proj.duration_weeks} onChange={e => handleProjectChange(i, 'duration_weeks', e.target.value)} className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>
                                        Team Size
                                        <InfoTip text="Number of people who worked on this project including yourself. Both solo and team projects are valued." />
                                    </label>
                                    <input type="number" min="1" value={proj.team_size} onChange={e => handleProjectChange(i, 'team_size', e.target.value)} className={inputCls} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelCls}>
                                        Open Source?
                                        <InfoTip text="Is the source code publicly available (e.g. on GitHub)? Open source projects add to your visibility score." />
                                    </label>
                                    <select value={proj.is_open_source} onChange={e => handleProjectChange(i, 'is_open_source', e.target.value)} className={inputCls}>
                                        {YES_NO.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>
                                        Production Deployed?
                                        <InfoTip text="Is this project live and serving real users? Production deployments significantly increase scoring weight." />
                                    </label>
                                    <select value={proj.production_deployed} onChange={e => handleProjectChange(i, 'production_deployed', e.target.value)} className={inputCls}>
                                        {YES_NO.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={addProject} className="flex items-center gap-1.5 text-xs font-semibold text-[#aaa] hover:text-[#555] border border-[#e8e8e8] hover:border-[#ccc] px-4 py-2.5 rounded-sm transition-colors w-full justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Project
                    </button>
                </div>
            );

            case 5: return (
                <div className="space-y-5 animate-fade-in">
                    <p className={sectionHeadCls}>Skills & Achievements</p>

                    <div>
                        <label className={labelCls}>
                            Skills (comma-separated)
                            <InfoTip text="List all technical skills: languages, frameworks, tools, platforms. More relevant skills = higher match score." />
                        </label>
                        <textarea name="skills" value={formData.skills} onChange={handleFormChange} rows={2} className={inputCls} placeholder="e.g. Python, React, Kubernetes, PostgreSQL" />
                    </div>

                    <div>
                        <label className={labelCls}>
                            Certifications (comma-separated)
                            <InfoTip text="Professional certifications from recognised providers (AWS, Google, Microsoft, etc.). Role-relevant certs add score." />
                        </label>
                        <textarea name="certifications" value={formData.certifications} onChange={handleFormChange} rows={2} className={inputCls} placeholder="e.g. AWS Certified, GCP Associate" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>
                                Coding Rating
                                <InfoTip text="Your highest competitive programming rating (Codeforces, CodeChef, etc.). Rates above 1600 are considered strong." />
                            </label>
                            <input type="number" name="coding_rating" min="0" value={formData.coding_rating} onChange={handleFormChange} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>
                                LeetCode Solved
                                <InfoTip text="Total number of LeetCode problems solved across all difficulty levels. 200+ is a common benchmark for engineering roles." />
                            </label>
                            <input type="number" name="leetcode_solved" min="0" value={formData.leetcode_solved} onChange={handleFormChange} className={inputCls} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>
                                Open Source PRs
                                <InfoTip text="Number of accepted pull requests in public open-source repositories. Demonstrates real-world collaboration skills." />
                            </label>
                            <input type="number" name="open_source_contributions" min="0" value={formData.open_source_contributions} onChange={handleFormChange} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>
                                GitHub Stars
                                <InfoTip text="Total GitHub stars across all your public repositories. Indicates community recognition of your work." />
                            </label>
                            <input type="number" name="github_stars" min="0" value={formData.github_stars} onChange={handleFormChange} className={inputCls} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className={labelCls}>
                                Hackathons Won
                                <InfoTip text="Number of hackathons where you placed 1st, 2nd, or 3rd. Winning is weighted significantly higher than participating." />
                            </label>
                            <input type="number" name="hackathons_won" min="0" value={formData.hackathons_won} onChange={handleFormChange} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>
                                Hackathons Part.
                                <InfoTip text="Total number of hackathons attended regardless of outcome. Shows initiative and collaborative spirit." />
                            </label>
                            <input type="number" name="hackathons_participated" min="0" value={formData.hackathons_participated} onChange={handleFormChange} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>
                                Publications
                                <InfoTip text="Research papers, articles, or technical blogs published in journals or conferences. Highly valued for research-oriented roles." />
                            </label>
                            <input type="number" name="publications" min="0" value={formData.publications} onChange={handleFormChange} className={inputCls} />
                        </div>
                    </div>
                </div>
            );

            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4 md:p-8 font-sans text-[#1a1a1a] relative overflow-hidden">

            {/* Background dot grid */}
            <div className="absolute inset-0 bg-grid-drift pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #d0d0d0 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.7 }} />

            {/* Floating dots */}
            {[
                { size: 4, top: '15%', left: '8%',  cls: 'float-dot float-dot-d1' },
                { size: 3, top: '75%', left: '85%', cls: 'float-dot float-dot-d2' },
                { size: 5, top: '50%', left: '93%', cls: 'float-dot float-dot-d3' },
                { size: 3, top: '88%', left: '20%', cls: 'float-dot float-dot-d4' },
            ].map((d, i) => (
                <span key={i} className={`absolute rounded-full bg-black pointer-events-none ${d.cls}`} style={{ width: d.size, height: d.size, top: d.top, left: d.left }} />
            ))}

            {/* Scan lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="scan-line scan-line-d1 absolute left-0 right-0 h-px bg-black" />
                <div className="scan-line scan-line-d2 absolute left-0 right-0 h-px bg-black" />
            </div>

            {/* Main layout */}
            <div className="relative w-full max-w-5xl h-[88vh] min-h-[560px] flex border border-[#e0e0e0] bg-white rounded-sm overflow-hidden z-10 animate-fade-up shadow-sm">

                {/* Sidebar */}
                <div className="w-[200px] bg-[#fafafa] border-r border-[#ebebeb] p-6 flex flex-col flex-shrink-0">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs font-semibold text-[#aaa] hover:text-[#555] transition-colors mb-8 w-fit group">
                        <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>
                    <div className="text-sm font-black text-black mb-1 tracking-tight">HireChance</div>
                    <p className="text-[11px] text-[#bbb] mb-8">Candidate Evaluation</p>

                    <div className="flex flex-col gap-1 flex-1">
                        {APP_STEPS.map(step => {
                            const isActive = step.id === currentStep;
                            const isDone = step.id < currentStep;
                            return (
                                <button key={step.id} type="button" onClick={() => !loading && !result && setCurrentStep(step.id)} disabled={loading || !!result}
                                    className={['flex items-center gap-3 px-3 py-2 rounded-sm text-left transition-colors w-full', isActive ? 'bg-[#f0f0f0] text-black' : 'text-[#aaa] hover:text-[#555] hover:bg-[#f5f5f5]'].join(' ')}>
                                    <span className={['w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                                        isDone   ? 'bg-black text-white'
                                        : isActive ? 'bg-white text-black border border-[#999]'
                                                   : 'bg-white text-[#bbb] border border-[#e0e0e0]',
                                    ].join(' ')}>
                                        {isDone ? <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> : step.id}
                                    </span>
                                    <span className="text-[12px] font-semibold">{step.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {loading || result ? (
                        <div className="flex-1 overflow-y-auto no-scrollbar animate-fade-in">
                            {loading && (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="w-10 h-10 border-2 border-[#ccc] border-t-black rounded-full animate-spin-slow mx-auto" />
                                        <p className="text-xs font-semibold text-[#aaa] tracking-widest uppercase animate-pulse-soft">Evaluating Profile…</p>
                                    </div>
                                </div>
                            )}
                            {result && !loading && (
                                <div className="p-6 md:p-8 space-y-6 animate-fade-in">

                                    {/* ── Header ── */}
                                    <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#e8e8e8]">
                                        <div>
                                            <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-1">Evaluation Report</p>
                                            <h2 className="text-xl font-black text-black leading-tight">{result.candidate_name}</h2>
                                            <p className="text-xs text-[#777] mt-0.5">{result.target_role}</p>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <div className="text-center">
                                                <div className="text-4xl font-black text-black leading-none">{result.ats_grade}</div>
                                                <div className="text-[10px] text-[#aaa] mt-1">Grade</div>
                                            </div>
                                            <div className="w-px h-10 bg-[#e0e0e0]" />
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-black leading-none">{result.ats_score}<span className="text-sm font-normal text-[#bbb]">/100</span></div>
                                                <div className="text-[10px] text-[#aaa] mt-1">ATS Score</div>
                                            </div>
                                            <div className="w-px h-10 bg-[#e0e0e0]" />
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-black leading-none">{result.percentile_estimate}<span className="text-sm font-normal text-[#bbb]">%ile</span></div>
                                                <div className="text-[10px] text-[#aaa] mt-1">Percentile</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Verdict banner ── */}
                                    <div className={`px-4 py-3 rounded-sm border text-xs font-semibold flex items-center gap-2 ${result.hired ? 'bg-[#f0faf0] border-[#b6e4b6] text-[#2a7a2a]' : 'bg-[#fff5f5] border-[#f0c0c0] text-[#a33]'}`}>
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${result.hired ? 'bg-[#2a7a2a]' : 'bg-[#a33]'}`} />
                                        {result.shortlist_recommendation}
                                    </div>

                                    {/* ── Interview readiness ── */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest">Interview Readiness:</span>
                                        <span className="text-xs font-semibold text-[#444]">{result.interview_readiness}</span>
                                    </div>

                                    {/* ── Scoring Dimensions ── */}
                                    <div>
                                        <p className={sectionHeadCls}>Scoring Dimensions</p>
                                        <div className="space-y-2">
                                            {Object.entries(result.dimensions).map(([key, dim]) => (
                                                <div key={key} className="flex items-center gap-3">
                                                    <div className="w-36 text-[11px] text-[#777] font-medium truncate flex-shrink-0">{dim.label}</div>
                                                    <div className="flex-1 h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                                                        <div className="h-full bg-black rounded-full transition-all" style={{ width: `${dim.percentage}%` }} />
                                                    </div>
                                                    <div className="w-10 text-right text-[11px] font-bold text-[#444]">{dim.score}<span className="font-normal text-[#bbb]">/{dim.max_score}</span></div>
                                                    <div className={`w-20 text-right text-[10px] font-semibold flex-shrink-0 ${dim.percentage >= 70 ? 'text-[#2a7a2a]' : dim.percentage >= 45 ? 'text-[#997700]' : 'text-[#a33]'}`}>{dim.verdict}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Market Intelligence ── */}
                                    <div>
                                        <p className={sectionHeadCls}>Market Intelligence</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: 'Demand Index', value: `${(result.market_intelligence.demand_index * 100).toFixed(0)}%` },
                                                { label: 'Supply Pressure', value: result.market_intelligence.supply_pressure.replace(/_/g, ' ') },
                                                { label: 'Salary Band', value: result.market_intelligence.salary_band },
                                                { label: 'Growth Trend', value: result.market_intelligence.market_growth_trend },
                                                { label: 'Market Adjustment', value: `${result.market_intelligence.market_adjustment > 0 ? '+' : ''}${result.market_intelligence.market_adjustment} pts` },
                                            ].map(({ label, value }) => (
                                                <div key={label} className="bg-[#fafafa] border border-[#ebebeb] rounded-sm px-3 py-2.5">
                                                    <p className="text-[10px] text-[#aaa] uppercase tracking-widest mb-0.5">{label}</p>
                                                    <p className="text-xs font-semibold text-[#1a1a1a] capitalize">{value}</p>
                                                </div>
                                            ))}
                                            <div className="col-span-2 bg-[#fafafa] border border-[#ebebeb] rounded-sm px-3 py-2.5">
                                                <p className="text-[10px] text-[#aaa] uppercase tracking-widest mb-0.5">Hiring Outlook</p>
                                                <p className="text-xs font-semibold text-[#1a1a1a]">{result.market_intelligence.hiring_outlook}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Skill Gap ── */}
                                    <div>
                                        <p className={sectionHeadCls}>Skill Gap Analysis</p>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div className="bg-[#fafafa] border border-[#ebebeb] rounded-sm px-3 py-2.5 text-center">
                                                <p className="text-[10px] text-[#aaa] uppercase tracking-widest mb-0.5">Core Match</p>
                                                <p className="text-lg font-black text-black">{result.skill_gap.core_match_pct}<span className="text-xs font-normal text-[#bbb]">%</span></p>
                                            </div>
                                            <div className="bg-[#fafafa] border border-[#ebebeb] rounded-sm px-3 py-2.5 text-center">
                                                <p className="text-[10px] text-[#aaa] uppercase tracking-widest mb-0.5">Bonus Match</p>
                                                <p className="text-lg font-black text-black">{result.skill_gap.bonus_match_pct}<span className="text-xs font-normal text-[#bbb]">%</span></p>
                                            </div>
                                        </div>
                                        {result.skill_gap.missing_core_skills.length > 0 && (
                                            <div className="mb-2">
                                                <p className="text-[10px] font-semibold text-[#a33] uppercase tracking-widest mb-1.5">Missing Core Skills</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {result.skill_gap.missing_core_skills.map(s => (
                                                        <span key={s} className="px-2 py-0.5 bg-[#fff5f5] border border-[#f0c0c0] text-[#a33] text-[10px] font-semibold rounded-sm">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {result.skill_gap.missing_bonus_skills.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-semibold text-[#997700] uppercase tracking-widest mb-1.5">Missing Bonus Skills</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {result.skill_gap.missing_bonus_skills.map(s => (
                                                        <span key={s} className="px-2 py-0.5 bg-[#fffbf0] border border-[#edd] text-[#997700] text-[10px] font-semibold rounded-sm">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* ── Strengths & Red Flags ── */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className={sectionHeadCls}>Strengths</p>
                                            <ul className="space-y-1.5">
                                                {result.strengths.map((s, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-xs text-[#444]">
                                                        <span className="mt-0.5 w-3 h-3 flex-shrink-0 text-[#2a7a2a]">
                                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                        </span>
                                                        {s}
                                                    </li>
                                                ))}
                                                {result.strengths.length === 0 && <li className="text-xs text-[#bbb]">None detected</li>}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className={sectionHeadCls}>Red Flags</p>
                                            <ul className="space-y-1.5">
                                                {result.red_flags.map((f, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-xs text-[#444]">
                                                        <span className="mt-0.5 w-3 h-3 flex-shrink-0 text-[#a33]">
                                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </span>
                                                        {f}
                                                    </li>
                                                ))}
                                                {result.red_flags.length === 0 && <li className="text-xs text-[#bbb]">None detected</li>}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* ── Actionable Feedback ── */}
                                    <div>
                                        <p className={sectionHeadCls}>Actionable Feedback</p>
                                        <ol className="space-y-2">
                                            {result.actionable_feedback.map((f, i) => (
                                                <li key={i} className="flex items-start gap-3 text-xs text-[#444]">
                                                    <span className="flex-shrink-0 w-5 h-5 rounded-sm bg-black text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                                                    {f}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>

                                    {/* ── Resume Keywords ── */}
                                    <div>
                                        <p className={sectionHeadCls}>Resume Keywords to Include</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {result.resume_keywords.map(k => (
                                                <span key={k} className="px-2.5 py-1 bg-black text-white text-[10px] font-semibold rounded-sm">{k}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Reset ── */}
                                    <div className="pt-2 pb-4 flex gap-3">
                                        <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black text-white hover:bg-[#222] text-xs font-semibold uppercase tracking-widest transition-colors rounded-sm">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            Evaluate Again
                                        </button>
                                        <button onClick={() => { setResult(null); setCurrentStep(1); }} className="flex-1 py-2.5 border border-[#ddd] text-[#888] hover:text-black hover:border-[#999] text-xs font-semibold uppercase tracking-widest transition-colors rounded-sm">
                                            Evaluate Another
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8">{renderStep()}</div>
                            <div className="border-t border-[#ebebeb] px-6 md:px-8 py-4 flex justify-between items-center flex-shrink-0 bg-white">
                                <div>
                                    {currentStep > 1 && (
                                        <button type="button" onClick={() => setCurrentStep(p => p - 1)} className="text-xs font-semibold text-[#aaa] hover:text-[#555] transition-colors px-4 py-2 border border-transparent hover:border-[#e0e0e0] rounded-sm">
                                            Previous
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] text-[#ccc] font-semibold">{currentStep} / {APP_STEPS.length}</span>
                                    {currentStep < APP_STEPS.length ? (
                                        <button type="button" onClick={() => setCurrentStep(p => p + 1)} className="px-6 py-2 bg-black text-white text-xs font-bold rounded-sm hover:bg-[#222] transition-colors tracking-wide uppercase">
                                            Continue
                                        </button>
                                    ) : (
                                        <button type="button" onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2 bg-black text-white text-xs font-bold rounded-sm hover:bg-[#222] transition-colors tracking-wide uppercase">
                                            Submit
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
