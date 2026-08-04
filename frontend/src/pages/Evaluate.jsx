// src/pages/Evaluate.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

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
const EXP_ROLES = ['Intern', 'Junior Engineer', 'Software Engineer', 'Senior Engineer', 'Lead', 'Manager', 'Consultant', 'Other'];

const APP_STEPS = [
    { id: 1, title: 'Info', icon: 'person' },
    { id: 2, title: 'Academic', icon: 'school' },
    { id: 3, title: 'Experience', icon: 'work' },
    { id: 4, title: 'Projects', icon: 'folder' },
    { id: 5, title: 'Skills', icon: 'psychology' },
];

export default function Evaluate() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const location = useLocation();
    const [isUploadMode, setIsUploadMode] = useState(location.state?.uploadMode || false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [formData, setFormData] = useState({
        name: '', target_role: 'AI Engineer', skills: '', certifications: ''
    });

    const [education, setEducation] = useState({
        degree: 'B.Tech', branch: 'CSE', cgpa: 8.5, graduation_year: 2024,
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

    const addExp = () => setExperience(prev => [...prev, { company: '', role: 'Intern' }]);
    const removeExp = (i) => { setExperience(prev => prev.filter((_, idx) => idx !== i)); };
    const handleExpChange = (i, field, value) => { setExperience(prev => { const a = [...prev]; a[i] = { ...a[i], [field]: value }; return a; }); if (field === 'company') setErrors(prev => { const n = { ...prev }; delete n[`exp_${i}_company`]; return n; }); };

    const addProject = () => setProjects(prev => [...prev, { title: '', tech_stack: '' }]);
    const removeProject = (i) => { setProjects(prev => prev.filter((_, idx) => idx !== i)); };
    const handleProjectChange = (i, field, value) => { setProjects(prev => { const a = [...prev]; a[i] = { ...a[i], [field]: value }; return a; }); if (field === 'title') setErrors(prev => { const n = { ...prev }; delete n[`proj_${i}_title`]; return n; }); };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to use this feature');
            navigate('/login');
            return;
        }

        setLoading(true);
        setErrors({});
        setResult(null);

        const formDataFile = new FormData();
        formDataFile.append('file', selectedFile);

        try {
            const minDelay = new Promise(resolve => setTimeout(resolve, 1500));
            const res = await fetch(API_ENDPOINTS.UPLOAD_RESUME, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataFile
            });

            if (res.status === 401) {
                alert('Session expired. Please login again.');
                localStorage.removeItem('token');
                navigate('/login');
                throw new Error('Unauthorized');
            }
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            
            const [data] = await Promise.all([res.json(), minDelay]);
            console.log('[Debug] Raw API response:', JSON.stringify(data, null, 2));
            
            if (data.recommend_error) {
                console.warn('[Debug] Recommendation error from server:', data.recommend_error);
            }
            
            const mappedMatches = (data.recommendations || []).map(r => ({
                name: r.Company,
                type: r.Job_Title,
                description: r.Description,
                match_percentage: Math.round(r.Final_Score || r.Possibility || 0),
                insights: r.Insights || {}
            }));
            
            setResult({
                student_name: formData.name || data.parsed_data?.name || 'Candidate',
                target_role: formData.target_role || data.parsed_data?.target_role || 'General Applicant',
                placement_category: 'Resume Match',
                percentile: 85,
                placement_score: mappedMatches.length > 0 ? mappedMatches[0].match_percentage : 0,
                company_matches: mappedMatches,
                recommend_error: data.recommend_error,
                breakdown: { 'Skills': 80, 'Experience': 75 },
                improvements: [] 
            });
            
        } catch (err) {
            console.error(err);
            if (err.message !== 'Unauthorized') {
                alert(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

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
            resume_text: `Candidate Name: ${formData.name}\n` +
                         `Target Role: ${formData.target_role}\n` +
                         `Education: ${education.degree} in ${education.branch}, Graduating ${education.graduation_year}, CGPA: ${education.cgpa}\n` +
                         `Skills: ${formData.skills}\n` +
                         `Projects: ${projects.map(p => p.title + ' (' + p.tech_stack + ')').join(', ')}\n` +
                         `Experience: ${experience.map(exp => exp.role + ' at ' + exp.company).join(', ')}\n` +
                         `Certifications: ${formData.certifications}\n`
        };

        try {
            const minDelay = new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
            const res = await fetch(API_ENDPOINTS.PREDICT_RECOMMEND, { 
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
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || `Server error: ${res.status}`);
            }
            const [data] = await Promise.all([res.json(), minDelay]);
            
            const mappedMatches = (data.recommendations || []).map(r => ({
                name: r.Company,
                type: r.Job_Title,
                description: r.Description,
                match_percentage: Math.round(r.Final_Score || r.Possibility || 0),
                insights: r.Insights || {}
            }));
            
            setResult({
                student_name: formData.name || 'Candidate',
                target_role: formData.target_role || 'General Applicant',
                placement_category: 'Profile Match',
                percentile: 85,
                placement_score: mappedMatches.length > 0 ? mappedMatches[0].match_percentage : 0,
                company_matches: mappedMatches,
                missing_skills: ['Consider adding more specific tools to match roles better'],
                resume_tips: ['Focus on impactful project descriptions'],
                estimated_salary: 'Based on market',
                skill_scores: {
                    frontend: 80,
                    backend: 70,
                    database: 75,
                    devops: 60
                }
            });
        } catch (err) {
            console.error(err);
            if (err.message !== 'Unauthorized') {
                alert(`Error: ${err.message}`);
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
                            <label className="font-bold text-sm uppercase">Graduation Year</label>
                            <select className="brutal-border rounded p-3 bg-transparent brutal-input appearance-none" name="graduation_year" value={education.graduation_year} onChange={handleEduChange}>
                                {GRAD_YEARS.map(y => <option key={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                </section>
            );
            case 3: return (
                <section className="border-2 border-black-forest rounded bg-cornsilk p-stack-lg relative animate-fade-in">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#606c38] rounded-l"></div>
                    <h3 className="font-h2 text-2xl text-black-forest mb-stack-md uppercase border-b-2 border-primary pb-2">Work Experience</h3>
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
                                    <label className="font-bold text-sm uppercase">Tech Stack</label>
                                    <input className="brutal-border rounded p-3 bg-transparent brutal-input" value={proj.tech_stack} onChange={e => handleProjectChange(i, 'tech_stack', e.target.value)} />
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
                            <h1 className="font-h2 text-h2 mb-stack-sm">Hi {result.student_name || formData.name}, here's your result.</h1>
                            <div className="inline-block bg-accent text-black-forest font-label-caps text-label-caps px-4 py-2 uppercase font-bold border-2 border-black-forest">
                                {result.placement_category || 'Evaluated'}
                            </div>
                            <p className="mt-2 text-surface-bright/80 text-lg font-bold uppercase">{result.target_role}</p>
                            <p className="mt-1 text-sm text-surface-bright/60">Better than {result.percentile}% of peers</p>
                        </div>
                        <div className="text-[120px] leading-none font-h1 font-bold text-cornsilk">
                            {result.placement_score}%
                        </div>
                    </div>
                </section>

                {/* Detailed Company Matches */}
                <div className="max-w-7xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
                    <h2 className="font-h2 text-h2 text-black-forest">Company Recommendations</h2>
                    
                    {result.company_matches && result.company_matches.length > 0 ? (
                        result.company_matches.map((match, idx) => (
                            <div key={idx} className="bg-cornsilk border-2 border-black-forest border-l-[6px] border-l-primary p-gutter rounded-[4px] shadow-sm flex flex-col gap-4 animate-fade-in brutal-border hover:-translate-y-1 transition-transform">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-outline-variant pb-4">
                                    <div>
                                        <h3 className="font-h2 text-2xl text-black-forest uppercase">{match.name}</h3>
                                        <p className="text-on-surface-variant font-bold text-lg">{match.type}</p>
                                    </div>
                                    <div className="text-4xl font-bold font-mono text-primary mt-2 md:mt-0">
                                        {match.match_percentage}%
                                    </div>
                                </div>

                                {match.description && (
                                    <p className="text-sm text-on-surface-variant italic mb-2 line-clamp-3">"{match.description}"</p>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                                    {/* Left Column: Scores */}
                                    <div className="flex flex-col gap-4">
                                        <h4 className="font-bold uppercase text-sm border-b-2 border-outline-variant pb-1 text-black-forest">Score Breakdown</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="flex justify-between items-center pr-4"><span className="font-bold text-on-surface-variant">Semantic</span> <span className="font-mono text-primary font-bold">{match.insights.Semantic_Score || 0}%</span></div>
                                            <div className="flex justify-between items-center pr-4"><span className="font-bold text-on-surface-variant">Skill</span> <span className="font-mono text-primary font-bold">{match.insights.Skill_Score || 0}%</span></div>
                                            <div className="flex justify-between items-center pr-4"><span className="font-bold text-on-surface-variant">Experience</span> <span className="font-mono text-primary font-bold">{match.insights.Experience_Score || 0}%</span></div>
                                            <div className="flex justify-between items-center pr-4"><span className="font-bold text-on-surface-variant">Brand</span> <span className="font-mono text-primary font-bold">{match.insights.Brand_Score || 0}%</span></div>
                                            <div className="flex justify-between items-center pr-4"><span className="font-bold text-on-surface-variant">Education</span> <span className="font-mono text-primary font-bold">{match.insights.Education_Score || 0}%</span></div>
                                        </div>
                                        
                                        <h4 className="font-bold uppercase text-sm border-b-2 border-outline-variant pb-1 mt-2 text-black-forest">Feedback</h4>
                                        <div className="flex flex-col gap-2">
                                            {match.insights.Experience_Feedback && (
                                                <p className="text-sm"><span className="font-bold text-on-surface-variant">Experience:</span> {match.insights.Experience_Feedback}</p>
                                            )}
                                            {match.insights.Pedigree_Feedback && (
                                                <p className="text-sm"><span className="font-bold text-on-surface-variant">Pedigree:</span> {match.insights.Pedigree_Feedback}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column: Skills */}
                                    <div className="flex flex-col gap-4">
                                        <h4 className="font-bold uppercase text-sm border-b-2 border-outline-variant pb-1 text-black-forest">Skills Matching</h4>
                                        <div className="flex flex-col gap-3">
                                            <div>
                                                <div className="text-xs font-bold text-primary mb-2 uppercase">Matched Skills</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {(match.insights.Matched_Skills || []).map((skill, i) => (
                                                        <span key={i} className="bg-primary-container text-on-primary-container text-xs px-2 py-1 rounded font-mono border-2 border-primary">{skill}</span>
                                                    ))}
                                                    {!(match.insights.Matched_Skills?.length > 0) && <span className="text-xs text-on-surface-variant italic">None</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-error mb-2 uppercase">Missing Skills</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {(match.insights.Missing_Skills || []).map((skill, i) => (
                                                        <span key={i} className="bg-error-container text-on-error-container text-xs px-2 py-1 rounded font-mono border-2 border-error">{skill}</span>
                                                    ))}
                                                    {!(match.insights.Missing_Skills?.length > 0) && <span className="text-xs text-on-surface-variant italic">None</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-cornsilk border-2 border-black-forest p-gutter rounded-[4px] brutal-border">
                            <p className="font-body-md text-on-surface-variant">No strong matches found yet. Keep improving your profile!</p>
                            {result.recommend_error && (
                                <p className="text-xs mt-2 text-red-600 font-mono bg-red-50 p-2 rounded border-2 border-red-600">Debug: {result.recommend_error}</p>
                            )}
                        </div>
                    )}
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
                    <button onClick={() => setIsUploadMode(false)} className={`${!isUploadMode ? 'bg-black-forest text-cornsilk' : 'bg-cornsilk text-black-forest hover:bg-surface-variant'} px-6 py-2 font-bold uppercase transition-colors`}>Manual Entry</button>
                    <button onClick={() => setIsUploadMode(true)} className={`${isUploadMode ? 'bg-black-forest text-cornsilk' : 'bg-cornsilk text-black-forest hover:bg-surface-variant'} px-6 py-2 font-bold uppercase transition-colors`}>Resume Upload</button>
                </div>
            </div>

            {/* MAIN LAYOUT */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* SideNavBar */}
                {!isUploadMode && (
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
                )}

                {/* MAIN FORM AREA */}
                <main className="flex-1 overflow-y-auto bg-cornsilk p-margin-mobile md:p-margin-desktop z-0 h-full">
                    <div className="max-w-4xl mx-auto flex flex-col gap-stack-md pb-16">
                        {isUploadMode ? (
                            <section className="border-2 border-black-forest rounded bg-cornsilk p-stack-lg relative animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l"></div>
                                <h3 className="font-h2 text-3xl text-black-forest mb-4 uppercase text-center">Upload Your Resume</h3>
                                <p className="text-on-surface-variant mb-8 text-center max-w-md">We will extract your skills, experience, and education to match you with the best roles.</p>
                                
                                <label className="cursor-pointer border-2 border-dashed border-primary bg-primary-container/10 hover:bg-primary-container/30 transition-colors rounded p-12 flex flex-col items-center justify-center w-full max-w-lg mb-8">
                                    <span className="material-symbols-outlined text-6xl text-primary mb-4">cloud_upload</span>
                                    <span className="font-bold text-lg">{selectedFile ? selectedFile.name : 'Select PDF Resume'}</span>
                                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                                </label>
                                
                                <button 
                                    onClick={handleFileUpload} 
                                    disabled={!selectedFile}
                                    className={`font-bold uppercase py-4 px-12 text-lg transition-colors border-2 ${selectedFile ? 'border-transparent bg-accent text-black-forest hover:bg-[#bc6c25]' : 'border-outline-variant bg-surface-variant text-on-surface-variant cursor-not-allowed'}`}
                                >
                                    Analyze Resume
                                </button>
                            </section>
                        ) : (
                            <>
                                {renderStepContent()}
                                
                                {/* NAVIGATION BUTTONS */}
                                <div className="bg-black-forest p-4 md:p-6 border-2 border-primary flex justify-between items-center gap-4 rounded">
                                    {currentStep > 1 ? (
                                        <button 
                                            onClick={() => setCurrentStep(prev => prev - 1)}
                                            className="font-bold uppercase py-3 px-6 bg-transparent border-2 border-cornsilk text-cornsilk hover:bg-surface-variant hover:text-black-forest transition-colors"
                                        >
                                            Previous
                                        </button>
                                    ) : (
                                        <div /> 
                                    )}
                                    
                                    {currentStep < APP_STEPS.length ? (
                                        <button 
                                            onClick={() => setCurrentStep(prev => prev + 1)}
                                            className="font-bold uppercase py-3 px-8 md:px-12 text-lg bg-primary text-cornsilk border-2 border-transparent hover:border-cornsilk transition-colors"
                                        >
                                            Next Step
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={handleSubmit} 
                                            className="font-bold uppercase py-3 px-8 md:px-12 text-lg transition-colors border-2 border-transparent bg-accent text-black-forest hover:bg-[#bc6c25]"
                                        >
                                            Predict Chances
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
