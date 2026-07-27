import React, { useState, useEffect, useRef } from 'react';
import { LuSparkles } from 'react-icons/lu';
import { 
    FaShieldAlt, 
    FaDna, 
    FaCommentDots, 
    FaShoppingBag, 
    FaFlask, 
    FaCalendarAlt, 
    FaSun, 
    FaLeaf, 
    FaBook, 
    FaTint, 
    FaCheckSquare, 
    FaHistory, 
    FaSignOutAlt, 
    FaUserCheck, 
    FaChevronLeft, 
    FaChevronRight,
    FaCheckCircle,
    FaPaperPlane,
    FaRobot,
    FaUser,
    FaMoon,
    FaImage,
    FaTimes,
    FaAward,
    FaStar,
    FaCamera
} from 'react-icons/fa';
import './dashboardlayout.css';

import { api } from '../../services/api';
import RitualModal from './RitualModal';

function DashboardLayout({ onLogout }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFeature, setActiveFeature] = useState(null);

    // Moisture Level & Step Checklists state
    const [moistureLevel, setMoistureLevel] = useState(80);
    const [moistureSteps, setMoistureSteps] = useState({
        step1: false, 
        step2: false, 
        step3: false  
    });
    
    // Dedicated state for standard dashboard text & image AI Chat view
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'ai', text: 'Hello! I am your dashboard AI assistant. You can chat with me or upload a skin/ingredient image for instant analysis today!', timestamp: 'Just now' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Dedicated state for History view modal/panel toggle
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Dedicated state for Aesthetic Beauty Journal view (Achievements & visual result logs)
    const [isJournalOpen, setIsJournalOpen] = useState(false);
    const [journalEntries, setJournalEntries] = useState([
        { 
            id: 1, 
            title: 'Initial Skin Barrier Restoration', 
            date: 'July 24, 2026', 
            hydration: '82%', 
            note: 'Skin feels significantly less reactive after completing the 3-step moisture protocol.', 
            badge: 'Milestone Unlocked',
            photo: null 
        },
        { 
            id: 2, 
            title: 'UV Shield Consistency Award', 
            date: 'July 25, 2026', 
            hydration: '88%', 
            note: 'Successfully applied sunscreen daily and maintained optimal daytime defense parameters.', 
            badge: 'Consistency Pro',
            photo: null 
        }
    ]);
    const [journalNoteInput, setJournalNoteInput] = useState('');
    const [journalPhotoUrl, setJournalPhotoUrl] = useState(null);
    const journalPhotoInputRef = useRef(null);

    // Dedicated state for the AI Skincare Routine Generator panel view
    const [isRoutineOpen, setIsRoutineOpen] = useState(false);
    const [routineSteps, setRoutineSteps] = useState({
        stepCleanse: false,
        stepExfoliate: false,
        stepTone: false,
        stepSerum: false,
        stepMoisturize: false,
        stepProtect: false
    });
    const [routinePhotoUrl, setRoutinePhotoUrl] = useState(null);

    // Dedicated state for the AI Morning & Night Planner panel view
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);
    const [plannerSteps, setPlannerSteps] = useState({
        morning1: false,
        morning2: false,
        morning3: false,
        evening1: false,
        evening2: false,
        evening3: false
    });
    const [plannerPhotoUrl, setPlannerPhotoUrl] = useState(null);

    const [sunscreenData, setSunscreenData] = useState({
        status: "Applied",
        message: "SPF 30 active and protecting your skin.",
        actionRequired: false
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [completedPanels, setCompletedPanels] = useState([]);

    const features = [
        { id: 'routine', title: 'AI Skincare Routine Generator', icon: <LuSparkles size={26} />, badge: 'CUSTOM', category: 'generator' },
        { id: 'acne', title: 'AI Acne Care Assistant', icon: <FaShieldAlt size={26} />, badge: 'SOS', category: 'care' },
        { id: 'type', title: 'AI Skin Type Analyzer', icon: <FaDna size={26} />, badge: 'SMART', category: 'analysis' },
        { id: 'chatbot', title: 'AI Beauty Consultation Chatbot', icon: <FaCommentDots size={26} />, badge: '24/7', category: 'consultation' },
        { id: 'product', title: 'AI Product Recommendation', icon: <FaShoppingBag size={26} />, badge: 'SHOP', category: 'shop' },
        { id: 'ingredient', title: 'AI Ingredient Analyzer', icon: <FaFlask size={26} />, badge: 'DECODE', desc: 'Explains cosmetic ingredients', category: 'analysis' },
        { id: 'planner', title: 'AI Morning & Night Planner', icon: <FaCalendarAlt size={26} />, badge: 'ROUTINE', category: 'planner' },
        { id: 'sunscreen', title: 'AI Sunscreen Advisor', icon: <FaSun size={26} />, badge: 'UV SHIELD', category: 'care' },
        { id: 'sensitive', title: 'AI Sensitive Skin Advisor', icon: <FaLeaf size={26} />, badge: 'CALM', category: 'care' },
        { id: 'journal', title: 'AI Beauty Journal', icon: <FaBook size={26} />, badge: 'LOG', category: 'journal' }
    ];

    const TARGET_DAILY_TASKS = 5;

    useEffect(() => {
        fetchInitialDashboardData();
    }, []);

    const fetchInitialDashboardData = async () => {
        try {
            setIsLoading(true);
            const data = await api.getDashboardData();
            if (data) {
                if (data.moisture_level !== undefined) setMoistureLevel(data.moisture_level);
                if (data.sunscreen_reminder) setSunscreenData(data.sunscreen_reminder);
                if (data.recent_history && Array.isArray(data.recent_history)) {
                    setRecentActivity(data.recent_history);
                }
            }
        } catch (err) {
            console.warn("Using offline fallback mode:", err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = (feature) => {
        setIsChatOpen(false);
        setIsRoutineOpen(false);
        setIsPlannerOpen(false);
        setIsHistoryOpen(false);
        setIsJournalOpen(false);

        if (feature.id === 'chatbot') {
            setIsChatOpen(true);
        } else if (feature.id === 'routine') {
            setIsRoutineOpen(true);
        } else if (feature.id === 'planner') {
            setIsPlannerOpen(true);
        } else if (feature.id === 'journal') {
            setIsJournalOpen(true);
        } else {
            setActiveFeature(feature);
        }
    };

    const handleTaskComplete = (featureId) => {
        if (!completedPanels.includes(featureId)) {
            setCompletedPanels(prev => [...prev, featureId]);
        }
        
        const matchedFeature = features.find(f => f.id === featureId);
        const featureTitle = matchedFeature ? matchedFeature.title : 'AI Ritual';

        const newActivityEntry = {
            id: Date.now(),
            action: `Completed ${featureTitle}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setRecentActivity(prev => [newActivityEntry, ...prev]);
    };

    const handleApplySunscreen = () => {
        setSunscreenData({
            status: "Applied",
            message: "SPF 30 active and protecting your skin.",
            actionRequired: false
        });

        const newActivityEntry = {
            id: Date.now(),
            action: "Applied Sunscreen",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setRecentActivity(prev => [newActivityEntry, ...prev]);
    };

    const handleStepToggle = (stepKey) => {
        setMoistureSteps(prev => {
            const updated = { ...prev, [stepKey]: !prev[stepKey] };
            const completedCount = Object.values(updated).filter(Boolean).length;
            setMoistureLevel(40 + (completedCount * 20));
            return updated;
        });
    };

    const handleRoutineStepToggle = (stepKey) => {
        setRoutineSteps(prev => ({
            ...prev,
            [stepKey]: !prev[stepKey]
        }));
    };

    const handlePlannerStepToggle = (stepKey) => {
        setPlannerSteps(prev => ({
            ...prev,
            [stepKey]: !prev[stepKey]
        }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveSelectedImage = () => {
        setSelectedImage(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleJournalPhotoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setJournalPhotoUrl(URL.createObjectURL(file));
        }
    };

    const handleAddJournalEntry = (e) => {
        e.preventDefault();
        if (!journalNoteInput.trim() && !journalPhotoUrl) return;

        const newEntry = {
            id: Date.now(),
            title: 'Skin Result Achievement Log',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            hydration: `${moistureLevel}%`,
            note: journalNoteInput || 'Achieved daily glow and milestone tracking parameter.',
            badge: 'Milestone Unlocked',
            photo: journalPhotoUrl
        };

        setJournalEntries([newEntry, ...journalEntries]);
        setJournalNoteInput('');
        setJournalPhotoUrl(null);
        if (journalPhotoInputRef.current) journalPhotoInputRef.current.value = '';
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim() && !selectedImage) return;

        const userMsg = chatInput;
        const currentImagePreview = imagePreviewUrl;
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        setChatMessages(prev => [
            ...prev, 
            { sender: 'user', text: userMsg, image: currentImagePreview, timestamp: timeNow }
        ]);

        setChatInput('');
        setSelectedImage(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsChatLoading(true);

        setTimeout(() => {
            let replyText = `Processed text analysis regarding "${userMsg}". All parameters look stable within dashboard limits.`;
            if (currentImagePreview) {
                replyText = `Image received and scanned successfully! The AI visual analysis indicates balanced hydration levels with slight surface exposure. Recommended to follow up with your routine hydration step.`;
            }

            setChatMessages(prev => [
                ...prev, 
                { sender: 'ai', text: replyText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ]);
            setIsChatLoading(false);
        }, 1200);
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#1e293b', background: '#f8fafc' }}>
                <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>Loading KINDGLOW Dashboard...</p>
            </div>
        );
    }

    const dailyTaskCount = completedPanels.length;
    const dailyTaskPercentage = Math.min(Math.round((dailyTaskCount / TARGET_DAILY_TASKS) * 100), 100);

    return (
        <div className="dashboard-container light-theme-dashboard">
            <button 
                className={`sidebar-toggle-btn ${isSidebarOpen ? 'is-open' : 'is-closed'}`}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
            </button>

            <div className="dashboard-workspace">
                <aside className={`dashboard-sidebar sidebar-glass left-side-panel ${isSidebarOpen ? 'open' : 'closed'}`}>
                    <div className="profile-card user-glow-card">
                        <div className="profile-avatar">
                            <FaUserCheck size={18} className="avatar-icon" />
                            <span className="status-dot">●</span>
                        </div>
                        <div className="profile-info">
                            <h3>KIND GLOW</h3>
                            <span>Level 3 Skin Cadet</span>
                        </div>
                    </div>

                    <div className="sidebar-widget moisture-widget">
                        <div className="widget-label">
                            <span className="label-title"><FaTint size={14} className="icon-blue" /> Moisture Protocol</span>
                            <span className="percentage-badge">{moistureLevel}%</span>
                        </div>
                        <div className="widget-bar-bg" style={{ marginBottom: '10px' }}>
                            <div className="filled-progress-bar" style={{ width: `${moistureLevel}%` }}></div>
                        </div>
                        <div className="moisture-steps-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Steps to Complete:</span>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', color: '#334155' }}>
                                <input 
                                    type="checkbox" 
                                    checked={moistureSteps.step1} 
                                    onChange={() => handleStepToggle('step1')} 
                                    style={{ accentColor: '#ec4899' }}
                                />
                                1. Gentle Hydrating Cleanse
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', color: '#334155' }}>
                                <input 
                                    type="checkbox" 
                                    checked={moistureSteps.step2} 
                                    onChange={() => handleStepToggle('step2')} 
                                    style={{ accentColor: '#ec4899' }}
                                />
                                2. Apply Hyaluronic Essence
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', color: '#334155' }}>
                                <input 
                                    type="checkbox" 
                                    checked={moistureSteps.step3} 
                                    onChange={() => handleStepToggle('step3')} 
                                    style={{ accentColor: '#ec4899' }}
                                />
                                3. Lock with Ceramide Cream
                            </label>
                        </div>
                    </div>

                    <div className="sidebar-widget sunscreen-widget">
                        <div className="widget-title-sm">
                            <FaSun size={12} className="icon-orange" /> Sunscreen Reminder 
                            {sunscreenData.actionRequired && <span className="due-badge">Due Now</span>}
                        </div>
                        <p className="sunscreen-desc">{sunscreenData.message}</p>
                        
                        <button 
                            className="apply-sunscreen-btn" 
                            onClick={handleApplySunscreen}
                        >
                            Apply Sunscreen
                        </button>
                    </div>

                    <div className="sidebar-widget task-widget">
                        <div className="widget-label">
                            <span className="label-title"><FaCheckSquare size={14} className="icon-purple" /> Panel Tasks</span>
                            <span className="percentage-badge">{dailyTaskCount} / {TARGET_DAILY_TASKS} ({dailyTaskPercentage}%)</span>
                        </div>
                        <div className="widget-bar-bg">
                            <div className="task-bar-fill filled-progress-bar" style={{ width: `${dailyTaskPercentage}%` }}></div>
                        </div>
                    </div>

                    <div className="sidebar-widget history-widget">
                        <div className="widget-title-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaHistory size={12} /> Recent Activity History</span>
                            <button 
                                onClick={() => { setIsHistoryOpen(true); setIsChatOpen(false); setIsRoutineOpen(false); setIsPlannerOpen(false); setIsJournalOpen(false); setActiveFeature(null); }}
                                style={{ background: 'none', border: 'none', color: '#ec4899', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                            >
                                View All
                            </button>
                        </div>
                        <ul className="history-list">
                            {recentActivity.length > 0 ? (
                                recentActivity.slice(0, 3).map((item) => (
                                    <li key={item.id} className="history-item">
                                        <span className="history-icon"><LuSparkles size={14} /></span>
                                        <div className="history-text">
                                            <p>{item.action || item.title}</p>
                                            <span>{item.timestamp || 'Just now'}</span>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="history-item">
                                    <div className="history-text">
                                        <p>No activity recorded yet</p>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>

                    <button className="logout-btn interactive-button" onClick={onLogout}>
                        <FaSignOutAlt size={14} /> Exit Session
                    </button>
                </aside>

                <main className="main-content-panel center-aligned-layout">
                    {/* 1. History Full View Modal/Panel */}
                    {isHistoryOpen ? (
                        <div className="chat-interface-container animate-fade-in" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '650px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
                            <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: '#fff', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaHistory size={18} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Complete Activity History Log</h3>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Full chronological record of your skin rituals and tasks</span>
                                    </div>
                                </div>
                                <button onClick={() => setIsHistoryOpen(false)} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                    Back to Dashboard
                                </button>
                            </div>

                            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((item) => (
                                        <div key={item.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ background: '#fdf2f8', color: '#ec4899', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <LuSparkles size={16} />
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{item.action || item.title}</p>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Recorded session entry</span>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>{item.timestamp || 'Just now'}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                        <p>No activity recorded in history log yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : isJournalOpen ? (
                        /* 2. Aesthetic Beauty Journal & Achievements View */
                        <div className="chat-interface-container animate-fade-in" style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #fbcfe8', display: 'flex', flexDirection: 'column', height: '680px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.08)' }}>
                            <div style={{ background: 'linear-gradient(135deg, #fdf2f8, #f5f3ff)', borderBottom: '1px solid #fce7f3', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: '#fff', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(236, 72, 153, 0.3)' }}>
                                        <FaAward size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#831843', letterSpacing: '-0.01em' }}>Aesthetic Beauty Journal & Achievements</h3>
                                        <span style={{ fontSize: '0.8rem', color: '#9d174d' }}>Your verified skin results, photo logs, and milestone victories</span>
                                    </div>
                                </div>
                                <button onClick={() => setIsJournalOpen(false)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                    Back to Dashboard
                                </button>
                            </div>

                            {/* Journal Input Creator Bar with Upload & Remove */}
                            <div style={{ background: '#fff9fb', padding: '16px 24px', borderBottom: '1px solid #fce7f3' }}>
                                <form onSubmit={handleAddJournalEntry} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        ref={journalPhotoInputRef} 
                                        onChange={handleJournalPhotoSelect} 
                                        style={{ display: 'none' }} 
                                        id="journal-photo-upload-input"
                                    />
                                    <label 
                                        htmlFor="journal-photo-upload-input" 
                                        title="Upload result photo"
                                        style={{ background: '#ffffff', border: '1px solid #fbcfe8', color: '#db2777', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', flexShrink: 0 }}
                                    >
                                        <FaCamera size={16} /> Upload Photo
                                    </label>

                                    <input 
                                        type="text" 
                                        placeholder="Log today's skin result achievement or milestone note..." 
                                        value={journalNoteInput}
                                        onChange={(e) => setJournalNoteInput(e.target.value)}
                                        style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1px solid #fbcfe8', background: '#ffffff', outline: 'none', fontSize: '0.88rem', color: '#1e293b' }}
                                    />

                                    <button type="submit" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, boxShadow: '0 4px 10px rgba(236, 72, 153, 0.2)' }}>
                                        Save Achievement ✨
                                    </button>
                                </form>

                                {journalPhotoUrl && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', background: '#ffffff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #fbcfe8', width: 'fit-content' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={journalPhotoUrl} alt="Preview" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                                            <span style={{ fontSize: '0.78rem', color: '#db2777', fontWeight: 600 }}>Result photo attached</span>
                                        </div>
                                        <button type="button" onClick={() => setJournalPhotoUrl(null)} style={{ background: '#fee2e2', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginLeft: '10px' }} title="Remove photo">×</button>
                                    </div>
                                )}
                            </div>

                            {/* Journal Feed Grid */}
                            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', background: '#fdf2f8' }}>
                                {journalEntries.map((entry) => (
                                    <div key={entry.id} style={{ background: '#ffffff', border: '1px solid #fbcfe8', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.05)', transition: 'transform 0.2s' }}>
                                        {entry.photo ? (
                                            <div style={{ height: '160px', width: '100%', overflow: 'hidden', background: '#f1f5f9' }}>
                                                <img src={entry.photo} alt="Result achievement" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        ) : (
                                            <div style={{ height: '100px', width: '100%', background: 'linear-gradient(135deg, #fce7f3, #fae8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777' }}>
                                                <FaStar size={28} />
                                            </div>
                                        )}
                                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ background: '#fdf2f8', color: '#db2777', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, border: '1px solid #fbcfe8' }}>
                                                    {entry.badge}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{entry.date}</span>
                                            </div>
                                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{entry.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: '1.4', flex: 1 }}>{entry.note}</p>
                                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Recorded Moisture Result:</span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ec4899', background: '#fdf2f8', padding: '2px 8px', borderRadius: '6px' }}>{entry.hydration}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : isRoutineOpen ? (
                        /* 3. AI Skincare Routine Generator View with Upload & Remove */
                        <div className="chat-interface-container animate-fade-in" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '650px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
                            <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: '#fff', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <LuSparkles size={18} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>AI Skincare Routine Generator</h3>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Standard full-sequence skincare protocol with pro tips</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <button onClick={() => { handleTaskComplete('routine'); setIsRoutineOpen(false); }} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                        Mark Complete ✓
                                    </button>
                                    <button onClick={() => setIsRoutineOpen(false)} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                        Back
                                    </button>
                                </div>
                            </div>

                            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc' }}>
                                {/* Upload Box Inside the Panel */}
                                <div style={{ background: '#ffffff', border: '1px dashed #fbcfe8', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                        <div style={{ background: '#fdf2f8', color: '#db2777', padding: '10px', borderRadius: '8px' }}>
                                            <FaCamera size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', fontWeight: 700, color: '#831843' }}>Routine Analysis Photo</h4>
                                            <p style={{ margin: 0, fontSize: '0.78rem', color: '#9d174d' }}>Upload a photo to calibrate your custom routine sequence</p>
                                        </div>
                                    </div>

                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        id="routine-panel-upload-inner" 
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) setRoutinePhotoUrl(URL.createObjectURL(file));
                                        }}
                                    />

                                    {!routinePhotoUrl ? (
                                        <label 
                                            htmlFor="routine-panel-upload-inner"
                                            style={{ background: '#ec4899', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, boxShadow: '0 2px 4px rgba(236, 72, 153, 0.2)' }}
                                        >
                                            Upload Photo
                                        </label>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={routinePhotoUrl} alt="Routine scan" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #fbcfe8' }} />
                                            <button 
                                                onClick={() => setRoutinePhotoUrl(null)} 
                                                style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                                            >
                                                Remove Photo ✕
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Complete Skincare Treatment Sequence</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>
                                        Follow these sequential steps in order for balanced skin health, optimal barrier maintenance, and active infusion.
                                    </p>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: '#1e293b', background: '#fdf2f8', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fce7f3' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={routineSteps.stepCleanse} 
                                                onChange={() => handleRoutineStepToggle('stepCleanse')} 
                                                style={{ accentColor: '#ec4899', marginTop: '2px', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <strong>Step 1: Gentle Cleansing</strong>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#831843' }}>Protocol: Remove impurities and surface oils using a mild, hydrating cleanser with lukewarm water.</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#9d174d', fontStyle: 'italic' }}>Pro Tip: Massage gently for 30 seconds without pulling or tugging facial skin.</p>
                                            </div>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: '#1e293b', background: '#fdf2f8', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fce7f3' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={routineSteps.stepExfoliate} 
                                                onChange={() => handleRoutineStepToggle('stepExfoliate')} 
                                                style={{ accentColor: '#ec4899', marginTop: '2px', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <strong>Step 2: Chemical Exfoliation (Optional / Periodic)</strong>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#831843' }}>Protocol: Apply mild AHA/BHA liquid solution to sweep away dead skin buildup.</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#9d174d', fontStyle: 'italic' }}>Pro Tip: Limit this step to 2-3 times per week to preserve your natural skin barrier.</p>
                                            </div>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: '#1e293b', background: '#fdf2f8', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fce7f3' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={routineSteps.stepTone} 
                                                onChange={() => handleRoutineStepToggle('stepTone')} 
                                                style={{ accentColor: '#ec4899', marginTop: '2px', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <strong>Step 3: Balancing Toner / Hydrating Essence</strong>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#831843' }}>Protocol: Press soothing toner rich in glycerin and hyaluronic acid into skin.</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#9d174d', fontStyle: 'italic' }}>Pro Tip: Pat gently with your palms instead of wiping with friction.</p>
                                            </div>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: '#1e293b', background: '#fdf2f8', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fce7f3' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={routineSteps.stepSerum} 
                                                onChange={() => handleRoutineStepToggle('stepSerum')} 
                                                style={{ accentColor: '#ec4899', marginTop: '2px', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <strong>Step 4: Targeted Active Serum</strong>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#831843' }}>Protocol: Apply specialized treatment drops (Vitamin C, Niacinamide, or Peptides) to face and neck.</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#9d174d', fontStyle: 'italic' }}>Pro Tip: Allow 60 seconds for deep penetration before sealing.</p>
                                            </div>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: '#1e293b', background: '#fdf2f8', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fce7f3' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={routineSteps.stepMoisturize} 
                                                onChange={() => handleRoutineStepToggle('stepMoisturize')} 
                                                style={{ accentColor: '#ec4899', marginTop: '2px', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <strong>Step 5: Barrier Cream / Moisturizer</strong>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#831843' }}>Protocol: Seal hydration and active ingredients using a ceramide-rich barrier cream.</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#9d174d', fontStyle: 'italic' }}>Pro Tip: Extend application down to your neck to maintain uniform skin texture.</p>
                                            </div>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: '#1e293b', background: '#fdf2f8', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fce7f3' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={routineSteps.stepProtect} 
                                                onChange={() => handleRoutineStepToggle('stepProtect')} 
                                                style={{ accentColor: '#ec4899', marginTop: '2px', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <strong>Step 6: UV Protection Shield</strong>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#831843' }}>Protocol: Layer broad-spectrum sunscreen evenly across all exposed skin areas.</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#9d174d', fontStyle: 'italic' }}>Pro Tip: Reapply every two hours if exposed to outdoor daylight.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : isPlannerOpen ? (
                        /* 4. AI Morning & Night Planner View with Upload & Remove */
                        <div className="chat-interface-container animate-fade-in" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '650px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
                            <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ background: 'linear-gradient(135deg, #d97706, #7c3aed)', color: '#fff', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaCalendarAlt size={18} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>AI Morning & Night Planner</h3>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Scheduled daily planner separating morning and evening skincare regimens</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <button onClick={() => { handleTaskComplete('planner'); setIsPlannerOpen(false); }} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                        Mark Complete ✓
                                    </button>
                                    <button onClick={() => setIsPlannerOpen(false)} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                        Back
                                    </button>
                                </div>
                            </div>

                            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', background: '#f8fafc' }}>
                                {/* Upload Box Inside the Planner Panel */}
                                <div style={{ background: '#ffffff', border: '1px dashed #fef3c7', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                        <div style={{ background: '#fffbeb', color: '#d97706', padding: '10px', borderRadius: '8px' }}>
                                            <FaCamera size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', fontWeight: 700, color: '#78350f' }}>Planner Daily Progress Photo</h4>
                                            <p style={{ margin: 0, fontSize: '0.78rem', color: '#92400e' }}>Upload your daily progress photo for schedule logging</p>
                                        </div>
                                    </div>

                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        id="planner-panel-upload-inner" 
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) setPlannerPhotoUrl(URL.createObjectURL(file));
                                        }}
                                    />

                                    {!plannerPhotoUrl ? (
                                        <label 
                                            htmlFor="planner-panel-upload-inner"
                                            style={{ background: '#d97706', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, boxShadow: '0 2px 4px rgba(217, 119, 6, 0.2)' }}
                                        >
                                            Upload Photo
                                        </label>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={plannerPhotoUrl} alt="Planner scan" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #fef3c7' }} />
                                            <button 
                                                onClick={() => setPlannerPhotoUrl(null)} 
                                                style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                                            >
                                                Remove Photo ✕
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Morning Routine Planner Section */}
                                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#d97706' }}>
                                        <FaSun size={18} />
                                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Morning Regimen & Pro Tips</h4>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: '#1e293b', background: '#fffbeb', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fef3c7' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={plannerSteps.morning1} 
                                                onChange={() => handlePlannerStepToggle('morning1')} 
                                                style={{ accentColor: '#d97706', marginTop: '2px', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <strong>1. Morning Cleanse & Vitamin C</strong>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#78350f' }}>Protocol: Wash with lukewarm water and apply antioxidant serum for daytime defense.</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#92400e', fontStyle: 'italic' }}>Pro Tip: Pat serum into slightly damp skin to boost absorption.</p>
                                            </div>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: '#1e293b', background: '#fffbeb', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fef3c7' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={plannerSteps.morning2} 
                                                onChange={() => handlePlannerStepToggle('morning2')} 
                                                style={{ accentColor: '#d97706', marginTop: '2px', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <strong>2. Daily Hydration Layer</strong>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#78350f' }}>Protocol: Apply lightweight moisturizer to lock in vital moisture without heaviness.</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#92400e', fontStyle: 'italic' }}>Pro Tip: Choose oil-free formulas if your skin tends to feel oily by midday.</p>
                                            </div>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: '#1e293b', background: '#fffbeb', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fef3c7' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={plannerSteps.morning3} 
                                                onChange={() => handlePlannerStepToggle('morning3')} 
                                                style={{ accentColor: '#d97706', marginTop: '2px', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <strong>3. Broad-Spectrum Sun Protection</strong>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#78350f' }}>Protocol: Apply SPF 30+ sunscreen as your final morning shield step.</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#92400e', fontStyle: 'italic' }}>Pro Tip: Essential for preventing premature photo-aging and dark spots.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Evening Routine Planner Section */}
                                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#7c3aed' }}>
                                        <FaMoon size={18} />
                                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Evening Regimen & Pro Tips</h4>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: '#1e293b', background: '#f5f3ff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #ede9fe' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={plannerSteps.evening1} 
                                                onChange={() => handlePlannerStepToggle('evening1')} 
                                                style={{ accentColor: '#7c3aed', marginTop: '2px', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <strong>1. Double Cleansing Protocol</strong>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#5b21b6' }}>Protocol: Use oil cleanser to dissolve sunscreen, followed by a gentle water-based cleanser.</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#6d28d9', fontStyle: 'italic' }}>Pro Tip: Cleanses deep inside pores to clear daily grime effectively.</p>
                                            </div>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: '#1e293b', background: '#f5f3ff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #ede9fe' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={plannerSteps.evening2} 
                                                onChange={() => handlePlannerStepToggle('evening2')} 
                                                style={{ accentColor: '#7c3aed', marginTop: '2px', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <strong>2. Cellular Repair & Retinol Treatment</strong>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#5b21b6' }}>Protocol: Apply a pea-sized amount of retinol or targeted night serum on clean skin.</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#6d28d9', fontStyle: 'italic' }}>Pro Tip: Introduce slowly (2 nights a week) if you are new to active retinoids.</p>
                                            </div>
                                        </label>

                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: '#1e293b', background: '#f5f3ff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #ede9fe' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={plannerSteps.evening3} 
                                                onChange={() => handlePlannerStepToggle('evening3')} 
                                                style={{ accentColor: '#7c3aed', marginTop: '2px', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <strong>3. Intensive Night Cream Sealing</strong>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#5b21b6' }}>Protocol: Finish with a rich ceramide cream to seal hydration overnight.</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#6d28d9', fontStyle: 'italic' }}>Pro Tip: Supports overnight barrier recovery while you rest.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : isChatOpen ? (
                        /* 5. AI Chat Bot View with Image Upload & Remove */
                        <div className="chat-interface-container animate-fade-in" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '650px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
                            <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: '#fff', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaRobot size={18} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>AI Beauty Consultation Chatbot</h3>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Upload skin photos and chat with AI for instant analysis</span>
                                    </div>
                                </div>
                                <button onClick={() => setIsChatOpen(false)} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                    Back to Dashboard
                                </button>
                            </div>

                            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc' }}>
                                {chatMessages.map((msg, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                                        <div style={{ background: msg.sender === 'user' ? '#ec4899' : '#e2e8f0', color: msg.sender === 'user' ? '#fff' : '#334155', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {msg.sender === 'user' ? <FaUser size={14} /> : <FaRobot size={14} />}
                                        </div>
                                        <div style={{ 
                                            background: msg.sender === 'user' ? '#ec4899' : '#ffffff', 
                                            color: msg.sender === 'user' ? '#ffffff' : '#1e293b', 
                                            padding: '12px 16px', 
                                            borderRadius: '12px', 
                                            maxWidth: '70%', 
                                            border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                                            fontSize: '0.9rem'
                                        }}>
                                            {msg.image && (
                                                <div style={{ marginBottom: '8px' }}>
                                                    <img src={msg.image} alt="Uploaded preview" style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.3)' }} />
                                                </div>
                                            )}
                                            <p style={{ margin: 0, lineHeight: '1.5' }}>{msg.text}</p>
                                            <span style={{ fontSize: '0.7rem', color: msg.sender === 'user' ? 'rgba(255,255,255,0.8)' : '#94a3b8', display: 'block', marginTop: '6px', textAlign: 'right' }}>{msg.timestamp}</span>
                                        </div>
                                    </div>
                                ))}
                                {isChatLoading && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ background: '#e2e8f0', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FaRobot size={14} color="#334155" />
                                        </div>
                                        <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '12px', color: '#64748b', fontSize: '0.85rem', border: '1px solid #e2e8f0' }}>
                                            AI is analyzing your photo and message...
                                        </div>
                                    </div>
                                )}
                            </div>

                            {imagePreviewUrl && (
                                <div style={{ background: '#f1f5f9', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img src={imagePreviewUrl} alt="Selected upload" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                                        <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>Ready to send photo for AI analysis</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={handleRemoveSelectedImage}
                                        style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600 }}
                                    >
                                        <FaTimes size={12} /> Remove
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} style={{ background: '#ffffff', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #e2e8f0' }}>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    ref={fileInputRef} 
                                    onChange={handleImageSelect} 
                                    style={{ display: 'none' }} 
                                    id="chat-image-upload"
                                />
                                <label 
                                    htmlFor="chat-image-upload" 
                                    title="Upload photo for AI analysis"
                                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                >
                                    <FaImage size={18} />
                                </label>

                                <input 
                                    type="text" 
                                    className="kg-chat-input" 
                                    placeholder="Type message or ask about your photo..." 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', outline: 'none', fontSize: '0.9rem', color: '#1e293b' }}
                                />
                                <button type="submit" className="kg-btn-primary" style={{ padding: '12px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>Send</span>
                                    <FaPaperPlane size={14} />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className="centered-hero-header animate-fade-in">
                                <div className="hub-logo-badge">
                                    <LuSparkles size={14} className="sparkle-icon" /> KINDGLOW HUB
                                </div>
                                <h2 className="gradient-text">Good morning, KIND GLOW BETTER!</h2>
                                <p>Interact with panels or open them to upload scan photos and progress your daily skin goals.</p>
                            </div>

                            <div className="magic-rituals-grid">
                                {features.map((feature, index) => {
                                    const isCompleted = completedPanels.includes(feature.id);

                                    return (
                                        <div 
                                            key={feature.id} 
                                            className={`ritual-card unique-magic-card category-${feature.category} ${isCompleted ? 'panel-completed' : ''}`}
                                            style={{ animationDelay: `${index * 60}ms` }}
                                            onClick={() => handleCardClick(feature)}
                                        >
                                            <div className="card-top-row" onClick={(e) => e.stopPropagation()}>
                                                <span className="card-badge">[{feature.badge}]</span>
                                                <input type="checkbox" className="panel-checkbox" checked={isCompleted} readOnly />
                                            </div>

                                            <div className="card-icon">{feature.icon}</div>
                                            <h4>{feature.title}</h4>

                                            <button className="launch-action-link" style={{ marginTop: 'auto' }}>
                                                {isCompleted ? <span className="completed-text"><FaCheckCircle size={14} /> Completed</span> : 'Launch Ritual →'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </main>
            </div>

            {activeFeature && (
                <RitualModal 
                    feature={activeFeature} 
                    onClose={() => setActiveFeature(null)} 
                    onComplete={handleTaskComplete}
                />
            )}
        </div>
    );
}

export default DashboardLayout;