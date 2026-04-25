import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import {
    Briefcase,
    ChevronRight,
    ChevronDown,
    Code2,
    Cpu,
    Database as DbIcon,
    Globe,
    Layers,
    Sparkles,
    X,
    BrainCircuit,
    Bug,
    Wand2,
    Target,
    Zap,
    Loader2
} from 'lucide-react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const SkillItem = ({ label, percentage, delay = 0 }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-black text-primary-400 italic">{percentage}%</span>
        </div>
        <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[1px]">
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay, ease: [0.23, 1, 0.32, 1] }}
                className="h-full bg-gradient-to-r from-primary-600 via-indigo-500 to-sky-400 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.3)]"
            />
        </div>
    </div>
);

const CareerCard = ({ title, icon: Icon, description, match, tags, onClick, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8 }}
        whileHover={{ y: -8 }}
        className="group relative h-full"
        onClick={onClick}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <div className="relative h-full bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl hover:bg-slate-900/60 transition-all cursor-pointer overflow-hidden flex flex-col shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/[0.03] transition-all" />
            
            <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 group-hover:bg-white group-hover:text-slate-950 transition-all duration-500">
                    <Icon size={24} />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                    {match}% Match
                </div>
            </div>
            
            <h3 className="text-2xl font-black text-white italic tracking-tighter mb-3 uppercase leading-none">{title}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
                {description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                {tags.map(tag => (
                    <span key={tag} className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                        {tag}
                    </span>
                ))}
            </div>
            
            <button
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-primary-600 group-hover:text-white text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
                Initiate Protocol
                <ChevronRight size={16} />
            </button>
        </div>
    </motion.div>
);

const pathwaySkillsData = {
    "Full-Stack Developer": [
        { name: "HTML/CSS", level: 90 },
        { name: "JavaScript/TypeScript", level: 85 },
        { name: "React/Next.js", level: 80 },
        { name: "Node.js/Express", level: 75 },
        { name: "SQL/NoSQL Databases", level: 70 },
        { name: "Version Control (Git)", level: 85 },
        { name: "API Design (REST/GraphQL)", level: 75 },
    ],
    "Cloud Architect": [
        { name: "Linux Administration", level: 80 },
        { name: "AWS/Azure/GCP", level: 85 },
        { name: "Docker & Kubernetes", level: 75 },
        { name: "Infrastructure as Code (Terraform)", level: 70 },
        { name: "Networking & Security", level: 75 },
        { name: "CI/CD Pipelines", level: 70 },
    ],
    "Data Scientist": [
        { name: "Python/R", level: 90 },
        { name: "SQL", level: 80 },
        { name: "Machine Learning Algorithms", level: 75 },
        { name: "Data Visualization (Tableau/PowerBI)", level: 70 },
        { name: "Statistics & Mathematics", level: 85 },
        { name: "Pandas/NumPy", level: 85 },
    ],
    "AI/Machine Learning Engineer": [
        { name: "Python", level: 95 },
        { name: "Deep Learning (TensorFlow/PyTorch)", level: 85 },
        { name: "Neural Networks", level: 80 },
        { name: "NLP / Computer Vision", level: 75 },
        { name: "MLOps & Model Deployment", level: 70 },
        { name: "Data Processing Pipelines", level: 80 },
    ],
    "QA/Testing Engineer": [
        { name: "Manual Testing Methodologies", level: 90 },
        { name: "Automated Testing (Selenium/Cypress)", level: 85 },
        { name: "API Testing (Postman/RestAssured)", level: 80 },
        { name: "CI/CD Integration", level: 75 },
        { name: "Performance Testing (JMeter)", level: 70 },
        { name: "Defect Tracking (Jira)", level: 85 },
    ],
    "UX/UI Designer": [
        { name: "Figma/Adobe XD", level: 95 },
        { name: "User Research & Testing", level: 85 },
        { name: "Wireframing & Prototyping", level: 90 },
        { name: "Information Architecture", level: 80 },
        { name: "Interaction Design", level: 85 },
        { name: "Basic HTML/CSS", level: 60 },
    ]
};

const getDomainMaxScore = (domainName) => {
    return pathwaySkillsData[domainName]?.reduce((sum, skill) => sum + skill.level, 0) || 1;
};

const CareerGuidance = () => {
    const [selectedPathway, setSelectedPathway] = useState(null);
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [selectedDomainToAdd, setSelectedDomainToAdd] = useState("");
    const [selectedSkillToAdd, setSelectedSkillToAdd] = useState("");
    const [expandedDomains, setExpandedDomains] = useState({});
    const [acquiredSkills, setAcquiredSkills] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const toggleDomain = (domain) => {
        setExpandedDomains(prev => ({
            ...prev,
            [domain]: !prev[domain]
        }));
    };

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await api.get('/students/dashboard');
                if (response.data.success && response.data.data.skills) {
                    const skillsFromBackend = response.data.data.skills;
                    const grouped = {};
                    skillsFromBackend.forEach(s => {
                        Object.entries(pathwaySkillsData).forEach(([domain, domainSkills]) => {
                            if (domainSkills.find(ds => ds.name === s.name)) {
                                if (!grouped[domain]) grouped[domain] = [];
                                if (!grouped[domain].find(ex => ex.name === s.name)) {
                                    grouped[domain].push(s);
                                }
                            }
                        });
                    });
                    setAcquiredSkills(grouped);
                }
            } catch (error) {
                console.error('Error fetching skills:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSkills();
    }, []);

    const syncSkillsToBackend = async (newAcquiredSkills) => {
        try {
            const flatSkills = [];
            const seen = new Set();
            Object.values(newAcquiredSkills).forEach(domainSkills => {
                domainSkills.forEach(s => {
                    if (!seen.has(s.name)) {
                        flatSkills.push(s);
                        seen.add(s.name);
                    }
                });
            });
            await api.put('/students/skills', { skills: flatSkills });
        } catch (error) {
            console.error('Error syncing skills to backend:', error);
        }
    };

    const calculateDomainScore = (domain) => {
        const skillsArray = acquiredSkills[domain] || [];
        const currentSum = skillsArray.reduce((sum, skill) => sum + skill.level, 0);
        const maxSum = getDomainMaxScore(domain);
        return Math.min(100, Math.round((currentSum / maxSum) * 100));
    };

    const allDomains = Object.keys(pathwaySkillsData);
    const displaySkills = allDomains.map(domain => ({
        label: domain,
        percentage: calculateDomainScore(domain)
    }));

    const radarDataState = {
        labels: allDomains,
        datasets: [
            {
                label: 'Current Proficiency (%)',
                data: allDomains.map(d => calculateDomainScore(d)),
                backgroundColor: 'rgba(14, 165, 233, 0.2)',
                borderColor: '#0ea5e9',
                borderWidth: 3,
                pointBackgroundColor: '#0ea5e9',
                pointBorderColor: '#fff',
                pointRadius: 4,
            },
            {
                label: 'Industry Target',
                data: allDomains.map(() => 100),
                backgroundColor: 'transparent',
                borderColor: 'rgba(255,255,255,0.05)',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
            },
        ],
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                pointLabels: { 
                    color: '#64748b', 
                    font: { weight: 'black', size: 10, family: 'Inter' },
                    padding: 20
                },
                ticks: { display: false },
                suggestedMin: 0,
                suggestedMax: 100,
            },
        },
        plugins: {
            legend: { 
                position: 'bottom', 
                labels: { 
                    color: '#94a3b8', 
                    font: { weight: 'bold', size: 10, family: 'Inter' },
                    usePointStyle: true,
                    padding: 30
                } 
            },
        },
    };

    const handleAddSkill = async () => {
        if (!selectedDomainToAdd || !selectedSkillToAdd) return;
        const domainSkills = pathwaySkillsData[selectedDomainToAdd];
        const skillData = domainSkills.find(s => s.name === selectedSkillToAdd);
        if (!skillData) return;

        const newAcquiredSkills = { ...acquiredSkills };
        const domainAcquired = newAcquiredSkills[selectedDomainToAdd] || [];
        if (domainAcquired.some(s => s.name === selectedSkillToAdd)) {
            setIsAddingSkill(false);
            return;
        }

        newAcquiredSkills[selectedDomainToAdd] = [...domainAcquired, skillData];
        setAcquiredSkills(newAcquiredSkills);
        await syncSkillsToBackend(newAcquiredSkills);
        setIsAddingSkill(false);
        setSelectedDomainToAdd("");
        setSelectedSkillToAdd("");
    };

    const handleRemoveSkill = async (domain, skillNameToRemove) => {
        const newAcquiredSkills = { ...acquiredSkills };
        const domainAcquired = newAcquiredSkills[domain] || [];
        newAcquiredSkills[domain] = domainAcquired.filter(s => s.name !== skillNameToRemove);
        setAcquiredSkills(newAcquiredSkills);
        await syncSkillsToBackend(newAcquiredSkills);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary-500" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <header>
                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Pathway Strategist</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Career Projection & Skill gap analysis</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Profile Summary & Skills */}
                <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl shadow-2xl space-y-10">
                    <div>
                        <h2 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-3 mb-8">
                            <Sparkles className="text-amber-400" size={24} />
                            Skill Core
                        </h2>
                        <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin">
                            {displaySkills.map((domainSkill, index) => {
                                const domainSkillsAdded = acquiredSkills[domainSkill.label] || [];
                                const isExpanded = expandedDomains[domainSkill.label];

                                return (
                                    <div key={index} className="space-y-4 pb-6 border-b border-white/5 last:border-0 relative group/domain">
                                        <div
                                            className="cursor-pointer relative"
                                            onClick={() => toggleDomain(domainSkill.label)}
                                        >
                                            <div className="absolute right-0 top-0 -mt-1 opacity-0 group-hover/domain:opacity-100 transition-opacity p-2 bg-white/5 rounded-lg z-10 transition-all">
                                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </div>
                                            <SkillItem label={domainSkill.label} percentage={domainSkill.percentage} />
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="space-y-2.5 mt-4 ml-2 pl-4 border-l-2 border-white/5">
                                                        {domainSkillsAdded.length > 0 ? (
                                                            domainSkillsAdded.map((skill, sIdx) => (
                                                                <div key={sIdx} className="flex items-center justify-between group/skill">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500/30" />
                                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{skill.name}</span>
                                                                    </div>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleRemoveSkill(domainSkill.label, skill.name); }}
                                                                        className="text-slate-700 hover:text-rose-500 opacity-0 group-hover/skill:opacity-100 transition-all p-1"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-[10px] text-slate-600 italic uppercase font-black tracking-widest">Awaiting input...</div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6 italic">Configuration Area</h3>
                        {!isAddingSkill ? (
                            <button
                                onClick={() => setIsAddingSkill(true)}
                                className="w-full py-4 bg-white/5 hover:bg-white text-slate-200 hover:text-slate-950 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                            >
                                Reconfigure Skillset
                            </button>
                        ) : (
                            <div className="space-y-4 bg-slate-950/60 p-6 rounded-2xl border border-white/10 shadow-inner">
                                <div className="space-y-2">
                                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-widest pl-1">Domain Node</label>
                                    <select
                                        className="w-full bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-xl p-3 focus:ring-1 focus:ring-primary-500 outline-none transition-all uppercase font-medium"
                                        value={selectedDomainToAdd}
                                        onChange={(e) => {
                                            setSelectedDomainToAdd(e.target.value);
                                            setSelectedSkillToAdd("");
                                        }}
                                    >
                                        <option value="">Select Domain...</option>
                                        {Object.keys(pathwaySkillsData).map(domain => (
                                            <option key={domain} value={domain}>{domain}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedDomainToAdd && (
                                    <div className="space-y-2">
                                        <label className="text-[8px] text-slate-500 font-black uppercase tracking-widest pl-1">Capability</label>
                                        <select
                                            className="w-full bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-xl p-3 focus:ring-1 focus:ring-primary-500 outline-none transition-all uppercase font-medium"
                                            value={selectedSkillToAdd}
                                            onChange={(e) => setSelectedSkillToAdd(e.target.value)}
                                        >
                                            <option value="">Select Skill...</option>
                                            {pathwaySkillsData[selectedDomainToAdd].map(skill => (
                                                <option key={skill.name} value={skill.name}>
                                                    {skill.name} ({skill.level}%)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleAddSkill}
                                        disabled={!selectedDomainToAdd || !selectedSkillToAdd}
                                        className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary-600/10"
                                    >
                                        Authenticate
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsAddingSkill(false);
                                            setSelectedDomainToAdd("");
                                            setSelectedSkillToAdd("");
                                        }}
                                        className="px-4 py-3.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Abort
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skill Gap Radar Chart */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/[0.02] rounded-full blur-[120px] -mr-32 -mt-32" />
                    <div className="relative z-10 w-full mb-10">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Gap Intelligence</h2>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-1">Cross-domain proficiency comparison</p>
                    </div>
                    <div className="h-[500px] w-full flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_70%)] pointer-events-none" />
                        <Radar data={radarDataState} options={radarOptions} />
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <section className="space-y-10 pt-10">
                <div className="flex items-center gap-6">
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">Recommended Pathways</h2>
                    <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <CareerCard
                        title="Full-Stack Developer"
                        match={92}
                        icon={Globe}
                        description="Architecting robust web ecosystems from UI/UX layer to high-performance database orchestration."
                        tags={['React/Next.js', 'Node.js', 'Distributed Systems']}
                        delay={0.1}
                        onClick={() => setSelectedPathway("Full-Stack Developer")}
                    />
                    <CareerCard
                        title="Cloud Architect"
                        match={78}
                        icon={Layers}
                        description="Managing scalable hyperscale infrastructure across multi-cloud environments (AWS/Azure/GCP)."
                        tags={['Kubernetes', 'Infrastructure', 'Security']}
                        delay={0.2}
                        onClick={() => setSelectedPathway("Cloud Architect")}
                    />
                    <CareerCard
                        title="Data Scientist"
                        match={65}
                        icon={DbIcon}
                        description="Applying predictive intelligence to complex data structures to derive institutional insights."
                        tags={['ML Ops', 'Deep Learning', 'Statistics']}
                        delay={0.3}
                        onClick={() => setSelectedPathway("Data Scientist")}
                    />
                    <CareerCard
                        title="AI/ML Engineer"
                        match={82}
                        icon={BrainCircuit}
                        description="Synthesizing neural architectures and high-dimension models for autonomous decision support."
                        tags={['PyTorch', 'Computer Vision', 'LLM']}
                        delay={0.4}
                        onClick={() => setSelectedPathway("AI/Machine Learning Engineer")}
                    />
                    <CareerCard
                        title="QA/Testing Engineer"
                        match={88}
                        icon={Bug}
                        description="Hardening software reliability through rigorous automated regression and CI/CD validation nodes."
                        tags={['Selenium', 'Chaos Engineering', 'CI/CD']}
                        delay={0.5}
                        onClick={() => setSelectedPathway("QA/Testing Engineer")}
                    />
                    <CareerCard
                        title="UX/UI Designer"
                        match={60}
                        icon={Wand2}
                        description="Synthesizing aesthetic theory with human interaction data for frictionless experience design."
                        tags={['Figma', 'Prototyping', 'Visual Theory']}
                        delay={0.6}
                        onClick={() => setSelectedPathway("UX/UI Designer")}
                    />
                </div>
            </section>

            {/* Pathway Modal */}
            <AnimatePresence>
                {selectedPathway && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                            onClick={() => setSelectedPathway(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-2xl"
                        >
                            <div className="flex items-center justify-between p-10 border-b border-white/5 relative bg-white/[0.02]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-1">{selectedPathway}</h2>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Domain Competency Matrix</p>
                                </div>
                                <button
                                    onClick={() => setSelectedPathway(null)}
                                    className="relative z-10 p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-10 overflow-y-auto space-y-10 scrollbar-thin">
                                {pathwaySkillsData[selectedPathway]?.map((skill, index) => (
                                    <SkillItem key={index} label={skill.name} percentage={skill.level} delay={index * 0.1} />
                                ))}
                            </div>
                            <div className="p-10 border-t border-white/5 bg-slate-900/80">
                                <button
                                    onClick={() => setSelectedPathway(null)}
                                    className="w-full py-6 rounded-[2rem] bg-white text-slate-950 font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-white/5"
                                >
                                    Commence Pathway Sequence
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CareerGuidance;
