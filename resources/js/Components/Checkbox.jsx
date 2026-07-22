export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-navy/20 text-signal shadow-sm focus:ring-signal ' + className
            }
        />
    );
}