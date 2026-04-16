import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Wand2
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

const SkillItem = ({ label, percentage }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-slate-300">{label}</span>
            <span className="text-primary-400">{percentage}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary-600 to-indigo-500 rounded-full"
            />
        </div>
    </div>
);

const CareerCard = ({ title, icon: Icon, description, match, tags, onClick }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group cursor-pointer"
        onClick={onClick}
    >
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-400">
                    <Icon size={24} />
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    {match}% Match
                </div>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
            <p className="text-sm text-slate-400 mb-6 line-clamp-2">
                {description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
                {tags.map(tag => (
                    <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-800/50 px-2 py-1 rounded-md">
                        {tag}
                    </span>
                ))}
            </div>
            <button
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all group-hover:bg-primary-600 group-hover:text-white"
                onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
                Explore Pathway
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

// Calculate total expected level sum for a domain to determine percentages
const getDomainMaxScore = (domainName) => {
    return pathwaySkillsData[domainName]?.reduce((sum, skill) => sum + skill.level, 0) || 1;
};

const CareerGuidance = () => {
    const [selectedPathway, setSelectedPathway] = useState(null);
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [selectedDomainToAdd, setSelectedDomainToAdd] = useState("");
    const [selectedSkillToAdd, setSelectedSkillToAdd] = useState("");
    const [expandedDomains, setExpandedDomains] = useState({});

    const toggleDomain = (domain) => {
        setExpandedDomains(prev => ({
            ...prev,
            [domain]: !prev[domain]
        }));
    };

    // Initialize state with domains instead of individual skills
    // We'll track the skills the user "has" per domain to calculate percentage
    const allDomains = Object.keys(pathwaySkillsData);

    // Track acquired skills: { "Full-Stack Developer": [{name: "HTML/CSS", level: 90}], ... }
    const [acquiredSkills, setAcquiredSkills] = useState({});

    // Calculate domain scores based on acquired skills vs max possible
    const calculateDomainScore = (domain) => {
        const skillsArray = acquiredSkills[domain] || [];
        const currentSum = skillsArray.reduce((sum, skill) => sum + skill.level, 0);
        const maxSum = getDomainMaxScore(domain);

        // Return percentage out of 100
        return Math.min(100, Math.round((currentSum / maxSum) * 100));
    };

    // User skills array derived from calculating scores
    // We intentionally show all domains available in pathwaySkillsData mapped to their current score (0 by default)
    const displaySkills = allDomains.map(domain => ({
        label: domain,
        percentage: calculateDomainScore(domain)
    }));

    // Dynamic radar data based on domain calculations
    const radarDataState = {
        labels: allDomains,
        datasets: [
            {
                label: 'Current Proficiency (%)',
                data: allDomains.map(d => calculateDomainScore(d)),
                backgroundColor: 'rgba(14, 165, 233, 0.2)',
                borderColor: '#0ea5e9',
                borderWidth: 2,
            },
            {
                label: 'Industry Standard target (100%)',
                data: allDomains.map(() => 100),
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: '#6366f1',
                borderWidth: 1,
                borderDash: [5, 5],
            },
        ],
    };

    const handleAddSkill = () => {
        if (!selectedDomainToAdd || !selectedSkillToAdd) return;

        const domainSkills = pathwaySkillsData[selectedDomainToAdd];
        const skillData = domainSkills.find(s => s.name === selectedSkillToAdd);
        if (!skillData) return;

        setAcquiredSkills(prev => {
            const domainAcquired = prev[selectedDomainToAdd] || [];

            // Avoid adding same skill twice
            if (domainAcquired.some(s => s.name === selectedSkillToAdd)) {
                return prev;
            }

            return {
                ...prev,
                [selectedDomainToAdd]: [...domainAcquired, skillData]
            };
        });

        // Reset and close
        setIsAddingSkill(false);
        setSelectedDomainToAdd("");
        setSelectedSkillToAdd("");
    };

    const handleRemoveSkill = (domain, skillNameToRemove) => {
        setAcquiredSkills(prev => {
            const domainAcquired = prev[domain] || [];
            const newDomainSkills = domainAcquired.filter(s => s.name !== skillNameToRemove);

            return {
                ...prev,
                [domain]: newDomainSkills
            };
        });
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(148, 163, 184, 0.1)' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
                pointLabels: { color: '#94a3b8', font: { size: 12 } },
                ticks: { display: false },
                suggestedMin: 0,
                suggestedMax: 100,
            },
        },
        plugins: {
            legend: { position: 'bottom', labels: { color: '#94a3b8' } },
        },
    };

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Summary & Skills */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
                            <Sparkles className="text-amber-400" size={20} />
                            Skill Profile
                        </h2>
                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                            {displaySkills.map((domainSkill, index) => {
                                const domainSkillsAdded = acquiredSkills[domainSkill.label] || [];
                                const isExpanded = expandedDomains[domainSkill.label];

                                return (
                                    <div key={index} className="space-y-3 pb-4 border-b border-slate-800/50 last:border-0 relative">
                                        <div
                                            className="group cursor-pointer relative"
                                            onClick={() => toggleDomain(domainSkill.label)}
                                        >
                                            <div className="absolute right-0 top-0 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-slate-800 rounded-md z-10">
                                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </div>
                                            <SkillItem label={domainSkill.label} percentage={domainSkill.percentage} />
                                        </div>

                                        {/* List of individual skills added for this domain */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    {domainSkillsAdded.length > 0 ? (
                                                        <div className="space-y-2 mt-3 pl-2 border-l-2 border-slate-800">
                                                            {domainSkillsAdded.map((skill, sIdx) => (
                                                                <div key={sIdx} className="flex items-center justify-between group/skill">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-1 h-1 rounded-full bg-primary-500/50" />
                                                                        <span className="text-xs text-slate-400">{skill.name}</span>
                                                                    </div>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleRemoveSkill(domainSkill.label, skill.name); }}
                                                                        className="text-slate-600 hover:text-rose-400 opacity-0 group-hover/skill:opacity-100 transition-colors p-1"
                                                                        title="Remove skill"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="mt-3 pl-2 text-xs text-slate-500 italic border-l-2 border-slate-800/50">
                                                            No skills added yet.
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Actions</h3>

                        {!isAddingSkill ? (
                            <button
                                onClick={() => setIsAddingSkill(true)}
                                className="w-full py-3 bg-primary-600/10 hover:bg-primary-600/20 text-primary-400 border border-primary-500/20 rounded-xl text-sm font-bold transition-all"
                            >
                                Update Skill Set
                            </button>
                        ) : (
                            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-medium">Select Domain</label>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2 focus:ring-1 focus:ring-primary-500 outline-none"
                                        value={selectedDomainToAdd}
                                        onChange={(e) => {
                                            setSelectedDomainToAdd(e.target.value);
                                            setSelectedSkillToAdd(""); // Reset skill when domain changes
                                        }}
                                    >
                                        <option value="">Select Domain...</option>
                                        {Object.keys(pathwaySkillsData).map(domain => (
                                            <option key={domain} value={domain}>{domain}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedDomainToAdd && (
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 font-medium">Select Skill</label>
                                        <select
                                            className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2 focus:ring-1 focus:ring-primary-500 outline-none"
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

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={handleAddSkill}
                                        disabled={!selectedDomainToAdd || !selectedSkillToAdd}
                                        className="flex-1 py-2 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-bold transition-all"
                                    >
                                        Add Skill
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsAddingSkill(false);
                                            setSelectedDomainToAdd("");
                                            setSelectedSkillToAdd("");
                                        }}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skill Gap Radar Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-100 italic">Skill-Gap Analysis</h2>
                            <p className="text-sm text-slate-500">Comparison with industry standards</p>
                        </div>
                    </div>
                    <div className="h-[400px] w-full flex items-center justify-center">
                        <Radar data={radarDataState} options={radarOptions} />
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-100">Recommended Pathways</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CareerCard
                        title="Full-Stack Developer"
                        match={92}
                        icon={Globe}
                        description="Build robust web applications from end-to-end using modern frameworks like React and Node.js."
                        tags={['Frontend', 'Backend', 'Deployment']}
                        onClick={() => setSelectedPathway("Full-Stack Developer")}
                    />
                    <CareerCard
                        title="Cloud Architect"
                        match={78}
                        icon={Layers}
                        description="Design and manage scalable cloud infrastructure across AWS, Azure, and Google Cloud."
                        tags={['AWS', 'Terraform', 'Scaling']}
                        onClick={() => setSelectedPathway("Cloud Architect")}
                    />
                    <CareerCard
                        title="Data Scientist"
                        match={65}
                        icon={DbIcon}
                        description="Analyze complex datasets to drive business decisions using Python, SQL, and Machine Learning."
                        tags={['Python', 'R', 'Statistics']}
                        onClick={() => setSelectedPathway("Data Scientist")}
                    />
                    <CareerCard
                        title="AI/Machine Learning Engineer"
                        match={82}
                        icon={BrainCircuit}
                        description="Develop and deploy predictive models, neural networks, and AI-driven solutions."
                        tags={['Python', 'TensorFlow', 'Neural Networks']}
                        onClick={() => setSelectedPathway("AI/Machine Learning Engineer")}
                    />
                    <CareerCard
                        title="QA/Testing Engineer"
                        match={88}
                        icon={Bug}
                        description="Ensure software quality through rigorous manual methodologies and automated test pipelines."
                        tags={['Automation', 'Selenium', 'CI/CD']}
                        onClick={() => setSelectedPathway("QA/Testing Engineer")}
                    />
                    <CareerCard
                        title="UX/UI Designer"
                        match={60}
                        icon={Wand2}
                        description="Create intuitive and visually stunning user interfaces and experiences for web/mobile applications."
                        tags={['Figma', 'Prototyping', 'Design Systems']}
                        onClick={() => setSelectedPathway("UX/UI Designer")}
                    />
                </div>
            </section>

            {/* Pathway Modal */}
            <AnimatePresence>
                {selectedPathway && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                            onClick={() => setSelectedPathway(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-800">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-100">{selectedPathway}</h2>
                                    <p className="text-sm text-slate-400 mt-1">Required Skills & Competencies</p>
                                </div>
                                <button
                                    onClick={() => setSelectedPathway(null)}
                                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <div className="space-y-6">
                                    {pathwaySkillsData[selectedPathway]?.map((skill, index) => (
                                        <SkillItem key={index} label={skill.name} percentage={skill.level} />
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                                <button
                                    onClick={() => setSelectedPathway(null)}
                                    className="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold transition-colors shadow-lg shadow-primary-500/20"
                                >
                                    Start Learning This Pathway
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
