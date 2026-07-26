import React, { useState, useRef } from 'react';
import { FaTimes, FaCamera, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import './dashboardlayout.css';

function RitualModal({ feature, onClose, onComplete }) {
    const [inputVal, setInputVal] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { 
            sender: 'ai', 
            text: `Hello! I am your ${feature.title} assistant. Describe your concerns or upload a photo below for an instant custom analysis!`, 
            timestamp: 'Just now' 
        }
    ]);
    
    const fileInputRef = useRef(null);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleExecuteRitual = async (e) => {
        e.preventDefault();
        if (!inputVal.trim() && !selectedImage) return;

        const userText = inputVal;
        const currentPreview = imagePreviewUrl;
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Add user message to chat stream
        setMessages(prev => [
            ...prev,
            { sender: 'user', text: userText, image: currentPreview, timestamp: timeNow }
        ]);

        setInputVal('');
        setSelectedImage(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsLoading(true);

        try {
            // Simulated AI processing with photo/text awareness
            setTimeout(() => {
                let aiReply = `Processed your request successfully for ${feature.title}. All parameters look optimal.`;
                if (currentPreview) {
                    aiReply = `📸 Photo analyzed successfully! The AI scan for ${feature.title} detects good baseline alignment with minor localized dryness. Recommended to follow your active hydration protocol.`;
                } else if (userText) {
                    aiReply = `Analysis complete for "${userText}": Custom parameters generated successfully for your skin profile.`;
                }

                setMessages(prev => [
                    ...prev,
                    { sender: 'ai', text: aiReply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                ]);
                setIsLoading(false);

                // Mark the panel as completed and update history/checkboxes in the dashboard
                if (onComplete) {
                    onComplete(feature.id);
                }
            }, 1200);

        } catch (err) {
            console.error("Ritual execution error:", err);
            setMessages(prev => [
                ...prev,
                { sender: 'ai', text: 'Sorry, we encountered an error processing your request. Please try again.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ]);
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-backdrop animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
            <div className="modal-content-container" style={{ background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '650px', height: '680px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }}>
                
                {/* Modal Header */}
                <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(236,72,153,0.2)' }}>
                            {feature.icon}
                        </div>
                        <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#fdf2f8', color: '#ec4899', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fbcfe8' }}>
                                [{feature.badge}]
                            </span>
                            <h3 style={{ margin: '2px 0 0 0', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{feature.title}</h3>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <FaTimes size={14} />
                    </button>
                </div>

                {/* Chat / Result Message Stream */}
                <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', background: '#f8fafc' }}>
                    <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#ec4899', fontSize: '1.2rem' }}>✨</span>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#831843', fontWeight: 500 }}>
                            Personalized AI analysis engine active. Upload a scan photo or type your concerns to complete this panel task and log your history.
                        </p>
                    </div>

                    {messages.map((msg, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                            <div style={{ background: msg.sender === 'user' ? '#ec4899' : '#e2e8f0', color: msg.sender === 'user' ? '#fff' : '#334155', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {msg.sender === 'user' ? <FaUser size={12} /> : <FaRobot size={12} />}
                            </div>
                            <div style={{ 
                                background: msg.sender === 'user' ? '#ec4899' : '#ffffff', 
                                color: msg.sender === 'user' ? '#ffffff' : '#1e293b', 
                                padding: '12px 16px', 
                                borderRadius: '12px', 
                                maxWidth: '75%', 
                                border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                fontSize: '0.88rem'
                            }}>
                                {msg.image && (
                                    <div style={{ marginBottom: '8px' }}>
                                        <img src={msg.image} alt="Upload preview" style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.3)' }} />
                                    </div>
                                )}
                                <p style={{ margin: 0, lineHeight: '1.4' }}>{msg.text}</p>
                                <span style={{ fontSize: '0.68rem', color: msg.sender === 'user' ? 'rgba(255,255,255,0.8)' : '#94a3b8', display: 'block', marginTop: '4px', textAlign: 'right' }}>{msg.timestamp}</span>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: '#e2e8f0', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaRobot size={12} color="#334155" />
                            </div>
                            <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '12px', color: '#64748b', fontSize: '0.82rem', border: '1px solid #e2e8f0' }}>
                                Analyzing scan photo and executing AI ritual...
                            </div>
                        </div>
                    )}
                </div>

                {/* Selected Image Thumbnail Preview Bar */}
                {imagePreviewUrl && (
                    <div style={{ background: '#f1f5f9', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={imagePreviewUrl} alt="Selected scan" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                            <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>Photo attached for AI analysis</span>
                        </div>
                        <button 
                            type="button" 
                            onClick={handleRemoveImage}
                            style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                            Remove ✕
                        </button>
                    </div>
                )}

                {/* Input Form & Action Bar */}
                <form onSubmit={handleExecuteRitual} style={{ background: '#ffffff', padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            onChange={handleImageSelect} 
                            style={{ display: 'none' }} 
                            id="modal-photo-upload"
                        />
                        <label 
                            htmlFor="modal-photo-upload" 
                            title="Upload skin scan photo"
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s', flexShrink: 0 }}
                        >
                            <FaCamera size={16} color="#ec4899" /> Upload Photo
                        </label>

                        <input 
                            type="text" 
                            placeholder="Describe your skin concerns or target goals..." 
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', outline: 'none', fontSize: '0.88rem', color: '#1e293b' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(236,72,153,0.25)' }}
                    >
                        <span>Execute AI Ritual & Complete Task</span>
                        <FaPaperPlane size={14} />
                    </button>
                </form>

            </div>
        </div>
    );
}

export default RitualModal;