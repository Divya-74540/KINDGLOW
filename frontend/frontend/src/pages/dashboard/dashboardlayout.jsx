import React, { useState } from 'react';
import './dashboardlayout.css';

function DashboardLayout({ onLogout }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const features = [
        { id: 'routine', title: 'AI Skincare Routine Generator', icon: '✨', badge: 'CUSTOM' },
        { id: 'acne', title: 'AI Acne Care Assistant', icon: '🛡️', badge: 'SOS' },
        { id: 'type', title: 'AI Skin Type Analyzer', icon: '🧬', badge: 'SMART' },
        { id: 'chatbot', title: 'AI Beauty Consultation Chatbot', icon: '💬', badge: '24/7' },
        { id: 'product', title: 'AI Product Recommendation System', icon: '🛍️', badge: 'SHOP' },
        { id: 'ingredient', title: 'AI Ingredient Analyzer', icon: '🧪', badge: 'DECODE', desc: 'Explains cosmetic ingredients' },
        { id: 'planner', title: 'AI Morning & Night Skincare Planner', icon: '📅', badge: 'ROUTINE' },
        { id: 'sunscreen', title: 'AI Sunscreen Recommendation App', icon: '☀️', badge: 'UV SHIELD' },
        { id: 'sensitive', title: 'AI Sensitive Skin Advisor', icon: '🌿', badge: 'CALM' },
        { id: 'journal', title: 'AI Beauty Journal', icon: '📔', badge: 'LOG' }
    ];

    return (
        <div className="dashboard-container">
            {/* Animated Cosmic Background Layers */}
            <div className="cosmic-bg-mesh"></div>
            <div className="cosmic-bg-glow"></div>

            {/* Floating Toggle Button for the Left Sidebar */}
            <button 
                className={`sidebar-toggle-btn ${isSidebarOpen ? 'is-open' : 'is-closed'}`}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title={isSidebarOpen ? "Hide Panel" : "Show Panel"}
            >
                {isSidebarOpen ? '←' : '→'}
            </button>

            <div className="dashboard-workspace">
                {/* Left Sidebar Widget Layout (Collapsible & Spaced Out) */}
                <aside className={`dashboard-sidebar sidebar-glass left-side-panel ${isSidebarOpen ? 'open' : 'closed'}`}>
                    <div className="profile-card user-glow-card">
                        <div className="profile-avatar avatar-bounce">🧸 <span className="status-dot">●</span></div>
                        <div className="profile-info">
                            <h3>KIND GLOW</h3>
                            <span>Level 3 Skin Cadet</span>
                        </div>
                    </div>

                    {/* 1. Moisture Level Widget */}
                    <div className="sidebar-widget moisture-widget">
                        <div className="widget-label">
                            <span>💧 Moisture Level</span>
                            <span>78%</span>
                        </div>
                        <div className="widget-bar-bg">
                            <div className="moisture-bar-fill filled-progress-bar" style={{ width: '78%' }}></div>
                        </div>
                    </div>

                    {/* 2. Task Completion Widget */}
                    <div className="sidebar-widget task-widget">
                        <div className="widget-label">
                            <span>✅ Daily Tasks Completed</span>
                            <span>3 / 5</span>
                        </div>
                        <div className="widget-bar-bg">
                            <div className="task-bar-fill filled-progress-bar" style={{ width: '60%' }}></div>
                        </div>
                    </div>

                    {/* 3. Sunscreen Reminder Widget */}
                    <div className="sidebar-widget reminder-widget float-reminder">
                        <div className="reminder-box">
                            <div className="reminder-header">
                                <span>☀️ Sunscreen Reminder</span>
                                <span className="reminder-status active blink-alert">Due Now</span>
                            </div>
                            <p className="reminder-desc">UV Index is moderate. Reapply SPF 30+ to stay protected!</p>
                        </div>
                    </div>

                    {/* 4. User History Widget */}
                    <div className="sidebar-widget history-widget">
                        <div className="widget-title-sm">📜 Recent Activity History</div>
                        <ul className="history-list">
                            <li className="history-item">
                                <span className="history-icon">🔬</span>
                                <div className="history-text">
                                    <p>Analyzed Skin Type</p>
                                    <span>2 hours ago</span>
                                </div>
                            </li>
                            <li className="history-item">
                                <span className="history-icon">✨</span>
                                <div className="history-text">
                                    <p>Generated Morning Routine</p>
                                    <span>Yesterday</span>
                                </div>
                            </li>
                            <li className="history-item">
                                <span className="history-icon">🧪</span>
                                <div className="history-text">
                                    <p>Checked Niacinamide Safety</p>
                                    <span>3 days ago</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <button className="logout-btn interactive-button" onClick={onLogout}>Exit Session (Logout)</button>
                </aside>

                {/* Center Panel: Header Features and Cards Grid */}
                <main className="main-content-panel center-aligned-layout">
                    
                    {/* Centered Header Block inside the Main Panel */}
                    <div className="centered-hero-header animate-fade-in">
                        <div className="hub-logo-badge pulse-glow aura-effect">
                            <span className="sparkle-icon">🌸</span> KINDGLOW HUB
                        </div>
                        <h2 className="gradient-text">Good morning, KIND GLOW BETTER! 🦄</h2>
                        <p>Let's unlock your cosmic glow routine today.</p>
                    </div>

                    <h3 className="panel-instruction-heading animate-fade-in">✦ Choose a Skincare Magic Ritual ✦</h3>
                    
                    <div className="magic-rituals-grid">
                        {features.map((feature, index) => (
                            <div 
                                key={feature.id} 
                                className="ritual-card unique-magic-card animate-card"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <span className="card-badge">[{feature.badge}]</span>
                                <div className="card-icon floating-icon">{feature.icon}</div>
                                <h4>{feature.title}</h4>
                                {feature.desc && <p className="card-description">{feature.desc}</p>}
                                <span className="launch-action-link custom-link-effect">Launch →</span>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;