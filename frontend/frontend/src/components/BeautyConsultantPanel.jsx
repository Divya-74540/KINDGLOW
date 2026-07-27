// src/components/BeautyConsultantPanel.jsx
import React, { useState } from 'react';
import { FaRobot, FaPaperPlane, FaSparkles } from 'react-icons/fa';
import api from '../../services/api';

export function BeautyConsultantPanel() {
    const [prompt, setPrompt] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);
        setResponseMessage('');

        try {
            // Calling the dedicated api method that connects to the Swagger / chatbot endpoint
            const data = await api.aiBeautyConsultationChatbot(prompt);
            setResponseMessage(data?.response || data?.message || data?.result || JSON.stringify(data));
        } catch (err) {
            setError(err.message || "Failed to fetch consultation response.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '20px auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: '#fdf2f8', color: '#ec4899', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaRobot size={20} />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>AI Beauty Consultant</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Interactive Swagger API Test & Consultation Panel</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <textarea 
                    rows="3"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask your beauty or skincare consultation question here..."
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', resize: 'vertical' }}
                />

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}
                >
                    <FaSparkles size={14} />
                    <span>{loading ? 'Consulting AI Engine...' : 'Send Consultation Request'}</span>
                </button>
            </form>

            {error && (
                <div style={{ marginTop: '16px', background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {responseMessage && (
                <div style={{ marginTop: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Consultant Response:</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{responseMessage}</p>
                </div>
            )}
        </div>
    );
}

export default BeautyConsultantPanel;