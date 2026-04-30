import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import {
    Brain, Zap, Upload, Play, RefreshCw, CheckCircle,
    AlertTriangle, Loader2, BarChart2, Database, Target,
    ChevronRight, X, FileText, Cpu
} from 'lucide-react';

const MetricCard = ({ label, value, color }) => (
    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-3xl font-black tracking-tight ${color}`}>{value ?? '—'}<span className="text-base ml-0.5 text-slate-500">%</span></p>
    </div>
);

const StatusBadge = ({ online }) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${online ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
        <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
        {online ? 'Service Online' : 'Service Offline'}
    </div>
);

const MLTraining = () => {
    const [status, setStatus] = useState(null);
    const [serviceOnline, setServiceOnline] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [modelType, setModelType] = useState('random_forest');
    const [nSamples, setNSamples] = useState(1000);
    const [isTraining, setIsTraining] = useState(false);
    const [isPredicting, setIsPredicting] = useState(false);
    const [toast, setToast] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileRef = useRef();

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchStatus = async () => {
        try {
            const res = await api.get('/ml/status');
            if (res.data.success) {
                setStatus(res.data.data);
                setServiceOnline(true);
            }
        } catch (e) {
            setServiceOnline(false);
            setStatus(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchStatus(); }, []);

    const handleTrainSynthetic = async () => {
        setIsTraining(true);
        try {
            const res = await api.post('/ml/train-synthetic', { model_type: modelType, n_samples: nSamples });
            if (res.data.success) {
                showToast(`Model trained! Accuracy: ${res.data.data.meta.accuracy}%`);
                fetchStatus();
            }
        } catch (e) {
            showToast(e.response?.data?.message || 'Training failed.', 'error');
        } finally {
            setIsTraining(false);
        }
    };

    const handleRunPredictions = async () => {
        setIsPredicting(true);
        try {
            const res = await api.post('/ml/run-predictions');
            if (res.data.success) {
                showToast(`${res.data.message} (Model: ${res.data.model_used})`);
            }
        } catch (e) {
            showToast(e.response?.data?.message || 'Prediction run failed.', 'error');
        } finally {
            setIsPredicting(false);
        }
    };

    const handleFileUpload = async () => {
        if (!uploadFile) return;
        setIsUploading(true);
        const form = new FormData();
        form.append('file', uploadFile);
        form.append('model_type', modelType);
        try {
            const res = await api.post('/ml/train-csv', form, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res.data.success) {
                showToast(`CSV training done! Accuracy: ${res.data.data.meta.accuracy}%`);
                setUploadFile(null);
                fetchStatus();
            }
        } catch (e) {
            showToast(e.response?.data?.message || 'CSV upload failed.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const featureImportance = status?.feature_importance;
    const maxImportance = featureImportance ? Math.max(...Object.values(featureImportance)) : 1;

    return (
        <div className="space-y-6 relative z-10">
            {/* Toast */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-bold backdrop-blur-xl
                                ${toast.type === 'error' ? 'bg-rose-900/80 border-rose-500/30 text-rose-200' : 'bg-emerald-900/80 border-emerald-500/30 text-emerald-200'}`}
                        >
                            {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                            {toast.message}
                            <button onClick={() => setToast(null)}><X size={14} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">ML Model Training</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">RandomForest / Gradient Boosting Engine</p>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge online={serviceOnline} />
                    <button onClick={fetchStatus} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        <RefreshCw size={15} />
                    </button>
                </div>
            </div>

            {/* Offline Warning */}
            {!isLoading && !serviceOnline && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-400 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-amber-300 font-black text-sm">ML Service is not running</p>
                        <p className="text-amber-400/70 text-xs mt-1 font-medium">Start it by running: <code className="bg-black/30 px-2 py-0.5 rounded text-amber-300">cd ML && uvicorn main:app --reload --port 8000</code></p>
                    </div>
                </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Accuracy" value={status?.accuracy} color="text-emerald-400" />
                <MetricCard label="Precision" value={status?.precision} color="text-indigo-400" />
                <MetricCard label="Recall" value={status?.recall} color="text-amber-400" />
                <MetricCard label="F1 Score" value={status?.f1} color="text-sky-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Training Panel */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                            <Brain size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-black text-white uppercase tracking-tight">Train Model</h3>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Synthetic Dataset</p>
                        </div>
                    </div>

                    {/* Model Type */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Algorithm</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'random_forest', label: 'Random Forest' },
                                { value: 'gradient_boosting', label: 'Gradient Boost' }
                            ].map(opt => (
                                <button key={opt.value} onClick={() => setModelType(opt.value)}
                                    className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${modelType === opt.value ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'}`}>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sample Size */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Training Samples</label>
                            <span className="text-[10px] font-black text-indigo-400">{nSamples.toLocaleString()}</span>
                        </div>
                        <input type="range" min="200" max="5000" step="100" value={nSamples} onChange={e => setNSamples(+e.target.value)}
                            className="w-full accent-indigo-500 cursor-pointer" />
                        <div className="flex justify-between text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                            <span>200</span><span>5,000</span>
                        </div>
                    </div>

                    <button onClick={handleTrainSynthetic} disabled={isTraining || !serviceOnline}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-indigo-500/20">
                        {isTraining ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                        {isTraining ? 'Training...' : 'Train on Synthetic Data'}
                    </button>

                    {/* Model info */}
                    {status?.trained_at && (
                        <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                            Last trained: {new Date(status.trained_at).toLocaleString()} · {status.training_samples?.toLocaleString()} samples
                        </p>
                    )}
                </div>

                {/* CSV Upload */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                            <Upload size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-black text-white uppercase tracking-tight">Upload Dataset</h3>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Custom CSV Training</p>
                        </div>
                    </div>

                    {/* Drop zone */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={e => { e.preventDefault(); setDragOver(false); setUploadFile(e.dataTransfer.files[0]); }}
                        onClick={() => fileRef.current.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragOver ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-white/10 hover:border-white/20 bg-black/10'}`}
                    >
                        <input type="file" ref={fileRef} accept=".csv" className="hidden" onChange={e => setUploadFile(e.target.files[0])} />
                        {uploadFile ? (
                            <div className="flex flex-col items-center gap-2">
                                <FileText size={28} className="text-emerald-400" />
                                <p className="text-sm font-black text-emerald-300">{uploadFile.name}</p>
                                <p className="text-xs text-slate-500">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                                <button onClick={e => { e.stopPropagation(); setUploadFile(null); }} className="text-rose-400 text-xs flex items-center gap-1 mt-1 hover:text-rose-300">
                                    <X size={12} /> Remove
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Upload size={28} className="text-slate-600" />
                                <p className="text-slate-400 font-bold text-sm">Drop CSV here or click to browse</p>
                                <p className="text-slate-600 text-xs">Required columns: <code className="text-slate-400">gpa, attendance, risk_label</code></p>
                            </div>
                        )}
                    </div>

                    <button onClick={handleFileUpload} disabled={!uploadFile || isUploading || !serviceOnline}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-emerald-500/20">
                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
                        {isUploading ? 'Training on CSV...' : 'Train on Uploaded Dataset'}
                    </button>

                    {/* CSV format hint */}
                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Expected CSV Format</p>
                        <code className="text-[10px] text-slate-400 font-mono">gpa, attendance, credits_earned, risk_label</code>
                        <br /><code className="text-[10px] text-slate-500 font-mono">3.5, 88, 120, Low</code>
                        <br /><code className="text-[10px] text-slate-500 font-mono">1.8, 60, 90, High</code>
                    </div>
                </div>
            </div>

            {/* Run Predictions + Feature Importance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Run Predictions */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/20">
                            <Cpu size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-black text-white uppercase tracking-tight">Apply to Students</h3>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Run ML predictions on all profiles</p>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-6 font-medium leading-relaxed">
                        Run the trained model against every student in the database. This will overwrite their current dropout risk scores with ML-generated predictions.
                    </p>
                    <button onClick={handleRunPredictions} disabled={isPredicting || !serviceOnline || !status?.model_ready}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95 border border-amber-500/20">
                        {isPredicting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                        {isPredicting ? 'Running Predictions...' : 'Run Bulk ML Predictions'}
                    </button>
                    {!status?.model_ready && serviceOnline && (
                        <p className="text-center text-amber-600/70 text-[10px] font-bold uppercase tracking-widest mt-3">Train a model first to enable predictions</p>
                    )}
                </div>

                {/* Feature Importance */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center border border-sky-500/20">
                            <Target size={20} className="text-sky-400" />
                        </div>
                        <div>
                            <h3 className="font-black text-white uppercase tracking-tight">Feature Importance</h3>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Model explainability</p>
                        </div>
                    </div>
                    {featureImportance ? (
                        <div className="space-y-3">
                            {Object.entries(featureImportance)
                                .sort((a, b) => b[1] - a[1])
                                .map(([feature, value]) => (
                                    <div key={feature}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{feature.replace(/_/g, ' ')}</span>
                                            <span className="text-[10px] font-black text-sky-400">{(value * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-black/30 rounded-full h-1.5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(value / maxImportance) * 100}%` }}
                                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                                className="h-1.5 rounded-full bg-gradient-to-r from-sky-600 to-indigo-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <BarChart2 size={32} className="text-slate-700 mb-3" />
                            <p className="text-slate-500 text-xs font-bold">Train a model to see feature importances</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MLTraining;
