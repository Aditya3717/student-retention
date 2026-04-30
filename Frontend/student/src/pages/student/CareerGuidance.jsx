import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { cacheClear } from '../../utils/dataCache';
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
    Loader2,
    CheckCircle2,
    Lock,
    PlusCircle,
    TrendingUp
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

const SkillItem = ({ label, percentage, delay = 0 }) => {
    const color = percentage >= 70 ? '#34d399' : percentage >= 40 ? '#0ea5e9' : '#f59e0b';
    return (
        <div className="space-y-2 group/bar">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-slate-500 group-hover/bar:text-slate-400 uppercase tracking-widest transition-colors">{label}</span>
                <span className="text-[11px] font-black italic" style={{ color }}>{percentage}%</span>
            </div>
            <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay, ease: [0.23, 1, 0.32, 1] }}
                    className="h-full rounded-full shadow-[0_0_8px_rgba(14,165,233,0.25)]"
                    style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
                />
            </div>
        </div>
    );
};

// SVG arc for match %
const MatchArc = ({ pct, color }) => {
    const r = 28; const circ = 2 * Math.PI * r;
    return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
            <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
            <motion.circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
                strokeLinecap="round" strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                whileInView={{ strokeDashoffset: circ * (1 - pct / 100) }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
            />
        </svg>
    );
};

const domainAccent = {
    "Full-Stack Developer":           { from: 'from-sky-600',    to: 'to-indigo-600',   arc: '#0ea5e9' },
    "Cloud Architect":                { from: 'from-violet-600', to: 'to-purple-700',   arc: '#8b5cf6' },
    "Data Scientist":                 { from: 'from-emerald-600',to: 'to-teal-600',     arc: '#34d399' },
    "AI/Machine Learning Engineer":   { from: 'from-rose-600',   to: 'to-pink-700',    arc: '#fb7185' },
    "QA/Testing Engineer":            { from: 'from-amber-600',  to: 'to-orange-600',  arc: '#f59e0b' },
    "UX/UI Designer":                 { from: 'from-fuchsia-600',to: 'to-pink-600',    arc: '#e879f9' },
};

const CareerCard = ({ title, icon: Icon, description, match, tags, onClick, delay = 0 }) => {
    const acc = domainAccent[title] || { from: 'from-sky-600', to: 'to-indigo-600', arc: '#0ea5e9' };
    const matchColor = match >= 70 ? '#34d399' : match >= 40 ? '#0ea5e9' : '#f59e0b';
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.7 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative h-full cursor-pointer"
            onClick={onClick}
        >
            {/* Glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${acc.from} ${acc.to} rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-20 transition-all duration-500`} />
            <div className="relative h-full bg-slate-900/50 border border-white/5 group-hover:border-white/10 p-7 rounded-[2.5rem] backdrop-blur-xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300">
                {/* Top row: icon + arc */}
                <div className="flex justify-between items-start mb-5">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${acc.from} ${acc.to} shadow-xl`}>
                        <Icon size={22} className="text-white" />
                    </div>
                    <div className="relative flex items-center justify-center">
                        <MatchArc pct={match} color={matchColor} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[11px] font-black" style={{ color: matchColor }}>{match}%</span>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-tight mb-2">{title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-5 flex-1">{description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {tags.map(tag => (
                        <span key={tag} className="text-[8px] font-black uppercase tracking-widest text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Match bar */}
                <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden mb-4">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${match}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${matchColor}88, ${matchColor})` }}
                    />
                </div>

                <button
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r ${acc.from} ${acc.to} opacity-0 group-hover:opacity-100 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-lg`}
                    onClick={e => { e.stopPropagation(); onClick(); }}
                >
                    Explore Pathway <ChevronRight size={14} />
                </button>
            </div>
        </motion.div>
    );
};

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
    const [userProficiency, setUserProficiency] = useState(50);
    const [expandedDomains, setExpandedDomains] = useState({});
    const [acquiredSkills, setAcquiredSkills] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [removingSkill, setRemovingSkill] = useState(null); // "domain::skillName" pending confirm
    const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
    const [skillDropdownOpen, setSkillDropdownOpen] = useState(false);
    const domainDropRef = useRef(null);
    const skillDropRef = useRef(null);

    const toggleDomain = (domain) => {
        setExpandedDomains(prev => ({
            ...prev,
            [domain]: !prev[domain]
        }));
    };

    // Close custom dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (domainDropRef.current && !domainDropRef.current.contains(e.target)) setDomainDropdownOpen(false);
            if (skillDropRef.current && !skillDropRef.current.contains(e.target)) setSkillDropdownOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

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

            // Calculate live recommendations based on updated skills
            const newRecs = Object.keys(pathwaySkillsData).map(domain => {
                const domainSkills = newAcquiredSkills[domain] || [];
                const currentSum = domainSkills.reduce((sum, skill) => sum + skill.level, 0);
                const maxSum = pathwaySkillsData[domain].reduce((sum, skill) => sum + skill.level, 0) || 1;
                const matchPct = Math.min(100, Math.round((currentSum / maxSum) * 100));
                return { title: domain, matchPercentage: matchPct };
            }).filter(r => r.matchPercentage > 0).sort((a, b) => b.matchPercentage - a.matchPercentage);

            await api.put('/students/skills', { skills: flatSkills, recommendations: newRecs });

            // Clear dashboard cache so it pulls the fresh recommendations
            cacheClear('dashboard');
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

    // Skills already acquired in the selected domain
    const alreadyAcquiredInDomain = selectedDomainToAdd
        ? (acquiredSkills[selectedDomainToAdd] || []).map(s => s.name)
        : [];

    // Available skills = domain skills minus already acquired
    const availableSkills = selectedDomainToAdd
        ? pathwaySkillsData[selectedDomainToAdd].filter(
              s => !alreadyAcquiredInDomain.includes(s.name)
          )
        : [];

    // Live match % — ratio of acquired skill points to domain max
    const getLiveMatch = (domainName) => calculateDomainScore(domainName);

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

        // Use the user's self-rated proficiency, not the hardcoded industry target
        const userRatedSkill = { name: skillData.name, level: userProficiency };

        setIsSaving(true);
        newAcquiredSkills[selectedDomainToAdd] = [...domainAcquired, userRatedSkill];
        setAcquiredSkills(newAcquiredSkills);
        await syncSkillsToBackend(newAcquiredSkills);
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        setIsAddingSkill(false);
        setSelectedDomainToAdd("");
        setSelectedSkillToAdd("");
        setUserProficiency(50);
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

            {/* ── Hero Header ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="relative rounded-[2.5rem] overflow-hidden border border-white/5">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-indigo-700/10 to-slate-900/80" />
                <div className="absolute top-0 left-0 w-72 h-72 bg-sky-500/10 rounded-full blur-[100px] -ml-20 -mt-20" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-20 -mb-20" />
                <div className="relative z-10 p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 rounded-2xl bg-sky-500/20 border border-sky-500/30">
                                <Briefcase size={20} className="text-sky-400" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-sky-400/70">Career Intelligence</span>
                        </div>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">Pathway Strategist</h2>
                        <p className="text-slate-400 text-sm">Map your skills to your dream role. Track gaps, log proficiency, and get matched.</p>
                    </div>
                    {/* Live summary stats */}
                    <div className="flex gap-4 shrink-0 flex-wrap">
                        {[
                            { label: 'Domains', value: Object.keys(pathwaySkillsData).length, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
                            { label: 'Skills Logged', value: Object.values(acquiredSkills).reduce((a, b) => a + b.length, 0), color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                            { label: 'Top Match', value: `${Math.max(...Object.keys(pathwaySkillsData).map(d => calculateDomainScore(d)), 0)}%`, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                        ].map(s => (
                            <div key={s.label} className={`border rounded-2xl px-5 py-4 text-center ${s.bg}`}>
                                <p className={`text-2xl font-black italic ${s.color}`}>{s.value}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>


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
                                                                <motion.div
                                                                    key={sIdx}
                                                                    layout
                                                                    initial={{ opacity: 0, x: -8 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    exit={{ opacity: 0, x: 8, scale: 0.95 }}
                                                                    className="bg-slate-900/60 border border-white/5 rounded-xl px-3 py-2.5 group/skill"
                                                                >
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                            <CheckCircle2 size={11} className="text-emerald-400/60 shrink-0" />
                                                                            <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest truncate">{skill.name}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                                                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                                                                                skill.level >= 80 ? 'text-emerald-400 bg-emerald-500/10'
                                                                                : skill.level >= 50 ? 'text-sky-400 bg-sky-500/10'
                                                                                : 'text-amber-400 bg-amber-500/10'
                                                                            }`}>{skill.level}%</span>
                                                                            {/* Two-step delete */}
                                                                            {removingSkill === `${domainSkill.label}::${skill.name}` ? (
                                                                                <div className="flex items-center gap-1">
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleRemoveSkill(domainSkill.label, skill.name);
                                                                                            setRemovingSkill(null);
                                                                                        }}
                                                                                        className="text-[8px] font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md hover:bg-rose-500/20 transition-all"
                                                                                    >
                                                                                        Confirm
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={(e) => { e.stopPropagation(); setRemovingSkill(null); }}
                                                                                        className="text-[8px] font-black text-slate-500 hover:text-slate-300 px-1.5 py-0.5 rounded-md transition-all"
                                                                                    >
                                                                                        ✕
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setRemovingSkill(`${domainSkill.label}::${skill.name}`);
                                                                                    }}
                                                                                    title="Remove skill"
                                                                                    className="w-5 h-5 flex items-center justify-center rounded-md text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all opacity-0 group-hover/skill:opacity-100"
                                                                                >
                                                                                    <X size={10} />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {/* Proficiency bar */}
                                                                    <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
                                                                        <div
                                                                            style={{ width: `${skill.level}%` }}
                                                                            className={`h-full rounded-full ${
                                                                                skill.level >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                                                                : skill.level >= 50 ? 'bg-gradient-to-r from-sky-500 to-indigo-400'
                                                                                : 'bg-gradient-to-r from-amber-500 to-orange-400'
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                </motion.div>
                                                            ))
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2 py-4 text-center">
                                                                <Lock size={16} className="text-slate-700" />
                                                                <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest">No skills logged yet</p>
                                                                <p className="text-[9px] text-slate-800">Use "Reconfigure Skillset" below</p>
                                                            </div>
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
                                {/* Success flash */}
                                <AnimatePresence>
                                    {saveSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
                                        >
                                            <Zap size={12} /> Skill authenticated &amp; saved!
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Domain selector — custom dropdown */}
                                <div className="space-y-2" ref={domainDropRef}>
                                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-widest pl-1">Domain Node</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => { setDomainDropdownOpen(v => !v); setSkillDropdownOpen(false); }}
                                            className="w-full flex items-center justify-between bg-slate-900/80 border border-white/10 hover:border-sky-500/40 text-slate-300 text-[11px] font-black uppercase tracking-widest rounded-xl px-4 py-3 transition-all focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                                        >
                                            <span className={selectedDomainToAdd ? 'text-white' : 'text-slate-600'}>
                                                {selectedDomainToAdd || 'Select Domain...'}
                                            </span>
                                            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${domainDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {domainDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute z-50 top-full mt-2 w-full bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                                                >
                                                    {Object.keys(pathwaySkillsData).map(domain => {
                                                        const acq = (acquiredSkills[domain] || []).length;
                                                        const total = pathwaySkillsData[domain].length;
                                                        const pct = Math.round((acq / total) * 100);
                                                        const isSelected = selectedDomainToAdd === domain;
                                                        return (
                                                            <button
                                                                key={domain}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedDomainToAdd(domain);
                                                                    setSelectedSkillToAdd('');
                                                                    setDomainDropdownOpen(false);
                                                                }}
                                                                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/5 border-b border-white/5 last:border-0 ${
                                                                    isSelected ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    {isSelected
                                                                        ? <CheckCircle2 size={14} className="text-sky-400 shrink-0" />
                                                                        : <div className="w-3.5 h-3.5 rounded-full border border-white/10 shrink-0" />}
                                                                    <span className="text-[10px] font-black uppercase tracking-widest truncate">{domain}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                                                    {/* Mini ring */}
                                                                    <div className="relative w-7 h-7">
                                                                        <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
                                                                            <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                                                            <circle cx="14" cy="14" r="10" fill="none"
                                                                                stroke={pct === 100 ? '#34d399' : '#0ea5e9'}
                                                                                strokeWidth="3"
                                                                                strokeDasharray={`${2 * Math.PI * 10}`}
                                                                                strokeDashoffset={`${2 * Math.PI * 10 * (1 - pct / 100)}`}
                                                                                strokeLinecap="round"
                                                                            />
                                                                        </svg>
                                                                        <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-slate-400">{pct}%</span>
                                                                    </div>
                                                                    <span className="text-[9px] text-slate-600 font-bold">{acq}/{total}</span>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Capability selector — custom dropdown, only available skills */}
                                {selectedDomainToAdd && (
                                    <div className="space-y-2" ref={skillDropRef}>
                                        <div className="flex items-center justify-between pl-1">
                                            <label className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Capability</label>
                                            {availableSkills.length === 0 ? (
                                                <span className="text-[8px] text-amber-400 font-black uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                                    All acquired!
                                                </span>
                                            ) : (
                                                <span className="text-[9px] text-slate-600">
                                                    Match: <span className="text-sky-400 font-black">{getLiveMatch(selectedDomainToAdd)}%</span>
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                disabled={availableSkills.length === 0}
                                                onClick={() => setSkillDropdownOpen(v => !v)}
                                                className={`w-full flex items-center justify-between bg-slate-900/80 border border-white/10 hover:border-sky-500/40 text-[11px] font-black uppercase tracking-widest rounded-xl px-4 py-3 transition-all focus:outline-none focus:ring-1 focus:ring-sky-500/50 disabled:opacity-40 disabled:cursor-not-allowed ${
                                                    selectedSkillToAdd ? 'text-white' : 'text-slate-600'
                                                }`}
                                            >
                                                <span className="truncate">
                                                    {availableSkills.length === 0 ? 'No skills remaining' : (selectedSkillToAdd || 'Select Skill...')}
                                                </span>
                                                <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${skillDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {skillDropdownOpen && availableSkills.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="absolute z-50 top-full mt-2 w-full bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto"
                                                    >
                                                        {availableSkills.map(skill => {
                                                            const isSelected = selectedSkillToAdd === skill.name;
                                                            return (
                                                                <button
                                                                    key={skill.name}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedSkillToAdd(skill.name);
                                                                        setUserProficiency(50);
                                                                        setSkillDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 border-b border-white/5 last:border-0 ${
                                                                        isSelected ? 'bg-sky-500/10' : ''
                                                                    }`}
                                                                >
                                                                    {isSelected
                                                                        ? <CheckCircle2 size={13} className="text-sky-400 shrink-0" />
                                                                        : <div className="w-3 h-3 rounded-full border border-white/10 shrink-0" />}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className={`text-[10px] font-black uppercase tracking-widest truncate ${isSelected ? 'text-sky-400' : 'text-slate-400'}`}>
                                                                            {skill.name}
                                                                        </p>
                                                                        <p className="text-[9px] text-slate-700 mt-0.5">
                                                                            Industry target: <span className="text-slate-600 font-bold">{skill.level}%</span>
                                                                        </p>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}

                                {/* Proficiency slider — appears after skill is selected */}
                                <AnimatePresence>
                                    {selectedSkillToAdd && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="space-y-3 pt-1">
                                                <div className="flex items-center justify-between pl-1">
                                                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Your Proficiency</label>
                                                    <div className="flex items-center gap-2">
                                                        {/* Colour-coded level badge */}
                                                        <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                                                            userProficiency >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                                            : userProficiency >= 50 ? 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                                                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                                        }`}>
                                                            {userProficiency}%
                                                        </span>
                                                        <span className={`text-[8px] font-black uppercase tracking-widest ${
                                                            userProficiency >= 80 ? 'text-emerald-500' : userProficiency >= 50 ? 'text-sky-500' : 'text-amber-500'
                                                        }`}>
                                                            {userProficiency >= 80 ? 'Expert' : userProficiency >= 50 ? 'Intermediate' : 'Beginner'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="range"
                                                        min={5}
                                                        max={100}
                                                        step={5}
                                                        value={userProficiency}
                                                        onChange={e => setUserProficiency(Number(e.target.value))}
                                                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                                        style={{
                                                            background: `linear-gradient(to right, ${
                                                                userProficiency >= 80 ? '#34d399' : userProficiency >= 50 ? '#0ea5e9' : '#f59e0b'
                                                            } ${userProficiency}%, rgba(255,255,255,0.05) ${userProficiency}%)`
                                                        }}
                                                    />
                                                </div>
                                                {/* Industry target comparison */}
                                                {(() => {
                                                    const target = pathwaySkillsData[selectedDomainToAdd]?.find(s => s.name === selectedSkillToAdd)?.level;
                                                    if (!target) return null;
                                                    const gap = target - userProficiency;
                                                    return (
                                                        <p className="text-[9px] text-slate-600 pl-1">
                                                            Industry target: <span className="text-slate-500 font-bold">{target}%</span>
                                                            {gap > 0 && <span className="text-amber-500/80 ml-2">↑ {gap}% gap to close</span>}
                                                            {gap <= 0 && <span className="text-emerald-500/80 ml-2">✓ Meets requirement</span>}
                                                        </p>
                                                    );
                                                })()}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleAddSkill}
                                        disabled={!selectedDomainToAdd || !selectedSkillToAdd || isSaving}
                                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary-600/10"
                                    >
                                        {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                                        {isSaving ? 'Saving...' : 'Authenticate'}
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

            {/* ── Recommended Pathways ── */}
            <section className="space-y-8 pt-4">
                <div className="flex items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Recommended Pathways</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Click any card to see your skill gap</p>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-full">
                        {Object.keys(pathwaySkillsData).length} paths
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CareerCard
                        title="Full-Stack Developer"
                        match={getLiveMatch("Full-Stack Developer")}
                        icon={Globe}
                        description="Architecting robust web ecosystems from UI/UX layer to high-performance database orchestration."
                        tags={['React/Next.js', 'Node.js', 'Distributed Systems']}
                        delay={0.1}
                        onClick={() => setSelectedPathway("Full-Stack Developer")}
                    />
                    <CareerCard
                        title="Cloud Architect"
                        match={getLiveMatch("Cloud Architect")}
                        icon={Layers}
                        description="Managing scalable hyperscale infrastructure across multi-cloud environments (AWS/Azure/GCP)."
                        tags={['Kubernetes', 'Infrastructure', 'Security']}
                        delay={0.2}
                        onClick={() => setSelectedPathway("Cloud Architect")}
                    />
                    <CareerCard
                        title="Data Scientist"
                        match={getLiveMatch("Data Scientist")}
                        icon={DbIcon}
                        description="Applying predictive intelligence to complex data structures to derive institutional insights."
                        tags={['ML Ops', 'Deep Learning', 'Statistics']}
                        delay={0.3}
                        onClick={() => setSelectedPathway("Data Scientist")}
                    />
                    <CareerCard
                        title="AI/ML Engineer"
                        match={getLiveMatch("AI/Machine Learning Engineer")}
                        icon={BrainCircuit}
                        description="Synthesizing neural architectures and high-dimension models for autonomous decision support."
                        tags={['PyTorch', 'Computer Vision', 'LLM']}
                        delay={0.4}
                        onClick={() => setSelectedPathway("AI/Machine Learning Engineer")}
                    />
                    <CareerCard
                        title="QA/Testing Engineer"
                        match={getLiveMatch("QA/Testing Engineer")}
                        icon={Bug}
                        description="Hardening software reliability through rigorous automated regression and CI/CD validation nodes."
                        tags={['Selenium', 'Chaos Engineering', 'CI/CD']}
                        delay={0.5}
                        onClick={() => setSelectedPathway("QA/Testing Engineer")}
                    />
                    <CareerCard
                        title="UX/UI Designer"
                        match={getLiveMatch("UX/UI Designer")}
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
                {selectedPathway && (() => {
                    const allSkills = pathwaySkillsData[selectedPathway] || [];
                    const userAcquired = acquiredSkills[selectedPathway] || [];
                    const acquiredNames = userAcquired.map(s => s.name);
                    const acquiredList = allSkills.filter(s => acquiredNames.includes(s.name));
                    const missingList = allSkills.filter(s => !acquiredNames.includes(s.name));
                    const liveMatch = getLiveMatch(selectedPathway);

                    const quickAddSkill = async (skill) => {
                        const newAcquiredSkills = { ...acquiredSkills };
                        const domainAcquired = newAcquiredSkills[selectedPathway] || [];
                        if (domainAcquired.some(s => s.name === skill.name)) return;
                        newAcquiredSkills[selectedPathway] = [...domainAcquired, skill];
                        setAcquiredSkills(newAcquiredSkills);
                        await syncSkillsToBackend(newAcquiredSkills);
                    };

                    return (
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
                                {/* Header */}
                                <div className="p-8 border-b border-white/5 relative bg-white/[0.02]">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                                    <div className="flex items-start justify-between relative z-10">
                                        <div>
                                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">{selectedPathway}</h2>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Domain Competency Matrix</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedPathway(null)}
                                            className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all shrink-0"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Live stats row */}
                                    <div className="flex items-center gap-4 mt-5">
                                        {/* Match arc */}
                                        <div className="flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-4 py-2 rounded-xl">
                                            <TrendingUp size={14} className="text-sky-400" />
                                            <span className="text-sky-400 font-black text-sm">{liveMatch}%</span>
                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Match</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                                            <CheckCircle2 size={14} className="text-emerald-400" />
                                            <span className="text-emerald-400 font-black text-sm">{acquiredList.length}</span>
                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Acquired</span>
                                        </div>
                                        {missingList.length > 0 && (
                                            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
                                                <Lock size={14} className="text-amber-400" />
                                                <span className="text-amber-400 font-black text-sm">{missingList.length}</span>
                                                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Gap{missingList.length > 1 ? 's' : ''}</span>
                                            </div>
                                        )}
                                        {missingList.length === 0 && (
                                            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                                                <Zap size={14} className="text-emerald-400" />
                                                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">All skills acquired!</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Overall progress bar */}
                                    <div className="mt-4">
                                        <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${liveMatch}%` }}
                                                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                                                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Skill list */}
                                <div className="p-8 overflow-y-auto space-y-3 scrollbar-thin flex-1">

                                    {/* Acquired skills */}
                                    {acquiredList.length > 0 && (
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/70 flex items-center gap-2">
                                                <CheckCircle2 size={10} /> Acquired Skills
                                            </p>
                                            {acquiredList.map((skill, i) => (
                                                <motion.div
                                                    key={skill.name}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-5 py-4"
                                                >
                                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate">{skill.name}</span>
                                                            <span className="text-xs font-black text-emerald-400 ml-3 shrink-0">{skill.level}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${skill.level}%` }}
                                                                transition={{ duration: 1, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                                                                className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Missing / Gap skills */}
                                    {missingList.length > 0 && (
                                        <div className="space-y-3 pt-2">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-amber-500/70 flex items-center gap-2">
                                                <Lock size={10} /> Skill Gaps — click ⚡ to acquire
                                            </p>
                                            {missingList.map((skill, i) => (
                                                <motion.div
                                                    key={skill.name}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: (acquiredList.length + i) * 0.05 }}
                                                    className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 group hover:border-amber-500/20 hover:bg-amber-500/5 transition-all"
                                                >
                                                    <Lock size={16} className="text-slate-600 group-hover:text-amber-400 shrink-0 transition-colors" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-[10px] font-black text-slate-600 group-hover:text-slate-400 uppercase tracking-widest truncate transition-colors">{skill.name}</span>
                                                            <span className="text-xs font-black text-slate-700 ml-3 shrink-0">{skill.level}%</span>
                                                        </div>
                                                        {/* Dashed target bar */}
                                                        <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-dashed border-white/5">
                                                            <div
                                                                style={{ width: `${skill.level}%` }}
                                                                className="h-full bg-gradient-to-r from-slate-700 to-slate-600 rounded-full opacity-40"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => quickAddSkill(skill)}
                                                        title="Quick-add this skill"
                                                        className="shrink-0 p-2 rounded-xl bg-white/5 hover:bg-sky-500/20 text-slate-600 hover:text-sky-400 border border-white/5 hover:border-sky-500/30 transition-all"
                                                    >
                                                        <Zap size={14} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {allSkills.length === 0 && (
                                        <div className="py-12 text-center text-slate-600 text-xs font-black uppercase tracking-widest">No skills data found</div>
                                    )}
                                </div>

                                {/* Footer CTA */}
                                <div className="p-8 border-t border-white/5 bg-slate-950/40">
                                    {missingList.length > 0 ? (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    missingList.forEach(skill => quickAddSkill(skill));
                                                }}
                                                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-sky-600/20"
                                            >
                                                <Zap size={14} /> Acquire All {missingList.length} Missing Skills
                                            </button>
                                            <button
                                                onClick={() => setSelectedPathway(null)}
                                                className="px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 font-black text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedPathway(null)}
                                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-sky-600 text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-sky-600/20 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Pathway Complete — All Skills Acquired!
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
};

export default CareerGuidance;
