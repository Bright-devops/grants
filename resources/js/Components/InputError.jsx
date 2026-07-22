export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-status-rejected text-xs mt-1 ' + className}
        >
            {message}
        </p>
    ) : null;
}