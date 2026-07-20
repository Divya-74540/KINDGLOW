import React, { useRef, useState } from "react";
import "./landingpage.css";

// Base Hero Asset Imports
import serumImage from "../../asset/images/serum.png";
import homeImage from "../../asset/images/home.jpg";

// Feature Asset Imports
import routineImg from "../../asset/images/routine.jpg";
import acneImg from "../../asset/images/acne.jpg";
import analyzerImg from "../../asset/images/analyzer.jpg";
import chatbotImg from "../../asset/images/chatbot.jpg";
import recommendationImg from "../../asset/images/recommendation.jpg";
import ingredientImg from "../../asset/images/ingredient.jpg";
import plannerImg from "../../asset/images/planner.jpg";
import sunscreenImg from "../../asset/images/sunscreen.jpg";
import sensitiveImg from "../../asset/images/sensitive.jpg";
import journalImg from "../../asset/images/journal.jpg";

function LandingPage({ onLoginSuccess }) { // Catching the login handler prop from App.js
    const homeRef = useRef(null);
    const aboutRef = useRef(null);
    const serviceRef = useRef(null);
    const featuresRef = useRef(null);
    const contactRef = useRef(null);

    const [activeFeature, setActiveFeature] = useState(0);
    const [activeTopic, setActiveTopic] = useState("general");
    const [formSubmitted, setFormSubmitted] = useState(false);
    
    // Auth Modal Overlay States
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login");

    // Dynamic Professional Toast Notifications
    const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

    const triggerToast = (message, type = "info") => {
        setToast({ visible: true, message, type });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, visible: false }));
        }, 4000);
    };

    const scrollToSection = (elementRef) => {
        elementRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        triggerToast("Transmission dispatched successfully to system terminal.", "success");
        setTimeout(() => setFormSubmitted(false), 4000);
    };

    const triggerContactRegister = () => {
        setAuthMode("register");
        setShowAuthModal(true);
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        if (authMode === "register") {
            triggerToast("Profile node established. Re-routing to Authentication console...", "success");
            setAuthMode("login"); 
        } else {
            triggerToast("Authentication matrix verification successful. Entry granted.", "success");
            setShowAuthModal(false);
            
            // This triggers the view toggle in App.js to open your dashboard layout instantly
            if (onLoginSuccess) {
                onLoginSuccess();
            }
        }
    };

    const topicDetails = {
        general: { title: "Let's co-create glowing experiences.", sub: "Have a general inquiry, feature suggestion, or partnership idea? Drop a transmission directly to our desk." },
        dermatology: { title: "Seeking algorithmic verification?", sub: "Our data modeling maps complex biological variables. Reach out to coordinate peer reviews or database syncs." },
        support: { title: "Encountering system latency?", sub: "If an AI engine routine breaks or your profile journal experiences state issues, our technical triage is on standby." }
    };

    const featuresData = [
        { title: "AI Skincare Routine Generator", desc: "Custom-tailored daily regimens built dynamically using complex dermatological logic algorithms.", tag: "Core Engine", image: routineImg },
        { title: "AI Acne Care Assistant", desc: "Targeted localized breakthrough management, cycle tracking, and active flare-up guidance.", tag: "Targeted Care", image: acneImg },
        { title: "AI Skin Type Analyzer", desc: "Advanced metrics calibration to evaluate moisture, sebum levels, and lipid barrier health.", tag: "Diagnostics", image: analyzerImg },
        { title: "AI Beauty Consultation Chatbot", desc: "24/7 hyper-personalized conversational companion powered by LLMs for immediate beauty advice.", tag: "Interactive", image: chatbotImg },
        { title: "AI Product Recommendation System", desc: "Intelligent matchmaker that aligns retail products with your precise skin compatibility score.", tag: "Smart Match", image: recommendationImg },
        { title: "AI Ingredient Analyzer", desc: "Decodes complex chemical labels instantly, explaining active cosmetic compounds clearly.", tag: "Transparency", image: ingredientImg },
        { title: "AI Morning & Night Skincare Planner", desc: "Chronological daily scheduler optimization to track perfect application timing windows.", tag: "Planner", image: plannerImg },
        { title: "AI Sunscreen Recommendation App", desc: "UV index-aware calibration suggesting ideal SPF levels based on local climate analytics.", tag: "Protection", image: sunscreenImg },
        { title: "AI Sensitive Skin Advisor", desc: "Defensive scanning mechanisms built explicitly to flag irritants and custom allergens.", tag: "Safety First", image: sensitiveImg },
        { title: "AI Beauty Journal", desc: "Visual timeline interface to track logs, capture photos, and map real skin transformations.", tag: "Analytics", image: journalImg }
    ];

    const resolveImageSrc = (imgAsset) => {
        return imgAsset && typeof imgAsset === 'object' ? imgAsset.default : imgAsset;
    };

    return (
        <div className="landing-view">
            {/* Professional App Toast Notification Banner */}
            <div className={`app-toast-alert ${toast.visible ? "toast-active" : ""} toast-${toast.type}`}>
                <div className="toast-indicator-dot"></div>
                <p className="toast-msg-body">{toast.message}</p>
            </div>

            {/* ==================== 1. HOME SCREEN BLOCK ==================== */}
            <div ref={homeRef} className="screen-block layer-white">
                <div className="inner-container">
                    <header>
                        <div className="logo">KINDGLOW</div>
                        <nav className="nav-links">
                            <span onClick={() => scrollToSection(homeRef)}>Home</span>
                            <span onClick={() => scrollToSection(aboutRef)}>About</span>
                            <span onClick={() => scrollToSection(serviceRef)}>Service</span>
                            <span onClick={() => scrollToSection(featuresRef)}>Features</span>
                            <span onClick={() => scrollToSection(contactRef)}>Contact</span>
                            <span onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}>Login</span>
                        </nav>
                    </header>

                    <main className="hero">
                        <section className="hero-text">
                            <h1>EXPERIENCE THE FUTURE OF SKINCARE WITH COMPREHENSIVE AI-POWERED INSIGHTS</h1>
                            <p>Experience personalized skincare journey with AI-driven insights.</p>
                            
                            <div className="explore-wrapper">
                                <span className="action-btn" onClick={() => scrollToSection(featuresRef)}>Explore</span>
                                <span className="action-btn" onClick={() => scrollToSection(contactRef)}>Contact Us</span>
                            </div>
                        </section>

                        <section className="card-container">
                            <div className="card card-back">
                                <img src={resolveImageSrc(serumImage)} alt="Serum" />
                            </div>
                            <div className="card card-front">
                                <img src={resolveImageSrc(homeImage)} alt="Skincare" />
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {/* ==================== 2. ABOUT SCREEN BLOCK ==================== */}
            <div ref={aboutRef} className="screen-block layer-white">
                <div className="inner-container">
                    <main className="about-content">
                        <section className="search-container">
                            <form onSubmit={handleSearchSubmit} className="about-search-bar">
                                <input type="text" placeholder="about.." />
                                <button type="submit" className="about-search-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b615a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                            </form>
                        </section>

                        <section className="project-description-section">
                            <span className="section-label">THE PURPOSE</span>
                            <h2>AI-POWERED PERSONALIZED SKINCARE & BEAUTY ASSISTANT</h2>
                            
                            <div className="description-paragraphs">
                                <p>
                                    The AI-Powered Personalized Skincare & Beauty Assistant is a full-stack web application designed to help users make informed skincare decisions through artificial intelligence. Instead of relying on generic beauty advice, the system provides personalized recommendations based on each user's skin type, skin concerns, lifestyle, and skincare goals.
                                </p>
                                <p>
                                    Users can create an account, complete a skin profile, and interact with an AI-powered beauty assistant that recommends suitable skincare routines, explains cosmetic ingredients, suggests products, and answers skincare-related questions. The application also includes a beauty journal where users can track their daily skincare routine and monitor their skin progress over time.
                                </p>
                                <p>
                                    The project combines OpenAI API and Gemma 3:4B (via Ollama) to deliver intelligent, conversational, and personalized skincare guidance while maintaining a modern, responsive, and user-friendly interface.
                                </p>
                            </div>

                            <div className="about-actions">
                                <span className="action-btn" onClick={() => scrollToSection(serviceRef)}>View Services</span>
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {/* ==================== 3. SERVICE SCREEN BLOCK ==================== */}
            <div ref={serviceRef} className="screen-block layer-white">
                <div className="inner-container">
                    <main className="service-content">
                        <span className="section-label">WHAT WE OFFER</span>
                        <h2 className="service-main-heading">INTELLIGENT DIGITAL SERVICES</h2>
                        
                        <div className="service-grid">
                            <div className="service-card pink-grid-card">
                                <div className="service-icon-wrapper">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d2926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2a10 10 0 0 1 7.54 16.59l-1.42-1.42a8 8 0 1 0-12.24 0l-1.42 1.42A10 10 0 0 1 12 2z"></path>
                                        <path d="M12 6a6 6 0 0 1 4.52 9.95l-1.42-1.42a4 4 0 1 0-6.2 0l-1.42 1.42A6 6 0 0 1 12 6z"></path>
                                        <circle cx="12" cy="12" r="2"></circle>
                                    </svg>
                                </div>
                                <h3>AI Diagnostics</h3>
                                <p>Powered by a dual engine setup of OpenAI API and Gemma 3:4B via Ollama to evaluate your exact skin health parameters dynamically.</p>
                            </div>

                            <div className="service-card pink-grid-card">
                                <div className="service-icon-wrapper">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d2926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                </div>
                                <h3>Smart Routines</h3>
                                <p>Get fully dynamic skincare advice tailored precisely to your specific concerns, ingredient preferences, and custom beauty goals.</p>
                            </div>

                            <div className="service-card pink-grid-card">
                                <div className="service-icon-wrapper">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d2926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                </div>
                                <h3>Beauty Journaling</h3>
                                <p>Keep track of your real-world lifestyle habits, log product application timelines, and monitor visual improvements systematically over time.</p>
                            </div>
                        </div>

                        <div className="service-actions">
                            <span className="action-btn" onClick={() => scrollToSection(featuresRef)}>Explore Features</span>
                        </div>
                    </main>
                </div>
            </div>

            {/* ==================== 4. FEATURES SCREEN BLOCK ==================== */}
            <div ref={featuresRef} className="screen-block layer-white">
                <div className="inner-container">
                    <main className="features-studio-layout">
                        <section className="features-list-pane">
                            <span className="section-label">SYSTEM CORE CAPABILITIES</span>
                            <h2 className="studio-heading">INTELLIGENT APPLICATION SUITE</h2>
                            
                            <div className="studio-interactive-list">
                                {featuresData.map((feature, idx) => (
                                    <div 
                                        key={idx}
                                        className={`studio-list-item ${activeFeature === idx ? "is-selected" : ""}`}
                                        onMouseEnter={() => setActiveFeature(idx)}
                                    >
                                        <div className="index-counter">{String(idx + 1).padStart(2, '0')}</div>
                                        <div className="item-text-content">
                                            <span className="item-badge">{feature.tag}</span>
                                            <h3>{feature.title}</h3>
                                            <p>{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="features-gallery-pane">
                            <div className="sticky-gallery-frame">
                                {featuresData.map((feature, idx) => (
                                    <div 
                                        key={idx}
                                        className={`feature-image-wrapper ${activeFeature === idx ? "layer-visible" : "layer-hidden"}`}
                                    >
                                        <div className="feature-image-frame">
                                            {feature.image ? (
                                                <img src={resolveImageSrc(feature.image)} alt={feature.title} />
                                            ) : (
                                                <div className="image-placeholder-art">
                                                    <div className="sparkle-effect">✨</div>
                                                    <div className="mockup-ui">
                                                        <span className="ui-dot"></span>
                                                        <span className="ui-dot"></span>
                                                        <span className="ui-dot"></span>
                                                    </div>
                                                    <h4>{feature.title}</h4>
                                                    <p>AI Engine Output Panel Mockup</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                    
                    <div className="features-footer-action">
                        <span className="action-btn" onClick={() => scrollToSection(contactRef)}>Continue to Contact</span>
                    </div>
                </div>
            </div>

            {/* ==================== 5. INTERACTIVE CONTACT BLOCK ==================== */}
            <div ref={contactRef} className="screen-block layer-white contact-studio-section">
                <div className="inner-container">
                    <span className="section-label">CONNECT WITH US</span>
                    <h2 className="contact-main-heading">HUMAN + AI SYNERGY HUB</h2>
                    
                    <div className="contact-interactive-layout">
                        <div className="contact-info-panel">
                            <div className="topic-selector-chips">
                                <button 
                                    className={`topic-chip ${activeTopic === "general" ? "active" : ""}`}
                                    onClick={() => setActiveTopic("general")}
                                >
                                    ✦ General Inquiry
                                </button>
                                <button 
                                    className={`topic-chip ${activeTopic === "dermatology" ? "active" : ""}`}
                                    onClick={() => setActiveTopic("dermatology")}
                                >
                                    🧬 Research & Logic
                                </button>
                                <button 
                                    className={`topic-chip ${activeTopic === "support" ? "active" : ""}`}
                                    onClick={() => setActiveTopic("support")}
                                >
                                    ⚙️ Dev Support
                                </button>
                            </div>

                            <div className="dynamic-message-billboard">
                                <h3>{topicDetails[activeTopic].title}</h3>
                                <p>{topicDetails[activeTopic].sub}</p>
                            </div>

                            <div className="system-coordinates">
                                <div className="coord-item">
                                    <span className="coord-label">System Node</span>
                                    <span className="coord-value">KINDGLOW_CORE_V1</span>
                                </div>
                                <div className="coord-item">
                                    <span className="coord-label">Response Metrics</span>
                                    <span className="coord-value">Avg under 240ms via Ollama Engine</span>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-panel">
                            {formSubmitted ? (
                                <div className="form-success-state">
                                    <div className="success-icon">✨</div>
                                    <h3>Transmission Encrypted & Sent</h3>
                                    <p>Your message has successfully merged into our optimization queues.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleContactSubmit} className="studio-console-form">
                                    <div className="form-group-row">
                                        <div className="input-frame">
                                            <input type="text" required placeholder=" " id="client-name" />
                                            <label htmlFor="client-name">Your Name</label>
                                        </div>
                                        <div className="input-frame">
                                            <input type="email" required placeholder=" " id="client-email" />
                                            <label htmlFor="client-email">Email Coordinate</label>
                                        </div>
                                    </div>
                                    
                                    <div className="input-frame text-area-frame">
                                        <textarea required rows="4" placeholder=" " id="client-msg"></textarea>
                                        <label htmlFor="client-msg">Type your message or custom integration needs...</label>
                                    </div>

                                    <div className="form-action-row">
                                        <button type="submit" className="console-submit-btn font-primary-btn">
                                            <span>Initialize Transmission</span>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                            </svg>
                                        </button>
                                        
                                        <button type="button" onClick={triggerContactRegister} className="console-submit-btn font-secondary-btn">
                                            <span>Register Account Node</span>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="8.5" cy="7" r="4"></circle>
                                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                                <line x1="23" y1="11" x2="17" y2="11"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== 6. INTERACTIVE AUTHENTICATION MODAL ==================== */}
            {showAuthModal && (
                <div className="auth-overlay-backdrop" onClick={() => setShowAuthModal(false)}>
                    <div className="auth-modal-window" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setShowAuthModal(false)}>×</button>
                        
                        <div className="auth-header-tabs">
                            <span 
                                className={`auth-tab ${authMode === "login" ? "active-tab" : ""}`}
                                onClick={() => setAuthMode("login")}
                            >
                                Sign In
                            </span>
                            <span 
                                className={`auth-tab ${authMode === "register" ? "active-tab" : ""}`}
                                onClick={() => setAuthMode("register")}
                            >
                                Register
                            </span>
                        </div>

                        <h3 className="auth-title">
                            {authMode === "login" ? "Access Skin Analytics Core" : "Create Personal Profile Node"}
                        </h3>

                        <form onSubmit={handleAuthSubmit} className="auth-console-form">
                            {authMode === "register" && (
                                <div className="input-frame">
                                    <input type="text" required placeholder=" " id="auth-username" />
                                    <label htmlFor="auth-username">Select Username</label>
                                </div>
                            )}

                            <div className="input-frame">
                                <input type="email" required placeholder=" " id="auth-email" />
                                <label htmlFor="auth-email">Email Address</label>
                            </div>

                            <div className="input-frame">
                                <input type="password" required placeholder=" " id="auth-password" />
                                <label htmlFor="auth-password">Security Password</label>
                            </div>

                            {authMode === "register" && (
                                <div className="terms-checkbox">
                                    <input type="checkbox" id="auth-agree" required />
                                    <label htmlFor="auth-agree">I authorize safe handling of diagnostic logs.</label>
                                </div>
                            )}

                            <button type="submit" className="auth-submit-btn">
                                {authMode === "login" ? "Authenticate Entry" : "Establish Profile Node"}
                            </button>
                        </form>

                        <div className="auth-footer-toggle">
                            {authMode === "login" ? (
                                <p>New to KindGlow? <span onClick={() => setAuthMode("register")}>Create an account Node</span></p>
                            ) : (
                                <p>Existing profile? <span onClick={() => setAuthMode("login")}>Return to Sign In</span></p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LandingPage;