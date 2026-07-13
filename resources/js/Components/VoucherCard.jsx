// resources/js/Components/VoucherCard.jsx
export default function VoucherCard({ children, className = '' }) {
    return (
        <div className={`relative bg-white rounded-r-2xl shadow-sm ${className}`}>
            {/* perforated stub edge */}
            <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-between py-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-cloud -ml-0.5 ring-1 ring-navy/10" />
                ))}
            </div>
            <div className="border-l-2 border-dashed border-navy/15 pl-6 pr-5 py-5 ml-3">
                {children}
            </div>
        </div>
    );
}