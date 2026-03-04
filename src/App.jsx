import { useState, useRef, useEffect } from 'react';

// ─── Option Lists (from API) ─────────────────────────────────────────────────
const ROLES = [
  { value: 'AI Engineer',               key: 'ai_engineer' },
  { value: 'MLOps Engineer',            key: 'mlops_engineer' },
  { value: 'LLM Engineer',              key: 'llm_engineer' },
  { value: 'Data Engineer',             key: 'data_engineer' },
  { value: 'Data Scientist',            key: 'data_scientist' },
  { value: 'Data Analyst',              key: 'data_analyst' },
  { value: 'Platform Engineer',         key: 'platform_engineer' },
  { value: 'Cloud Architect',           key: 'cloud_architect' },
  { value: 'DevOps Engineer',           key: 'devops_engineer' },
  { value: 'Site Reliability Engineer', key: 'site_reliability_engineer' },
  { value: 'System Administrator',      key: 'system_administrator' },
  { value: 'Backend Developer',         key: 'backend_developer' },
  { value: 'Full Stack Developer',      key: 'full_stack_developer' },
  { value: 'Software Engineer',         key: 'software_engineer' },
  { value: 'iOS Developer',             key: 'ios_developer' },
  { value: 'Android Developer',         key: 'android_developer' },
  { value: 'Frontend Developer',        key: 'frontend_developer' },
  { value: 'Embedded Engineer',         key: 'embedded_engineer' },
  { value: 'Security Engineer',         key: 'security_engineer' },
  { value: 'DevSecOps Engineer',        key: 'devsecops_engineer' },
  { value: 'SDET',                      key: 'sdet' },
  { value: 'QA Automation Engineer',    key: 'qa_automation_engineer' },
  { value: 'Manual Tester',             key: 'manual_tester' },
  { value: 'Product Manager',           key: 'product_manager' },
  { value: 'Scrum Master',              key: 'scrum_master' },
  { value: 'Blockchain Developer',      key: 'blockchain_developer' },
];

const DEGREES       = ['B.Tech', 'B.E.', 'B.Sc', 'BCA', 'M.Tech', 'M.Sc', 'MCA', 'MBA', 'PhD', 'B.Com', 'Other'];
const BRANCHES      = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Biotechnology', 'Aerospace', 'Data Science', 'Information Systems', 'Mathematics', 'Physics', 'Other'];
const TIERS         = [
  { value: 1, label: 'Tier 1 — IIT / NIT / BITS' },
  { value: 2, label: 'Tier 2 — Top Private (IIIT, VIT, Manipal…)' },
  { value: 3, label: 'Tier 3 — Average Private' },
  { value: 4, label: 'Tier 4 — Deemed University' },
  { value: 5, label: 'Tier 5 — Open / Distance' },
];
const GRAD_YEARS    = Array.from({ length: 12 }, (_, i) => 2019 + i);
const SKILL_LABELS  = { 1: '1 — Needs Work', 2: '2 — Developing', 3: '3 — Adequate', 4: '4 — Strong', 5: '5 — Excellent' };
const PROJ_TYPES    = ['Cloud', 'Web', 'Mobile', 'AI/ML', 'Security', 'Embedded', 'Open Source', 'IoT', 'Blockchain', 'Other'];
const PRESENCE_MAP  = ['No presence','Minimal','Basic','Some','Moderate','Active','Visible','Strong','Very Strong','Expert','Top'];
const CERTS         = [
  'AWS Solutions Architect', 'AWS Developer Associate', 'AWS Cloud Practitioner',
  'GCP Professional Cloud Architect', 'Azure Solutions Architect',
  'CKA', 'CKAD', 'HashiCorp Terraform Associate',
  'CEH', 'CISSP', 'CompTIA Security+',
  'TensorFlow Developer', 'Databricks Spark', 'Google Professional ML Engineer',
  'GitHub Actions', 'Docker Certified Associate', 'Red Hat RHCSA',
];

// ─── Design Tokens (monochrome) ───────────────────────────────────────────────
const css = {
  input:   'mt-1.5 block w-full rounded-xl border border-[#e0e0e0] bg-[#f6f6f6] py-2.5 px-3.5 text-[#111] text-sm focus:ring-2 focus:ring-[#111] focus:bg-white transition-all duration-200 outline-none appearance-none',
  select:  'mt-1.5 block w-full rounded-xl border border-[#e0e0e0] bg-[#f6f6f6] py-2.5 px-3.5 text-[#111] text-sm focus:ring-2 focus:ring-[#111] focus:bg-white transition-all duration-200 outline-none cursor-pointer',
  label:   'block text-[10px] font-bold text-[#888] tracking-widest uppercase',
  section: 'pb-8 border-b border-[#ebebeb] last:border-0 last:pb-0',
  head:    'text-[10px] font-bold text-[#888] tracking-widest uppercase mb-4',
  card:    'bg-white rounded-[1.5rem] border border-[#e0e0e0] p-6 shadow-[0_1px_12px_rgba(0,0,0,0.05)]',
  addBtn:  'mt-3 text-xs font-semibold text-[#111] border border-[#e0e0e0] rounded-full px-4 py-1.5 hover:bg-[#f0f0f0] transition-colors duration-150',
  delBtn:  'text-xs font-semibold text-[#aaa] hover:text-[#111] transition-colors duration-150',
};

// ─── Score Bar ────────────────────────────────────────────────────────────────
const ScoreBar = ({ pct, delay = '' }) => {
  const color = pct >= 75 ? '#111111' : pct >= 50 ? '#777777' : '#cccccc';
  return (
    <div className="w-full bg-[#efefef] rounded-full h-1.5 overflow-hidden">
      <div className={`h-1.5 rounded-full animate-bar-grow ${delay}`} style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
    </div>
  );
};

// ─── Tag ─────────────────────────────────────────────────────────────────────
const Tag = ({ children, muted }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
    muted ? 'bg-[#f0f0f0] text-[#666] border-[#e0e0e0]' : 'bg-[#111] text-white border-transparent'
  }`}>{children}</span>
);

function App() {
  const API_URL = "http://localhost:8000/predict";

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);  const [stepIdx, setStepIdx]   = useState(0);
  const resultsRef              = useRef(null);
  const stepTimerRef            = useRef(null);

  const STEPS = [
    'Parsing candidate profile…',
    'Matching skills to role…',
    'Calculating ATS dimensions…',
    'Analysing market signals…',
    'Generating insights…',
  ];

  useEffect(() => {
    if (loading) {
      setStepIdx(0);
      stepTimerRef.current = setInterval(() => {
        setStepIdx(i => (i + 1) % STEPS.length);
      }, 900);
    } else {
      clearInterval(stepTimerRef.current);
    }
    return () => clearInterval(stepTimerRef.current);
  }, [loading]);

  // Scroll to results area as soon as loading begins
  useEffect(() => {
    if (loading && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  }, [loading]);

  // Scroll to results when they arrive
  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }, [result]);
  // --- MASSSIVE V9 STATE (Pre-filled with test data for easy testing) ---
  const [formData, setFormData] = useState({
    name: "Aryan Sharma",
    target_role: "MLOps Engineer",
    total_experience_months: 9,
    skills: "python, docker, kubernetes, mlflow, aws, terraform, ci/cd, airflow, prometheus, linux",
    certifications: "AWS Cloud Practitioner, HashiCorp Terraform Associate",
    coding_rating: 1650,
    leetcode_solved: 220,
    open_source_contributions: 4,
    github_stars: 35,
    hackathons_participated: 3,
    hackathons_won: 1,
    publications: 1,
    online_presence_score: 7,
    has_portfolio_site: true,
    has_video_resume: false
  });

  const [education, setEducation] = useState({
    degree: "B.Tech", branch: "CSE", institute_tier: 2, cgpa: 8.5, graduation_year: 2024, backlogs: 0
  });

  const [softSkills, setSoftSkills] = useState({
    communication: 4, teamwork: 4, problem_solving: 5, leadership: 3, adaptability: 4
  });

  const [experience, setExperience] = useState([
    { company: 'TechCorp India', role: 'MLOps Intern',        duration_months: 6, is_relevant: 'true', tech_used: 'python, docker, kubernetes, mlflow' },
    { company: 'DataStartup',   role: 'Data Engineer Intern', duration_months: 3, is_relevant: 'true', tech_used: 'python, airflow, aws' },
  ]);

  const [projects, setProjects] = useState([
    { title: 'ML Model Deployment Pipeline', project_type: 'Cloud', tech_stack: 'python, docker, kubernetes, mlflow, aws', description: 'Built an end-to-end MLOps pipeline.', github_link: 'https://github.com/aryan/mlops', team_size: 2, duration_weeks: 10, is_open_source: 'true', production_deployed: 'true' },
  ]);

  // --- HANDLERS ---
  const handleFormChange = (e) => {
    const { name, type, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleEduChange = (e) => {
    const { name, type, value } = e.target;
    setEducation(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSoftChange = (e) => {
    setSoftSkills(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
  };

  const handleExpChange  = (i, field, value) => setExperience(prev => { const a = [...prev]; a[i] = { ...a[i], [field]: value }; return a; });
  const addExp           = () => setExperience(prev => [...prev, { company: '', role: '', duration_months: 3, is_relevant: 'true', tech_used: '' }]);
  const removeExp        = (i) => setExperience(prev => prev.filter((_, idx) => idx !== i));

  const handleProjChange = (i, field, value) => setProjects(prev => { const a = [...prev]; a[i] = { ...a[i], [field]: value }; return a; });
  const addProj          = () => setProjects(prev => [...prev, { title: '', project_type: 'Web', tech_stack: '', description: '', github_link: '', team_size: 1, duration_weeks: 4, is_open_source: 'false', production_deployed: 'false' }]);
  const removeProj       = (i) => setProjects(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const payload = {
      ...formData,
      internships:    experience.length,
      skills:         formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      certifications: formData.certifications.split(',').map(s => s.trim()).filter(Boolean),
      education:      { ...education, institute_tier: Number(education.institute_tier) },
      soft_skills:    softSkills,
      work_experience: experience.map(exp => ({
        ...exp,
        is_relevant:     exp.is_relevant === 'true' || exp.is_relevant === true,
        duration_months: Number(exp.duration_months),
        tech_used:       typeof exp.tech_used === 'string' ? exp.tech_used.split(',').map(s => s.trim()).filter(Boolean) : exp.tech_used,
      })),
      projects: projects.map(p => ({
        ...p,
        team_size:           Number(p.team_size),
        duration_weeks:      Number(p.duration_weeks),
        is_open_source:      p.is_open_source === 'true' || p.is_open_source === true,
        production_deployed: p.production_deployed === 'true' || p.production_deployed === true,
        tech_stack:          typeof p.tech_stack === 'string' ? p.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : p.tech_stack,
      })),
    };

    try {
      const res  = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Could not connect to the ATS engine.');
    } finally {
      setLoading(false);
    }
  };

  // cert toggle helper
  const selectedCerts  = formData.certifications.split(',').map(s => s.trim()).filter(Boolean);
  const toggleCert = (cert) => {
    const next = selectedCerts.includes(cert)
      ? selectedCerts.filter(c => c !== cert)
      : [...selectedCerts, cert];
    setFormData(p => ({ ...p, certifications: next.join(', ') }));
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-[#111] selection:bg-[#111] selection:text-white pb-32">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#e0e0e0]">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <span className="text-sm font-bold tracking-tight">HireChance</span>
          <span className="text-[10px] font-bold text-[#888] uppercase tracking-widest">ATS v9</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-14 pb-10 px-6 text-center max-w-xl mx-auto animate-fade-up">
        <h1 className="text-[2.5rem] font-bold tracking-[-0.035em] leading-tight mb-2">Evaluate your hire.</h1>
        <p className="text-sm text-[#888] font-medium">Enterprise-grade candidate scoring engine.</p>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6">
        <div className={`grid gap-8 transition-all duration-500 ${
          result ? 'grid-cols-1 lg:grid-cols-[1fr_1.35fr]' : 'grid-cols-1 max-w-2xl mx-auto'
        }`}>

          {/* ════ FORM ════════════════════════════════════════════════════ */}
          <div className="animate-fade-up delay-100">
            <form onSubmit={handleSubmit} className="bg-white rounded-[1.75rem] border border-[#e0e0e0] p-8 space-y-8 shadow-[0_2px_20px_rgba(0,0,0,0.05)]">

              {/* 1. Candidate */}
              <div className={css.section}>
                <p className={css.head}>Candidate</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={css.label}>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} className={css.input} placeholder="Aryan Sharma" />
                  </div>
                  <div>
                    <label className={css.label}>Target Role</label>
                    <select name="target_role" value={formData.target_role} onChange={handleFormChange} className={css.select}>
                      {ROLES.map(r => <option key={r.key} value={r.value}>{r.value}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={css.label}>Total Experience (months)</label>
                    <input type="number" name="total_experience_months" min="0" value={formData.total_experience_months} onChange={handleFormChange} className={css.input} />
                  </div>
                </div>
              </div>

              {/* 2. Education */}
              <div className={css.section}>
                <p className={css.head}>Education</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={css.label}>Degree</label>
                    <select name="degree" value={education.degree} onChange={handleEduChange} className={css.select}>
                      {DEGREES.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={css.label}>Branch</label>
                    <select name="branch" value={education.branch} onChange={handleEduChange} className={css.select}>
                      {BRANCHES.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={css.label}>Institute Tier</label>
                    <select name="institute_tier" value={education.institute_tier} onChange={handleEduChange} className={css.select}>
                      {TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={css.label}>Graduation Year</label>
                    <select name="graduation_year" value={education.graduation_year} onChange={handleEduChange} className={css.select}>
                      {GRAD_YEARS.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={css.label}>CGPA (/ 10)</label>
                    <input type="number" name="cgpa" step="0.1" min="0" max="10" value={education.cgpa} onChange={handleEduChange} className={css.input} />
                  </div>
                  <div>
                    <label className={css.label}>Backlogs</label>
                    <select name="backlogs" value={education.backlogs} onChange={handleEduChange} className={css.select}>
                      {[0,1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n === 0 ? '0 — None' : n}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Technical Skills */}
              <div className={css.section}>
                <p className={css.head}>Technical Skills</p>
                <div>
                  <label className={css.label}>Skills (comma-separated)</label>
                  <textarea name="skills" rows="2" value={formData.skills} onChange={handleFormChange} className={css.input} placeholder="python, docker, kubernetes…" />
                </div>
              </div>

              {/* 4. Certifications */}
              <div className={css.section}>
                <p className={css.head}>Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {CERTS.map(cert => {
                    const active = selectedCerts.includes(cert);
                    return (
                      <button key={cert} type="button" onClick={() => toggleCert(cert)}
                        className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition-all duration-150 active:scale-95 ${
                          active ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#555] border-[#e0e0e0] hover:border-[#999]'
                        }`}>
                        {cert}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Coding & OSS */}
              <div className={css.section}>
                <p className={css.head}>Coding & Open Source</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={css.label}>Competitive Rating</label>
                    <input type="number" name="coding_rating" min="0" value={formData.coding_rating} onChange={handleFormChange} className={css.input} />
                  </div>
                  <div>
                    <label className={css.label}>LeetCode Solved</label>
                    <input type="number" name="leetcode_solved" min="0" value={formData.leetcode_solved} onChange={handleFormChange} className={css.input} />
                  </div>
                  <div>
                    <label className={css.label}>OSS PRs Merged</label>
                    <select name="open_source_contributions" value={formData.open_source_contributions} onChange={handleFormChange} className={css.select}>
                      {[0,1,2,3,4,5,6,7,8,9,10,15,20].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={css.label}>GitHub Stars (total)</label>
                    <input type="number" name="github_stars" min="0" value={formData.github_stars} onChange={handleFormChange} className={css.input} />
                  </div>
                </div>
              </div>

              {/* 6. Work Experience */}
              <div className={css.section}>
                <div className="flex items-center justify-between mb-4">
                  <p className={css.head} style={{ marginBottom: 0 }}>Work Experience</p>
                  <button type="button" onClick={addExp} className={css.addBtn}>+ Add</button>
                </div>
                <div className="space-y-4">
                  {experience.map((exp, i) => (
                    <div key={i} className="bg-[#f9f9f9] rounded-xl border border-[#e8e8e8] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-[#888] uppercase tracking-widest">Experience {i + 1}</span>
                        {experience.length > 1 && <button type="button" onClick={() => removeExp(i)} className={css.delBtn}>Remove</button>}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={css.label}>Company</label>
                          <input type="text" value={exp.company} onChange={e => handleExpChange(i, 'company', e.target.value)} className={css.input} placeholder="Company name" />
                        </div>
                        <div>
                          <label className={css.label}>Role / Title</label>
                          <input type="text" value={exp.role} onChange={e => handleExpChange(i, 'role', e.target.value)} className={css.input} placeholder="MLOps Intern" />
                        </div>
                        <div>
                          <label className={css.label}>Duration</label>
                          <select value={exp.duration_months} onChange={e => handleExpChange(i, 'duration_months', Number(e.target.value))} className={css.select}>
                            {[1,2,3,4,5,6,7,8,9,10,11,12,18,24,36].map(n => <option key={n} value={n}>{n} mo</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={css.label}>Relevant to Target Role?</label>
                          <select value={exp.is_relevant} onChange={e => handleExpChange(i, 'is_relevant', e.target.value)} className={css.select}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className={css.label}>Technologies Used</label>
                          <input type="text" value={exp.tech_used} onChange={e => handleExpChange(i, 'tech_used', e.target.value)} className={css.input} placeholder="python, docker, aws…" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Projects */}
              <div className={css.section}>
                <div className="flex items-center justify-between mb-4">
                  <p className={css.head} style={{ marginBottom: 0 }}>Projects</p>
                  <button type="button" onClick={addProj} className={css.addBtn}>+ Add</button>
                </div>
                <div className="space-y-4">
                  {projects.map((p, i) => (
                    <div key={i} className="bg-[#f9f9f9] rounded-xl border border-[#e8e8e8] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-[#888] uppercase tracking-widest">Project {i + 1}</span>
                        {projects.length > 1 && <button type="button" onClick={() => removeProj(i)} className={css.delBtn}>Remove</button>}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={css.label}>Title</label>
                          <input type="text" value={p.title} onChange={e => handleProjChange(i, 'title', e.target.value)} className={css.input} placeholder="Project title" />
                        </div>
                        <div>
                          <label className={css.label}>Type</label>
                          <select value={p.project_type} onChange={e => handleProjChange(i, 'project_type', e.target.value)} className={css.select}>
                            {PROJ_TYPES.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={css.label}>Team Size</label>
                          <select value={p.team_size} onChange={e => handleProjChange(i, 'team_size', Number(e.target.value))} className={css.select}>
                            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n === 1 ? '1 — Solo' : n}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={css.label}>Duration (weeks)</label>
                          <select value={p.duration_weeks} onChange={e => handleProjChange(i, 'duration_weeks', Number(e.target.value))} className={css.select}>
                            {[1,2,3,4,6,8,10,12,16,20,24].map(n => <option key={n} value={n}>{n} wks</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={css.label}>Open Source?</label>
                          <select value={p.is_open_source} onChange={e => handleProjChange(i, 'is_open_source', e.target.value)} className={css.select}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                        <div>
                          <label className={css.label}>Production Deployed?</label>
                          <select value={p.production_deployed} onChange={e => handleProjChange(i, 'production_deployed', e.target.value)} className={css.select}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className={css.label}>Tech Stack</label>
                          <input type="text" value={p.tech_stack} onChange={e => handleProjChange(i, 'tech_stack', e.target.value)} className={css.input} placeholder="python, docker, aws…" />
                        </div>
                        <div className="col-span-2">
                          <label className={css.label}>GitHub / Live URL</label>
                          <input type="text" value={p.github_link} onChange={e => handleProjChange(i, 'github_link', e.target.value)} className={css.input} placeholder="https://github.com/…" />
                        </div>
                        <div className="col-span-2">
                          <label className={css.label}>Description</label>
                          <textarea rows="2" value={p.description} onChange={e => handleProjChange(i, 'description', e.target.value)} className={css.input} placeholder="What you built and its impact…" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. Soft Skills */}
              <div className={css.section}>
                <p className={css.head}>Soft Skills</p>
                <div className="grid grid-cols-2 gap-4">
                  {[['communication','Communication'],['teamwork','Teamwork'],['problem_solving','Problem Solving'],['leadership','Leadership'],['adaptability','Adaptability']].map(([name, lbl]) => (
                    <div key={name}>
                      <label className={css.label}>{lbl}</label>
                      <select name={name} value={softSkills[name]} onChange={handleSoftChange} className={css.select}>
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{SKILL_LABELS[n]}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9. Achievements & Presence */}
              <div className={css.section}>
                <p className={css.head}>Achievements & Presence</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={css.label}>Hackathons Participated</label>
                    <select name="hackathons_participated" value={formData.hackathons_participated} onChange={handleFormChange} className={css.select}>
                      {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={css.label}>Hackathons Won</label>
                    <select name="hackathons_won" value={formData.hackathons_won} onChange={handleFormChange} className={css.select}>
                      {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={css.label}>Publications</label>
                    <select name="publications" value={formData.publications} onChange={handleFormChange} className={css.select}>
                      {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={css.label}>Online Presence (0–10)</label>
                    <select name="online_presence_score" value={formData.online_presence_score} onChange={handleFormChange} className={css.select}>
                      {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} — {PRESENCE_MAP[n]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={css.label}>Portfolio Website?</label>
                    <select value={String(formData.has_portfolio_site)} onChange={e => setFormData(p => ({ ...p, has_portfolio_site: e.target.value === 'true' }))} className={css.select}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className={css.label}>Video Resume?</label>
                    <select value={String(formData.has_video_resume)} onChange={e => setFormData(p => ({ ...p, has_video_resume: e.target.value === 'true' }))} className={css.select}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full rounded-full px-6 py-3.5 text-sm font-bold text-white bg-[#111] hover:bg-black transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
                {loading
                  ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin-slow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        <path d="M7 1a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Evaluating…
                    </span>
                  )
                  : 'Evaluate Candidate'}
              </button>
            </form>
          </div>

          {/* ════ RESULTS (also shown while loading so we scroll here) ════ */}
          {(loading || result) && (
            <div ref={resultsRef} className="space-y-4 scroll-mt-20">

              {/* Loading card — shown while waiting */}
              {loading && (
                <div className={`${css.card} animate-fade-in flex flex-col items-center justify-center py-16 gap-5`}>
                  <div className="relative w-11 h-11">
                    <div className="absolute inset-0 rounded-full border-2 border-[#e8e8e8]" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#111] animate-spin-slow" />
                  </div>
                  <div className="h-5 overflow-hidden">
                    <p key={stepIdx} className="text-sm font-semibold text-[#111] text-center animate-step-fade">
                      {STEPS[stepIdx]}
                    </p>
                  </div>
                  <p className="text-[11px] text-[#bbb] tracking-wide">Usually takes 2–4 seconds</p>
                </div>
              )}

              {/* Results — shown once loaded */}
              {result && (<>

              {/* Overview */}
              <div className={`${css.card} animate-fade-up`}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-0.5">{result.candidate_name}</p>
                    <h2 className="text-lg font-bold tracking-tight">{result.target_role}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-0.5">Grade</p>
                    <p className="text-4xl font-black leading-none">{result.ats_grade}</p>
                  </div>
                </div>
                <div className="bg-[#f6f6f6] rounded-2xl px-5 py-4 border border-[#e8e8e8] flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-1">ATS Score</p>
                    <p className="text-3xl font-bold">{result.ats_score}<span className="text-sm font-medium text-[#888]">/100</span></p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-1">Percentile</p>
                    <p className="text-xl font-bold">{result.percentile_estimate}<span className="text-xs text-[#888]">th</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-1">Decision</p>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                      result.hired ? 'bg-[#111] text-white' : 'bg-[#ebebeb] text-[#555]'
                    }`}>{result.hired ? 'Shortlisted' : 'Not Selected'}</span>
                  </div>
                </div>
                <p className="text-xs text-center font-medium text-[#555]">{result.shortlist_recommendation}</p>
              </div>

              {/* Interview Readiness */}
              <div className={`${css.card} animate-fade-up delay-100`}>
                <p className={css.head}>Interview Readiness</p>
                <p className="text-sm font-semibold text-[#111]">{result.interview_readiness}</p>
              </div>

              {/* Score Dimensions */}
              <div className={`${css.card} animate-fade-up delay-150`}>
                <p className={css.head}>Score Dimensions</p>
                <div className="space-y-4">
                  {Object.entries(result.dimensions).map(([key, data], i) => (
                    <div key={key}>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-xs font-semibold text-[#333]">{data.label}</span>
                        <span className="text-[10px] font-bold tabular-nums text-[#888]">
                          {data.score}<span className="text-[#bbb]">/{data.max_score}</span>
                          <span className="ml-1 text-[#aaa]">· {data.verdict}</span>
                        </span>
                      </div>
                      <ScoreBar pct={data.percentage} delay={`delay-${150 + i * 30}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Intelligence */}
              <div className={`${css.card} animate-fade-up delay-200`}>
                <p className={css.head}>Market Intelligence</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[
                    { l: 'Salary Band',     v: result.market_intelligence.salary_band },
                    { l: 'Supply Pressure', v: result.market_intelligence.supply_pressure.replace(/_/g, ' ') },
                    { l: 'Demand Index',    v: `${(result.market_intelligence.demand_index * 100).toFixed(0)}%` },
                    { l: 'Growth Trend',    v: result.market_intelligence.market_growth_trend },
                  ].map(({ l, v }) => (
                    <div key={l} className="bg-[#f6f6f6] rounded-xl p-3 border border-[#ebebeb]">
                      <p className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-1">{l}</p>
                      <p className="text-xs font-semibold capitalize">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#f6f6f6] rounded-xl px-4 py-3 border border-[#ebebeb]">
                  <p className="text-xs font-medium text-[#333]">{result.market_intelligence.hiring_outlook}</p>
                </div>
              </div>

              {/* Strengths & Gaps */}
              <div className="grid grid-cols-2 gap-4 animate-fade-up delay-250">
                <div className={css.card}>
                  <p className={css.head}>Strengths</p>
                  <ul className="space-y-2">
                    {result.strengths.slice(0, 5).map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#333]">
                        <span className="w-1 h-1 rounded-full bg-[#111] mt-1.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={css.card}>
                  <p className={css.head}>Skill Gaps</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.skill_gap.missing_bonus_skills.length > 0
                      ? result.skill_gap.missing_bonus_skills.map((sk, i) => <Tag key={i} muted>{sk}</Tag>)
                      : <span className="text-xs text-[#888]">No gaps detected.</span>}
                  </div>
                </div>
              </div>

              {/* Red Flags */}
              {result.red_flags.length > 0 && (
                <div className={`${css.card} animate-fade-up delay-300`}>
                  <p className={css.head}>Red Flags</p>
                  <ul className="space-y-2">
                    {result.red_flags.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#555]">
                        <span className="w-1 h-1 rounded-full bg-[#ccc] mt-1.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Feedback */}
              <div className={`${css.card} animate-fade-up delay-350`}>
                <p className={css.head}>Actionable Feedback</p>
                <ol className="space-y-2">
                  {result.actionable_feedback.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-[#333]">
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#f0f0f0] text-[#888] flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                      {f}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Resume Keywords */}
              <div className={`${css.card} animate-fade-up delay-400`}>
                <p className={css.head}>Resume Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.resume_keywords.map((kw, i) => (
                    <Tag key={i} muted={!formData.skills.toLowerCase().includes(kw)}>{kw}</Tag>
                  ))}
                </div>
              </div>

              </>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;