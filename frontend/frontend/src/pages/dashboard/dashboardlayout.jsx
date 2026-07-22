import React, { useState } from 'react';
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
    FaCheckCircle
} from 'react-icons/fa';
import './dashboardlayout.css';

function DashboardLayout({ onLogout }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Dynamic Moisture Checklist State
    const [moistureChecklist, setMoistureChecklist] = useState({
        moisturizer: false,
        drinkingWater: false
    });

    // Sunscreen State
    const [isSunscreenApplied, setIsSunscreenApplied] = useState(false);

    // Skincare Panels / Feature List
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

    const [completedPanels, setCompletedPanels] = useState([]); 
    const TARGET_DAILY_TASKS = 5;

    const handleMoistureToggle = (key) => {
        setMoistureChecklist(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const moistureCount = Object.values(moistureChecklist).filter(Boolean).length;
    const moisturePercentage = Math.round((moistureCount / 2) * 100);

    const dailyTaskCount = completedPanels.length;
    const dailyTaskPercentage = Math.min(Math.round((dailyTaskCount / TARGET_DAILY_TASKS) * 100), 100);

    const handlePanelLaunch = (id) => {
        if (completedPanels.includes(id)) {
            setCompletedPanels(prev => prev.filter(item => item !== id));
        } else {
            setCompletedPanels(prev => [...prev, id]);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="cosmic-bg-mesh"></div>
            <div className="cosmic-bg-glow"></div>

            <button 
                className={`sidebar-toggle-btn ${isSidebarOpen ? 'is-open' : 'is-closed'}`}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title={isSidebarOpen ? "Hide Panel" : "Show Panel"}
            >
                {isSidebarOpen ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
            </button>

            <div className="dashboard-workspace">
                <aside className={`dashboard-sidebar sidebar-glass left-side-panel ${isSidebarOpen ? 'open' : 'closed'}`}>
                    <div className="profile-card user-glow-card">
                        <div className="profile-avatar avatar-bounce">
                            <FaUserCheck size={20} className="avatar-icon" />
                            <span className="status-dot">●</span>
                        </div>
                        <div className="profile-info">
                            <h3>KIND GLOW</h3>
                            <span>Level 3 Skin Cadet</span>
                        </div>
                    </div>

                    {/* 1. Moisture Level Widget */}
                    <div className="sidebar-widget moisture-widget">
                        <div className="widget-label">
                            <span className="label-title"><FaTint size={14} /> Moisture Level</span>
                            <span className="percentage-badge">{moisturePercentage}%</span>
                        </div>
                        <div className="widget-bar-bg">
                            <div 
                                className="moisture-bar-fill filled-progress-bar" 
                                style={{ width: `${moisturePercentage}%` }}
                            ></div>
                        </div>

                        <div className="widget-checklist">
                            <label className="checkbox-item">
                                <input 
                                    type="checkbox" 
                                    checked={moistureChecklist.moisturizer} 
                                    onChange={() => handleMoistureToggle('moisturizer')}
                                />
                                <span>Applied Moisturizer (+50%)</span>
                            </label>
                            <label className="checkbox-item">
                                <input 
                                    type="checkbox" 
                                    checked={moistureChecklist.drinkingWater} 
                                    onChange={() => handleMoistureToggle('drinkingWater')}
                                />
                                <span>Drank Water (+50%)</span>
                            </label>
                        </div>
                    </div>

                    {/* 2. Daily Tasks Widget */}
                    <div className="sidebar-widget task-widget">
                        <div className="widget-label">
                            <span className="label-title"><FaCheckSquare size={14} /> Panel Tasks</span>
                            <span className="percentage-badge">{dailyTaskCount} / {TARGET_DAILY_TASKS} ({dailyTaskPercentage}%)</span>
                        </div>
                        <div className="widget-bar-bg">
                            <div 
                                className="task-bar-fill filled-progress-bar" 
                                style={{ width: `${dailyTaskPercentage}%` }}
                            ></div>
                        </div>
                        <span className="widget-subtext">Click panels in the main layout to complete tasks!</span>
                    </div>

                    {/* 3. Sunscreen Reminder Widget */}
                    <div className="sidebar-widget reminder-widget float-reminder">
                        <div className={`reminder-box ${isSunscreenApplied ? 'applied' : ''}`}>
                            <div className="reminder-header">
                                <span className="label-title"><FaSun size={14} /> Sunscreen Reminder</span>
                                <span className={`reminder-status ${isSunscreenApplied ? 'applied' : 'active blink-alert'}`}>
                                    {isSunscreenApplied ? 'Protected' : 'Due Now'}
                                </span>
                            </div>
                            <p className="reminder-desc">
                                {isSunscreenApplied 
                                    ? 'SPF 30+ Applied! Skin is protected against UV rays.' 
                                    : 'UV Index is moderate. Reapply SPF 30+ to stay protected!'}
                            </p>
                            
                            <button 
                                className={`sunscreen-action-btn ${isSunscreenApplied ? 'applied' : ''}`}
                                onClick={() => setIsSunscreenApplied(!isSunscreenApplied)}
                            >
                                {isSunscreenApplied ? (
                                    <>
                                        <FaCheckCircle size={13} /> Done (Protected)
                                    </>
                                ) : (
                                    'Apply Sunscreen'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 4. Recent Activity History */}
                    <div className="sidebar-widget history-widget">
                        <div className="widget-title-sm">
                            <FaHistory size={12} /> Recent Activity History
                        </div>
                        <ul className="history-list">
                            <li className="history-item">
                                <span className="history-icon"><FaDna size={14} /></span>
                                <div className="history-text">
                                    <p>Analyzed Skin Type</p>
                                    <span>2 hours ago</span>
                                </div>
                            </li>
                            <li className="history-item">
                                <span className="history-icon"><LuSparkles size={14} /></span>
                                <div className="history-text">
                                    <p>Generated Morning Routine</p>
                                    <span>Yesterday</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <button className="logout-btn interactive-button" onClick={onLogout}>
                        <FaSignOutAlt size={14} /> Exit Session
                    </button>
                </aside>

                <main className="main-content-panel center-aligned-layout">
                    <div className="centered-hero-header animate-fade-in">
                        <div className="hub-logo-badge pulse-glow aura-effect">
                            <LuSparkles size={14} className="sparkle-icon" /> KINDGLOW HUB
                        </div>
                        <h2 className="gradient-text">Good morning, KIND GLOW BETTER!</h2>
                        <p>Interact with panels to dynamically progress your daily skin goals.</p>
                    </div>

                    <h3 className="panel-instruction-heading animate-fade-in">Interactive Skincare Rituals</h3>
                    
                    <div className="magic-rituals-grid">
                        {features.map((feature, index) => {
                            const isCompleted = completedPanels.includes(feature.id);
                            return (
                                <div 
                                    key={feature.id} 
                                    className={`ritual-card unique-magic-card category-${feature.category} ${isCompleted ? 'panel-completed' : ''}`}
                                    style={{ animationDelay: `${index * 60}ms` }}
                                    onClick={() => handlePanelLaunch(feature.id)}
                                >
                                    <div className="card-top-row">
                                        <span className="card-badge">[{feature.badge}]</span>
                                        <input 
                                            type="checkbox" 
                                            className="panel-checkbox"
                                            checked={isCompleted}
                                            readOnly
                                        />
                                    </div>
                                    <div className="card-icon floating-icon">{feature.icon}</div>
                                    <h4>{feature.title}</h4>
                                    {feature.desc && <p className="card-description">{feature.desc}</p>}
                                    <button className="launch-action-link custom-link-effect">
                                        {isCompleted ? (
                                            <span className="completed-text"><FaCheckCircle size={14} /> Completed</span>
                                        ) : (
                                            'Launch Ritual →'
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;