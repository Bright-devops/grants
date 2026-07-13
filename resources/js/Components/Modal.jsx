// resources/js/Components/Modal.jsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children, show = false, maxWidth = '2xl', closeable = true, onClose = () => {} }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && closeable) onClose();
        };
        if (show) document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [show, closeable, onClose]);

    if (!show) return null;

    const close = () => {
        if (closeable) onClose();
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:px-0 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={close} />
            <div className={`relative bg-white rounded-2xl shadow-xl w-full ${maxWidthClass} mx-auto`}>
                {children}
            </div>
        </div>,
        document.body
    );
}