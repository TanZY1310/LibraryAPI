import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
    // Close on Escape key — mirrors original window.onclick behaviour
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
}