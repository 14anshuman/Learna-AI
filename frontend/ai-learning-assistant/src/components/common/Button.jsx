import React from 'react';

const VARIANTS = {
    primary:
        'bg-green-700 cursor-pointer text-white focus:ring-indigo-500',
    secondary:
        'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400',
    danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline:
        'border border-gray-300 text-gray-700 hover:bg-gray-50',
};

const SIZES = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
};

const Button = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    className = '',
    variant = 'primary',
    size = 'md',
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center justify-center gap-2
                rounded-lg font-medium transition
                focus:outline-none focus:ring-2 focus:ring-offset-2
                disabled:opacity-60 disabled:cursor-not-allowed
                ${VARIANTS[variant]}
                ${SIZES[size]}
                ${className}
            `}
        >
            {children}
        </button>
    );
};

export default Button;
