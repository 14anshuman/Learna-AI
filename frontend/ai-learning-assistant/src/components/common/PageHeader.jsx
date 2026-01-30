import React from 'react';

const PageHeader = ({ title, subtitle, children }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-slate-500 text-sm">
                        {subtitle}
                    </p>
                )}
            </div>

            {children && (
                <div className="flex items-center gap-2">
                    {children}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
