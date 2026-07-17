import React from "react";
import "./landingpage.css";
import serumImage from "../../asset/images/serum.png";
import homeImage from "../../asset/images/home.jpg";

function LandingPage() {
    return (
        <div className="landing-view">
            <div className="inner-container">
                <header>
                    <div className="logo">KINDGLOW</div>
                    <nav className="nav-links">
                        <span>Home</span><span>Service</span><span>Features</span><span>Contact</span><span>Login</span>
                    </nav>
                </header>

                <main className="hero">
                    <section className="hero-text">
                        <h1>EXPERIENCE THE FUTURE OF SKINCARE WITH COMPREHENSIVE AI-POWERED INSIGHTS</h1>
                        <p>Experience personalized skincare journey with AI-driven insights.</p>
                        
                        <div className="explore-wrapper">
                            <span className="explore-btn">Explore</span>
                        </div>
                    </section>

                    <section className="card-container">
                        <div className="card card-back">
                            <img src={serumImage} alt="Serum" />
                        </div>
                        <div className="card card-front">
                            <img src={homeImage} alt="Skincare" />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default LandingPage;