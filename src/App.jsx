import { useState, useEffect, useRef } from 'react';

function App() {
  const API_URL =
    'http://placement-api-env-v8.eba-tbpmmf2b.us-east-1.elasticbeanstalk.com/predict';

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const resultRef = useRef(null);

  const [formData, setFormData] = useState({
    target_role: 'mlops_engineer',
    cgpa: 8.0,
    internships: 1,
    coding_rating: 1200,
    skills: 'Python, AWS, Docker',
  });

  const [projects, setProjects] = useState([
    {
      title: 'HireChance Architecture',
      project_type: 'Cloud',
      tech_stack: 'AWS, Terraform',
    },
  ]);

  const roleCategories = [
    {
      label: 'AI & Data',
      roles: [
        { value: 'ai_engineer', label: 'AI Engineer' },
        { value: 'mlops_engineer', label: 'MLOps Engineer' },
        { value: 'data_scientist', label: 'Data Scientist' },
      ],
    },
    {
      label: 'Cloud & DevOps',
      roles: [
        { value: 'platform_engineer', label: 'Platform Engineer' },
        { value: 'cloud_architect', label: 'Cloud Architect' },
      ],
    },
    {
      label: 'Software Engineering',
      roles: [
        {
          value: 'frontend_developer',
          label: 'Frontend',
          badge: 'Saturated',
        },
        { value: 'backend_developer', label: 'Backend' },
        { value: 'full_stack_developer', label: 'Full Stack' },
        { value: 'ios_developer', label: 'iOS' },
      ],
    },
  ];

  useEffect(() => {
    if (result) {
      setAnimatedScore(0);
      const end = result.score;
      const duration = 1600;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedScore(Math.round(eased * end));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 200);
    }
  }, [result]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoleSelect = (value) =>
    setFormData({ ...formData, target_role: value });

  const handleProjectChange = (i, field, value) => {
    const u = [...projects];
    u[i][field] = value;
    setProjects(u);
  };

  const addProject = () =>
    setProjects([
      ...projects,
      { title: '', project_type: 'Web', tech_stack: '' },
    ]);

  const removeProject = (i) =>
    setProjects(projects.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const payload = {
      target_role: formData.target_role,
      cgpa: parseFloat(formData.cgpa),
      internships: parseInt(formData.internships),
      coding_rating: parseInt(formData.coding_rating),
      skills: formData.skills.split(',').map((s) => s.trim()),
      projects: projects.map((p) => ({
        title: p.title || 'Untitled',
        project_type: p.project_type,
        tech_stack: p.tech_stack
          ? p.tech_stack.split(',').map((s) => s.trim())
          : ['None'],
      })),
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setResult(await res.json());
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the API.');
    } finally {
      setLoading(false);
    }
  };

  const R = 88;
  const C = 2 * Math.PI * R;
  const offset = C - (animatedScore / 100) * C;
  const ringColor =
    animatedScore >= 65 ? '#34c759' : animatedScore >= 40 ? '#ff9f0a' : '#ff3b30';

  const skillPills = formData.skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] antialiased selection:bg-[#0071e3]/20 selection:text-[#0071e3]">
      {/* ───── Global Styles ───── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{font-family:'SF Pro Display','SF Pro Text','Inter',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif}

        @keyframes fadeInUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

        .anim-fiu{animation:fadeInUp .9s cubic-bezier(.16,1,.3,1) both}
        .anim-fi{animation:fadeIn .7s ease both}
        .anim-si{animation:scaleIn .7s cubic-bezier(.16,1,.3,1) both}
        .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}
        .d4{animation-delay:.4s}.d5{animation-delay:.5s}.d6{animation-delay:.6s}

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        input[type="number"]{-moz-appearance:textfield}
        select{-webkit-appearance:none;-moz-appearance:none;appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2386868b' d='M6 8.825a.75.75 0 01-.53-.22L2.22 5.355a.75.75 0 111.06-1.06L6 7.015l2.72-2.72a.75.75 0 111.06 1.06L6.53 8.605a.75.75 0 01-.53.22z'/%3E%3C/svg%3E");
          background-repeat:no-repeat;background-position:right 14px center;background-size:12px;padding-right:36px}
        ::-webkit-scrollbar{width:8px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#c7c7cc;border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:#a1a1a6}
      `}</style>

      {/* ───── Navigation ───── */}
      <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-[rgba(251,251,253,.72)] backdrop-saturate-[180%] border-b border-black/[.08]">
        <div className="mx-auto flex h-[44px] max-w-[980px] items-center justify-between px-6 lg:px-4">
          <a
            href="#top"
            className="text-[20px] font-semibold tracking-[-.02em] text-[#1d1d1f]"
          >
            HireChance
          </a>
          <div className="hidden items-center gap-7 text-[12px] font-normal text-[#424245] sm:flex">
            <a href="#predict" className="transition-colors hover:text-[#1d1d1f]">
              Predict
            </a>
            <a href="#how" className="transition-colors hover:text-[#1d1d1f]">
              How It Works
            </a>
            <a
              href="#predict"
              className="rounded-full bg-[#0071e3] px-[14px] py-[5px] text-[12px] font-normal text-white transition-colors hover:bg-[#0077ed]"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <header id="top" className="px-6 pb-[56px] pt-[140px] text-center">
        <div className="mx-auto max-w-[600px]">
          <p className="mb-3 text-[14px] font-semibold uppercase tracking-[.06em] text-[#0071e3]">
            AI-Powered Predictions
          </p>
          <h1 className="mb-3 text-[52px] font-bold leading-[1.05] tracking-[-.025em] text-[#1d1d1f] md:text-[72px] lg:text-[80px]">
            HireChance.
          </h1>
          <p className="text-[21px] font-semibold leading-[1.381] tracking-[-.01em] text-[#1d1d1f] md:text-[28px]">
            Know before you apply.
          </p>
          <p className="mx-auto mt-4 max-w-[460px] text-[17px] leading-[1.47] text-[#86868b]">
            Real-time placement predictions powered by machine learning and
            live market dynamics.
          </p>
        </div>
      </header>

      {/* ───── How It Works ───── */}
      <section id="how" className="border-y border-[#d2d2d7]/50 bg-white py-[56px]">
        <div className="mx-auto grid max-w-[980px] grid-cols-1 gap-8 px-6 md:grid-cols-3 lg:px-4">
          {[
            {
              step: '01',
              title: 'Enter your profile',
              desc: 'Academic metrics, skills, and the projects you\'ve built.',
            },
            {
              step: '02',
              title: 'AI analyzes fit',
              desc: 'Your profile is scored against real role-specific market data.',
            },
            {
              step: '03',
              title: 'Get your prediction',
              desc: 'An instant, detailed breakdown of your placement probability.',
            },
          ].map((item) => (
            <div key={item.step} className="text-center md:text-left">
              <p className="mb-2 text-[12px] font-semibold text-[#86868b] tracking-[.04em]">
                {item.step}
              </p>
              <p className="mb-1 text-[17px] font-semibold text-[#1d1d1f]">
                {item.title}
              </p>
              <p className="text-[15px] leading-[1.47] text-[#86868b]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Form ───── */}
      <section id="predict" className="mx-auto max-w-[680px] px-6 py-[80px]">
        <form onSubmit={handleSubmit}>
          {/* — Role Selection — */}
          <div className="mb-[64px]">
            <h3 className="text-[28px] font-semibold leading-[1.14] tracking-[-.02em] text-[#1d1d1f]">
              Choose your role.
            </h3>
            <p className="mt-2 text-[17px] leading-[1.47] text-[#86868b]">
              Market dynamics are factored in automatically.
            </p>

            <div className="mt-8 space-y-7">
              {roleCategories.map((cat) => (
                <div key={cat.label}>
                  <p className="mb-3 text-[12px] font-semibold uppercase tracking-[.06em] text-[#86868b]">
                    {cat.label}
                  </p>
                  <div className="flex flex-wrap gap-[10px]">
                    {cat.roles.map((role) => {
                      const active = formData.target_role === role.value;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => handleRoleSelect(role.value)}
                          className={`relative rounded-full border px-[18px] py-[9px] text-[14px] font-medium transition-all duration-300
                            ${
                              active
                                ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white shadow-[0_1px_6px_rgba(0,0,0,.24)]'
                                : 'border-[#d2d2d7] bg-white text-[#1d1d1f] hover:border-[#86868b] hover:shadow-[0_1px_4px_rgba(0,0,0,.06)]'
                            }`}
                        >
                          {role.label}
                          {role.badge && (
                            <span
                              className={`ml-1.5 inline-block rounded-full px-[6px] py-[1px] text-[10px] font-semibold leading-[16px] ${
                                active
                                  ? 'bg-white/20 text-white/80'
                                  : 'bg-[#ff3b30]/10 text-[#ff3b30]'
                              }`}
                            >
                              {role.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* — Metrics — */}
          <div className="mb-[64px]">
            <h3 className="text-[28px] font-semibold leading-[1.14] tracking-[-.02em] text-[#1d1d1f]">
              Your numbers.
            </h3>
            <p className="mt-2 text-[17px] leading-[1.47] text-[#86868b]">
              Academic performance and competitive programming metrics.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                {
                  label: 'CGPA',
                  name: 'cgpa',
                  step: '0.1',
                  ph: '8.5',
                  sub: '/ 10',
                },
                {
                  label: 'Internships',
                  name: 'internships',
                  step: '1',
                  ph: '2',
                  sub: 'completed',
                },
                {
                  label: 'Coding Rating',
                  name: 'coding_rating',
                  step: '1',
                  ph: '1500',
                  sub: 'e.g. Codeforces',
                },
              ].map((f) => (
                <label key={f.name} className="block">
                  <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[.06em] text-[#86868b]">
                    {f.label}
                  </span>
                  <input
                    type="number"
                    step={f.step}
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    placeholder={f.ph}
                    required
                    className="w-full rounded-[14px] border border-[#d2d2d7]/60 bg-[#f5f5f7] px-4 py-[14px] text-[17px] text-[#1d1d1f] outline-none transition-all duration-200 placeholder:text-[#86868b]/40 focus:border-[#0071e3] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,113,227,.12)]"
                  />
                  <span className="mt-1.5 block text-[12px] text-[#86868b]">
                    {f.sub}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* — Skills — */}
          <div className="mb-[64px]">
            <h3 className="text-[28px] font-semibold leading-[1.14] tracking-[-.02em] text-[#1d1d1f]">
              Technical skills.
            </h3>
            <p className="mt-2 text-[17px] leading-[1.47] text-[#86868b]">
              Separate each skill with a comma.
            </p>

            <div className="mt-8">
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Python, React, AWS, Docker, Kubernetes"
                required
                className="w-full rounded-[14px] border border-[#d2d2d7]/60 bg-[#f5f5f7] px-4 py-[14px] text-[17px] text-[#1d1d1f] outline-none transition-all duration-200 placeholder:text-[#86868b]/40 focus:border-[#0071e3] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,113,227,.12)]"
              />
              {skillPills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {skillPills.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-[#e8e8ed] px-[12px] py-[5px] text-[13px] font-medium text-[#1d1d1f]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* — Projects — */}
          <div className="mb-[64px]">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-[28px] font-semibold leading-[1.14] tracking-[-.02em] text-[#1d1d1f]">
                  Projects.
                </h3>
                <p className="mt-2 text-[17px] leading-[1.47] text-[#86868b]">
                  Quality projects can significantly impact your score.
                </p>
              </div>
              <button
                type="button"
                onClick={addProject}
                className="shrink-0 text-[14px] font-medium text-[#0071e3] transition-colors hover:text-[#0077ed]"
              >
                + Add
              </button>
            </div>

            <div className="mt-8 space-y-3">
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="group relative rounded-[20px] border border-[#d2d2d7]/40 bg-[#f5f5f7] p-6 transition-all duration-300 hover:border-[#d2d2d7] hover:shadow-[0_2px_16px_rgba(0,0,0,.06)]"
                >
                  <button
                    type="button"
                    onClick={() => removeProject(i)}
                    className="absolute right-4 top-4 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white text-[12px] text-[#86868b] opacity-0 shadow-sm transition-all duration-200 hover:text-[#1d1d1f] group-hover:opacity-100"
                  >
                    ✕
                  </button>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Project name"
                        value={p.title}
                        onChange={(e) =>
                          handleProjectChange(i, 'title', e.target.value)
                        }
                        required
                        className="w-full border-b border-[#d2d2d7] bg-transparent py-[8px] text-[15px] text-[#1d1d1f] outline-none transition-colors placeholder:text-[#86868b]/40 focus:border-[#0071e3]"
                      />
                      <select
                        value={p.project_type}
                        onChange={(e) =>
                          handleProjectChange(i, 'project_type', e.target.value)
                        }
                        className="w-full cursor-pointer border-b border-[#d2d2d7] bg-transparent py-[8px] text-[15px] text-[#1d1d1f] outline-none transition-colors focus:border-[#0071e3]"
                      >
                        <option value="Web">Web</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Cloud">Cloud / DevOps</option>
                        <option value="AI">AI / ML</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Tech stack — e.g. Python, TensorFlow, Docker"
                      value={p.tech_stack}
                      onChange={(e) =>
                        handleProjectChange(i, 'tech_stack', e.target.value)
                      }
                      required
                      className="w-full border-b border-[#d2d2d7] bg-transparent py-[8px] text-[15px] text-[#1d1d1f] outline-none transition-colors placeholder:text-[#86868b]/40 focus:border-[#0071e3]"
                    />
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
                <div className="rounded-[20px] border border-dashed border-[#d2d2d7] py-14 text-center">
                  <p className="text-[15px] text-[#86868b]">
                    No projects added yet.
                  </p>
                  <button
                    type="button"
                    onClick={addProject}
                    className="mt-2 text-[15px] font-medium text-[#0071e3] hover:underline"
                  >
                    Add your first project
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* — Submit — */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-[#0071e3] px-[28px] py-[16px] text-[17px] font-normal tracking-[-.01em] text-white transition-all duration-300 hover:bg-[#0077ed] hover:shadow-[0_4px_20px_rgba(0,113,227,.35)] active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg
                    className="h-[18px] w-[18px] animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      className="opacity-75"
                    />
                  </svg>
                  Analyzing…
                </span>
              ) : (
                'Run Prediction'
              )}
            </button>
            <p className="mt-4 text-[12px] text-[#86868b]">
              Your data is processed in real-time and never stored.
            </p>
          </div>
        </form>
      </section>

      {/* ───── Results ───── */}
      {result && (
        <>
          <div className="mx-auto max-w-[980px] px-6">
            <div className="h-px bg-[#d2d2d7]/50" />
          </div>

          <section
            ref={resultRef}
            className="mx-auto max-w-[680px] scroll-mt-[60px] px-6 py-[80px]"
          >
            {/* Score Hero */}
            <div className="anim-fiu mb-[64px] text-center">
              <p className="mb-6 text-[12px] font-semibold uppercase tracking-[.1em] text-[#86868b]">
                Prediction Result
              </p>

              {/* Ring */}
              <div className="relative mx-auto mb-8 inline-flex items-center justify-center">
                <svg
                  width="224"
                  height="224"
                  viewBox="0 0 224 224"
                  className="-rotate-90"
                >
                  <circle
                    cx="112"
                    cy="112"
                    r={R}
                    fill="none"
                    stroke="#f5f5f7"
                    strokeWidth="7"
                  />
                  <circle
                    cx="112"
                    cy="112"
                    r={R}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={offset}
                    style={{
                      transition:
                        'stroke-dashoffset 1.6s cubic-bezier(.16,1,.3,1), stroke .4s ease',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[56px] font-bold tracking-[-.04em] text-[#1d1d1f]">
                    {animatedScore}
                  </span>
                  <span className="-mt-1 text-[13px] font-medium text-[#86868b]">
                    out of 100
                  </span>
                </div>
              </div>

              <h2 className="mb-2 text-[32px] font-bold tracking-[-.02em] text-[#1d1d1f]">
                {result.placed ? 'Strong candidate.' : 'Needs improvement.'}
              </h2>
              <p className="mx-auto max-w-[440px] text-[17px] leading-[1.47] text-[#86868b]">
                {result.placed
                  ? 'Your profile shows strong alignment with current market demands for this role.'
                  : 'Focus on the areas below to strengthen your profile and improve your placement odds.'}
              </p>
            </div>

            {/* Breakdown */}
            <div className="anim-fiu d2 mb-[64px]">
              <h3 className="mb-8 text-[24px] font-semibold tracking-[-.02em] text-[#1d1d1f]">
                Score Breakdown
              </h3>

              <div className="space-y-6">
                {[
                  {
                    label: 'Academics',
                    val: result.breakdown.cgpa,
                    max: 40,
                  },
                  {
                    label: 'Experience',
                    val: result.breakdown.internships,
                    max: 20,
                  },
                  {
                    label: 'Coding',
                    val: result.breakdown.coding_rating,
                    max: 25,
                  },
                  {
                    label: 'Skills',
                    val: result.breakdown.skills,
                    max: 10,
                  },
                  {
                    label: 'Portfolio',
                    val: result.breakdown.projects,
                    max: 5,
                  },
                ].map((item, idx) => {
                  const pct = (item.val / item.max) * 100;
                  const barColor =
                    pct >= 70 ? '#34c759' : pct >= 40 ? '#ff9f0a' : '#ff3b30';
                  return (
                    <div key={item.label}>
                      <div className="mb-[6px] flex items-baseline justify-between">
                        <span className="text-[15px] font-medium text-[#1d1d1f]">
                          {item.label}
                        </span>
                        <span className="tabular-nums text-[15px] text-[#86868b]">
                          {item.val}
                          <span className="mx-[3px] text-[#d2d2d7]">/</span>
                          {item.max}
                        </span>
                      </div>
                      <div className="h-[5px] overflow-hidden rounded-full bg-[#f5f5f7]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: barColor,
                            transition: `width 1.2s cubic-bezier(.16,1,.3,1) ${idx * 120}ms`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Market Intelligence */}
            <div className="anim-fiu d4">
              <h3 className="mb-8 text-[24px] font-semibold tracking-[-.02em] text-[#1d1d1f]">
                Market Intelligence
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-[20px] border border-[#d2d2d7]/40 bg-white p-7 transition-shadow hover:shadow-[0_2px_16px_rgba(0,0,0,.06)]">
                  <p className="mb-2 text-[12px] font-semibold uppercase tracking-[.06em] text-[#86868b]">
                    Market Adjustment
                  </p>
                  <p
                    className={`text-[36px] font-bold tracking-[-.03em] ${
                      result.breakdown.market_adjustment >= 0
                        ? 'text-[#34c759]'
                        : 'text-[#ff3b30]'
                    }`}
                  >
                    {result.breakdown.market_adjustment >= 0 ? '+' : ''}
                    {result.breakdown.market_adjustment}
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.38] text-[#86868b]">
                    points based on current role demand
                  </p>
                </div>
                <div className="rounded-[20px] border border-[#d2d2d7]/40 bg-white p-7 transition-shadow hover:shadow-[0_2px_16px_rgba(0,0,0,.06)]">
                  <p className="mb-2 text-[12px] font-semibold uppercase tracking-[.06em] text-[#86868b]">
                    Supply Level
                  </p>
                  <p className="text-[36px] font-bold capitalize tracking-[-.03em] text-[#1d1d1f]">
                    {result.market_insights.market_supply.replace(/_/g, ' ')}
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.38] text-[#86868b]">
                    for{' '}
                    {result.market_insights.target_role_detected.replace(
                      /_/g,
                      ' '
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ───── Footer ───── */}
      <footer className="border-t border-[#d2d2d7]/50 bg-[#f5f5f7]">
        <div className="mx-auto max-w-[980px] px-6 py-[14px] lg:px-4">
          <div className="flex flex-col items-center justify-between gap-2 text-[12px] text-[#86868b] sm:flex-row">
            <p>
              Copyright © {new Date().getFullYear()} HireChance. All rights
              reserved.
            </p>
            <p>
              Built with machine learning. Not affiliated with any recruiter.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;