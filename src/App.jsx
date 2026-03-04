import { useState } from 'react';

function App() {
  const API_URL = "http://placement-api-env-v8.eba-tbpmmf2b.us-east-1.elasticbeanstalk.com/predict";
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 1. Basic Form Data
  const [formData, setFormData] = useState({
    target_role: "mlops_engineer",
    cgpa: 8.0,
    internships: 1,
    coding_rating: 1200,
    skills: "Python, AWS, Docker", 
  });

  // 2. Dynamic Projects Array State
  const [projects, setProjects] = useState([
    { title: "MyFirstApp", project_type: "Web", tech_stack: "React, Node" }
  ]);

  // Handle Basic Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Dynamic Project Handlers ---
  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const addProject = () => {
    setProjects([...projects, { title: "", project_type: "Web", tech_stack: "" }]);
  };

  const removeProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  // --- Submit to AWS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Format the projects array for the API (splitting comma-separated tech stacks)
    const formattedProjects = projects.map(p => ({
      title: p.title || "Untitled Project",
      project_type: p.project_type,
      tech_stack: p.tech_stack ? p.tech_stack.split(',').map(s => s.trim()) : ["None"]
    }));

    const payload = {
      target_role: formData.target_role,
      cgpa: parseFloat(formData.cgpa),
      internships: parseInt(formData.internships),
      coding_rating: parseInt(formData.coding_rating),
      skills: formData.skills.split(',').map(skill => skill.trim()),
      projects: formattedProjects
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the API. Check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">HireChance <span className="text-blue-600">AI</span></h1>
          <p className="mt-3 text-xl text-gray-500">Market-Aware Placement Prediction Engine</p>
        </div>

        <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Target Role */}
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <label className="block text-sm font-bold text-blue-900 mb-2">Target Role (Triggers Market Engine)</label>
              <select name="target_role" value={formData.target_role} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-white border">
                <optgroup label="AI & Data">
                  <option value="ai_engineer">AI Engineer</option>
                  <option value="mlops_engineer">MLOps Engineer</option>
                  <option value="data_scientist">Data Scientist</option>
                </optgroup>
                <optgroup label="Cloud & DevOps">
                  <option value="platform_engineer">Platform Engineer</option>
                  <option value="cloud_architect">Cloud Architect</option>
                </optgroup>
                <optgroup label="Software Engineering">
                  <option value="frontend_developer">Frontend Developer (Saturated Market)</option>
                  <option value="backend_developer">Backend Developer</option>
                  <option value="full_stack_developer">Full Stack Developer</option>
                  <option value="ios_developer">iOS Developer</option>
                </optgroup>
              </select>
            </div>

            {/* Section 2: Core Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">CGPA (out of 10)</label>
                <input type="number" step="0.1" name="cgpa" value={formData.cgpa} onChange={handleChange} className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm p-3 bg-gray-50 border" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Internships</label>
                <input type="number" name="internships" value={formData.internships} onChange={handleChange} className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm p-3 bg-gray-50 border" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Coding Rating</label>
                <input type="number" name="coding_rating" value={formData.coding_rating} onChange={handleChange} className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm p-3 bg-gray-50 border" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Technical Skills (Comma separated)</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Python, Swift, Terraform" className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm p-3 bg-gray-50 border" required />
            </div>

            <hr className="border-gray-200" />

            {/* Section 3: Dynamic Projects */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-lg font-bold text-gray-900">Portfolio Projects</label>
                <button type="button" onClick={addProject} className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  + Add Project
                </button>
              </div>

              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                    <button type="button" onClick={() => removeProject(index)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-200 font-bold border border-red-200">
                      ×
                    </button>
                    
                    <div className="flex-1">
                      <input type="text" placeholder="Project Title" value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm p-2 text-sm border" required />
                    </div>
                    
                    <div className="w-full md:w-1/4">
                      <select value={project.project_type} onChange={(e) => handleProjectChange(index, 'project_type', e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm p-2 text-sm border bg-white">
                        <option value="Web">Web</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Cloud">Cloud</option>
                        <option value="AI">AI/ML</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <input type="text" placeholder="Tech Stack (e.g. React, AWS)" value={project.tech_stack} onChange={(e) => handleProjectChange(index, 'tech_stack', e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm p-2 text-sm border" required />
                    </div>
                  </div>
                ))}
                {projects.length === 0 && <p className="text-sm text-gray-500 italic">No projects added. (Warning: This heavily impacts your score!)</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="w-full py-4 px-6 rounded-xl shadow-lg text-xl font-bold text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 transition-all transform hover:scale-[1.01]">
              {loading ? "Analyzing Market Data..." : "Run Prediction Engine"}
            </button>
          </form>
        </div>

        {/* Results Dashboard */}
        {result && (
          <div className={`shadow-2xl rounded-3xl p-8 border-t-8 transform transition-all animate-fade-in-up ${result.placed ? 'border-green-500 bg-white' : 'border-red-500 bg-white'}`}>
            <h2 className="text-4xl font-extrabold text-center mb-2 text-gray-900">
              {result.placed ? "🎉 Hire Highly Likely" : "⚠️ High Risk Candidate"}
            </h2>
            <p className="text-center text-gray-500 mb-8 font-medium">Placement Probability Score</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Score Box */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Score</p>
                <p className={`text-6xl font-black ${result.score >= 60 ? 'text-green-500' : 'text-red-500'}`}>
                  {result.score}
                </p>
                <p className="text-sm text-gray-500 mt-2">Threshold: 60</p>
              </div>

              {/* Market Box */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">Market Impact</p>
                <p className={`text-5xl font-black ${result.breakdown.market_adjustment >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {result.breakdown.market_adjustment >= 0 ? '+' : ''}{result.breakdown.market_adjustment}
                </p>
                <p className="text-sm text-blue-800 mt-3 font-medium">
                  Applying as: <span className="font-bold">{result.market_insights.target_role_detected}</span>
                </p>
                <p className="text-xs text-blue-600 mt-1">Supply Level: {result.market_insights.market_supply}</p>
              </div>
            </div>

            {/* Score Breakdown Bar */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Score Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Academics (CGPA)</span><span className="font-bold">{result.breakdown.cgpa} / 40</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Internships</span><span className="font-bold">{result.breakdown.internships} / 20</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Coding Skills</span><span className="font-bold">{result.breakdown.coding_rating} / 25</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Tech Stack</span><span className="font-bold">{result.breakdown.skills} / 10</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Portfolio</span><span className="font-bold">{result.breakdown.projects} / 5</span></div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;